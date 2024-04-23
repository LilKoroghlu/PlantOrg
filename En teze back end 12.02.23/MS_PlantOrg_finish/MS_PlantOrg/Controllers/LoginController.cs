
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using MS_PlantOrg.Models;
using System.Security.Claims;

namespace MS_PlantOrg.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LoginController : ControllerBase
    {
        private readonly IStringLocalizer<LoginController> _localizer;
        private readonly PlantOrgContext _sql;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public LoginController(PlantOrgContext sql, IWebHostEnvironment hostingEnvironment, IStringLocalizer<LoginController> localizer)
        {
            _sql = sql;
            _hostingEnvironment = hostingEnvironment;
            _localizer = localizer;
        }

        [HttpGet]
        public List<User> GetUsers()
        {
            var users = _sql.Users.ToList();
            return users;
        }

        [HttpPost]
        [Route("giris")]
        [AllowAnonymous]
        public IActionResult Giris([FromBody] User u, [FromQuery] string url)
        {
            var user = _sql.Users
                .Include(u => u.UserCity)
                .Include(u => u.UserCountry)
                .Select(user => new
                {
                    ID = user.UserId,
                    Name = user.UserName,
                    Surname = user.UserSurname,
                    Password = user.UserPassword,
                    StatusName = user.UserStatus.StatusName,
                    StatusId = user.UserStatusId,
                    Phone = user.UserPhone,
                    Email = user.UserEmail,
                    CountryName = user.UserCountry.CountryName,
                    CityName = user.UserCity.CityName,
                    PhotoUrl = user.UserProfilePhotoUrl,
                    RegDate = user.UserRegDate
                })
                .SingleOrDefault(x => (x.Email == u.UserEmail || x.Phone == u.UserEmail) && x.Password == u.UserPassword);


            if (user != null)
            {
                var UserClaims = new List<Claim>
                {
                   new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                   new Claim(ClaimTypes.Name, user.Name),
                   new Claim("Photo", user.PhotoUrl),
                   new Claim("SurName", user.Surname),
                   new Claim(ClaimTypes.Email, user.Email),
                   new Claim("CountryName",user.CountryName),
                   new Claim("CityName", user.CityName),
                   new Claim("Status",user.StatusId.ToString())

                };

                if (url != "PlantOrgLoginAz.html" && url != "PlantOrgLogin.html")
                {
                    return BadRequest("Oturum açma sayfasında değilsiniz.");
                }

                var identityUser = new ClaimsIdentity(UserClaims, "login");

                ClaimsPrincipal principal = new ClaimsPrincipal(identityUser);
                HttpContext.User = principal;

                if (user.StatusId == 1)
                {
                    return Ok(new { redirectUrl = "Admin/Admin.html", UserClaims });
                }
                else if (user.StatusId == 2)
                {

                    UserClaims.Add(new Claim("PlantName", GetPlantNameForOperator(user.ID)));

                    if (url == "PlantOrgLoginAz.html")
                    {
                        return Ok(new { redirectUrl = "/OperatorChatAz.html", UserClaims });
                    }
                    else
                    {
                        return Ok(new { redirectUrl = "/OperatorChat.html", UserClaims });
                    }

                }
                else
                {
                    if (url == "PlantOrgLoginAz.html")
                    {
                        return Ok(new { redirectUrl = "/UserChatAz.html", UserClaims });
                    }
                    else
                    {
                        return Ok(new { redirectUrl = "/UserChat.html", UserClaims });
                    }
                }
            }
            else
            {
                return BadRequest("Böyle bir kullanıcı bulunamadı");
            }
        }


        private string? GetPlantNameForOperator(int operatorId)
        {
            // Operatörün PlantId'sini bulmak için bir sorgu ekleyin.
            var plantId = _sql.OperatorPlants
                .Where(op => op.OpOperatorId == operatorId)
                .Select(op => op.OpPlantId)
                .FirstOrDefault();

            // PlantId ile ilişkilendirilmiş PlantName bilgisini çekin.
            var plantName = _sql.Plants
                .Where(plant => plant.PlantId == plantId)
                .Select(plant => plant.PlantName)
                .FirstOrDefault();

            return plantName;
        }

        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromForm] UserViewModel userViewModel)
        {
            // HTTP isteğinden dosyayı al
            IFormFile userPhotoFile = userViewModel.UserPhoto;

            // Dosyayı sunucuda geçici bir yere kaydet
            string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "profiles");
            string photoFileName = Guid.NewGuid().ToString() + "_" + userPhotoFile.FileName;
            string photoFilePath = Path.Combine(uploadFolderPath, photoFileName);

            using (var stream = new FileStream(photoFilePath, FileMode.Create))
            {
                userPhotoFile.CopyTo(stream);
            }

            // User sınıfına ait bir nesne oluştur
            User user = new User
            {
                UserName = userViewModel.UserName,
                UserSurname = userViewModel.UserSurname,
                UserCityId = userViewModel.UserCityId,
                UserCountryId = userViewModel.UserCountryId,
                UserEmail = userViewModel.UserEmail,
                UserPhone = userViewModel.UserPhone,
                UserPassword = userViewModel.UserPassword,
                UserStatusId = 3,
                UserRegDate = DateTime.Now,
                UserProfilePhotoUrl = photoFileName // veya sadece dosya adını kaydedebilirsiniz
            };

            // Veritabanına kaydet
            _sql.Users.Add(user);
            _sql.SaveChanges();

            // Başka işlemler ve dönüşler
            return Ok("User registered successfully");
        }

        [HttpGet]
        [Route("getprofilephoto/{userId}")]
        public IActionResult GetProfilePhoto(int userId)
        {
            try
            {
                // userId kullanarak gerekli işlemleri yapabilirsiniz
                var user = _sql.Users.FirstOrDefault(u => u.UserId == userId);

                if (user != null && !string.IsNullOrEmpty(user.UserProfilePhotoUrl))
                {
                    var photoFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "profiles", user.UserProfilePhotoUrl);
                    var photoBytes = System.IO.File.ReadAllBytes(photoFilePath);
                    return File(photoBytes, "image/jpeg");
                }

                // Profil fotoğrafı bulunamazsa, varsayılan bir fotoğraf döndürebilirsiniz
                var defaultPhotoPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "profiles", "default-photo.jpg");
                var defaultPhotoBytes = System.IO.File.ReadAllBytes(defaultPhotoPath);
                return File(defaultPhotoBytes, "image/jpeg");
            }
            catch (Exception ex)
            {
                // Hata durumu veya alternatif işlemleri burada ele alabilirsiniz
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("changetoaze")]
        public IActionResult ChangeToAze()
        {
            return Ok(_localizer["settings"]);
        }
    }
}
