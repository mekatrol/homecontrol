using Microsoft.Extensions.DependencyInjection;

namespace Mekatrol.Automatum.Tests.Integration;

public abstract class IntegrationTestBase
{
    protected async Task RunTestWithServiceContainer(Func<IServiceProvider, CancellationToken, Task> runTest)
    {
        // Create a cencellation token
        using var cancellationTokenSource = new CancellationTokenSource();

        // Create service container
        var serviceCollection = new ServiceCollection();

        // Add services
        await Setup(serviceCollection);

        // Build service provider
        var services = serviceCollection.BuildServiceProvider();

        // Run test callback
        await runTest(services, cancellationTokenSource.Token);

        // Cleanup after running test
        await Cleanup();
    }

    protected virtual Task<ServiceCollection> Setup(ServiceCollection serviceCollection)
    {
        return Task.FromResult(serviceCollection);
    }

    protected virtual Task Cleanup()
    {
        return Task.CompletedTask;
    }
}
