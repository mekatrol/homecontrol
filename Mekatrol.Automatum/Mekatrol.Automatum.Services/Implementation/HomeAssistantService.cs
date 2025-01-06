using Mekatrol.Automatum.Data.Context;
using Mekatrol.Automatum.Models.HomeAssistant;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Text.Json;

namespace Mekatrol.Automatum.Services.Implementation;

internal class HomeAssistantService : IHomeAssistantService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<IHomeAssistantService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public HomeAssistantService(
        HttpClient httpClient,
        ILogger<IHomeAssistantService> logger)
    {
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        _httpClient = httpClient;
        _logger = logger;
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

    public async Task<EntityStateModel> GetState(string entityId, CancellationToken cancellationToken)
    {
        var response = await _httpClient.GetAsync($"http://ha.lan:8123/api/states/{entityId}", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            // TODO: throw a proper error
            throw new Exception("");
        }

        // Get the body JSON as a ApiResponse object
        var entityState = await response.Content.ReadFromJsonAsync<EntityStateModel>(_jsonOptions, cancellationToken);

        // Return state or null if not found
        return entityState;
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

    public async Task UpdatePointStates(IServiceProvider services, CancellationToken cancellationToken)
    {
        var dbContext = services.GetRequiredService<IAutomatumDbContext>();
        var state = await GetState("switch.alfresco_led", cancellationToken);

    }
}