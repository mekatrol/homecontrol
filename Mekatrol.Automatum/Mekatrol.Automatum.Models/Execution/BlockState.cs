using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Models.Execution;

public class BlockState
{
    /// <summary>
    /// The block that this block state is tracking
    /// </summary>
    public FlowBlock Block { get; set; } = new FlowBlock();

    public IList<IoState> Io { get; set; } = [];
}
