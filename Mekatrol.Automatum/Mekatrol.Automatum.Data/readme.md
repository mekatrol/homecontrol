# Install & add tools
dotnet tool install --global dotnet-ef

## Inside NodeServer project
dotnet add package Microsoft.EntityFrameworkCore.Design

# Create initial migration
dotnet ef migrations add InitialCreate --project .\Mekatrol.Automatum.Data --startup-project .\Mekatrol.Automatum.NodeServer