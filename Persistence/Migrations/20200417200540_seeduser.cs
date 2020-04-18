using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class seeduser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password", "UID", "Username" },
                values: new object[] { 1.0, "nishank.net@gmail.com", "User1 FirstName", "User1 LastName", "Pentium@1", new Guid("c3904252-9664-440d-b063-a88ad939c823"), "User1" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password", "UID", "Username" },
                values: new object[] { 2.0, "test@gmail.com", "User2 FirstName", "User2 LastName", "Pentium@2", new Guid("c38f09b5-0313-4b74-bae4-b547c893af76"), "User2" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password", "UID", "Username" },
                values: new object[] { 3.0, "test2@gmail.com", "User3 FirstName", "User3 LastName", "Pentium@3", new Guid("3506dc0e-c4ac-463c-ad9f-6a7a59e37868"), "User3" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1.0);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2.0);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3.0);
        }
    }
}
