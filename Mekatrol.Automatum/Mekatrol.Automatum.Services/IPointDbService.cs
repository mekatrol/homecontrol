using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Models.HomeAssistant;

namespace Mekatrol.Automatum.Services;

public interface IPointDbService : IDbService<Point>
{
    Task<EntityStateModel> GetHomeAssistantEntity(string entityId, CancellationToken cancellationToken);
}