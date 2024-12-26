using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Models;
using Microsoft.EntityFrameworkCore;

namespace Mekatrol.Automatum.Services.Implementation;

internal class PingService(IHomeAssistantService homeAssistant, IAutomatumDbContext dbContext) : IPingService
{
    public async Task<PingModel> Ping(CancellationToken cancellationToken)
    {
        // Assume everything online
        var model = new PingModel
        {
            HomeAssistantOnline = true,
            DatabaseOnline = true
        };

        // Pong home assistant
        try
        {
            await homeAssistant.Ping(cancellationToken);
        }
        catch
        {
            // Home assistant is offline
            model.HomeAssistantOnline = false;
        }

        // Access the database
        try
        {
            await dbContext.Points.ToListAsync(cancellationToken);
        }
        catch
        {
            // Database is offline
            model.DatabaseOnline = false;
        }

        return model;
    }
}
