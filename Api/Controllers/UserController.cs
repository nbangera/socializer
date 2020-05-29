using Microsoft.AspNetCore.Mvc;
using Application;
using System.Threading.Tasks;
using Domain;
using System.Linq;
using System.Collections.Generic;
using Application.User;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    public class UserController : BaseController
    {        

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