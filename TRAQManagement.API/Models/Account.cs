using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TRAQManagement.API.Models
{
    public class Account
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public int PersonId { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }

        // Navigation Properties
        public Person Person { get; set; }
        public Status Status { get; set; }
    }
}
