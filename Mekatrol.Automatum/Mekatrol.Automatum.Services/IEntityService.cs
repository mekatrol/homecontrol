using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services;

public interface IEntityService<TModel> where TModel : RootEntityModel
{
    Task<IList<TModel>> GetList(CancellationToken cancellationToken);

    Task<TModel> Get(Guid id, CancellationToken cancellationToken);

    Task<TModel> Create(TModel flow, CancellationToken cancellationToken);

    Task<TModel> Update(TModel flow, CancellationToken cancellationToken);

    Task Delete(Guid id, CancellationToken cancellationToken);
}