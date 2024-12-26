namespace Mekatrol.Automatum.Models.Flows;


public class Flow : BaseModel
{
    public IList<FlowBlock> Blocks { get; set; } = [];

    public IList<FlowConnection> Connections { get; set; } = [];
}
