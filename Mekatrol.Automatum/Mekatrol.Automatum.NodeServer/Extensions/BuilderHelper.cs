using Mekatrol.Automatum.Services.Extensions;

namespace Mekatrol.Automatum.NodeServer.Extensions;

internal class BuilderHelper
{
    public IConfiguration Configuration { get; }

    public ILogger Logger { get; }

    public IServiceProvider Services { get; }

    public BuilderHelper()
    {
        Configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .AddJsonFile($"appsettings.json", true, true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", true, true)
            .Build();

        using var loggerFactory = LoggerFactory.Create(loggingBuilder =>
            loggingBuilder.AddConfiguration(Configuration.GetSection("Logging"))
                .AddJsonConsole()
                .AddDebug());

        Logger = loggerFactory.CreateLogger<Program>();

        var serviceCollection = new ServiceCollection();
        serviceCollection.AddCertificateServices();
        Services = serviceCollection.BuildServiceProvider();
    }
}
