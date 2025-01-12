using Mekatrol.Automatum.Devices;

namespace Mekatrol.Automatum.KnownDevices;

public class HomeAssistantDeviceTypeFactory : IDeviceTypeFactory
{
    private static readonly Guid _id = Guid.Parse("{C32DC3D5-5E96-4AD8-BD98-461FE939C6A2}");

    public Guid Identitier => _id;

    public IList<IDeviceType> GetDeviceTypes()
    {
        return [];
    }
}
