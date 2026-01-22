using Microsoft.EntityFrameworkCore;
using System;
using TRAQManagement.API.Models;

namespace TRAQManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Person> Persons { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<User> Users { get; set; }

    }
}
