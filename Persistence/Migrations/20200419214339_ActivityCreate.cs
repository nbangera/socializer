using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class ActivityCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    Venue = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1.0,
                column: "UID",
                value: new Guid("bcae147e-4424-4a20-a76a-f351bfe19a82"));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2.0,
                column: "UID",
                value: new Guid("cf3259d1-8204-4d0c-b41b-54b0aaa7baa9"));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3.0,
                column: "UID",
                value: new Guid("1f31f8b1-9958-4d73-aeff-410152a07c3a"));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1.0,
                column: "UID",
                value: new Guid("c3904252-9664-440d-b063-a88ad939c823"));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2.0,
                column: "UID",
                value: new Guid("c38f09b5-0313-4b74-bae4-b547c893af76"));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3.0,
                column: "UID",
                value: new Guid("3506dc0e-c4ac-463c-ad9f-6a7a59e37868"));
        }
    }
}
