using System.Net;

namespace Mekatrol.Automatum.Middleware.Exceptions;

public class ConflictException : ServiceException
{
    public ConflictException() : base(HttpStatusCode.Conflict)
    {
    }

    public ConflictException(string error) : base(HttpStatusCode.Conflict, error)
    {
    }
}