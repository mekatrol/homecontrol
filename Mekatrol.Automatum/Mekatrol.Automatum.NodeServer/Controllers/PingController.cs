using Mekatrol.Automatum.Models;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("[controller]")]
public class PingController(IPingService pingService, ILogger<PingController> logger) : ControllerBase
{
    [HttpGet(Name = "ping")]
    public async Task<PingModel> Get(CancellationToken cancellationToken)
    {
        logger.LogDebug("Calling ping service");
        return await pingService.Ping(cancellationToken);
    }
}