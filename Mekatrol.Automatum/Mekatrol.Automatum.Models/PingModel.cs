namespace Mekatrol.Automatum.Models;

public class PingModel
{
    /// <summary>
    /// Will be null if home assitant not configured, true if home assistant online or false if home assistant not online
    /// </summary>
    public bool? HomeAssistantOnline { get; set; }

    /// <summary>
    /// Will be true if the database service is online, false otherwise
    /// </summary>
    public bool DatabaseOnline { get; set; }
}