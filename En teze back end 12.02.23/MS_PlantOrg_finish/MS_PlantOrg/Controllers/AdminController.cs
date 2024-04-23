
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MS_PlantOrg.Models;

namespace MS_PlantOrg.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly PlantOrgContext _sql;

        public AdminController(PlantOrgContext sql)
        {
            _sql = sql;
        }

        //Users
        [HttpGet]
        [Route("getUser")]
        public IActionResult GetUser()
        {


            var joinedData = _sql.Users
                .Include(u => u.UserCity)
                .Include(u => u.UserCountry)
                .Include(u => u.UserStatus)
                .Select(user => new
                {
                    ID = user.UserId,
                    Name = user.UserName,
                    Surname = user.UserSurname,
                    Password = user.UserPassword,
                    StatusName = user.UserStatus.StatusName,
                    Phone = user.UserPhone,
                    Email = user.UserEmail,
                    CountryName = user.UserCountry.CountryName,
                    CityName = user.UserCity.CityName,
                    RegDate = user.UserRegDate
                })
                .ToList();

            return Ok(joinedData);
        }

        [HttpGet]
        [Route("getOperators")]
        public IActionResult getOperators()
        {
            var Operators = _sql.Users.Where(x => x.UserStatusId == 2).ToList();

            return Ok(Operators);
        }

        [HttpPost]
        [Route("addUser")]
        public IActionResult AddUser([FromBody] User u)
        {
            var user = new User();
            user.UserName = u.UserName;
            user.UserSurname = u.UserSurname;
            user.UserEmail = u.UserEmail;
            user.UserPassword = u.UserPassword;
            user.UserCountryId = u.UserCountryId;
            user.UserCityId = u.UserCityId;
            user.UserPhone = u.UserPhone;
            user.UserStatusId = u.UserStatusId;
            user.UserRegDate = DateTime.Now;
            user.UserProfilePhotoUrl = u.UserProfilePhotoUrl;
            _sql.Add(user);
            _sql.SaveChanges();
            return Ok("User was added");
        }

        [HttpDelete("DeleteUser/{id}")]
        [Route("deleteUser")]
        public IActionResult DeleteUser(int id)
        {
            var user = _sql.Users.Find(id);
            if (user != null)
            {
                _sql.Users.Remove(user);
                _sql.SaveChanges();
                return Ok("User was removed");
            }
            else
            {
                return BadRequest("User was not found");
            }
        }

        [HttpPut("UpdateUser/{id}")]
        [Route("updateUser")]
        public IActionResult UpdateUser(int id, [FromBody] User updUser)
        {
            var existUser = _sql.Users.Find(id);
            if (existUser != null)
            {
                if (updUser.UserName == "")
                {
                    existUser.UserName = existUser.UserName;
                }
                else
                {
                    existUser.UserName = updUser.UserName;
                }
                if (updUser.UserSurname == "")
                {
                    existUser.UserSurname = existUser.UserSurname;
                }
                else
                {
                    existUser.UserSurname = updUser.UserSurname;
                }

                if (updUser.UserPhone == "")
                {
                    existUser.UserPhone = existUser.UserPhone;
                }
                else
                {
                    existUser.UserPhone = updUser.UserPhone;
                }

                if (updUser.UserEmail == "")
                {
                    existUser.UserEmail = existUser.UserEmail;
                }
                else
                {
                    existUser.UserEmail = updUser.UserEmail;
                }

                if (updUser.UserPassword == "")
                {
                    existUser.UserPassword = existUser.UserPassword;
                }
                else
                {
                    existUser.UserPassword = updUser.UserPassword;
                }

                _sql.SaveChanges();
                return Ok("User was updated");
            }
            else
            {
                return BadRequest("User is not found");
            }
        }

        //PlantType
        [HttpGet]
        [Route("getPlantType")]
        public IActionResult GetPlantType()
        {

            var pt = _sql.PlantTypes.Select(plant_type => new
            {
                ID = plant_type.PlantTypeId,
                Name = plant_type.PlantTypeName,
                Price = plant_type.PlantPrice,
                NameEng = plant_type.PlantTypeNameEng
            }).ToList();

            return Ok(pt);

        }

        [HttpPost]
        [Route("addPlantType")]
        public IActionResult AddPlantType([FromBody] PlantType plantType)
        {
            var pt = new PlantType();
            pt.PlantTypeName = plantType.PlantTypeName;
            pt.PlantTypeNameEng = plantType.PlantTypeNameEng;
            pt.PlantPrice = plantType.PlantPrice;
            _sql.Add(pt);
            _sql.SaveChanges();
            return Ok("Plant type was added");
        }

        [HttpDelete("DeletePlantType/{id}")]
        [Route("deletePlantType")]
        public IActionResult DeletePlantType(int id)
        {

            var pt = _sql.PlantTypes.Find(id);

            if (pt != null)
            {
                _sql.PlantTypes.Remove(pt);
                _sql.SaveChanges();
                return Ok("Plant Type was removed");
            }
            else
            {
                return BadRequest("Plant Type is not found");
            }
        }

        [HttpPut("UpdatePlantType/{id}")]
        [Route("updatePlantType")]
        public IActionResult UpdatePlantType(int id, [FromBody] PlantType pt)
        {
            var existPT = _sql.PlantTypes.Find(id);
            if (existPT != null)
            {
                existPT.PlantTypeName = pt.PlantTypeName;
                existPT.PlantPrice = pt.PlantPrice;
                existPT.PlantTypeNameEng = pt.PlantTypeNameEng;
                _sql.SaveChanges();
                return Ok("Plant Type was updated");
            }
            else
            {
                return BadRequest("Plant Type is not found");
            }

        }

        //Plant
        [HttpGet]
        [Route("getPlant")]
        public IActionResult GetPlant()
        {
            var joinedData = _sql.Plants
                .Include(p => p.PlantPlantType)
                .Select(plant => new
                {
                    ID = plant.PlantId,
                    Name = plant.PlantName,
                    NameEng = plant.PlantNameEng,
                    PlantType = plant.PlantPlantType.PlantTypeName
                })
                .ToList();

            return Ok(joinedData);
        }

        [HttpPost]
        [Route("addPlant")]
        public IActionResult AddPlant([FromBody] Plant plant)
        {
            var p = new Plant();
            p.PlantName = plant.PlantName;
            p.PlantNameEng = plant.PlantNameEng;
            p.PlantPlantTypeId = plant.PlantPlantTypeId;
            _sql.Add(p);
            _sql.SaveChanges();
            return Ok("Plant was added");
        }

        [HttpDelete("DeletePlant/{id}")]
        [Route("deletePlant")]
        public IActionResult DeletePlant(int id)
        {
            var p = _sql.Plants.Find(id);
            if (p != null)
            {
                _sql.Plants.Remove(p);
                _sql.SaveChanges();
                return Ok("Plant was removed");
            }
            else
            {
                return BadRequest("Plant is not found");
            }

        }

        [HttpPut("UpdatePlant/{id}")]
        [Route("updatePlant")]
        public IActionResult UpdatePLant(int id, [FromBody] Plant plant)
        {
            var existP = _sql.Plants.Find(id);
            if (existP != null)
            {
                existP.PlantName = plant.PlantName ?? existP.PlantName;
                existP.PlantNameEng = plant.PlantNameEng ?? existP.PlantNameEng;
                existP.PlantPlantTypeId = plant.PlantPlantTypeId ?? existP.PlantPlantTypeId;
                _sql.SaveChanges();
                return Ok("Plant was updated");
            }
            else
            {
                return BadRequest("Plant is not found");
            }
        }

        //Operator_PlantType
        [HttpGet]
        [Route("getOPT")]
        public List<OperatorPlantType> GetOPT()
        {
            var opt = _sql.OperatorPlantTypes.ToList();
            return (opt);
        }

        [HttpPost]
        [Route("addOPT")]
        public IActionResult AddOPT(OperatorPlantType operatorPT)
        {

            var opt = new OperatorPlantType();
            opt.OptOperatorId = operatorPT.OptOperatorId;
            opt.OptPlanTypetId = operatorPT.OptPlanTypetId;
            _sql.Add(opt);
            _sql.SaveChanges();
            return Ok("Operator Plant Type was added");
        }

        [HttpDelete("DeleteOPT/{id}")]
        [Route("deleteOPT")]
        public IActionResult DeleteOPT(int id)
        {
            var opt = _sql.OperatorPlantTypes.Find(id);
            if (opt != null)
            {
                _sql.Remove(opt);
                _sql.SaveChanges();
                return Ok("Operator Plant Type was removed");
            }
            else
            {
                return BadRequest("Operator Plant Type is not found");
            }
        }

        [HttpPut("UpdateOPT/{id}")]
        [Route("updateOPT")]
        public IActionResult UpdateOPT(int id, [FromBody] OperatorPlantType operatorPT)
        {
            var existOPT = _sql.OperatorPlantTypes.Find(id);
            if (existOPT != null)
            {
                existOPT.OptOperatorId = operatorPT.OptOperatorId ?? existOPT.OptOperatorId;
                existOPT.OptPlanTypetId = operatorPT.OptPlanTypetId ?? existOPT.OptPlanTypetId;
                _sql.SaveChanges();
                return Ok("Operator Plant Type was updated");
            }
            else
            {
                return BadRequest("Operator Plant Type is not found");
            }
        }

        //OperatorPlant
        [HttpGet]
        [Route("GetOP")]
        public IActionResult GetOP()
        {
            var OP = _sql.OperatorPlants
        .Join(_sql.Users,
              op => op.OpOperatorId,
              user => user.UserId,
              (op, user) => new
              {
                  OpId = op.OpId,
                  OperatorName = user.UserName,  // Burada uygun ismi alabilirsiniz
                  op.OpPlantId
              })
        .Join(_sql.Plants,
              op => op.OpPlantId,
              plant => plant.PlantId,
              (op, plant) => new
              {
                  OpId = op.OpId,
                  OperatorName = op.OperatorName,
                  PlantName = plant.PlantName,  // Burada uygun ismi alabilirsiniz
              })
        .ToList();

            return Ok(OP);
        }

        [HttpPost]
        [Route("addOP")]
        public IActionResult AddOP([FromBody] OperatorPlant OperatorP)
        {
            var existingOP = _sql.OperatorPlants
                .FirstOrDefault(op => op.OpOperatorId == OperatorP.OpOperatorId && op.OpPlantId == OperatorP.OpPlantId);
            if (existingOP != null)
            {
                return BadRequest("Bu Operator-Plant mövcuddur");
            }
            else
            {
                var op = new OperatorPlant();
                op.OpOperatorId = OperatorP.OpOperatorId;
                op.OpPlantId = OperatorP.OpPlantId;
                _sql.Add(op);
                _sql.SaveChanges();
                return Ok("Operator Plant was added");
            }
        }

        [HttpDelete("DeleteOP/{id}")]
        [Route("deleteOP")]
        public IActionResult DeleteOP(int id)
        {
            var op = _sql.OperatorPlants.Find(id);
            if (op != null)
            {
                _sql.Remove(op);
                _sql.SaveChanges();
                return Ok("Operator Plant was removed");
            }
            else
            {
                return BadRequest("Operator Plant is not found");
            }
        }

        [HttpPut("UpdateOP/{id}")]
        [Route("updateOP")]
        public IActionResult UpdateOP(int id, [FromBody] OperatorPlant OperatorP)
        {
            var existOP = _sql.OperatorPlants.Find(id);
            if (existOP != null)
            {
                existOP.OpOperatorId = OperatorP.OpOperatorId ?? existOP.OpOperatorId;
                existOP.OpPlantId = OperatorP.OpPlantId ?? existOP.OpPlantId;
                _sql.SaveChanges();
                return Ok("Operator Plant was updated");
            }
            else
            {
                return BadRequest("Operator Plant is not found");
            }
        }

        //Status
        [HttpGet]
        [Route("getStatuse")]
        public IActionResult GetStatuse()
        {
            var s = _sql.Statuses.ToList();
            return Ok(s);
        }

        //Rating
        [HttpGet]
        [Route("getRating")]
        public IActionResult GetRating()
        {
            var result = (from rating in _sql.Ratings
                          join operatorUser in _sql.Users on rating.RatingOperatorId equals operatorUser.UserId
                          join clientUser in _sql.Users on rating.RatingClientId equals clientUser.UserId
                          select new
                          {
                              RatingId = rating.RatingId,
                              RatingOperator = $"{operatorUser.UserName} {operatorUser.UserSurname}",
                              RatingClient = $"{clientUser.UserName} {clientUser.UserSurname}",
                              RatingAppealId = rating.RatingAppealId,
                              RatingValue = rating.RatingValue
                          }).ToList();

            return Ok(result);
        }

        //Country
        [HttpGet]
        [Route("getCountry")]
        public IActionResult GetCountry()
        {
            var c = _sql.Countries.ToList();
            return Ok(c);
        }

        //City
        [HttpGet("GetCity/{id}")]
        [Route("getCity")]
        public IActionResult GetCity(int id)
        {
            var c = _sql.Cities.Where(x => x.CityCountryId == id);

            return Ok(c);
        }

        //Appeal
        [HttpGet]
        [Route("getAppeal")]
        public IActionResult GetAppeal()
        {
            var result = (from appeal in _sql.Appeals
                          join clientUser in _sql.Users on appeal.AppealClientId equals clientUser.UserId
                          join operatorUser in _sql.Users on appeal.AppealOperatorId equals operatorUser.UserId
                          join plant in _sql.Plants on appeal.AppealPlantId equals plant.PlantId
                          select new
                          {
                              AppealId = appeal.AppealId,
                              AppealClient = $"{clientUser.UserName} {clientUser.UserSurname}",
                              AppealOperator = $"{operatorUser.UserName} {operatorUser.UserSurname}",
                              AppealDate = appeal.AppealDate,
                              PaidOrUnpaid12 = appeal.PaidOrUnpaid12,
                              EndOrNotEnd = appeal.EndOrNotEnd,
                              AppealPlantName = plant.PlantName,
                              AppealPlantTypeId = plant.PlantPlantTypeId
                          }).ToList();

            return Ok(result);
        }

        //Messages
        [HttpGet]
        [Route("getMessages")]
        public IActionResult getMessages()
        {
            var m = _sql.Messages.ToList();
            return Ok(m);
        }
    }
}


