using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Mekatrol.Automatum.Models.Converters;

public class UtcStringJsonConverter : JsonConverter<DateTime?>
{
    private const string UtcFormat = "\"yyyy-MM-ddTHH:mm:ss.fffffff\"";

    public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        static DateTime Parse(string s)
        {
            DateTime dateTimeUtc = DateTime.ParseExact(s, UtcFormat, null, DateTimeStyles.RoundtripKind);
            dateTimeUtc = DateTime.SpecifyKind(dateTimeUtc, DateTimeKind.Utc);
            return dateTimeUtc;
        }

        return reader.TokenType switch
        {
            JsonTokenType.Null => null,
            JsonTokenType.String => Parse(reader.GetString() ?? ""),
            _ => throw new JsonException($"Invalid token type '{reader.TokenType}' for type '{typeof(DateTime?).Name}' value.")
        };
    }

    public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
    {
        // If value null, then just write a null value
        if (value == null)
        {
            writer.WriteNullValue();
            return;
        }

        writer.WriteStringValue(value.Value.ToString(UtcFormat, CultureInfo.InvariantCulture));
    }
}
