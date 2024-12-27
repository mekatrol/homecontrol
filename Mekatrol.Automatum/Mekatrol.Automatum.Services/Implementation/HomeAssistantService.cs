using Mekatrol.Automatum.Models.HomeAssistant;
using System.Net.Http.Json;
using System.Text.Json;

namespace Mekatrol.Automatum.Services.Implementation;

internal class HomeAssistantService : IHomeAssistantService
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;

    public HomeAssistantService(HttpClient httpClient)
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        _httpClient = httpClient;
    }

    public async Task<IList<EntityStateModel>> GetStates(CancellationToken cancellationToken)
    {
        var response = await _httpClient.GetAsync("http://ha.lan:8123/api/states", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            // TODO: throw a proper error
            throw new Exception("");
        }

        // Get the body JSON as a ApiResponse object
        var entityStates = await response.Content.ReadFromJsonAsync<IList<EntityStateModel>>(_jsonOptions, cancellationToken);

        // Return states or empty list if deserialization returned null
        return entityStates ?? [];
    }

    public async Task<bool> Ping(CancellationToken cancellationToken)
    {
        var response = await _httpClient.GetAsync("http://ha.lan:8123/api/", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return false;
        }

        // Get the body JSON  as a ApiResponse object
        var apiStatus = await response.Content.ReadFromJsonAsync<ApiStatusModel>(_jsonOptions, cancellationToken);

        return apiStatus != null && apiStatus.Message.Contains("api running", StringComparison.OrdinalIgnoreCase);
    }
}