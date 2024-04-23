using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MS_PlantOrg.Migrations
{
    public partial class AddModelsToDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    CountryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CountryName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.CountryId);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    OperatorId = table.Column<int>(type: "int", nullable: true),
                    SendByUser = table.Column<bool>(type: "bit", nullable: true),
                    Message = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SendDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "OperatorPlant",
                columns: table => new
                {
                    OP_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OP_OperatorId = table.Column<int>(type: "int", nullable: true),
                    OP_PlantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Operator__C7FDFD420BAA310F", x => x.OP_Id);
                });

            migrationBuilder.CreateTable(
                name: "OperatorPlantType",
                columns: table => new
                {
                    OPT_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OPT_OperatorId = table.Column<int>(type: "int", nullable: true),
                    OPT_PlanTypetId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Operator__140CDAA957AD07AD", x => x.OPT_Id);
                });

            migrationBuilder.CreateTable(
                name: "PlantType",
                columns: table => new
                {
                    PlantTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlantTypeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlantPrice = table.Column<int>(type: "int", nullable: true),
                    PlantTypeNameEng = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantType", x => x.PlantTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Rating",
                columns: table => new
                {
                    RatingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RatingOperatorId = table.Column<int>(type: "int", nullable: true),
                    RatingClientId = table.Column<int>(type: "int", nullable: true),
                    RatingAppealId = table.Column<int>(type: "int", nullable: true),
                    RatingValue = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rating", x => x.RatingId);
                });

            migrationBuilder.CreateTable(
                name: "Statuse",
                columns: table => new
                {
                    StatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Statuse__C8EE2063C7E8719A", x => x.StatusId);
                });

            migrationBuilder.CreateTable(
                name: "Cities",
                columns: table => new
                {
                    CityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CityCountryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cities", x => x.CityId);
                    table.ForeignKey(
                        name: "FK_City_Country",
                        column: x => x.CityCountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId");
                });

            migrationBuilder.CreateTable(
                name: "Plant",
                columns: table => new
                {
                    PlantId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlantName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlantNameEng = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    PlantPlantTypeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plant", x => x.PlantId);
                    table.ForeignKey(
                        name: "FK__Plant__PlantPlan__46E78A0C",
                        column: x => x.PlantPlantTypeId,
                        principalTable: "PlantType",
                        principalColumn: "PlantTypeId");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserStatusId = table.Column<int>(type: "int", nullable: true),
                    UserPhone = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserEmail = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserPassword = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserCountryId = table.Column<int>(type: "int", nullable: true),
                    UserCityId = table.Column<int>(type: "int", nullable: true),
                    UserRegDate = table.Column<DateTime>(type: "date", nullable: true),
                    UserProfilePhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK__Users__UserStatu__403A8C7D",
                        column: x => x.UserStatusId,
                        principalTable: "Statuse",
                        principalColumn: "StatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_City",
                        column: x => x.UserCityId,
                        principalTable: "Cities",
                        principalColumn: "CityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_Country",
                        column: x => x.UserCountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appeal",
                columns: table => new
                {
                    AppealId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppealClientId = table.Column<int>(type: "int", nullable: true),
                    AppealOperatorId = table.Column<int>(type: "int", nullable: true),
                    AppealDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    PaidOrUnpaid_1_2 = table.Column<int>(type: "int", nullable: true),
                    EndOrNotEnd = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))"),
                    AppealPlantId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appeal", x => x.AppealId);
                    table.ForeignKey(
                        name: "FK__Appeal__AppealPl__4E88ABD4",
                        column: x => x.AppealPlantId,
                        principalTable: "Plant",
                        principalColumn: "PlantId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appeal_AppealPlantId",
                table: "Appeal",
                column: "AppealPlantId");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_CityCountryId",
                table: "Cities",
                column: "CityCountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Plant_PlantPlantTypeId",
                table: "Plant",
                column: "PlantPlantTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserCityId",
                table: "Users",
                column: "UserCityId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserCountryId",
                table: "Users",
                column: "UserCountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserStatusId",
                table: "Users",
                column: "UserStatusId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appeal");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "OperatorPlant");

            migrationBuilder.DropTable(
                name: "OperatorPlantType");

            migrationBuilder.DropTable(
                name: "Rating");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Plant");

            migrationBuilder.DropTable(
                name: "Statuse");

            migrationBuilder.DropTable(
                name: "Cities");

            migrationBuilder.DropTable(
                name: "PlantType");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
