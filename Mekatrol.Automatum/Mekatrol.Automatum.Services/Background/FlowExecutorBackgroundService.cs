using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Common.Extensions;
using Mekatrol.Automatum.Middleware.Exceptions;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Models.Execution;
using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Services.Exceptions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Mekatrol.Automatum.Services.Background;

internal class FlowExecutorBackgroundService(
    BackgroundServiceOptions backgroundServiceOptions,
    IServiceProvider serviceProvider,
    ILogger<FlowExecutorBackgroundService> logger)
    : BaseBackgroundService<FlowExecutorBackgroundService>(backgroundServiceOptions, serviceProvider, logger)
{
    protected override async Task<bool> ExecuteIteration(IServiceProvider services, CancellationToken stoppingToken)
    {
        var stateService = services.GetRequiredService<IStateService>();

        try
        {
            var flowDbService = services.GetRequiredService<IFlowDbService>();
            var flowStateService = services.GetRequiredService<IStateService>();

            var flows = await flowDbService.GetList(stoppingToken);

            // Iterate configured flows
            foreach (var flow in flows)
            {
                try
                {
                    // Stop processing further flows if cancellation flagged
                    if (stoppingToken.IsCancellationRequested)
                    {
                        return false;
                    }

                    // If the flow is not enabled then remove it (if it exists) and continue
                    if (!flow.Enabled)
                    {
                        flowStateService.RemoveFlowState(flow.Id);
                        continue;
                    }

                    // Get existing flow state, do not create if flow disabled
                    var flowState = flowStateService.GetFlowState(flow);

                    // Is the flow state flagged as failed?
                    if (flowState.Failed)
                    {
                        // Do not re-execute the flow until any errors have been resolved
                        continue;
                    }

                    // Execute the flow using the known state
                    await ExecuteFlow(flow, flowState, services, stoppingToken);
                }
                catch (FlowExecutionException ex)
                {
                    // TODO: Capture this to some error list that can be displayed to the user

                    logger.LogError(ex);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex);
                }
            }

            // Update status to running
            stateService.UpdateModuleState(ModuleNames.FlowExecutor, (moduleState) =>
            {
                moduleState.Messages.Clear();
                moduleState.Status = ModuleStatus.Running;
            });
        }
        catch (Exception ex)
        {
            Logger.LogError(ex);

            stateService.UpdateModuleState(ModuleNames.FlowExecutor, (moduleState) =>
            {
                moduleState.Messages.Clear();
                moduleState.Status = ModuleStatus.Error;
                moduleState.Messages.Add(ex.Message);
            });
        }
        return true;
    }

    private static async Task ExecuteFlow(Flow flow, FlowState flowState, IServiceProvider services, CancellationToken stoppingToken)
    {
        // Update last execution date and time
        flowState.LastExecutionDateTime = DateTimeOffset.UtcNow;

        var pointDbService = services.GetRequiredService<IPointDbService>();

        // First step is to update input points, note that this means an input to the flow
        // not that the point is an input (outputs can be inputs to flows)
        var flowInputs = flow.PointReferences
            .Where(pr => pr.Direction == InputOutputDirection.Input)
            .ToList();

        var values = new Dictionary<string, PointState>();

        foreach (var pointReference in flowInputs)
        {
            // Stop processing further points if cancellation flagged
            if (stoppingToken.IsCancellationRequested)
            {
                return;
            }

            try
            {
                // Get the point from the DB
                var point = await pointDbService.GetById(pointReference.PointId, stoppingToken);

                // Get the current state
                var pointState = flowState.Points.Single(p => p.Id == point.Id);

                pointState.Value = point.CurrentValue;
                pointState.Units = point.Units;

            }
            catch (NotFoundException)
            {
                // The point was not found so throw an exception as the flow cannot execute
                throw new FlowExecutionException($"The flow '{flow.Name}' with key '{flow.Key}' cannot execute because the point with key '{pointReference.PointId}' was not found or has been deleted.");
            }
        }

        // At the end of execution ensure flow state is flagged as initialized
        // (because it has been executed at least once now)
        flowState.Initialized = true;
    }
}
