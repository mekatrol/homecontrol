namespace Mekatrol.Automatum.Models.Flows;

public class Flow : RootEntityModel
{
    public TimeSpan Interval { get; set; } = TimeSpan.FromMinutes(1);

    public IList<FlowPointReference> PointReferences { get; set; } = [];

    public IList<FlowBlock> Blocks { get; set; } = [];

    public IList<FlowConnection> Connections { get; set; } = [];
}