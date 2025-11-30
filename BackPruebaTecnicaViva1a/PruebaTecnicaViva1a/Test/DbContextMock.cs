namespace PruebaTecnicaViva1a.Test
{
    using Microsoft.EntityFrameworkCore;
    using PruebaTecnicaViva1a.Models.DB;

    public static class DbContextMock
    {
        public static PruebaTecnicaContext GetContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<PruebaTecnicaContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new PruebaTecnicaContext(options);
        }
    }

}
