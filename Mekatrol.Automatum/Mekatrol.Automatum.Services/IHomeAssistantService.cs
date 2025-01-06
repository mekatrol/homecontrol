using Mekatrol.Automatum.Models.HomeAssistant;

namespace Mekatrol.Automatum.Services;

public interface IHomeAssistantService
{
    Task<bool> Ping(CancellationToken cancellationToken);

    Task<IList<EntityStateModel>> GetStates(CancellationToken cancellationToken);

    Task<EntityStateModel> GetState(string entityId, CancellationToken cancellationToken);

    Task UpdatePointStates(IServiceProvider services, CancellationToken cancellationToken);
}