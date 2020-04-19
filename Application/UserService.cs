using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application
{
    public interface IUserService
    {
        public Task<IEnumerable<User>> Users();

        public Task<string> Create(User user);
        public Task<bool> Update(User user);
        public Task<User> UsersByUid(string uid);        

    }
    public class UserService : IUserService
    {
        private readonly DataContext _dataContext;
        public UserService(DataContext dataContext)
        {
            this._dataContext = dataContext;
        }

        public async Task<IEnumerable<User>> Users()
        {
            var result = await _dataContext.Users.ToListAsync();
            return result;
        }

        public async Task<string> Create(User user)
        {
            var savedUser = await _dataContext.Users.AddAsync(user);
            var result = await _dataContext.SaveChangesAsync();
            var uid = savedUser.Entity.UID;
            return uid.ToString();
        }

        public async Task<bool> Update(User user)
        {
            var currentUser = await _dataContext.Users.SingleOrDefaultAsync(t => t.Id == user.Id);
            currentUser = user;
            var result = await _dataContext.SaveChangesAsync();
            return true;
        }
        public async Task<User> UsersByUid(string uid)
        {
            var userId = new Guid(uid);
            var currentUser = await _dataContext.Users.Where(t => t.UID == userId).SingleOrDefaultAsync();
            return currentUser;
        }
    }
}
