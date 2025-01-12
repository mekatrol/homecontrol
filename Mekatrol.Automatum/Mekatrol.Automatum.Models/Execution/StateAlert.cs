namespace Mekatrol.Automatum.Models.Execution;

public class StateAlert
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string? Link { get; set; }
}
