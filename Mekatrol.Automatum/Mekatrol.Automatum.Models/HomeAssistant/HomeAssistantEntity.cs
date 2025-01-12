namespace Mekatrol.Automatum.Models.HomeAssistant;

public class HomeAssistantEntity
{
    public string EntityId { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public HomeAssistantEntityAttributes Attributes { get; set; } = new HomeAssistantEntityAttributes();

    public DateTimeOffset LastChanged { get; set; }

    public DateTimeOffset LastReported { get; set; }

    public DateTimeOffset LastUpdated { get; set; }
}
