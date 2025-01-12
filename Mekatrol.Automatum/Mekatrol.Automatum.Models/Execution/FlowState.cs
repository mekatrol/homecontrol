namespace Mekatrol.Automatum.Models.Execution;

public class FlowState
{
    /// <summary>
    /// Set to true if execution failed, flow will not be reexecuted until
    /// the error is resolved by a user (or other system component)
    /// </summary>
    public bool Failed { get; set; } = false;

    /// <summary>
    /// The list of result messages from the most recent execution
    /// </summary>
    public IList<ExecutionResult> ExecutionResults { get; set; } = [];

    /// <summary>
    /// The last date and time that an execution of the flow occurred
    /// </summary>
    public DateTimeOffset LastExecutionDateTime { get; set; }

    /// <summary>
    /// The ID of flow that is flow state is tracking
    /// </summary>
    public string FlowId { get; set; } = string.Empty;

    /// <summary>
    /// Set to true once the flow state has been initialized for the first time
    /// </summary>
    public bool Initialized { get; set; } = false;

    /// <summary>
    /// Tracking the state of the flow IO
    /// </summary>
    public IList<PointState> Points { get; set; } = [];

    /// <summary>
    /// Tracking the state of the flow blocks
    /// </summary>
    public IList<BlockState> Blocks { get; set; } = [];
}
