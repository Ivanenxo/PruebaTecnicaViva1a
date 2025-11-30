# Prueba Técnica: Gestión de Pacientes

## Objetivo
Evaluar la capacidad de desarrollo Full-Stack:
- Backend: .NET Core con SQL Server.
- Frontend: Angular 16 con PrimeNG.

La aplicación permite gestionar pacientes: crear, editar, eliminar, consultar y exportar reportes en Excel.

---

## Contenido del Repositorio

- `/Backend`: API RESTful en .NET Core 8.
- `/Frontend`: Aplicación Angular 16.
- `/Docs`: Scripts de base de datos y documentación adicional.
- `README.md`: Documentación de instalación y arquitectura.

---

## Backend - .NET Core

### Arquitectura
- Proyecto en **.NET Core 8**.
- Conexión a **SQL Server** mediante **Entity Framework Core**.
- **Estructura MVC/API**: Controllers, Services, Repositories.
- Procedimientos almacenados para operaciones específicas (ej. pacientes creados después de una fecha).
- Validaciones de duplicados por `(DocumentType, DocumentNumber)`.
- Respuestas con manejo de errores y códigos HTTP adecuados.
- Pruebas unitarias con **xUnit**.

### Base de Datos
Tabla `Patients`:
| Campo           | Tipo          | Notas |
|-----------------|---------------|-------|
| PatientId       | int           | PK, Identity |
| DocumentType    | nvarchar(10)  |       |
| DocumentNumber  | nvarchar(20)  | Único |
| FirstName       | nvarchar(80)  |       |
| LastName        | nvarchar(80)  |       |
| BirthDate       | date          |       |
| PhoneNumber     | nvarchar(20)  | NULL  |
| Email           | nvarchar(120) | NULL  |
| CreatedAt       | datetime2     | Default GETUTCDATE() |

### Endpoints
| Método | URL                        | Descripción |
|--------|----------------------------|-------------|
| POST   | `/api/patients`           | Crear paciente (valida duplicados) |
| GET    | `/api/patients`           | Listar pacientes con filtros y paginación |
| GET    | `/api/patients/{id}`      | Obtener paciente por ID |
| PUT    | `/api/patients/{id}`      | Actualizar paciente parcial o total |
| DELETE | `/api/patients/{id}`      | Eliminar paciente |
| GET    | `/api/patients/created-after?date=YYYY-MM-DD` | Pacientes creados después de cierta fecha |

### Ejecución
1. Restaurar paquetes: `dotnet restore`
2. Crear base de datos y ejecutar script SQL (`/Docs/create_db.sql`)
3. Ejecutar migraciones: `dotnet ef database update`
4. Ejecutar la API: `dotnet run`
5. Probar endpoints con Postman o Swagger: `https://localhost:7074/swagger`

---

## Frontend - Angular 16

### Arquitectura
- **Angular 16**, modular, con separación de módulos y servicios por recurso.
- **PrimeNG** para componentes UI (Tablas, Dropdowns, Dialogs, Toasts).
- **HttpClient** para consumir la API.
- Interceptor para manejo global de errores.
- SweetAlert2 para confirmaciones y popups.
- Formularios con validaciones y mensajes amigables.
- Exportación de datos a Excel con xlsx y file-saver.

### Funcionalidades
1. **Listado de pacientes**
   - Tabla paginada y filtrable.
   - Acciones: Ver detalles, Editar, Eliminar.
   - Exportar CSV/Excel de pacientes por fecha de creación.

2. **Crear / Editar paciente**
   - Campos obligatorios: DocumentType, DocumentNumber, FirstName, LastName, BirthDate.
   - Validaciones: duplicados por documento.
   - Feedback visual: spinner, botón deshabilitado, SweetAlert.

3. **Ver detalles**
   - Modal con información del paciente y citas recientes.
   - Tres consultas ejemplo con Lorem Ipsum.

### Ejecución
1. Instalar dependencias:
   ```bash
   npm install
   npm install xlsx file-saver --save
   npm install --save-dev @types/file-saver
