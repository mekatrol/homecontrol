using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("[controller]")]
public class AlertController(IStateService stateService, ILogger<PingController> logger) : ControllerBase
{
    [HttpDelete]
    public void Delete(Guid alertId)
    {
        logger.LogDebug("{msg}", $"Deleting alert with ID '{alertId}'");
        stateService.RemoveAlert(alertId);
    }
}