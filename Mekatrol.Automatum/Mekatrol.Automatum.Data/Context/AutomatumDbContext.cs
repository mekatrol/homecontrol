﻿using Mekatrol.Automatum.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Runtime.CompilerServices;

namespace Mekatrol.Automatum.Data.Context;

public class AutomatumDbContext(DbContextOptions<AutomatumDbContext> options) : DbContext(options), IAutomatumDbContext
{
    public DbSet<Point> Points { get; set; }

    public DbSet<FlowEntity> Flows { get; set; }

    public DbSet<FlowConnectionEntity> FlowConnections { get; set; }

    public async Task InitializeDatabase(CancellationToken cancellationToken = default)
    {
        // Make sure all migrations applied
        await Database.MigrateAsync(cancellationToken);

        // Now apply row version triggers
        IList<string> tables = ["Flows", "FlowConnections", "Points"];
        var triggerSql =
            @"
create trigger UpdateRowVersion{0}
after update on {0}
begin
    update {0}
    set RowVersion = RowVersion + 1
    where rowid = new.rowid;
end;
            ";

        var triggerNames = await Database
            .SqlQueryRaw<string>("select name from sqlite_master where type = 'trigger';")
            .ToListAsync(cancellationToken);

        foreach (var tableName in tables)
        {
            var triggerName = $"UpdateRowVersion{tableName}";

            if(triggerNames.Contains(triggerName))
            {
                continue;
            }

            var sql = string.Format(triggerSql, tableName).Trim();
            await Database.ExecuteSqlRawAsync(sql, cancellationToken);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<FlowEntity>()
                .Property(c => c.RowVersion)
                    .HasDefaultValue(1)
                    .IsRowVersion();
    }
}
