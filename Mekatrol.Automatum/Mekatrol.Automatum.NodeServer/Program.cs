
using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.Services.Extensions;
using System.Security.Cryptography.X509Certificates;

namespace Mekatrol.Automatum.NodeServer;

public class Program
{
    private const string AppCorsPolicy = nameof(AppCorsPolicy);

    public static async Task Main(string[] args)
    {
        // Try and initialize/load the server certificate
        X509Certificate2? serverCertificate = await CertificateHelper.InitializeLoadCertificate(args);

        var builder = WebApplication.CreateBuilder(args);

        // Bind origins configuration
        var originsConfiguration = new OriginsOptions();
        builder.Configuration.Bind(OriginsOptions.SectionName, originsConfiguration);

        // If the certificate was loaded then configure host to use it
        // NOTE: a server certificate is typically not loaded if debugging through Visual Studio
        //       and is why appsettings.Development.json has: "UseSelfSignedCertificate": false
        if (serverCertificate != null)
        {
            builder.WebHost.ConfigureKestrel((context, serverOptions) =>
            {
                serverOptions.ConfigureHttpsDefaults(configureOptions =>
                {
                    configureOptions.ServerCertificate = serverCertificate;
                });
            });
        }

        // Add services to the container.
        builder.Services.AddAppServices();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: AppCorsPolicy,
                policy =>
                {
                    policy.WithOrigins([.. originsConfiguration]);
                    policy.AllowAnyMethod();
                    policy.AllowAnyHeader();
                });
        });

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        app.UseCors(AppCorsPolicy);

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

        app.Run();
    }
}
