
using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Common.Extensions;
using Mekatrol.Automatum.Devices;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Models.Execution;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace Mekatrol.Automatum.Services.Background;

internal class MainControlLoopBackgroundService(
    BackgroundServiceOptions backgroundServiceOptions,
    IServiceProvider serviceProvider,
    ILogger<MainControlLoopBackgroundService> logger)
    : BaseBackgroundService<MainControlLoopBackgroundService>(backgroundServiceOptions, serviceProvider, logger)
{
    protected override async Task<bool> ExecuteIteration(IServiceProvider services, CancellationToken stoppingToken)
    {
        var stateService = services.GetRequiredService<IStateService>();

        try
        {
            await ManageDeviceTypes(services);
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

    private static Task ManageDeviceTypes(IServiceProvider services)
    {
        var devicesOptions = services.GetRequiredService<DevicesOptions>();
        var stateService = services.GetRequiredService<IStateService>();

        // Get the set of currently registered device types
        var registeredDeviceTypes = stateService
            .GetRegisteredDeviceTypes()
            .ToDictionary(k => k.Id, v => v);

        if (!Directory.Exists(devicesOptions.FactoryLibraryDirectory))
        {
            // Creat factory library directory
            Directory.CreateDirectory(devicesOptions.FactoryLibraryDirectory);
        }

        // Get the exe location so that we can get any device factories from
        // DLLs in that directory
        var exeLocation = Assembly.GetExecutingAssembly().Location;

        // Get the combined files from both directories
        var fileNames = Directory.GetFiles(Path.GetDirectoryName(exeLocation)!, "*.dll")
            .Union(Directory.GetFiles(devicesOptions.FactoryLibraryDirectory, "*.dll"))
            .ToList();

        foreach (var fileName in fileNames)
        {
            Assembly assembly;
            try
            {
                assembly = Assembly.LoadFrom(fileName);
            }
            catch
            {
                // Do nothing, this DLL may not be a .NET DLL
                continue;
            }

            // Get all types defived from device factory
            var deviceFactoryType = typeof(IDeviceTypeFactory);


            List<Type> deviceFactories;

            try
            {
                deviceFactories = assembly
                .GetTypes()
                .Where(type =>
                    type.IsAssignableTo(deviceFactoryType) &&
                    type.IsClass &&
                    !type.IsAbstract)
                .ToList();
            }
            catch
            {
                // Do nothing, this DLL may not be a .NET DLL
                continue;
            }

            foreach (var type in deviceFactories)
            {
                // Create an instance of the device factory
                var factory = (IDeviceTypeFactory)Activator.CreateInstance(type)!;

                var id = factory.Identitier;
                var deviceTypes = factory.GetDeviceTypes();

                foreach (var deviceType in deviceTypes)
                {
                    if (registeredDeviceTypes.ContainsKey(deviceType.Id))
                    {
                        // Alrady exists, so continue
                        continue;
                    }

                    stateService.AddDeviceType(deviceType);
                    registeredDeviceTypes.Remove(deviceType.Id);
                }
            }

        }

        // Update status to running
        stateService.UpdateModuleState(ModuleNames.MainControlLoop, (moduleState) =>
        {
            moduleState.Messages.Clear();
            moduleState.Status = ModuleStatus.Running;
        });

        return Task.CompletedTask;
    }
}
