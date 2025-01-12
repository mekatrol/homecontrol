namespace Mekatrol.Automatum.Models.Flows;

public class FlowPointReference
{
    public string PointId { get;set; } = string.Empty;

    public InputOutputDirection Direction { get; set; }

    public InputOutputSignalType SignalType { get; set; }
}
