using Microsoft.AspNetCore.Mvc;
using Application;
using System.Threading.Tasks;
using Domain;
using System.Linq;
using System.Collections.Generic;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Users()
        {
            var users = await _userService.Users();
            return Ok(users);
        }

        [HttpGet("{uid}")]
        public async Task<ActionResult<User>> UsersByUid(string uid)
        {
            var users = await _userService.UsersByUid(uid);
            return Ok(users);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<string>> Create(User user)
        {
            var usersId = await _userService.Create(user);
            return Ok(usersId);
        }

        
        [HttpPost]
        [Route("Update")]
        public async Task<ActionResult<bool>> Update(User user)
        {
            var saved = await _userService.Update(user);
            return Ok(saved);
        }

    }
}