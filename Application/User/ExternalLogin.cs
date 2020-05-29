using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class ExternalLogin
    {
        public class Query : IRequest<User>
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IFacebookAccessor _facebookAccessor;

            private readonly IJwtGenerator _jwtGenerator;
            public Handler(IFacebookAccessor facebookAccessor, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _facebookAccessor = facebookAccessor;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var facebookInfo = await _facebookAccessor.FacebookLogin(request.AccessToken);

                if (facebookInfo == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validating token" });

                var user = await _userManager.FindByEmailAsync(facebookInfo.Email);
                if (user == null)
                {
                    user = new AppUser
                    {
                        DisplayName = facebookInfo.Name,
                        Email = facebookInfo.Email,
                        UserName = "fb_" + facebookInfo.Id,
                        Id = facebookInfo.Id
                    };

                    var photo = new Photo
                    {
                        IsMain = true,
                        Url = facebookInfo.Picture.Data.Url,
                        Id = "fb_" + facebookInfo.Id
                    };
                    user.Photos.Add(photo);

                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                        throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem creating user" });

                }
                return new User
                {
                    UserName = user.UserName,
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
                };

            }
        }
    }
}