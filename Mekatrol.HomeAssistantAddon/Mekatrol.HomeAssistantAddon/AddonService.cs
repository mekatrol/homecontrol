using Microsoft.Extensions.Logging;
using System.Reflection;

namespace Mekatrol.HomeAssistantAddon;

internal class AddonService(ILogger<AddonService> logger)
{
    private readonly ILogger<AddonService> _logger = logger;

    public async Task Execute(CancellationToken stoppingToken)
    {
        var currentAssemblyDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!;
        var executingAssemblyPath = Path.GetFullPath(currentAssemblyDirectory);

        Console.WriteLine($"Executing from '{executingAssemblyPath}'...");

        var tickNo = 1;
        while (!stoppingToken.IsCancellationRequested)
        {
            Console.WriteLine($"Add on tick {tickNo++}...");
            await Task.Delay(1000, stoppingToken);
        }

        Console.WriteLine($"Ended execution from '{executingAssemblyPath}'...");
    }
}
