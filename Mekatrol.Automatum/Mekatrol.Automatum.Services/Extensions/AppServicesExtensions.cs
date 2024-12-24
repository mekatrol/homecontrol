using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Services.Implementation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Net.Http;

namespace Mekatrol.Automatum.Services.Extensions;

public static class AppServicesExtensions
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IHostApplicationBuilder builder, ILogger logger)
    {
        AddCertificateServices(services);

        // Bind home assistant options
        var homeAssistantOptions = new HomeAssistantOptions();
        builder.Configuration.Bind(HomeAssistantOptions.SectionName, homeAssistantOptions);

        // Add options as a singleton
        services.AddSingleton(homeAssistantOptions);

        AddHttpClientServices(services, homeAssistantOptions, logger);

        AddHomeAssistantServices(services);

        return services;
    }

    public static IServiceCollection AddHttpClientServices(this IServiceCollection services, HomeAssistantOptions options, ILogger logger)
    {
        // When hosted as an Addon in home assistant then the supervior token is set via and environment variable,
        // so we override the options value with this injected value
        var supervisorToken = Environment.GetEnvironmentVariable("SUPERVISOR_TOKEN");

        // NOTE: the string will not be set when debugging in Visual Studio so that long lived API key
        // should be configured in appsettings.Development.json
        if (!string.IsNullOrEmpty(supervisorToken))
        {
            logger.LogInformation("The API supervisor token has been set from the configured environment variable");
            options.SupervisorToken = supervisorToken;
        }else
        {
            logger.LogInformation("The API supervisor token was not set from environment variable, will default to appsettings value");
        }

        var handler = new SocketsHttpHandler
        {
            PooledConnectionLifetime = options.ConnectionLifeTime
        };
        var client = new HttpClient(handler);

        // Set the bearer token to the supervisor token
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.SupervisorToken);

        services.AddSingleton(client);

        return services;
    }

    public static IServiceCollection AddCertificateServices(this IServiceCollection services)
    {
        services.AddSingleton<ICertificateService, CertificateService>();
        return services;
    }

    public static IServiceCollection AddHomeAssistantServices(this IServiceCollection services)
    {
        services.AddSingleton<IHomeAssistantService, HomeAssistantService>();

        return services;
    }
}
