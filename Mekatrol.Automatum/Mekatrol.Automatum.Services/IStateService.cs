using Mekatrol.Automatum.Devices;
using Mekatrol.Automatum.Models.Execution;
using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services;

public interface IStateService
{
    /// <summary>
    /// Get the managed flow state instance
    /// </summary>
    /// <param name="flow"></param>
    FlowState GetFlowState(Flow flow);

    /// <summary>
    /// Get a snapshot copy of the flow state instance
    /// Modifying this copy does not modify the original instance
    /// </summary>
    FlowState GetFlowStateSnapshot(Flow flow);

    /// <summary>
    /// Remove the state, typically called if a flow is disabled or deleted.
    /// </summary>
    /// <param name="flowId"></param>
    void RemoveFlowState(string flowId);

    /// <summary>
    /// Get the list of currently registered device types
    /// </summary>
    IList<IDeviceType> GetRegisteredDeviceTypes();

    /// <summary>
    /// Return true if a deive ype with the specified ID is registered
    /// </summary>
    bool IsDeviceTypeRegistered(Guid id);

    /// <summary>
    /// Add a device type
    /// </summary>
    void AddDeviceType(IDeviceType device);

    /// <summary>
    /// Remove the device type
    /// </summary>
    void RemoveDeviceType(IDeviceType device);

    /// <summary>
    /// Get a copy of the current system state
    /// </summary>
    SystemState SystemState { get; }

    /// <summary>
    /// Set a system module state
    /// </summary>
    void SetModuleState(ModuleState module);

    /// <summary>
    /// Get a system module state
    /// </summary>
    ModuleState GetModuleState(string name);

    /// <summary>
    /// Update the module state
    /// </summary>
    ModuleState UpdateModuleState(string name, Action<ModuleState> update);
    
    /// <summary>
    /// Add an alert
    /// </summary>
    void AddAlert(StateAlert stateAlert);

    /// <summary>
    /// Remove an alert
    /// </summary>
    void RemoveAlert(Guid alertId);
}
