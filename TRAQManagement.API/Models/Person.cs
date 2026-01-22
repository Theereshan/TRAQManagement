using System.Collections.Generic;

namespace TRAQManagement.API.Models
{
    public class Person
    {
        public int PersonId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }

        // ✅ Navigation property (1 person can have many accounts)
        public List<Account> Accounts { get; set; } = new();
    }
}
