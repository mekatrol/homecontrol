using Mekatrol.Automatum.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Diagnostics.CodeAnalysis;

namespace Mekatrol.Automatum.Data.Context;

public interface IAutomatumDbContext
{
    DbSet<PointEntity> Points { get; set; }

    DbSet<FlowEntity> Flows { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    Task InitializeDatabase(CancellationToken cancellationToken = default);
}