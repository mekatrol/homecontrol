using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services;

public interface IEntityService<TEntity> where TEntity : BaseModel
{
    Task<IList<TEntity>> GetList(CancellationToken cancellationToken);

    Task<TEntity> Get(Guid id, CancellationToken cancellationToken);

    Task<TEntity> Create(TEntity flow, CancellationToken cancellationToken);

    Task<TEntity> Update(TEntity flow, CancellationToken cancellationToken);

    Task Delete(Guid id, CancellationToken cancellationToken);
}
