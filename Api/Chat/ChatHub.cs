using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Api.Chat {
    public class ChatHub : Hub {
        private readonly IMediator _mediator;
        public ChatHub (IMediator mediator) {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var userName = GetUserName();
            command.Username = userName;
            var comment =   await _mediator.Send(command);
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment",comment);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
             var userName = GetUserName();
             await  Clients.Groups(groupName).SendAsync("Send",$"{userName} joined the group");
        }

        public async Task RemoveFromGroup(string groupName)
        {
             await Groups.RemoveFromGroupAsync(Context.ConnectionId,groupName);
             var userName = GetUserName();
             await  Clients.Groups(groupName).SendAsync("Send",$"{userName} left the group");
        }

        private string GetUserName()
        {
             return Context.User?.Claims?.FirstOrDefault(x=>x.Type == ClaimTypes.NameIdentifier)?.Value;
        }
    }
}