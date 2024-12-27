using Mekatrol.Automatum.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mekatrol.Automatum.Data.Context;

public interface IAutomatumDbContext
{
    DbSet<PointEntity> Points { get; set; }

    DbSet<FlowEntity> Flows { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    Task InitializeDatabase(CancellationToken cancellationToken = default);
}