namespace Mekatrol.Automatum.Models.Flows;

public class BaseModel
{
    public Guid Id { get; set; } = Guid.Empty;

    public string Key { get; set; } = string.Empty;

    public bool Enabled { get; set; } = true;

    public string Label { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Updated { get; set; }
}