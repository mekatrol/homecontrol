using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mekatrol.Automatum.Data.Migrations;

/// <inheritdoc />
public partial class InitialCreate : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Flows",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "TEXT", nullable: false),
                Key = table.Column<string>(type: "TEXT", nullable: false),
                Json = table.Column<string>(type: "TEXT", nullable: false),
                Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                Updated = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                RowVersion = table.Column<int>(type: "INTEGER", rowVersion: true, nullable: false, defaultValue: 1)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Flows", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Points",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "TEXT", nullable: false),
                Key = table.Column<string>(type: "TEXT", nullable: false),
                Json = table.Column<string>(type: "TEXT", nullable: false),
                Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                Updated = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                RowVersion = table.Column<int>(type: "INTEGER", rowVersion: true, nullable: false, defaultValue: 1)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Points", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Flows_Key",
            table: "Flows",
            column: "Key",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Points_Key",
            table: "Points",
            column: "Key",
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Flows");

        migrationBuilder.DropTable(
            name: "Points");
    }
}