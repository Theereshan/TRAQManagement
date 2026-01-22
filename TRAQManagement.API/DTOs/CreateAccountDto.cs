using System.ComponentModel.DataAnnotations;

namespace TRAQManagement.API.DTOs
{
    public class CreateAccountDto
    {
        [Required]
        public int PersonId { get; set; }

        [Required]
        public string AccountNumber { get; set; }
    }
}
