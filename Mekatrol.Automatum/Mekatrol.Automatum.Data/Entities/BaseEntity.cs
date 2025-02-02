﻿namespace Mekatrol.Automatum.Data.Entities;

public class BaseEntity
{
    public string Id { get; set; } = string.Empty;

    public string Key { get; set; } = string.Empty;

    public string Json { get; set; } = string.Empty;

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Updated { get; set; }

    public int RowVersion { get; set; }
}