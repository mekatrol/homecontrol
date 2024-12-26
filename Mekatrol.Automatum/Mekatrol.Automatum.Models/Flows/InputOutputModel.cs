namespace Mekatrol.Automatum.Models.Flows;

public class InputOutputModel
{
    public int Pin { get; set; }

    public string? Label { get; set; }

    public string? Description { get; set; }

    public InputOutputSignalType Type { get; set; }

    public InputOutputDirection Direction { get; set; }

    public OffsetModel Offset { get; set; } = new OffsetModel();

    public SizeModel Size { get; set; } = new SizeModel();

    public BlockSide Side { get; set; }
}
