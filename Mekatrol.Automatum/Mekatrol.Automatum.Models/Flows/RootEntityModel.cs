namespace Mekatrol.Automatum.Models.Flows;

public class RootEntityModel : BaseModel
{
    public string Key { get; set; } = string.Empty;

    public bool Enabled { get; set; } = true;

    public string Label { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTimeOffset Created { get; set; }

    public DateTimeOffset Updated { get; set; }
}