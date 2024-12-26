using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Middleware.Exceptions;
using Mekatrol.Automatum.Middleware.Extensions;
using Mekatrol.Automatum.Models.Flows;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Mekatrol.Automatum.Services.Implementation;

internal class FlowService(IAutomatumDbContext dbContext) : IFlowService
{
    private readonly IAutomatumDbContext _dbContext = dbContext;

    public async Task<IList<FlowSummaryModel>> GetSummaries(CancellationToken cancellationToken)
    {
        var flowEntities = await _dbContext.Flows.ToListAsync(cancellationToken);

        var flowSummaries = flowEntities.Select(x =>
        {
            var flow = JsonSerializer.Deserialize<FlowModel>(x.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeFlowException(x.Id);

            return new FlowSummaryModel
            {
                Id = x.Id,
                Label = flow.Label,
                Description = flow.Description,
                Created = flow.Created,
                Updated = flow.Updated
            };
        })
        .ToList();

        return flowSummaries;
    }

    public async Task<FlowModel> Get(Guid id, CancellationToken cancellationToken)
    {
        // If the id is an empty GUID then caller wants a new default flow (do not persist)
        if (id == Guid.Empty)
        {
            return new FlowModel
            {
                Id = Guid.NewGuid(),
                Enabled = true
            };
        }

        var flowEntity = await _dbContext.Flows
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync(cancellationToken);

        return flowEntity == null
            ? throw IdNotFoundException(id)
            : JsonSerializer.Deserialize<FlowModel>(flowEntity.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeFlowException(flowEntity.Id);
        ;
    }

    public async Task<FlowModel> Create(FlowModel flow, CancellationToken cancellationToken)
    {
        var dateTime = DateTimeOffset.UtcNow;

        var flowEntity = new FlowEntity
        {
            Id = flow.Id == Guid.Empty ? Guid.NewGuid() : flow.Id, // If caller specified an empty guid then create a new ID
            Key = flow.Label,
            Json = JsonSerializer.Serialize(flow, JsonSerializerExtensions.ApiSerializerOptions),
            Created = dateTime,
            Updated = dateTime
        };

        await _dbContext.Flows.AddAsync(flowEntity, cancellationToken);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            if (ex.InnerException != null && 
                ex.InnerException.Message.Contains($"UNIQUE constraint failed: {nameof(IAutomatumDbContext.Flows)}.{nameof(FlowEntity.Id)}"))
            {
                throw IdAlreadyExistsException(flow.Id);
            }

            throw;
        }

        return JsonSerializer.Deserialize<FlowModel>(flowEntity.Json, JsonSerializerExtensions.ApiSerializerOptions)!;
    }

    public async Task<FlowModel> Update(FlowModel flow, CancellationToken cancellationToken)
    {
        var existing = await _dbContext.Flows.SingleOrDefaultAsync(x => x.Id == flow.Id, cancellationToken)
            ?? throw IdNotFoundException(flow.Id);

        flow.Updated = DateTimeOffset.UtcNow;

        existing.Key = flow.Label;
        existing.Updated = flow.Updated;
        
        existing.Json = JsonSerializer.Serialize(flow, JsonSerializerExtensions.ApiSerializerOptions);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch(DbUpdateConcurrencyException)
        {
            // The flow has been updated since it was fetched
            throw OptimisticConcurrencyException(flow.Id);
        }

        return JsonSerializer.Deserialize<FlowModel>(existing.Json, JsonSerializerExtensions.ApiSerializerOptions)!;
    }

    public async Task Delete(Guid id, CancellationToken cancellationToken)
    {
        var existing = await _dbContext.Flows.SingleOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw IdNotFoundException(id);

        _dbContext.Flows.Remove(existing);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private static NotFoundException IdNotFoundException(Guid id) => new($"A flow with the ID '{id}' was not found.");

    private static InternalServerException CouldNotDeserializeFlowException(Guid id) => new($"The flow with ID '{id}' could not be deserialized.");

    private static ConflictException IdAlreadyExistsException(Guid id) => new($"A flow with the ID '{id}' already exists.");

    private static ConflictException OptimisticConcurrencyException(Guid id) => new($"The flow with the ID '{id}' has changed, you need to fetch the latest version and update it.");
}