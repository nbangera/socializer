using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {

        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Id = request.Id, activity = "Not Found" });
                }

                //Activity activity = new Activity { Id = request.Id };
                _context.Activities.Remove(activity);
                bool success = await _context.SaveChangesAsync() > 0;
                if (!success)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Id = request.Id, activity = "Activity could not be deleted" });
                }

                return Unit.Value;
            }
        }
    }
}