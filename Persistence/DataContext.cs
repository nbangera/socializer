using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasData(
                new User { Id = 1, UID = Guid.NewGuid(), FirstName = "User1 FirstName", LastName = "User1 LastName", Username = "User1", Password = "Pentium@1", Email = "nishank.net@gmail.com" },
                new User { Id = 2, UID = Guid.NewGuid(), FirstName = "User2 FirstName", LastName = "User2 LastName", Username = "User2", Password = "Pentium@2", Email = "test@gmail.com" },
                new User { Id = 3, UID = Guid.NewGuid(), FirstName = "User3 FirstName", LastName = "User3 LastName", Username = "User3", Password = "Pentium@3", Email = "test2@gmail.com" }
            );
        }
    }
}
