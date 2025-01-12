namespace Mekatrol.Automatum.Models.Execution;

public class SystemState
{
    public bool IsLoading { get; set; } = true;

    public IList<ModuleState> Modules { get; set; } = [];

    public IList<StateAlert> Alerts { get; set; } = [];
}
