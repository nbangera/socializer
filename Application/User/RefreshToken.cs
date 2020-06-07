using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class RefreshToken
    {
        public class Query : IRequest<User>
        {
            public string UserName { get; set; }
            public string Token { get; set; }
            public string RefreshToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;

            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(request.UserName);
                if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiry < DateTime.Now)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                user.RefreshToken = _jwtGenerator.GenerateRefreshToken();
                user.RefreshTokenExpiry = DateTime.Now.AddDays(30);

                await _userManager.UpdateAsync(user);

                return new User
                {
                    DisplayName = user.DisplayName,
                    UserName = user.UserName,
                    Image = user.Photos.SingleOrDefault(x => x.IsMain)?.Url,
                    Token = _jwtGenerator.CreateToken(user),
                    RefreshToken = user.RefreshToken,
                };
            }
        }
    }
}