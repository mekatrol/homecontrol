using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Middleware.Exceptions;
using Mekatrol.Automatum.Models.Flows;
using Mekatrol.Automatum.Services;
using Mekatrol.Automatum.Services.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Mekatrol.Automatum.Tests.Integration;

[TestClass]
public class FlowServiceTest : IntegrationTestBase
{
    private const string TestDBName = "automatum.test.flowservice.{0}.db";

    private AutomatumDbContext? _dbContext = null;

    [TestMethod]
    public async Task TestNoFlows()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flowService = services.GetRequiredService<IFlowService>();

            var flows = await flowService.GetSummaries(cancellationToken);

            // Should be no flows
            Assert.AreEqual(0, flows.Count);
        });
    }

    [TestMethod]
    public async Task TestNewFlowEmptyId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flow = new Flow
            {
                Label = "label1",
                Blocks = [],
                Connections = []
            };

            var flowService = services.GetRequiredService<IFlowService>();

            var createdFlow = await flowService.Create(flow, cancellationToken);

            Assert.AreNotEqual(Guid.Empty, createdFlow.Id);
        });
    }

    [TestMethod]
    public async Task TestNewFlowGoodId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flow = new Flow
            {
                Id = Guid.NewGuid(),
                Label = "label1",
                Blocks = [],
                Connections = []
            };

            var flowService = services.GetRequiredService<IFlowService>();

            var createdFlow = await flowService.Create(flow, cancellationToken);

            Assert.AreEqual(flow.Id, createdFlow.Id);
        });
    }

    [TestMethod]
    public async Task TestUpdateFlowNotFoundId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flow = new Flow
            {
                Id = Guid.NewGuid(),
                Label = "label1",
                Blocks = [],
                Connections = []
            };

            var flowService = services.GetRequiredService<IFlowService>();

            var ex = await Assert.ThrowsExceptionAsync<NotFoundException>(async () =>
            {
                await flowService.Update(flow, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"A flow with the ID '{flow.Id}' was not found.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestDeleteFlowNotFoundId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flowService = services.GetRequiredService<IFlowService>();

            var id = Guid.NewGuid();
            var ex = await Assert.ThrowsExceptionAsync<NotFoundException>(async () =>
            {
                await flowService.Delete(id, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"A flow with the ID '{id}' was not found.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestDeleteId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var id = Guid.NewGuid();

            await using (var scope = services.CreateAsyncScope())
            {
                var flow = new Flow
                {
                    Id = id,
                    Label = "label1",
                    Blocks = [],
                    Connections = []
                };

                var flowService = services.GetRequiredService<IFlowService>();

                var createdFlow = await flowService.Create(flow, cancellationToken);

                Assert.AreEqual(id, createdFlow.Id);
            }

            // Clear tracking for previously created flow
            _dbContext?.ChangeTracker.Clear();

            // Make sure it exists
            Assert.IsNotNull(await _dbContext!.Flows.SingleOrDefaultAsync(x => x.Id == id, cancellationToken));

            // Clear tracking for previously fetched flow
            _dbContext?.ChangeTracker.Clear();

            await using (var scope = services.CreateAsyncScope())
            {
                var flowService = services.GetRequiredService<IFlowService>();

                await flowService.Delete(id, cancellationToken);
            }

            // Clear tracking for previously deleted flow
            _dbContext?.ChangeTracker.Clear();

            // Make sure it no longer exists
            Assert.IsNull(await _dbContext!.Flows.SingleOrDefaultAsync(x => x.Id == id, cancellationToken));
        });
    }

    [TestMethod]
    public async Task TestCreateDuplicateId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var id = Guid.NewGuid();

            await using (var scope = services.CreateAsyncScope())
            {
                var flow = new Flow
                {
                    Id = id,
                    Label = "label1",
                    Blocks = [],
                    Connections = []
                };

                var flowService = services.GetRequiredService<IFlowService>();

                var createdFlow = await flowService.Create(flow, cancellationToken);

                Assert.AreEqual(id, createdFlow.Id);
            }

            // Clear tracking for previously created flow
            _dbContext?.ChangeTracker.Clear();

            await using (var scope = services.CreateAsyncScope())
            {
                var flow = new Flow
                {
                    Id = id, // // Will be duplicate ID
                    Label = "label2",
                    Blocks = [],
                    Connections = []
                };

                var flowService = services.GetRequiredService<IFlowService>();

                var ex = await Assert.ThrowsExceptionAsync<ConflictException>(async () =>
                {
                    await flowService.Create(flow, cancellationToken);
                });

                Assert.AreEqual(1, ex.Errors.Count);
                Assert.AreEqual($"A flow with the ID '{id}' already exists.", ex.Errors[0].ErrorMessage);
            }
        });
    }

    [TestMethod]
    public async Task TestOptimisticConcurrency()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var id = Guid.NewGuid();

            await using var scope = services.CreateAsyncScope();
            
            var flow = new Flow
            {
                Id = id,
                Label = "label1",
                Blocks = [],
                Connections = []
            };

            var flowService = services.GetRequiredService<IFlowService>();

            var createdFlow = await flowService.Create(flow, cancellationToken);

            var flowCopy1 = await flowService.Get(flow.Id, cancellationToken);
            var flowCopy2 = await flowService.Get(flow.Id, cancellationToken);

            flowCopy1.Label = "label2";
            flowCopy2.Label = "label3";

            await flowService.Update(flowCopy1, cancellationToken);

            var ex = await Assert.ThrowsExceptionAsync<ConflictException>(async () =>
            {
                await flowService.Update(flowCopy2, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"The flow with the ID '{id}' has changed, you need to fetch the latest version and update it.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestFlowNotFound()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flowService = services.GetRequiredService<IFlowService>();

            var id = Guid.NewGuid();
            var ex = await Assert.ThrowsExceptionAsync<NotFoundException>(async () =>
            {
                await flowService.Get(id, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"A flow with the ID '{id}' was not found.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestFlowGetEmptyGuid()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var flowService = services.GetRequiredService<IFlowService>();

            var flow = await flowService.Get(Guid.Empty, cancellationToken);

            Assert.IsNotNull(flow);
            Assert.AreNotEqual(Guid.Empty, flow.Id);
        });
    }

    protected override async Task<ServiceCollection> Setup(ServiceCollection serviceCollection)
    {
        // Set up Sqlite database
        var dbName = string.Format(TestDBName, Guid.NewGuid());
        var optionsBuilder = new DbContextOptionsBuilder<AutomatumDbContext>();
        optionsBuilder.UseSqlite($"Data Source={dbName}");
        _dbContext = new AutomatumDbContext(optionsBuilder.Options);
        await _dbContext.Database.EnsureDeletedAsync();
        await _dbContext.InitializeDatabase();

        serviceCollection.AddSingleton<IAutomatumDbContext>(_dbContext);
        serviceCollection.AddFlowService();

        return serviceCollection;
    }

    protected override async Task Cleanup()
    {
        if (_dbContext != null)
        {
            // Cleanup database on disk
            await _dbContext.Database.CloseConnectionAsync();
            await _dbContext.Database.EnsureDeletedAsync();
        }
    }
}