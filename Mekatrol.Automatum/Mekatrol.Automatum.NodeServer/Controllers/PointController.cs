using Mekatrol.Automatum.Models.Devices;
using Mekatrol.Automatum.Services;
using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;

[ApiController]
[Route("point")]
public class PointController(ILogger<PointController> logger, IPointDbService pointService) : ControllerBase
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
        logger.LogDebug("{msg}", $"Getting point with ID '{id}'");
        var point = await pointService.GetById(id.ToString("D"), cancellationToken);
        return point;
    }

    [HttpPost]
    public async Task<Point> Post([FromBody] Point point, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Creating point with ID '{point.Id}'");
        point = await pointService.Create(point, cancellationToken);
        return point;
    }

    [HttpPut]
    public async Task<Point> Put([FromBody] Point point, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Updating point with ID '{point.Id}'");
        point = await pointService.Update(point, cancellationToken);
        return point;
    }

    [HttpDelete("{id}")]
    public async Task Delete(Guid id, CancellationToken cancellationToken)
    {
        logger.LogDebug("{msg}", $"Deleting point with ID '${id}'");
        await pointService.Delete(id.ToString("D"), cancellationToken);
    }
}