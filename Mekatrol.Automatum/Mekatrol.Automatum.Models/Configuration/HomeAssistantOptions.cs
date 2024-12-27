namespace Mekatrol.Automatum.Models.Configuration;

public class HomeAssistantOptions
{
    public const string SectionName = "HomeAssistant";

    /// <summary>
    /// How long the connection to home assistant is maintained until the connection is cycled
    /// </summary>
    public TimeSpan ConnectionLifeTime { get; set; } = TimeSpan.FromMinutes(60);

    /// <summary>
    /// The home assistant server URL
    /// </summary>
    public string ServerUrl { get; set; } = string.Empty;

    /// <summary>
    /// The token used to access the home assistant API
    /// </summary>
    public string SupervisorToken { get; set; } = string.Empty;
}