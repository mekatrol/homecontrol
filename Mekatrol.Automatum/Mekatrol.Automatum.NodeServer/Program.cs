
using Mekatrol.Automatum.Common;
using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Middleware;
using Mekatrol.Automatum.Middleware.Extensions;
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Models.Execution;
using Mekatrol.Automatum.NodeServer.Extensions;
using Mekatrol.Automatum.Services;
using Mekatrol.Automatum.Services.Extensions;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Mekatrol.Automatum.NodeServer;

public class Program
{
    private const string AppCorsPolicy = nameof(AppCorsPolicy);

    public static async Task Main(string[] args)
    {
        WebApplication app;

        // Scope next section so that garbage collector will clean up builder helper after we complete the section
        {
            var builderHelper = new BuilderHelper();

            //  Create web application builder
            var webAppBuilder = WebApplication.CreateBuilder(args);

            // Bind origins options
            var originsOptions = new OriginsOptions();
            webAppBuilder.Configuration.Bind(OriginsOptions.SectionName, originsOptions);

            // Try and initialize/load the server certificate
            var serverCertificate = await CertificateHelper.InitializeLoadCertificate(builderHelper);

            // If the certificate was loaded then configure host to use it
            // NOTE: a server certificate is typically not loaded if debugging through Visual Studio
            //       and is why appsettings.Development.json has: "UseSelfSignedCertificate": false
            if (serverCertificate != null)
            {
                webAppBuilder.WebHost.ConfigureKestrel((context, serverOptions) =>
                {
                    serverOptions.ConfigureHttpsDefaults(configureOptions =>
                    {
                        configureOptions.ServerCertificate = serverCertificate;
                    });
                });
            }

            webAppBuilder.Services.Configure<HostOptions>(x =>
            {
                x.ServicesStartConcurrently = true;
                x.ServicesStopConcurrently = true;

                // Don't stop host if background service fails
                x.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.Ignore;
            });

            // Initialise DB context
            webAppBuilder.Services.AddDbContext<IAutomatumDbContext, AutomatumDbContext>(
                options => options.UseSqlite($"Data Source={nameof(Mekatrol)}.{nameof(Automatum)}.db".ToLower()),
                ServiceLifetime.Scoped);

            // Add services to the container.
            webAppBuilder.Services.AddExceptionMiddleware();
            webAppBuilder.Services.AddAppServices(webAppBuilder, builderHelper.Logger);

            webAppBuilder.Services.Configure<JsonOptions>(options =>
            {
                options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            webAppBuilder.Services.AddCors(options =>
            {
                options.AddPolicy(name: AppCorsPolicy,
                    policy =>
                    {
                        policy.WithOrigins([.. originsOptions]);
                        policy.AllowAnyMethod();
                        policy.AllowAnyHeader();
                    });
            });

            // Bind device options
            var devicesOptions = new DevicesOptions();
            webAppBuilder.Configuration.Bind(DevicesOptions.SectionName, devicesOptions);

            webAppBuilder.Services
                .AddControllers()
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.InvalidModelStateResponseFactory = (context) => new ErrorModelResult();
                })
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            webAppBuilder.Services.AddEndpointsApiExplorer();
            webAppBuilder.Services.AddSwaggerGen(c =>
            {
                c.SchemaFilter<NonNullablePropertiesRequiredSchemaFilter>();
            });

            app = webAppBuilder.Build();
        }

        // Make sure DB has migrations applied (as well as any seed scripts)
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<IAutomatumDbContext>();
            await dbContext.InitializeDatabase();
        }

        app.UseCors(AppCorsPolicy);

        app.UseExceptionMiddleware();

        app.UseStaticFiles();

        app.UseSwagger();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwaggerUI(x =>
            {
                x.EnableTryItOutByDefault();
            });
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.RegisterSystemModules();

        app.Run();
    }
}