namespace PruebaTecnicaViva1a.Test
{
    using Xunit;
    using Microsoft.AspNetCore.Mvc;
    using PruebaTecnicaViva1a.Controllers;
    using PruebaTecnicaViva1a.Models.DB;
    using PruebaTecnicaViva1a.Models;

    public class PatientsControllerTests
    {
        [Fact]
        public async Task PostDocumentExists()
        {
            // Arrange
            var context = DbContextMock.GetContext("PostDuplicateTest");

            context.Patients.Add(new Patient
            {
                DocumentType = "CC",
                DocumentNumber = "12345",
                FirstName = "Juan",
                LastName = "Perez"
            });

            context.SaveChanges();

            var controller = new PatientsController(context);

            var newPatient = new Patient
            {
                DocumentType = "CC",
                DocumentNumber = "12345",
                FirstName = "Ana",
                LastName = "Gomez"
            };

            // Act
            var result = await controller.PostPatient(newPatient);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Ya existe un paciente con este tipo y número de documento.", badRequest.Value);
        }

        [Fact]
        public async Task GetPatientsByNameAndDocument()
        {
            // Arrange
            var context = DbContextMock.GetContext("FilterTest");

            context.Patients.AddRange(
                new Patient { FirstName = "Ivan", DocumentNumber = "111" },
                new Patient { FirstName = "Andres", DocumentNumber = "222" },
                new Patient { FirstName = "Ivan", DocumentNumber = "333" }
            );
            context.SaveChanges();

            var controller = new PatientsController(context);

            // Act
            var result = await controller.GetPatients("Ivan", "333");

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var patients = Assert.IsAssignableFrom<IEnumerable<Patient>>(ok.Value);

            Assert.Single(patients);
            Assert.Equal("333", patients.First().DocumentNumber);
        }


    }

}
