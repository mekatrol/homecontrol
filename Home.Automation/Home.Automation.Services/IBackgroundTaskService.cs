using Microsoft.Extensions.Hosting;

namespace Home.Automation.Services;

public interface IBackgroundTaskService : IHostedService
{
    Task Run(CancellationToken stoppingToken);
}
