using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Services;
using Mekatrol.Automatum.Services.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace Mekatrol.Automatum.Tests.Integration;

[TestClass]
public sealed class HomeAssistantTests
{
    private readonly IServiceProvider _services;

    public HomeAssistantTests()
    {
        var serviceCollection = new ServiceCollection();

        // Bind home assistant options
        var homeAssistantOptions = new HomeAssistantOptions
        {
            SupervisorToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MzdiMzlhNzdjODc0YWQwOGQ5ZmIwOTNkMDNjOGNjNCIsImlhdCI6MTczNDkzNzg2OCwiZXhwIjoyMDUwMjk3ODY4fQ.tuKiyqfxRoPo8m97WyGn4R7NrH9RK_l8thJwmcYfeP8"
        };

        var loggerMock = new Mock<ILogger<HomeAssistantTests>>();

        serviceCollection.AddHttpClientServices(homeAssistantOptions, loggerMock.Object);
        serviceCollection.AddHomeAssistantServices();

        _services = serviceCollection.BuildServiceProvider();
    }

    [TestMethod]
    public async Task TestPing()
    {
        var homeAssistant = _services.GetRequiredService<IHomeAssistantService>();
        var cancellationTokenSource = new CancellationTokenSource();

        // Should be successful
        Assert.IsTrue(await homeAssistant.Ping(cancellationTokenSource.Token));
    }

    [TestMethod]
    public async Task TestGetStates()
    {
        var homeAssistant = _services.GetRequiredService<IHomeAssistantService>();
        var cancellationTokenSource = new CancellationTokenSource();

        // Should be successful
        var states = await homeAssistant.GetStates(cancellationTokenSource.Token);

        // There should be at least one state
        Assert.IsTrue(states.Any());
    }
}
