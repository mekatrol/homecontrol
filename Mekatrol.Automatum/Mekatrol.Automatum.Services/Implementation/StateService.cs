using Mekatrol.Automatum.Devices;
using Mekatrol.Automatum.Models.Execution;
using Mekatrol.Automatum.Models.Flows;
using System.Text.Json;

namespace Mekatrol.Automatum.Services.Implementation;

internal class StateService : IStateService
{
    // In memory set of flow states (static so that is shared across all instances, and DI containers)
    private static readonly Dictionary<string, FlowState> _flowStates = [];

    private static readonly Dictionary<Guid, IDeviceType> _deviceTypes = [];

    private static readonly Dictionary<string, ModuleState> _moduleStates = [];

    private static readonly SystemState _systemState = new();

    // The synchronisation lock across background services and HTTP requests
    private static readonly Lock _lock = new();

    public SystemState SystemState
    {
        get
        {
            SystemState systemState;
            
            lock (_lock)
            {
                _systemState.Modules = [.. _moduleStates.Values];
                systemState = Clone(_systemState);
            }

            systemState.IsLoading = systemState.Modules.Any(m => m.Status == ModuleStatus.Loading);

            return systemState;

        }
    }

    public void SetModuleState(ModuleState module)
    {
        lock (_lock)
        {
            _moduleStates[module.Name] = module;
        }
    }

    public ModuleState GetModuleState(string name)
    {
        lock (_lock)
        {
            return _moduleStates[name];
        }
    }

    public ModuleState UpdateModuleState(string name, Action<ModuleState> update)
    {
        // Get current state
        var moduleState = GetModuleState(name);

        // Update callback
        update(moduleState);

        // Update the module state
        SetModuleState(moduleState);

        // Return the updated state
        return moduleState;
    }

    public FlowState GetFlowState(Flow flow)
    {
        return GetFlowState(flow, false);
    }

    public FlowState GetFlowStateSnapshot(Flow flow)
    {
        return GetFlowState(flow, true);
    }

    public void RemoveFlowState(string flowId)
    {
        lock (_lock)
        {
            _flowStates.Remove(flowId);
        }
    }

    public IList<IDeviceType> GetRegisteredDeviceTypes()
    {
        lock (_lock)
        {
            return Clone(_deviceTypes.Values.ToList());
        }
    }

    public bool IsDeviceTypeRegistered(Guid id)
    {
        lock (_lock)
        {
            return _deviceTypes.ContainsKey(id);
        }
    }

    public void AddDeviceType(IDeviceType deviceType)
    {
        lock (_lock)
        {
            _deviceTypes.Add(deviceType.Id, deviceType);
        }
    }

    public void RemoveDeviceType(IDeviceType deviceType)
    {
        lock (_lock)
        {
            _deviceTypes.Remove(deviceType.Id);
        }
    }

    private static FlowState GetFlowState(Flow flow, bool takeSnapshot)
    {
        lock (_lock)
        {
            if (!_flowStates.TryGetValue(flow.Id, out var flowState))
            {
                flowState = CreateInitialFlowState(flow);
                _flowStates.Add(flow.Id, flowState);
            }

            if (takeSnapshot)
            {
                flowState = Clone(flowState);
            }

            return flowState;
        }
    }

    private static FlowState CreateInitialFlowState(Flow flow)
    {
        var flowState = new FlowState
        {
            Initialized = false,
            FlowId = flow.Id,
            Blocks = flow.Blocks
            .Select(b =>
                new BlockState
                {
                    Block = b,
                    Io = b.Io
                        .Select(io => new IoState { InputOutput = io })
                        .ToList()
                }
            )
            .ToList()
        };

        return flowState;
    }

    private static T Clone<T>(T source)
    {
        // Serialize / deserialize to perform a deep copy
        var json = JsonSerializer.Serialize(source);
        return JsonSerializer.Deserialize<T>(json)!;
    }
}
