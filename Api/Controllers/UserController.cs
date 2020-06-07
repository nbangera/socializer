using Microsoft.AspNetCore.Mvc;
using Application;
using System.Threading.Tasks;
using Domain;
using System.Linq;
using System.Collections.Generic;
using Application.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace Api.Controllers
{
    public class UserController : BaseController
    {
        private readonly IConfiguration _config;
        public UserController(IConfiguration config)
        {
            _config = config;
        }


        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Refresh(RefreshToken.Query query)
        {
            var principal = GetPrincipalFromExpiredToken(query.Token);
            query.UserName = principal.Claims.FirstOrDefault(x=>x.Type == ClaimTypes.NameIdentifier)?.Value;
            var users = await Mediator.Send(query);
            return users;
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateLifetime = false,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid Token");

            return principal;
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            var users = await Mediator.Send(query);
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpPost("facebook")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> FacebookLogin(ExternalLogin.Query query)
        {
            return await Mediator.Send(query);
        }


        // [HttpGet("{uid}")]
        // public async Task<ActionResult<User>> UsersByUid(string uid)
        // {
        //     var users = await _userService.UsersByUid(uid);
        //     return Ok(users);
        // }

        // [HttpPost]
        // [Route("Create")]
        // public async Task<ActionResult<string>> Create(User user)
        // {
        //     var usersId = await _userService.Create(user);
        //     return Ok(usersId);
        // }


        // [HttpPost]
        // [Route("Update")]
        // public async Task<ActionResult<bool>> Update(User user)
        // {
        //     var saved = await _userService.Update(user);
        //     return Ok(saved);
        // }

    }
}