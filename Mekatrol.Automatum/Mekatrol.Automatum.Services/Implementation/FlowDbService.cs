using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services.Implementation;

internal class FlowDbService(IAutomatumDbContext dbContext) : DbService<Flow, FlowEntity>(dbContext), IFlowDbService
{
    protected override void UpdateEntity(FlowEntity toEntity, Flow fromModel)
    {
    }

    protected override void UpdateModel(Flow toModel, FlowEntity fromEntity)
    {
    }
}
