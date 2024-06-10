
namespace Home.Automation.Services.Implementation;

internal class HomeAssistantBackgroundTaskService : IBackgroundTaskService
{
    public async Task Run(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(100, stoppingToken);
        }
    }
}
