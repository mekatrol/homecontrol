using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Models.Execution;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Mekatrol.Automatum.Services.Extensions;

public static class AppExentions
{
    public static WebApplication RegisterSystemModules(this WebApplication app)
    {
        // Register modules
        var stateService = app.Services.GetRequiredService<IStateService>();

        stateService.SetModuleState(new ModuleState(ModuleNames.DeviceManagerModule, "Manages communication to configured devices.", ModuleStatus.Loading));
        stateService.SetModuleState(new ModuleState(ModuleNames.MainControlLoop, "The main system control loop.", ModuleStatus.Loading));
        stateService.SetModuleState(new ModuleState(ModuleNames.FlowExecutor, "Executes enabled flows.", ModuleStatus.Loading));

        return app;
    }
}