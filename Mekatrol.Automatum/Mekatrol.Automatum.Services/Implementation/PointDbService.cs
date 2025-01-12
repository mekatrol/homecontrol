using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Models.HomeAssistant;
using Mekatrol.Automatum.Models.Devices;

namespace Mekatrol.Automatum.Services.Implementation;

internal class PointDbService(IHomeAssistantService homeAssistant, IAutomatumDbContext dbContext) 
    : DbService<Point, PointEntity>(dbContext), IPointDbService
{
    public async Task<HomeAssistantEntity> GetHomeAssistantEntity(string entityId, CancellationToken cancellationToken)
    {
        return await homeAssistant.GetState(entityId, cancellationToken);
    }

    protected override void UpdateEntity(PointEntity toEntity, Point fromModel)
    {
    }

    protected override void UpdateModel(Point toModel, PointEntity fromEntity)
    {
    }
}