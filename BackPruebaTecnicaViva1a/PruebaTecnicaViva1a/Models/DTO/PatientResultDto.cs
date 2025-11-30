namespace PruebaTecnicaViva1a.Models.DTO
{
    public class PatientResultDto
    {
        public int PatientId { get; set; }
        public string DocumentType { get; set; }
        public string DocumentNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
