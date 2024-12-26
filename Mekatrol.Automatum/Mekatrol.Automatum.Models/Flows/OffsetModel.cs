namespace Mekatrol.Automatum.Models.Flows;

public class OffsetModel
{
    public double X { get; set; }
    public double Y { get; set; }

    public override string ToString()
    {
        return $"({X}, {Y})";
    }

}
