using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Common.Extensions;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Models.Execution;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Mekatrol.Automatum.Services.Background;

internal class DeviceManagerBackgroundService(
    BackgroundServiceOptions backgroundServiceOptions,
    IServiceProvider serviceProvider,
    ILogger<DeviceManagerBackgroundService> logger)
    : BaseBackgroundService<DeviceManagerBackgroundService>(backgroundServiceOptions, serviceProvider, logger)
{
    protected override async Task<bool> ExecuteIteration(IServiceProvider services, CancellationToken stoppingToken)
    {
        var stateService = services.GetRequiredService<IStateService>();

        try
        {
            await Task.Delay(5000, stoppingToken);

            stateService.UpdateModuleState(ModuleNames.DeviceManagerModule, (moduleState) =>
            {
                moduleState.Messages.Clear();
                moduleState.Status = ModuleStatus.Running;
            });
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);

            stateService.UpdateModuleState(ModuleNames.DeviceManagerModule, (moduleState) =>
            {
                moduleState.Messages.Clear();
                moduleState.Status = ModuleStatus.Error;
                moduleState.Messages.Add(ex.Message);
            });
        }
        return true;
    }
}
