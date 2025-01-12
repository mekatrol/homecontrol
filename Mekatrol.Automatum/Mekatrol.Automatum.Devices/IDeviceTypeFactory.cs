namespace Mekatrol.Automatum.Devices;

public interface IDeviceTypeFactory
{
    Guid Identitier { get; }

    IList<IDeviceType> GetDeviceTypes();
}
