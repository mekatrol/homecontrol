namespace Mekatrol.Automatum.Models.Configuration;

public class CertificateOptions
{
    public const string SectionName = "Certificate";
    public const string DefaultCommonNameName = "Mekatrol.Automatum.NodeServer";
    public const string DefaultPassword = "test_only_should_be_changed";
    public const string DefaultCertificatePath = "/data/certificate.pfx";

    public bool UseSelfSignedCertificate { get; set; }

    public string CertificateCommonName { get; set; } = $"{nameof(Mekatrol)}.{nameof(Automatum)}";

    public string CertificatePassword { get; set; } = DefaultPassword;

    public string CertificatePath { get; set; } = DefaultCertificatePath;
}