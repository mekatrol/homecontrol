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

        var list = entities.Select(entity =>
        {
            var model = JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeException(entity.Id);

            // Allow derived class to perform any updates
            UpdateModel(model, entity);

            return model;
        })
        .ToList();

        return list;
    }

    public async virtual Task<TModel> GetById(string id, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(id, out var uuid))
        {
            throw IdNotValidException(id);
        }

        // If the id is an empty GUID then caller wants a new default model (do not persist)
        if (uuid == Guid.Empty)
        {
            var newModel = Activator.CreateInstance<TModel>()!;

            newModel.Id = Guid.NewGuid().ToString("D");
            newModel.Enabled = true;
            newModel.Key = $"new.{typeof(TModel).Name.ToLowerInvariant()}";
            newModel.Name = $"New {typeof(TModel).Name}";

            return newModel;
        }

        var entity = await _dbContext.Set<TEntity>()
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync(cancellationToken);

        var model = entity == null
            ? throw IdNotFoundException(id)
            : JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeException(entity.Id);

        // Allow derived class to perform any updates
        UpdateModel(model, entity);

        return model;
    }

    public async virtual Task<TModel> GetByKey(string key, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Set<TEntity>()
            .Where(x => x.Key == key)
            .SingleOrDefaultAsync(cancellationToken);

        var model = entity == null
            ? throw KeyNotFoundException(key)
            : JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)
                ?? throw CouldNotDeserializeException(entity.Id);

        // Allow derived class to perform any updates
        UpdateModel(model, entity);

        return model;
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

        if (string.IsNullOrWhiteSpace(model.Name))
        {
            throw NameMissingException(model.Id);
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

        // Allow derived class to perform any updates
        UpdateEntity(entity, model);

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

        // Get persisted model
        model =  JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)!;

        // Allow derived class to perform any updates
        UpdateModel(model, entity);

        return model;
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

        if (string.IsNullOrWhiteSpace(model.Name))
        {
            throw NameMissingException(model.Id);
        }

        // Get existing entity (if exists)
        var entity = await _dbContext.Set<TEntity>().SingleOrDefaultAsync(x => x.Id == model.Id, cancellationToken)
            ?? throw IdNotFoundException(model.Id);

        model.Updated = DateTimeOffset.UtcNow;

        entity.Key = model.Key;
        entity.Updated = model.Updated;

        // Allow derived class to perform any updates
        UpdateEntity(entity, model);

        entity.Json = JsonSerializer.Serialize(model, JsonSerializerExtensions.ApiSerializerOptions);

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

        // Get persisted model
        model = JsonSerializer.Deserialize<TModel>(entity.Json, JsonSerializerExtensions.ApiSerializerOptions)!;

        // Allow derived class to perform any updates
        UpdateModel(model, entity);

        return model;
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

    protected abstract void UpdateModel(TModel toModel, TEntity fromEntity);

    protected abstract void UpdateEntity(TEntity toEntity, TModel fromModel);

    protected static BadRequestException IdNotValidException(string id) => new($"The ID '{id}' is not valid.");

    protected static NotFoundException IdNotFoundException(string id) => new($"A {typeof(TModel).Name.ToLower()} with the ID '{id}' was not found.");

    protected static BadRequestException NameMissingException(string id) => new($"The {typeof(TModel).Name.ToLower()} with the ID '{id}' has a missing or invalid name.");

    protected static BadRequestException KeyMissingException(string id) => new($"The {typeof(TModel).Name.ToLower()} with the ID '{id}' has a missing or invalid key.");

    protected static InternalServerException CouldNotDeserializeException(string id) => new($"The {typeof(TModel).Name.ToLower()} with ID '{id}' could not be deserialized.");

    protected static ConflictException IdAlreadyExistsException(string id) => new($"A {typeof(TModel).Name.ToLower()} with the ID '{id}' already exists.");

    protected static ConflictException KeyAlreadyExistsException(string key) => new($"A {typeof(TModel).Name.ToLower()} with the key '{key}' already exists.");

    protected static NotFoundException KeyNotFoundException(string key) => new($"A {typeof(TModel).Name.ToLower()} with the key '{key}' was not found.");

    protected static ConflictException OptimisticConcurrencyException(string id) => new($"The {typeof(TModel).Name.ToLower()} with the ID '{id}' has changed, you need to fetch the latest version and update it.");
}