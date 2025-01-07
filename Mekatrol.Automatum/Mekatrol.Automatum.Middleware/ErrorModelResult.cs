using Mekatrol.Automatum.Middleware.Extensions;
using Mekatrol.Automatum.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mime;
using System.Text.Json;

namespace Mekatrol.Automatum.Middleware;

public class ErrorModelResult : IActionResult
{
    public async Task ExecuteResultAsync(ActionContext context)
    {
        var serviceErrors = new List<ServiceError>();

        foreach(var key in context.ModelState.Keys)
        {
            if(!key.StartsWith('$'))
            {
                // This is the overarching error because the deserialized model will be null
                continue;
            }

            var error = context.ModelState[key];

            if (error == null)
            {
                // Shouldn't happen, but in case...
                continue;
            }

            serviceErrors.Add(new ServiceError(error.Errors.First().ErrorMessage, key.TrimStart('$').TrimStart('.')));
        }

        context.HttpContext.Response.ContentType = MediaTypeNames.Application.Json;
        context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

        var json = JsonSerializer.Serialize(serviceErrors, JsonSerializerExtensions.ErrorSerializerOptions);
        await context.HttpContext.Response.WriteAsync(json);
    }
}
