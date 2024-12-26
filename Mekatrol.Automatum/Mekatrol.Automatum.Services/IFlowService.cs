using Mekatrol.Automatum.Models.Flows;

namespace Mekatrol.Automatum.Services;

public interface IFlowService
{
    Task<IList<FlowSummaryModel>> GetSummaries(CancellationToken cancellationToken);

    Task<FlowModel> Get(Guid id, CancellationToken cancellationToken);

    Task<FlowModel> Create(FlowModel flow, CancellationToken cancellationToken);

    Task<FlowModel> Update(FlowModel flow, CancellationToken cancellationToken);

    Task Delete(Guid id, CancellationToken cancellationToken);
}