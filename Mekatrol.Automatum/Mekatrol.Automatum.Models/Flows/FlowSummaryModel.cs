﻿namespace Mekatrol.Automatum.Models.Flows;

public class FlowSummaryModel : BaseModel
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Label { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}