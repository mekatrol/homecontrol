using Mekatrol.Automatum.Common.Extensions;
using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Models.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Mekatrol.Automatum.Services.Background;

internal class HomeAssistantBackgroundService(
    HomeAssistantOptions homeAssitantOptions,
    IServiceProvider serviceProvider,
    ILogger<HomeAssistantBackgroundService> logger) : BackgroundService()
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogDebug("Starting home assistant background service");

        var exceptionCount = 0;

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = serviceProvider.CreateScope();

                var services = scope.ServiceProvider;
                
                var homeAssistantService = services.GetRequiredService<IHomeAssistantService>();

                while (!stoppingToken.IsCancellationRequested)
                {
                    await homeAssistantService.UpdatePointStates(services, stoppingToken);
                    await Task.Delay(homeAssitantOptions.LoopIterationSleep, stoppingToken);
                }

                // No exceptions so reset exception count
                exceptionCount = 0;
            }
            catch (Exception ex)
            {
                logger.LogError(ex);

                if (++exceptionCount >= homeAssitantOptions.MaxConsecutiveExceptions)
                {
                    // If we have 10 consecutive exceptions then we give up!
                    logger.LogError("{msg}", $"Stopping {nameof(HomeAssistantBackgroundService)} due to too many consecutive exceptions.");
                    return;
                }

                // Sleep for 10 seconds to try and let things settle (esp if exception keeps occuring)
                await Task.Delay(homeAssitantOptions.LoopExceptionSleep, stoppingToken);
            }
        }
    }
}
