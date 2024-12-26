namespace Mekatrol.Automatum.Models.Flows;

public class FlowBlockModel
{
    //   Block identifier metadata
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Label { get; set; }

    // Functional properties for execution of flow
    public string FunctionType { get; set; } = string.Empty;    
    public IList<InputOutputModel> Io { get; set; } = [];

    // Visual properties for display in user interface
    public OffsetModel Offset { get; set; } = new OffsetModel();
    public SizeModel Size { get; set; } = new SizeModel();
    public int ZOrder { get; set; }
    public int ZBoost { get; set; }
    public int Z { get; set; }

    public bool Selected { get; set; }

    public bool? DraggingAsNew { get; set; }

    public bool? DragLocationInvalid { get; set; }

    public bool? DragLocationHasBeenValid { get; set; }
}
