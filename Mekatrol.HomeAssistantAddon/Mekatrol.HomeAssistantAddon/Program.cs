using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Mekatrol.HomeAssistantAddon;

/******************************************************************************
 * A simple Home Assistant Addon for understanding how to set a .NET add on up
 ******************************************************************************/

internal class Program
{
    static async Task Main(string[] args)
    {
        var host = Host.CreateDefaultBuilder(args)
            .ConfigureServices(services =>
            {
                services.AddTransient<AddonService>();
            })
            .Build();

        Console.WriteLine($"SUPERVISOR_TOKEN: '{Environment.GetEnvironmentVariable("SUPERVISOR_TOKEN")}'");

        var scriptRunner = host.Services.GetRequiredService<AddonService>();
        var stoppingTokenSource = new CancellationTokenSource();
        await scriptRunner.Execute(stoppingTokenSource.Token);
        stoppingTokenSource.Cancel();
    }
}
