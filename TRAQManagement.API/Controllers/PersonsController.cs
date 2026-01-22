using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TRAQManagement.API.Data;
using TRAQManagement.API.Models;

namespace TRAQManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Persons
        [HttpGet]
        public async Task<IActionResult> GetPersons()
        {
            var persons = await _context.Persons.ToListAsync();
            return Ok(persons);
        }

        // ✅ GET: api/Persons/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPerson(int id)
        {
            var person = await _context.Persons
                .Include(p => p.Accounts)
                .ThenInclude(a => a.Status)
                .FirstOrDefaultAsync(p => p.PersonId == id);

            if (person == null)
                return NotFound("Person not found.");

            return Ok(person);
        }

        // ✅ POST: api/Persons
        [HttpPost]
        public async Task<IActionResult> CreatePerson(Person person)
        {
            // ✅ Business rule: person can only be created once with same ID Number
            bool exists = await _context.Persons.AnyAsync(p => p.IdNumber == person.IdNumber);

            if (exists)
                return BadRequest("A person with this ID Number already exists.");

            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            return Ok(person);
        }

        // ✅ PUT: api/Persons/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerson(int id, Person updatedPerson)
        {
            if (id != updatedPerson.PersonId)
                return BadRequest("PersonId mismatch.");

            var person = await _context.Persons.FindAsync(id);
            if (person == null)
                return NotFound("Person not found.");

            person.FirstName = updatedPerson.FirstName;
            person.LastName = updatedPerson.LastName;
            person.IdNumber = updatedPerson.IdNumber;

            await _context.SaveChangesAsync();

            return Ok(person);
        }

        // ✅ DELETE: api/Persons/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Persons
                .Include(p => p.Accounts)
                .ThenInclude(a => a.Status)
                .FirstOrDefaultAsync(p => p.PersonId == id);

            if (person == null)
                return NotFound("Person not found.");

            // ✅ Business rule:
            // Only persons with no accounts OR where all accounts are closed may be deleted
            if (person.Accounts != null && person.Accounts.Any(a => a.Status.StatusName != "Closed"))
            {
                return BadRequest("Cannot delete person unless they have no accounts or all accounts are closed.");
            }

            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();

            return Ok("Person deleted successfully.");
        }

        // ✅ BONUS Search:
        // api/Persons/search?query=...
        [HttpGet("search")]
        public async Task<IActionResult> Search(string query)
        {
            query = query?.Trim() ?? "";

            var results = await _context.Persons
                .Include(p => p.Accounts)
                .Where(p =>
                    p.IdNumber.Contains(query) ||
                    p.LastName.Contains(query) ||
                    p.Accounts.Any(a => a.AccountNumber.Contains(query))
                )
                .ToListAsync();

            return Ok(results);
        }
    }
}
