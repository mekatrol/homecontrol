namespace Mekatrol.Automatum.Models.HomeAssistant;

public class EntityStateModel
{
    public string EntityId { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public AttributesModel Attributes { get; set; } = new AttributesModel();

    public DateTimeOffset LastChanged { get; set; }

    public DateTimeOffset LastReported { get; set; }

    public DateTimeOffset LastUpdated { get; set; }
}
