using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public HttpStatusCode Code { get;private set; }

        public object Errors { get; private set; }
        public RestException(HttpStatusCode code,object errors = null)
        {
            Code = code;
            Errors = errors;
        }
        
    }
}