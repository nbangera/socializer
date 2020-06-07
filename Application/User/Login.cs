using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x=>x.Email).NotEmpty();
                RuleFor(x=>x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {

            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signinManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(UserManager<AppUser> userManager,SignInManager<AppUser> signinManager,IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _signinManager = signinManager;
                _jwtGenerator = jwtGenerator;
            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }
                var result = await _signinManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (result.Succeeded)
                {
                    user.RefreshToken = _jwtGenerator.GenerateRefreshToken();
                    user.RefreshTokenExpiry = DateTime.Now.AddDays(30);

                    await _userManager.UpdateAsync(user);
                    
                    return new User{
                        DisplayName = user.DisplayName,
                        UserName = user.UserName,
                        Image = user.Photos.SingleOrDefault(x=>x.IsMain)?.Url,
                        Token = _jwtGenerator.CreateToken(user),
                        RefreshToken = user.RefreshToken,                        
                    };
                }
                throw new RestException(HttpStatusCode.Unauthorized);
            }
        }
    }
}