using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Models.Execution;

public class IoState
{
    /// <summary>
    /// The input output that this io state is tracking
    /// </summary>
    public InputOutput InputOutput { get; set; } = new InputOutput();

    /// <summary>
    /// The current value of the input output
    /// </summary>
    public object Value { get; set; } = new object();
}