﻿namespace Mekatrol.Automatum.Models;

public class ServiceError(string errorMessage, string? property = null)
{
    public string? Property { get; set; } = property;

    public string ErrorMessage { get; set; } = errorMessage;
}