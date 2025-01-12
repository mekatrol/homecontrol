namespace Mekatrol.Automatum.Devices;

public interface IDeviceType
{
    Guid Id { get; }

    string Name { get; set; }

    string Description { get; set; }

    string Publisher { get; set; }

    Version Version { get; set; }
}
