﻿namespace Mekatrol.Automatum.Data.Entities;

public class BaseEntity
{
    public Guid Id { get; set; } = Guid.Empty;

    public string Json { get; set; } = string.Empty;

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Updated { get; set; }

    public int RowVersion { get; set; }
}