using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace Mekatrol.Automatum.Services.Implementation;

/*
 * This service needs to be publish as it is used prior to the service container being built.
 */
public class CertificateService : ICertificateService
{
    private const int TenYears = 365 * 10;

    public X509Certificate2 GenerateX509(
        string subject,
        string password,
        DateTimeOffset? notBefore = null,
        DateTimeOffset? notAfter = null,
        HashAlgorithmName? hashAlgorithm = null,
        RSASignaturePadding? signaturePadding = null,
        int keySizeInBits = 2048)
    {
        // Default date range if needed
        notBefore ??= new DateTimeOffset(DateTime.UtcNow.AddDays(-1));
        notAfter ??= new DateTimeOffset(DateTime.UtcNow.AddDays(TenYears));

        // Make sure date range valid
        if (notBefore.Value >= notAfter.Value)
        {
            throw new InvalidOperationException($"'{nameof(notBefore)}' >= '{nameof(notAfter)}'");
        }

        // Geernate and return certificate
        using var rsa = RSA.Create(keySizeInBits);

        var request = new CertificateRequest(
            new X500DistinguishedName($"CN={subject}"),
            rsa,
            hashAlgorithm ?? HashAlgorithmName.SHA256,
            signaturePadding ?? RSASignaturePadding.Pkcs1);

        var certificate = request.CreateSelfSigned(notBefore.Value, notAfter.Value);

        // Return certificate if successful, else was an operation exception
        return certificate ?? throw new InvalidOperationException("Failed to create self signed certificate");
    }

    public X509Certificate2 LoadPkcs12(string path, string password)
    {
        var certificate = X509CertificateLoader.LoadPkcs12FromFile(path, password);
        return certificate;
    }

    public async Task SavePkcs12(string path, string password, X509Certificate2 certificate)
    {
        // Save certificate as PFX (Pkcs12)
        var certificateBytyes = certificate.Export(X509ContentType.Pkcs12, password);
        await File.WriteAllBytesAsync(path, certificateBytyes);
    }
}