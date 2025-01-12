namespace Mekatrol.Automatum.Models.Execution;

public class ModuleState
{
    public ModuleState()
    {        
    }

    public ModuleState(string name, string description, ModuleStatus status)
    {
        Name = name;
        Description = description;
        Status = status;
    }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty; 
    
    public ModuleStatus Status { get; set; }

    public IList<string> Messages { get; set; } = [];
}
