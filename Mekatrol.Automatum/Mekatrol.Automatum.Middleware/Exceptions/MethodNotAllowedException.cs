﻿using Mekatrol.Automatum.Models;
using System.Net;

namespace Mekatrol.Automatum.Middleware.Exceptions;

public class MethodNotAllowedException : ServiceException
{
    public MethodNotAllowedException(IList<ServiceError> errors) : base(HttpStatusCode.MethodNotAllowed, errors)
    {
    }

    public MethodNotAllowedException() : base(HttpStatusCode.MethodNotAllowed)
    {
    }

    public MethodNotAllowedException(string error) : base(HttpStatusCode.MethodNotAllowed, error)
    {
    }
}