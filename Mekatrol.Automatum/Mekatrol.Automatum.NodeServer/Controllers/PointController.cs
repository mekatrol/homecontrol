using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("point")]
public class PointController(ILogger<PointController> logger, IPointService pointService) : ControllerBase
{
    [HttpGet]
    public async Task<IList<Point>> Get(CancellationToken cancellationToken)
    {
        logger.LogDebug("Getting points...");
        var points = await pointService.GetList(cancellationToken);
        return points;
    }

    [HttpGet("{id}")]
    public async Task<Point> Get(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Getting point with ID '{id}'");
        var point = await pointService.Get(id, cancellationToken);
        return point;
    }

    [HttpPost]
    public async Task<Point> Post([FromBody] Point point, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Creating point with ID '{point.Id}'");
        point = await pointService.Create(point, cancellationToken);
        return point;
    }

    [HttpPut]
    public async Task<Point> Put([FromBody] Point point, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Updating point with ID '{point.Id}'");
        point = await pointService.Update(point, cancellationToken);
        return point;
    }

    [HttpDelete("{id}")]
    public void Delete(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{message}", $"Deleting point with ID '${id}'");
        pointService.Delete(id, cancellationToken);
    }
}