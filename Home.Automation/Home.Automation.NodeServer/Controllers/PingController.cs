using Microsoft.AspNetCore.Mvc;

namespace Home.Automation.NodeServer.Controllers;
[ApiController]
[Route("[controller]")]
public class PingController(ILogger<PingController> logger) : ControllerBase
{
    private readonly ILogger<PingController> _logger = logger;

    [HttpGet(Name = "ping")]
    public string Get()
    {
        var caller = HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "Unknown";
        _logger.LogDebug("{message}", $"Server pinged from ${caller}");

        return "pong";
    }
}
