using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List(CancellationToken ct)
        {
            var result = await _mediator.Send(new List.Query(), ct);
            return result;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Detail(Guid id)
        {
            var activity = await _mediator.Send(new Detail.Query { Id = id });
            return activity;
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            var activity = await _mediator.Send(command);
            return activity;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            var activity = await _mediator.Send(command);
            return activity;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {            
            var activity = await _mediator.Send(new Delete.Command{Id=id});
            return activity;
        }
    }
}