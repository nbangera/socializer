using System;
using System.Threading;
using System.Threading.Tasks;
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
                Activity activity = new Activity { Id = request.Id };
                _context.Activities.Remove(activity);
                bool success = await _context.SaveChangesAsync() > 0;

                if (!success)
                {
                    throw new Exception("Activity could not be Deleted");
                }

                return Unit.Value;
            }
        }
    }
}