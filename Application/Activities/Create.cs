using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }

            public string Category { get; set; }

            public string Description { get; set; }

            public string City { get; set; }

            public string Venue { get; set; }

            public DateTime Date { get; set; }
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
                var activity = new Activity
                {

                    Id = request.Id,
                    Date = request.Date,
                    Category = request.Category,
                    Description = request.Description,
                    City = request.City,
                    Venue = request.Venue,
                    Title = request.Title
                };
                _context.Activities.Add(activity);
                bool success = await _context.SaveChangesAsync() > 0;

                if (!success)
                {
                    throw new Exception("Activity could not be saved");
                }

                return Unit.Value;

            }
        }
    }
}