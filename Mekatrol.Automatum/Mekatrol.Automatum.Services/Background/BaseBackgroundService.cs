using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Common.Extensions;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Models.Execution;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Mekatrol.Automatum.Services.Background;

internal abstract class BaseBackgroundService<T>(
    BackgroundServiceOptions backgroundServiceOptions,
    string moduleName,
    IServiceProvider serviceProvider,
    ILogger<T> logger) : BackgroundService()
{
    private Guid? _prevErrorId = null;

    protected ILogger Logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogDebug("{msg}", $"Starting {nameof(T)} background service");

        var exceptionCount = 0;

        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            var stateService = services.GetRequiredService<IStateService>();

            try
            {
                if (!await ExecuteIteration(services, stoppingToken))
                {
                    // Derived class asked for background service to exit
                    return;
                }

                await Task.Delay(backgroundServiceOptions.LoopIterationSleep, stoppingToken);

                // No exceptions so reset exception count
                exceptionCount = 0;
            }
            catch (Exception ex)
            {
                logger.LogError(ex);

                if (++exceptionCount >= backgroundServiceOptions.MaxConsecutiveExceptions)
                {
                    // If we have configured consecutive exceptions then we give up!
                    logger.LogError("{msg}", $"Stopping {nameof(T)} due to too many consecutive exceptions.");
                    return;
                }

                stateService.UpdateModuleState(moduleName, (moduleState) =>
                {
                    moduleState.Status = ModuleStatus.Error;
                });

                if (_prevErrorId != null)
                {
                    stateService.RemoveAlert(_prevErrorId.Value);
                }

                var alert = new StateAlert
                {
                    Title = $"{ModuleNames.MainControlLoop} Error",
                    Message = ex.Message
                };

                _prevErrorId = alert.Id;

                stateService.AddAlert(alert);

                // Sleep for configured number seconds to try and let things settle (esp if exception keeps occuring)
                await Task.Delay(backgroundServiceOptions.LoopExceptionSleep, stoppingToken);
            }
        }

        logger.LogDebug("{msg}", $"Exiting {nameof(T)} background service");
    }

    protected abstract Task<bool> ExecuteIteration(IServiceProvider services, CancellationToken stoppingToken);
}
