using System.Net;

namespace Mekatrol.Automatum.Middleware.Exceptions;

public class InternalServerException : ServiceException
{
    public InternalServerException() : base(HttpStatusCode.InternalServerError)
    {
    }

    public InternalServerException(string error) : base(HttpStatusCode.InternalServerError, error)
    {
    }
}
