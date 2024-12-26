using Mekatrol.Automatum.Middleware.Exceptions;
using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("flow")]
public class FlowController(ILogger<FlowController> logger, IFlowService flowService) : ControllerBase
{
    [HttpGet]
    public async Task<IList<FlowSummary>> Get(CancellationToken cancellationToken)
    {
        logger.LogDebug("Getting flows...");
        var flows = await flowService.GetSummaries(cancellationToken);
        return flows;
    }

    [HttpGet("{id}")]
    public async Task<Flow> Get(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Getting flow with ID '{id}'");
        var flow = await flowService.Get(id, cancellationToken);
        return flow;
    }

    [HttpPost]
    public async Task<Flow> Post([FromBody] Flow flow, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Creating flow with ID '{flow.Id}'");
        flow = await flowService.Create(flow, cancellationToken);
        return flow;
    }

    [HttpPut]
    public async Task<Flow> Put([FromBody] Flow flow, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Updating flow with ID '{flow.Id}'");
        flow = await flowService.Update(flow, cancellationToken);
        return flow;
    }

    [HttpDelete("{id}")]
    public void Delete(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Deleting flow with ID '${id}'");
        flowService.Delete(id, cancellationToken);
    }
}
