﻿using Mekatrol.Automatum.Models.Configuration;
using Mekatrol.Automatum.NodeServer.Extensions;
using Mekatrol.Automatum.Services;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace Mekatrol.Automatum.NodeServer;

internal static class CertificateHelper
{
    public static async Task<X509Certificate2?> InitializeLoadCertificate(BuilderHelper builderHelper)
    {
        X509Certificate2? certificate = null;

        var certificateOptions = builderHelper.Configuration
           .GetSection(CertificateOptions.SectionName)
           .Get<CertificateOptions>();

        // Only create self signed certificate if enabled
        if (certificateOptions != null && certificateOptions.UseSelfSignedCertificate)
        {
            var certificateFullPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                certificateOptions.CertificatePath);

            // This is idempotent so can be called every start up
            var directory = Path.GetDirectoryName(certificateFullPath);
            if (directory != null)
            {
                Directory.CreateDirectory(directory);
            }

            // See if there is existing one and if so also check its expirey date
            if (File.Exists(certificateOptions.CertificatePath))
            {
                // Try and load existing
                try
                {
                    certificate = X509CertificateLoader.LoadPkcs12FromFile(
                        certificateFullPath,
                        certificateOptions.CertificatePassword);
                }
                catch (CryptographicException)
                {
                    // Set to null, we will recreate
                    certificate = null;
                }

                // If loaded then check expiry date
                if (certificate != null)
                {
                    // Check expiry
                    if (certificate.NotAfter <= DateTime.UtcNow)
                    {
                        // Clear certificate so that it is regenerated
                        certificate = null;
                    }
                }
            }

            // If the certificate is null at this pont then it either did not exist or has expired
            // so create a new one.
            if (certificate == null)
            {
                var certificateService = builderHelper.Services.GetRequiredService<ICertificateService>();

                // Generate pfx certificate
                certificate = certificateService.GenerateX509(certificateOptions.CertificateCommonName, certificateOptions.CertificatePassword);

                // Save new certificate
                await certificateService.SavePkcs12(certificateOptions.CertificatePath, certificateOptions.CertificatePassword, certificate);
            }
        }

        // Returning null means don't use configured certificate
        return certificate;
    }
}