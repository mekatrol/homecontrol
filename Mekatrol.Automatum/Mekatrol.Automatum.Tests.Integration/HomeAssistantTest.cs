using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Services;
using Mekatrol.Automatum.Services.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace Mekatrol.Automatum.Tests.Integration;

[TestClass]
public sealed class HomeAssistantTest : IntegrationTestBase
{
    private const string TestDBName = "automatum.test.homeassistant.{0}.db";

    private AutomatumDbContext? _dbContext = null;

    [TestMethod]
    public async Task TestPing()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var homeAssistant = services.GetRequiredService<IHomeAssistantService>();
            var cancellationTokenSource = new CancellationTokenSource();

            // Should be successful
            Assert.IsTrue(await homeAssistant.Ping(cancellationTokenSource.Token));
        });
    }

    [TestMethod]
    public async Task TestGetStates()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var homeAssistant = services.GetRequiredService<IHomeAssistantService>();
            var cancellationTokenSource = new CancellationTokenSource();

            // Should be successful
            var states = await homeAssistant.GetStates(cancellationTokenSource.Token);

            // There should be at least one state
            Assert.IsTrue(states.Any());
        });
    }

    protected override async Task<ServiceCollection> Setup(ServiceCollection serviceCollection)
    {
        // Set up Sqlite database
        var dbName = string.Format(TestDBName, Guid.NewGuid());
        var optionsBuilder = new DbContextOptionsBuilder<AutomatumDbContext>();
        optionsBuilder.UseSqlite($"Data Source={dbName}");
        _dbContext = new AutomatumDbContext(optionsBuilder.Options);
        await _dbContext.Database.EnsureDeletedAsync();
        await _dbContext.InitializeDatabase();

        // Bind home assistant options
        var homeAssistantOptions = new HomeAssistantOptions
        {
            SupervisorToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MzdiMzlhNzdjODc0YWQwOGQ5ZmIwOTNkMDNjOGNjNCIsImlhdCI6MTczNDkzNzg2OCwiZXhwIjoyMDUwMjk3ODY4fQ.tuKiyqfxRoPo8m97WyGn4R7NrH9RK_l8thJwmcYfeP8"
        };

        var loggerMock = new Mock<ILogger<HomeAssistantTest>>();
        var homeAssistantServiceLoggerMock = new Mock<ILogger<IHomeAssistantService>>();

        serviceCollection.AddSingleton(homeAssistantServiceLoggerMock.Object);

        serviceCollection.AddSingleton<IAutomatumDbContext>(_dbContext);
        serviceCollection.AddHttpClientServices(homeAssistantOptions, loggerMock.Object);
        serviceCollection.AddHomeAssistantServices();

        return serviceCollection;
    }

    protected override async Task Cleanup()
    {
        if (_dbContext != null)
        {
            // Cleanup database on disk
            await _dbContext.Database.CloseConnectionAsync();
            await _dbContext.Database.EnsureDeletedAsync();
        }
    }
}