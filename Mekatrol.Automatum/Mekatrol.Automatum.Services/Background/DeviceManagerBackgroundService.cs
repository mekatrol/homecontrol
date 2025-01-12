using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Models.Execution;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Mekatrol.Automatum.Services.Background;

internal class DeviceManagerBackgroundService(
    BackgroundServiceOptions backgroundServiceOptions,
    IServiceProvider serviceProvider,
    ILogger<DeviceManagerBackgroundService> logger)
    : BaseBackgroundService<DeviceManagerBackgroundService>(
        backgroundServiceOptions,
        ModuleNames.DeviceManagerModule,
        serviceProvider,
        logger)
{
    protected override async Task<bool> ExecuteIteration(IServiceProvider services, CancellationToken stoppingToken)
    {
        var stateService = services.GetRequiredService<IStateService>();

        await Task.Delay(0, stoppingToken);

        stateService.UpdateModuleState(ModuleNames.DeviceManagerModule, (moduleState) =>
        {
            moduleState.Status = ModuleStatus.Running;
        });

        return true;
    }
}
