using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Models.HomeAssistant;

namespace Mekatrol.Automatum.Services;

public interface IPointDbService : IDbService<Point>
{
    Task<HomeAssistantEntityModel> GetHomeAssistantEntity(string entityId, CancellationToken cancellationToken);
}