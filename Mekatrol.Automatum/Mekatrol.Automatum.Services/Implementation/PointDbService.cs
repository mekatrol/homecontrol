using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Models.HomeAssistant;

namespace Mekatrol.Automatum.Services.Implementation;

internal class PointDbService(IHomeAssistantService homeAssistant, IAutomatumDbContext dbContext) 
    : DbService<Point, PointEntity>(dbContext), IPointDbService
{
    public async Task<HomeAssistantEntityModel> GetHomeAssistantEntity(string entityId, CancellationToken cancellationToken)
    {
        return await homeAssistant.GetState(entityId, cancellationToken);
    }
}