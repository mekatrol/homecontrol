namespace Mekatrol.Automatum.Models.Flows;


public class Flow : FlowSummary
{
    public bool Enabled { get; set; }

    public IList<FlowBlock> Blocks { get; set; } = [];

    public IList<FlowConnection> Connections { get; set; } = [];
}
