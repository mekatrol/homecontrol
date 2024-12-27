using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services.Implementation;

internal class FlowService(IAutomatumDbContext dbContext) : EntityService<Flow, FlowEntity>(dbContext), IFlowService
{
}