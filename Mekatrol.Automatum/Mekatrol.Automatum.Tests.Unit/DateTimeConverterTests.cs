using Mekatrol.Automatum.Models.Converters;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Mekatrol.Automatum.Tests.Unit;

[TestClass]
public sealed class DateTimeConverterTests
{
    [TestMethod]
    public void TestNullValue()
    {
        var dateString = "2024-12-21T05:44:43.237212+00:00";
        var json = $"{{ \"date_time\": \"{dateString}\" }}";

        var dto = DateTimeOffset.Parse(dateString);

#pragma warning disable CA1869 // Cache and reuse 'JsonSerializerOptions' instances
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };
#pragma warning restore CA1869 // Cache and reuse 'JsonSerializerOptions' instances

        var model = JsonSerializer.Deserialize<TestDateTimeConverterModel>(json, jsonOptions);

        Assert.IsNotNull(model);

        Assert.AreEqual(DateTime.Parse("2024-12-21T05:44:43.237212+00:00Z", null, DateTimeStyles.RoundtripKind), model.DateTime);
    }
}

public class TestDateTimeConverterModel
{
    public DateTimeOffset? DateTime { get; set; }
}
