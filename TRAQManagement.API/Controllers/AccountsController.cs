using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TRAQManagement.API.Data;
using TRAQManagement.API.DTOs;
using TRAQManagement.API.Models;

namespace TRAQManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Accounts
        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            var accounts = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Status)
                .ToListAsync();

            return Ok(accounts);
        }

        // ✅ GET: api/Accounts/5  (THIS FIXES YOUR 404)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var account = await _context.Accounts
                .Include(a => a.Person)
                .Include(a => a.Status)
                .FirstOrDefaultAsync(a => a.AccountId == id);

            if (account == null)
                return NotFound("Account not found.");

            return Ok(account);
        }

        // ✅ POST: api/Accounts
        [HttpPost]
        public async Task<IActionResult> CreateAccount(CreateAccountDto dto)
        {
            var personExists = await _context.Persons.AnyAsync(p => p.PersonId == dto.PersonId);
            if (!personExists)
                return BadRequest("Person does not exist.");

            var duplicate = await _context.Accounts.AnyAsync(a => a.AccountNumber == dto.AccountNumber);
            if (duplicate)
                return BadRequest("Duplicate account number.");

            var openStatus = await _context.Status
                .FirstOrDefaultAsync(s => s.StatusName == "Open");

            if (openStatus == null)
                return StatusCode(500, "Open status not found.");

            var account = new Account
            {
                AccountNumber = dto.AccountNumber,
                PersonId = dto.PersonId,
                StatusId = openStatus.StatusId,
                Balance = 0
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return Ok(account);
        }
    }
}
