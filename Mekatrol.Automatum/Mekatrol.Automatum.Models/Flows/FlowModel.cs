namespace Mekatrol.Automatum.Models.Flows;


public class FlowModel : FlowSummaryModel
{
    public bool Enabled { get; set; }

    public IList<FlowBlockModel> Blocks { get; set; } = [];

    public IList<FlowConnectionModel> Connections { get; set; } = [];
}
