using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceBooking.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    idClient = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nameClient = table.Column<string>(type: "TEXT", nullable: false),
                    emailClient = table.Column<string>(type: "TEXT", nullable: false),
                    phoneClient = table.Column<string>(type: "TEXT", nullable: false),
                    passwordClient = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.idClient);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    idService = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nameService = table.Column<string>(type: "TEXT", nullable: false),
                    descriptionService = table.Column<string>(type: "TEXT", nullable: false),
                    priceService = table.Column<decimal>(type: "TEXT", nullable: false),
                    timeService = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.idService);
                });

            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    idBooking = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    idClient = table.Column<int>(type: "INTEGER", nullable: false),
                    idService = table.Column<int>(type: "INTEGER", nullable: false),
                    startService = table.Column<DateTime>(type: "TEXT", nullable: false),
                    endService = table.Column<DateTime>(type: "TEXT", nullable: false),
                    status = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.idBooking);
                    table.ForeignKey(
                        name: "FK_bookings_clients_idClient",
                        column: x => x.idClient,
                        principalTable: "clients",
                        principalColumn: "idClient",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookings_services_idService",
                        column: x => x.idService,
                        principalTable: "services",
                        principalColumn: "idService",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_idClient",
                table: "bookings",
                column: "idClient");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_idService",
                table: "bookings",
                column: "idService");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "services");
        }
    }
}
