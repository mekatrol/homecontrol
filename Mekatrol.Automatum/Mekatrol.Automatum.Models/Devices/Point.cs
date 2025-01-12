using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Models.Devices;

public class Point : RootEntityModel
{
    public InputOutputSignalType SignalType { get; set; }

    public string Units { get; set; } = string.Empty;

    public string CurrentValue { get; set; } = string.Empty;

    public DateTimeOffset ValueLastUpdated { get; set; } = DateTimeOffset.MinValue;
}