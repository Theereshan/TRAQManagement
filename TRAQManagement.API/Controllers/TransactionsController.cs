using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TRAQManagement.API.Data;
using TRAQManagement.API.DTOs;
using TRAQManagement.API.Models;

namespace TRAQManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Transactions
        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Account)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return Ok(transactions);
        }

        // ✅ GET: api/Transactions/byAccount/2
        [HttpGet("byAccount/{accountId}")]
        public async Task<IActionResult> GetTransactionsByAccount(int accountId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return Ok(transactions);
        }

        // ✅ POST: api/Transactions
        [HttpPost]
        public async Task<IActionResult> CreateTransaction(CreateTransactionDto dto)
        {
            if (dto.Amount == 0)
                return BadRequest("Transaction amount cannot be zero.");

            if (dto.TransactionDate.Date > DateTime.Today)
                return BadRequest("Transaction date cannot be in the future.");

            var account = await _context.Accounts
                .Include(a => a.Status)
                .FirstOrDefaultAsync(a => a.AccountId == dto.AccountId);

            if (account == null)
                return BadRequest("Account does not exist.");

            if (account.Status.StatusName == "Closed")
                return BadRequest("Transactions are not allowed on closed accounts.");

            var transaction = new Transaction
            {
                AccountId = dto.AccountId,
                Amount = dto.Amount,
                TransactionDate = dto.TransactionDate
            };

            _context.Transactions.Add(transaction);

            // ✅ update balance
            account.Balance += dto.Amount;

            await _context.SaveChangesAsync();

            return Ok(transaction);
        }
    }
}
