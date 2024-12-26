using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Data.Entities;
using Mekatrol.Automatum.Middleware.Extensions;
using Mekatrol.Automatum.Models.Flows;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Mekatrol.Automatum.Services.Implementation;

internal class FlowService(IAutomatumDbContext dbContext) : EntityService<Flow, FlowEntity>(dbContext), IFlowService
{
}
