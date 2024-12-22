using Mekatrol.Automatum.Services.Implementation;
using Microsoft.Extensions.DependencyInjection;

namespace Mekatrol.Automatum.Services.Extensions;

public static class AppServicesExtensions
{
    public static IServiceCollection AddAppServices(this IServiceCollection services)
    {
        services.AddSingleton<ICertificateService, CertificateService>();

        return services;
    }
}
