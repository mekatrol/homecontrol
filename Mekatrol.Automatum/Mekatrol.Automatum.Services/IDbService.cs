using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services;

public interface IDbService<TModel> where TModel : RootEntityModel
{
    Task<IList<TModel>> GetList(CancellationToken cancellationToken);

    Task<TModel> GetById(string id, CancellationToken cancellationToken);

    Task<TModel> GetByKey(string key, CancellationToken cancellationToken);

    Task<TModel> Create(TModel model, CancellationToken cancellationToken);

    Task<TModel> Update(TModel model, CancellationToken cancellationToken);

    Task Delete(string id, CancellationToken cancellationToken);
}