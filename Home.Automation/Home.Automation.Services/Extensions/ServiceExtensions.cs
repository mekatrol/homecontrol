using Home.Automation.Services.Implementation;
using Microsoft.Extensions.DependencyInjection;

namespace Home.Automation.Services.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddAppBackgroundTasks(this IServiceCollection services)
    {
        services.AddHostedService<HomeAssistantBackgroundTaskService>();

        services.AddKeyedScoped<IBackgroundTaskService, HomeAssistantBackgroundTaskService>(ServiceKeys.HomeAssistant);

        return services;
    }
}
