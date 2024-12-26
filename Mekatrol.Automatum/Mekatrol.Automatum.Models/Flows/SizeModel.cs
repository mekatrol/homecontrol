namespace Mekatrol.Automatum.Models.Flows;

public class SizeModel
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override string ToString()
    {
        return $"({Width}, {Height})";
    }
}
