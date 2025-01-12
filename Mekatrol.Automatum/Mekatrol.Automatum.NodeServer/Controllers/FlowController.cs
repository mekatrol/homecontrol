using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("flow")]
public class FlowController(ILogger<FlowController> logger, IStateService flowStateService, IFlowDbService flowService) : ControllerBase
{
    [HttpGet]
    public async Task<IList<Flow>> Get(CancellationToken cancellationToken)
    {
        logger.LogDebug("Getting flows...");
        var flows = await flowService.GetList(cancellationToken);

        return flows;
    }

    [HttpGet("{id}")]
    public async Task<Flow> Get(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Getting flow with ID '{id}'");
        var flow = await flowService.GetById(id.ToString("D"), cancellationToken);
        return flow;
    }

    [HttpPost]
    public async Task<Flow> Post([FromBody] Flow flow, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Creating flow with ID '{flow.Id}'");
        flow = await flowService.Create(flow, cancellationToken);
        return flow;
    }

    [HttpPut]
    public async Task<Flow> Put([FromBody] Flow flow, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Updating flow with ID '{flow.Id}'");
        flow = await flowService.Update(flow, cancellationToken);
        return flow;
    }

    [HttpDelete("{id}")]
    public void Delete(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Deleting flow with ID '${id}'");
        flowService.Delete(id.ToString("D"), cancellationToken);
    }
}