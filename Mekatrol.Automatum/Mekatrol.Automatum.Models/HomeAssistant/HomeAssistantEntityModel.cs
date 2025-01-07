namespace Mekatrol.Automatum.Models.HomeAssistant;

public class HomeAssistantEntityModel
{
    public string EntityId { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public HomeAssistantEntityAttributesModel Attributes { get; set; } = new HomeAssistantEntityAttributesModel();

    public DateTimeOffset LastChanged { get; set; }

    public DateTimeOffset LastReported { get; set; }

    public DateTimeOffset LastUpdated { get; set; }
}
