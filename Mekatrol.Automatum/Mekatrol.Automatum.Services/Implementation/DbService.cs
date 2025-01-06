using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Middleware.Exceptions;
using Mekatrol.Automatum.Middleware.Extensions;
using Mekatrol.Automatum.Models.Flows;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Mekatrol.Automatum.Services.Implementation;

internal abstract class DbService<TModel, TEntity>(IAutomatumDbContext dbContext) : IDbService<TModel>
    where TModel : RootEntityModel
    where TEntity : BaseEntity
{
    protected readonly IAutomatumDbContext _dbContext = dbContext;

    public async virtual Task<IList<TModel>> GetList(CancellationToken cancellationToken)
    {
        var entities = await _dbContext.Set<TEntity>().ToListAsync(cancellationToken);

        var list = entities.Select(x =>
        {
            var model = JsonSerializer.Deserialize<TModel>(x.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeException(x.Id);

            return model;
        })
        .ToList();

        return list;
    }

    public async virtual Task<TModel> Get(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var uuid))
        {
            throw IdNotValidException(id);
        }

        // If the id is an empty GUID then caller wants a new default model (do not persist)
        if (uuid == Guid.Empty)
        {
            var model = Activator.CreateInstance<TModel>()!;

            model.Id = Guid.NewGuid().ToString("D");
            model.Enabled = true;
            model.Key = $"<New {typeof(TModel).Name}>";

            return model;
        }

        var entity = await _dbContext.Set<TEntity>()
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync(cancellationToken);

        return entity == null
            ? throw IdNotFoundException(id)
            : JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeException(entity.Id);        
    }

    public async virtual Task<TModel> Create(TModel model, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(model.Id, out var uuid))
        {
            throw IdNotValidException(model.Id);
        }

        if (string.IsNullOrWhiteSpace(model.Key))
        {
            throw KeyMissingException(model.Id);
        }

        var dateTime = DateTimeOffset.UtcNow;

        // Set model Id if not set already
        model.Id = uuid == Guid.Empty ? Guid.NewGuid().ToString("D") : model.Id;

        model.Created = dateTime;
        model.Updated = dateTime;

        var entity = Activator.CreateInstance<TEntity>()!;
        entity.Id = model.Id; 
        entity.Key = model.Key;
        entity.Json = JsonSerializer.Serialize(model, JsonSerializerExtensions.ApiSerializerOptions);
        entity.Created = dateTime;
        entity.Updated = dateTime;

        await _dbContext.Set<TEntity>().AddAsync(entity, cancellationToken);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            if (ex.InnerException != null)
            {
                if (ex.InnerException.Message.Contains($"UNIQUE constraint failed: {typeof(TModel).Name}s.{nameof(BaseEntity.Id)}"))
                {
                    throw IdAlreadyExistsException(model.Id);
                }

                if (ex.InnerException.Message.Contains($"UNIQUE constraint failed: {typeof(TModel).Name}s.{nameof(BaseEntity.Key)}"))
                {
                    throw KeyAlreadyExistsException(model.Key);
                }
            }
            throw;
        }

        return JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)!;
    }

    public async virtual Task<TModel> Update(TModel model, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(model.Id, out var uuid))
        {
            throw IdNotValidException(model.Id);
        }

        if(uuid == Guid.Empty)
        {
            throw IdNotValidException(model.Id);
        }

        if (string.IsNullOrWhiteSpace(model.Key))
        {
            throw KeyMissingException(model.Id);
        }

        var existing = await _dbContext.Set<TEntity>().SingleOrDefaultAsync(x => x.Id == model.Id, cancellationToken)
            ?? throw IdNotFoundException(model.Id);

        model.Updated = DateTimeOffset.UtcNow;

        existing.Key = model.Key;
        existing.Updated = model.Updated;

        existing.Json = JsonSerializer.Serialize(model, JsonSerializerExtensions.ApiSerializerOptions);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            // The model has been updated since it was fetched
            throw OptimisticConcurrencyException(model.Id);
        }
        catch (Exception ex)
        {
            if (ex.InnerException != null)
            {
                if (ex.InnerException.Message.Contains($"UNIQUE constraint failed: {typeof(TModel).Name}s.{nameof(BaseEntity.Key)}"))
                {
                    throw KeyAlreadyExistsException(model.Key);
                }
            }
            throw;
        }

        return JsonSerializer.Deserialize<TModel>(existing.Json, JsonSerializerExtensions.ApiSerializerOptions)!;
    }

    public async virtual Task Delete(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var _))
        {
            throw IdNotValidException(id);
        }

        var existing = await _dbContext.Set<TEntity>().SingleOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw IdNotFoundException(id);

        _dbContext.Set<TEntity>().Remove(existing);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    protected static BadRequestException IdNotValidException(string id) => new($"The ID '{id}' is not valid.");

    protected static NotFoundException IdNotFoundException(string id) => new($"A {typeof(TModel).Name.ToLower()} with the ID '{id}' was not found.");

    protected static BadRequestException KeyMissingException(string id) => new($"The {typeof(TModel).Name.ToLower()} with the ID '{id}' has a missing or invalid key.");

    protected static InternalServerException CouldNotDeserializeException(string id) => new($"The {typeof(TModel).Name.ToLower()} with ID '{id}' could not be deserialized.");

    protected static ConflictException IdAlreadyExistsException(string id) => new($"A {typeof(TModel).Name.ToLower()} with the ID '{id}' already exists.");

    protected static ConflictException KeyAlreadyExistsException(string key) => new($"A {typeof(TModel).Name.ToLower()} with the key '{key}' already exists.");

    protected static ConflictException OptimisticConcurrencyException(string id) => new($"The {typeof(TModel).Name.ToLower()} with the ID '{id}' has changed, you need to fetch the latest version and update it.");
}