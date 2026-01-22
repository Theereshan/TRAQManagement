using System.ComponentModel.DataAnnotations;

namespace TRAQManagement.API.DTOs
{
    public class CreateTransactionDto
    {
        [Required]
        public int AccountId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }
    }
}
