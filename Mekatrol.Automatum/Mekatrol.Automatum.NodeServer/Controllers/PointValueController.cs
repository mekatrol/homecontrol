using Mekatrol.Automatum.Models.Execution;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("point-value")]
public class PointValueController(ILogger<PointValueController> logger, IPointDbService pointService) : ControllerBase
{
    [HttpGet("{key}")]
    public async Task<PointState> Get(string key, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Getting value for entity with ID '{key}'");

        var point = await pointService.GetByKey(key, cancellationToken);

        if(key.StartsWith("ha."))
        {
            var haPoint = await pointService.GetHomeAssistantEntity(key[3..], cancellationToken);

            return new PointState
            {
                Id = point.Id,
                Value = haPoint.State
            };
        }
        
        return new PointState();
    }
}