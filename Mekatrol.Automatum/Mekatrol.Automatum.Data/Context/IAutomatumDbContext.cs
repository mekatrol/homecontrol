using Mekatrol.Automatum.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mekatrol.Automatum.Data.Context;

public interface IAutomatumDbContext
{
    DbSet<Point> Points { get; set; }

    DbSet<FlowEntity> Flows { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    Task InitializeDatabase(CancellationToken cancellationToken = default);
}