using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{

    public class ActivitiesController:BaseController
    {
   
        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> List(CancellationToken ct)
        {
            var result = await Mediator.Send(new List.Query(), ct);
            return result;

        }

        [HttpGet("{id}")]        
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            var activity = await Mediator.Send(new Details.Query { Id = id });
            return activity;
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            var activity = await Mediator.Send(command);
            return activity;
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            var activity = await Mediator.Send(command);
            return activity;
        }

        [HttpDelete("{id}")]
         [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {            
            var activity = await Mediator.Send(new Delete.Command{Id=id});
            return activity;
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command{Id = id});
        }

        [HttpDelete("{id}/unattend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command{Id = id});
        }
    }
}