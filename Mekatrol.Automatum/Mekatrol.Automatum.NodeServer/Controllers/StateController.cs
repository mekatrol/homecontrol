using Mekatrol.Automatum.Models.Execution;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("[controller]")]
public class StateController(IStateService stateService, ILogger<PingController> logger) : ControllerBase
{
    [HttpGet]
    public SystemState Get()
    {
        logger.LogDebug("Calling get state");
        return stateService.SystemState;
    }
}