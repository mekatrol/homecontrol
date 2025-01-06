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

    /// <summary>
    /// The maximum number of consecutive exceptions in the home assistant background service
    /// main service loop before it will just exit the service loop (and not run again till a restart).
    /// NOTE: this is only a count of the exception that are propagated to the service loop itself.
    ///       exceptions that are handled within loop method calls are not counted.
    /// </summary>
    public int MaxConsecutiveExceptions { get; set; } = 10;

    /// <summary>
    /// The number of milliseconds to sleep in the loop after an exception occurs.
    /// </summary>
    public int LoopExceptionSleep { get; set; } = 10000;

    /// <summary>
    /// The number of milliseconds to sleep after each iteration of the loop (so that Home Assistant is not smashed with requests)
    /// in milliseconds
    /// </summary>
    public int LoopIterationSleep { get; set; } = 500;
}