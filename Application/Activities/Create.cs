using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;
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

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Id).NotEmpty();
                RuleFor(x=>x.Title).NotEmpty();
                RuleFor(x=>x.Category).NotEmpty();
                RuleFor(x=>x.Description).NotEmpty();
                RuleFor(x=>x.Date).NotEmpty();
                RuleFor(x=>x.Venue).NotEmpty();
                RuleFor(x=>x.City).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
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
                var userName = _userAccessor.GetCurrentUsername();
                var user = await _context.Users.SingleOrDefaultAsync(x=>x.UserName == userName);

                var attendee = new UserActivity
                {
                    AppUser = user,
                    Activity = activity,
                    DateJoined = DateTime.Now,
                    IsHost = true                
                };
                _context.UserActivities.Add(attendee);
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