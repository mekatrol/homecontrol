using Mekatrol.Automatum.Models.HomeAssistant;
using Mekatrol.Automatum.Models.Devices;

namespace Mekatrol.Automatum.Services;

public interface IPointDbService : IDbService<Point>
{
    Task<HomeAssistantEntity> GetHomeAssistantEntity(string entityId, CancellationToken cancellationToken);
}