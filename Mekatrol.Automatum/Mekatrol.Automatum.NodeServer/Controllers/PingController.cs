using Microsoft.AspNetCore.Mvc;

namespace Mekatrol.Automatum.NodeServer.Controllers;
[ApiController]
[Route("[controller]")]
public class PingController : ControllerBase
{
    private readonly ILogger<PingController> _logger;

    public PingController(ILogger<PingController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "ping")]
    public PingPongModel Get()
    {
        return new PingPongModel();
    }

    public class PingPongModel
    {
        public string Message { get; set; } = "Pong";
    }
}
