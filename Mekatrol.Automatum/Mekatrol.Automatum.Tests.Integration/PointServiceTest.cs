using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Middleware.Exceptions;
using Mekatrol.Automatum.Models.Devices;
using Mekatrol.Automatum.Services;
using Mekatrol.Automatum.Services.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Mekatrol.Automatum.Tests.Integration;

[TestClass]
public class PointServiceTest : IntegrationTestBase
{
    private const string TestDBName = "automatum.test.pointservice.{0}.db";

    private AutomatumDbContext? _dbContext = null;

    [TestMethod]
    public async Task TestNoPoints()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var pointService = services.GetRequiredService<IPointDbService>();

            var points = await pointService.GetList(cancellationToken);

            // Should be no points
            Assert.AreEqual(0, points.Count);
        });
    }

    [TestMethod]
    public async Task TestNewPointEmptyId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var point = new Point
            {
                Id = Guid.Empty.ToString("D"),
                Key = "key1",
                Description = "The description"
            };

            var pointService = services.GetRequiredService<IPointDbService>();

            var createdPoint = await pointService.Create(point, cancellationToken);

            Assert.AreNotEqual(Guid.Empty.ToString("D"), createdPoint.Id);
        });
    }

    [TestMethod]
    public async Task TestNewPointGoodId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var point = new Point
            {
                Id = Guid.NewGuid().ToString("D"),
                Key = "key1"
            };

            var pointService = services.GetRequiredService<IPointDbService>();

            var createdPoint = await pointService.Create(point, cancellationToken);

            Assert.AreEqual(point.Id, createdPoint.Id);
        });
    }

    [TestMethod]
    public async Task TestUpdatePointNotFoundId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var point = new Point
            {
                Id = Guid.NewGuid().ToString("D"),
                Key = "key1"
            };

            var pointService = services.GetRequiredService<IPointDbService>();

            var ex = await Assert.ThrowsExceptionAsync<NotFoundException>(async () =>
            {
                await pointService.Update(point, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"A point with the ID '{point.Id}' was not found.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestUpdatePointBadId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var point = new Point
            {
                Id = Guid.Empty.ToString("D"),
                Key = "key1",
            };

            var pointService = services.GetRequiredService<IPointDbService>();

            var ex = await Assert.ThrowsExceptionAsync<BadRequestException>(async () =>
            {
                await pointService.Update(point, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"The ID '{point.Id}' is not valid.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestDeletePointNotFoundId()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var pointService = services.GetRequiredService<IPointDbService>();

            var id = Guid.NewGuid();
            var ex = await Assert.ThrowsExceptionAsync<NotFoundException>(async () =>
            {
                await pointService.Delete(id.ToString("D"), cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"A point with the ID '{id}' was not found.", ex.Errors[0].ErrorMessage);
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
                var point = new Point
                {
                    Id = id.ToString("D"),
                    Key = "key1"
                };

                var pointService = services.GetRequiredService<IPointDbService>();

                var createdPoint = await pointService.Create(point, cancellationToken);

                Assert.AreEqual(id.ToString("D"), createdPoint.Id);
            }

            // Clear tracking for previously created point
            _dbContext?.ChangeTracker.Clear();

            // Make sure it exists
            Assert.IsNotNull(await _dbContext!.Points.SingleOrDefaultAsync(x => x.Id == id.ToString("D"), cancellationToken));

            // Clear tracking for previously fetched point
            _dbContext?.ChangeTracker.Clear();

            await using (var scope = services.CreateAsyncScope())
            {
                var pointService = services.GetRequiredService<IPointDbService>();

                await pointService.Delete(id.ToString("D"), cancellationToken);
            }

            // Clear tracking for previously deleted point
            _dbContext?.ChangeTracker.Clear();

            // Make sure it no longer exists
            Assert.IsNull(await _dbContext!.Points.SingleOrDefaultAsync(x => x.Id == id.ToString("D"), cancellationToken));
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
                var point = new Point
                {
                    Id = id.ToString("D"),
                    Key = "key1"
                };

                var pointService = services.GetRequiredService<IPointDbService>();

                var createdPoint = await pointService.Create(point, cancellationToken);

                Assert.AreEqual(id.ToString("D"), createdPoint.Id);
            }

            // Clear tracking for previously created point
            _dbContext?.ChangeTracker.Clear();

            await using (var scope = services.CreateAsyncScope())
            {
                var point = new Point
                {
                    Id = id.ToString("D"), // Will be duplicate ID
                    Key = "key2"
                };

                var pointService = services.GetRequiredService<IPointDbService>();

                var ex = await Assert.ThrowsExceptionAsync<ConflictException>(async () =>
                {
                    await pointService.Create(point, cancellationToken);
                });

                Assert.AreEqual(1, ex.Errors.Count);
                Assert.AreEqual($"A point with the ID '{id}' already exists.", ex.Errors[0].ErrorMessage);
            }
        });
    }

    [TestMethod]
    public async Task TestCreateDuplicateName()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var key = "the.key";

            await using (var scope = services.CreateAsyncScope())
            {
                var point = new Point
                {
                    Id = Guid.NewGuid().ToString("D"),
                    Key = key
                };

                var pointService = services.GetRequiredService<IPointDbService>();

                var createdPoint = await pointService.Create(point, cancellationToken);

                Assert.AreEqual(key, createdPoint.Key);
            }

            // Clear tracking for previously created point
            _dbContext?.ChangeTracker.Clear();

            await using (var scope = services.CreateAsyncScope())
            {
                var point = new Point
                {
                    Id = Guid.NewGuid().ToString("D"),
                    Key = key
                };

                var pointService = services.GetRequiredService<IPointDbService>();

                var ex = await Assert.ThrowsExceptionAsync<ConflictException>(async () =>
                {
                    await pointService.Create(point, cancellationToken);
                });

                Assert.AreEqual(1, ex.Errors.Count);
                Assert.AreEqual($"A point with the key '{key}' already exists.", ex.Errors[0].ErrorMessage);
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

            var point = new Point
            {
                Id = id.ToString("D"),
                Key = "key1"
            };

            var pointService = services.GetRequiredService<IPointDbService>();

            var createdPoint = await pointService.Create(point, cancellationToken);

            var pointCopy1 = await pointService.GetById(point.Id, cancellationToken);
            var pointCopy2 = await pointService.GetById(point.Id, cancellationToken);

            pointCopy1.Key = "key2";
            pointCopy2.Key = "label3";

            await pointService.Update(pointCopy1, cancellationToken);

            var ex = await Assert.ThrowsExceptionAsync<ConflictException>(async () =>
            {
                await pointService.Update(pointCopy2, cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"The point with the ID '{id}' has changed, you need to fetch the latest version and update it.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestPointNotFound()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var pointService = services.GetRequiredService<IPointDbService>();

            var id = Guid.NewGuid();
            var ex = await Assert.ThrowsExceptionAsync<NotFoundException>(async () =>
            {
                await pointService.GetById(id.ToString("D"), cancellationToken);
            });

            Assert.AreEqual(1, ex.Errors.Count);
            Assert.AreEqual($"A point with the ID '{id}' was not found.", ex.Errors[0].ErrorMessage);
        });
    }

    [TestMethod]
    public async Task TestPointGetEmptyGuid()
    {
        await RunTestWithServiceContainer(async (services, cancellationToken) =>
        {
            var pointService = services.GetRequiredService<IPointDbService>();

            var point = await pointService.GetById(Guid.Empty.ToString("D"), cancellationToken);

            Assert.IsNotNull(point);
            Assert.AreNotEqual(Guid.Empty.ToString("D"), point.Id);
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
        serviceCollection.AddPointService();

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