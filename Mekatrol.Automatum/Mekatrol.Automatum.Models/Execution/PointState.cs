namespace Mekatrol.Automatum.Models.Execution;

public class PointState
{
    public string Id { get; set; } = string.Empty;

    public object? Value { get; set; } = null;

    public string Units { get; set; } = string.Empty;

    public DateTimeOffset LastUpdated { get; set; }
}
