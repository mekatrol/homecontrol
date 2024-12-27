using Mekatrol.Automatum.Models;

namespace Mekatrol.Automatum.Services;

public interface IPingService
{
    Task<PingModel> Ping(CancellationToken cancellationToken);
}