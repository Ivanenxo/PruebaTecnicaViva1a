
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTecnicaViva1a.Models.DB;
using PruebaTecnicaViva1a.Models.DTO;


namespace PruebaTecnicaViva1a.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PruebaTecnicaContext _context;

        public PatientsController(PruebaTecnicaContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients(string? name = null, string? documentNumber = null)
        {
            var query = _context.Patients.AsQueryable();

            
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(p =>
                    p.FirstName.Contains(name) ||
                    p.LastName.Contains(name));
            }

            // Filtro por número de documento
            if (!string.IsNullOrWhiteSpace(documentNumber))
            {
                query = query.Where(p => p.DocumentNumber.Contains(documentNumber));
            }

            var result = await query.ToListAsync();

            return result;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            return patient;
        }

        [HttpGet("created-after")]
        public async Task<ActionResult<IEnumerable<PatientResultDto>>> GetPatientsCreatedAfter([FromQuery] DateTime date)
        {
            var result = await _context.PatientsCreatedAfter
                .FromSqlRaw("EXEC GetPatientsCreatedAfter @Date = {0}", date)
                .ToListAsync();

            return Ok(result);
        }


        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {
            // Validar duplicado por tipo y número de documento
            var exists = await _context.Patients
                .AnyAsync(p => p.DocumentType == patient.DocumentType &&
                               p.DocumentNumber == patient.DocumentNumber);

            if (exists)
                return BadRequest("Ya existe un paciente con ese tipo y número de documento.");

            // Asignar fecha de creación
            patient.CreatedAt = DateTime.UtcNow;

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatient),
                new { id = patient.PatientId }, patient);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, Patient patient)
        {
            if (id != patient.PatientId)
                return BadRequest("El ID no coincide");

            var patientDb = await _context.Patients.FindAsync(id);
            if (patientDb == null)
                return NotFound();

            if (!string.IsNullOrWhiteSpace(patient.FirstName) && patientDb.FirstName != patient.FirstName)
                patientDb.FirstName = patient.FirstName;

            if (!string.IsNullOrWhiteSpace(patient.LastName) && patientDb.LastName != patient.LastName)
                patientDb.LastName = patient.LastName;


            if (patientDb.BirthDate != patient.BirthDate)
                patientDb.BirthDate = patient.BirthDate;

            
            patientDb.Email = string.IsNullOrWhiteSpace(patient.Email)
                ? "" : (patientDb.Email != patient.Email ? patient.Email : patientDb.Email);

            
            patientDb.PhoneNumber = string.IsNullOrWhiteSpace(patient.PhoneNumber)
                ? "" : (patientDb.PhoneNumber != patient.PhoneNumber ? patient.PhoneNumber : patientDb.PhoneNumber);

            await _context.SaveChangesAsync();

            return NoContent();
        }





        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
