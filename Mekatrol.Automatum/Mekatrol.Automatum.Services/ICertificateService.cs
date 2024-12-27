using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace Mekatrol.Automatum.Services;

public interface ICertificateService
{
    X509Certificate2 GenerateX509(
        string subject,
        string password,
        DateTimeOffset? notBefore = null,
        DateTimeOffset? notAfter = null,
        HashAlgorithmName? hashAlgorithm = null,
        RSASignaturePadding? signaturePadding = null,
        int keySizeInBits = 2048);

    Task SavePkcs12(
        string path,
        string password,
        X509Certificate2 certificate);

    X509Certificate2 LoadPkcs12(
        string path,
        string password);
}