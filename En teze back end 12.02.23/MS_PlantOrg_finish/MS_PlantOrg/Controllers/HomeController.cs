
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MS_PlantOrg.Models;

namespace MS_PlantOrg.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class HomeController : ControllerBase
    {

        private readonly PlantOrgContext _sql;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public HomeController(PlantOrgContext sql, IWebHostEnvironment hostingEnvironment)
        {
            _sql = sql;
            _hostingEnvironment = hostingEnvironment;
        }


        private string GetShortenedFileNameWithTimestamp(string originalFileName, bool sendByUser, DateTime sendDate)
        {
            string extension = Path.GetExtension(originalFileName);
            string timeStamp = sendDate.ToString("yyyyMMddHHmmss"); // Current date and time as YYYYMMDDHHmmss format

            string userPrefix = sendByUser ? "User_" : "Operator_"; // Prefix for user or operator

            //string shortenedGuid = Guid.NewGuid().ToString("N").Substring(0, 8); // First 8 characters
            string shortenedFileName = $"{userPrefix}{timeStamp}_{extension}";

            return shortenedFileName;
        }

        [HttpPost]
        [Route("sendfirstimage")]
        public IActionResult SendFirstImage([FromForm] FirstPhotoViewModel firstPhotoViewModel)
        {
            try
            {
                IFormFile userPhotoFile = firstPhotoViewModel.Photo;

                // Dosyayı sunucuda geçici bir yere kaydet
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "first_photos");
                string folderName = firstPhotoViewModel.UserId.ToString();
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);
                if (!Directory.Exists(userOperatorFolderPath))
                {
                    Directory.CreateDirectory(userOperatorFolderPath);
                }

                // Fotoğraf dosyasının adını kısaltmak için yeni bir isim oluştur
                string photoFileName = GetShortenedFileNameWithTimestamp(userPhotoFile.FileName, true, firstPhotoViewModel.SendDate);
                string photoFilePath = Path.Combine(userOperatorFolderPath, photoFileName);


                using (var stream = new FileStream(photoFilePath, FileMode.Create))
                {
                    userPhotoFile.CopyTo(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("sendfirstvideo")]
        public IActionResult SendFirstVideo([FromForm] FirstVideoViewModel firstVideoViewModel)
        {
            try
            {
                IFormFile userVideoFile = firstVideoViewModel.Video;

                // Dosyayı sunucuda geçici bir yere kaydet
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "videos", "first_videos");
                string folderName = firstVideoViewModel.UserId.ToString();
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);
                if (!Directory.Exists(userOperatorFolderPath))
                {
                    Directory.CreateDirectory(userOperatorFolderPath);
                }

                // Fotoğraf dosyasının adını kısaltmak için yeni bir isim oluştur
                string videoFileName = GetShortenedFileNameWithTimestamp(userVideoFile.FileName, true, firstVideoViewModel.SendDate);
                string videoFilePath = Path.Combine(userOperatorFolderPath, videoFileName);


                using (var stream = new FileStream(videoFilePath, FileMode.Create))
                {
                    userVideoFile.CopyTo(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }



        [HttpPost]
        [Route("sendimage")]
        public IActionResult SendImage([FromForm] PhotoViewModel photoViewModel)
        {
            try
            {
                IFormFile userPhotoFile = photoViewModel.Photo;

                // Dosyayı sunucuda geçici bir yere kaydet
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "photos");
                string folderName = photoViewModel.UserId + "-" + photoViewModel.OperatorId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);
                if (!Directory.Exists(userOperatorFolderPath))
                {
                    Directory.CreateDirectory(userOperatorFolderPath);
                }

                // Fotoğraf dosyasının adını kısaltmak için yeni bir isim oluştur
                string photoFileName = GetShortenedFileNameWithTimestamp(userPhotoFile.FileName, photoViewModel.SendByUser, photoViewModel.SendDate);
                string photoFilePath = Path.Combine(userOperatorFolderPath, photoFileName);
                _sql.Messages.Add(new Message
                {
                    UserId = photoViewModel.UserId,
                    OperatorId = photoViewModel.OperatorId,
                    Message1 = photoFileName,
                    SendByUser = photoViewModel.SendByUser,
                    SendDate = photoViewModel.SendDate,
                    UserName = photoViewModel.UserName,
                    Type = "photo"
                });
                _sql.SaveChanges();
                using (var stream = new FileStream(photoFilePath, FileMode.Create))
                {
                    userPhotoFile.CopyTo(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receivefirstimage/{userId}")]
        public IActionResult ReceiveFirstİmage(string userId)
        {
            try
            {
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "first_photos");
                string folderName = userId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                if (Directory.Exists(userOperatorFolderPath))
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(userOperatorFolderPath);
                    var files = directoryInfo.GetFiles()
                        .Where(f => f.Extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".png", StringComparison.OrdinalIgnoreCase)) // Filter JPG or JPEG files
                        .OrderByDescending(f => f.LastWriteTime) // Order files by last write time
                        .ToList();

                    if (files.Any())
                    {
                        var latestPhoto = files.First(); // Retrieve the latest photo file
                        var photoBytes = System.IO.File.ReadAllBytes(latestPhoto.FullName);
                        return File(photoBytes, "image/jpeg");
                    }
                }
                return Ok(); // If no files found or folder doesn't exist
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receivefirstvideo/{userId}")]
        public IActionResult ReceiveFirstVideo(string userId)
        {
            try
            {
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "videos", "first_videos");
                string folderName = userId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                if (Directory.Exists(userOperatorFolderPath))
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(userOperatorFolderPath);
                    var files = directoryInfo.GetFiles()
                        .Where(f => f.Extension.Equals(".mp4", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".avi", StringComparison.OrdinalIgnoreCase)) // Filter JPG or JPEG files
                        .OrderByDescending(f => f.LastWriteTime) // Order files by last write time
                        .ToList();

                    if (files.Any())
                    {
                        var latestVideo = files.First(); // Retrieve the latest photo file
                        var videoBytes = System.IO.File.ReadAllBytes(latestVideo.FullName);
                        return File(videoBytes, "video/mp4");
                    }
                }
                return Ok(); // If no files found or folder doesn't exist
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }



        [HttpGet]
        [Route("receiveimage/{userDbId}/{operatorDbId}")]
        public IActionResult ReceiveImage(string userDbId, string operatorDbId)
        {
            try
            {
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "photos");
                string folderName = userDbId + "-" + operatorDbId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                if (Directory.Exists(userOperatorFolderPath))
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(userOperatorFolderPath);
                    var files = directoryInfo.GetFiles()
                        .Where(f => f.Extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".png", StringComparison.OrdinalIgnoreCase)) // Filter JPG or JPEG files
                        .OrderByDescending(f => f.LastWriteTime) // Order files by last write time
                        .ToList();

                    if (files.Any())
                    {
                        var latestPhoto = files.First(); // Retrieve the latest photo file
                        var photoBytes = System.IO.File.ReadAllBytes(latestPhoto.FullName);
                        return File(photoBytes, "image/jpeg");
                    }
                }
                return Ok(); // If no files found or folder doesn't exist
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receiveoldimage/{imagePath}/{userDbId}/{operatorDbId}")]
        public IActionResult ReceiveOldImage(string imagePath, string userDbId, string operatorDbId)
        {
            try
            {
                // Assuming imagePath contains the file name or the relative path
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images", "photos");
                string folderName = userDbId + "-" + operatorDbId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                string imageFullPath = Path.Combine(userOperatorFolderPath, imagePath);

                if (System.IO.File.Exists(imageFullPath))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(imageFullPath);
                    return File(fileBytes, "image/jpeg");
                }
                else
                {
                    return NotFound("Image not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("sendvideo")]
        public IActionResult SendVideo([FromForm] VideoViewModel videoViewModel)
        {
            try
            {
                IFormFile userVideoFile = videoViewModel.Video;

                // Dosyayı sunucuda geçici bir yere kaydet
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "videos");
                string folderName = videoViewModel.UserId + "-" + videoViewModel.OperatorId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);
                if (!Directory.Exists(userOperatorFolderPath))
                {
                    Directory.CreateDirectory(userOperatorFolderPath);
                }

                // Fotoğraf dosyasının adını kısaltmak için yeni bir isim oluştur
                string videoFileName = GetShortenedFileNameWithTimestamp(userVideoFile.FileName, videoViewModel.SendByUser, videoViewModel.SendDate);
                string videoFilePath = Path.Combine(userOperatorFolderPath, videoFileName);
                _sql.Messages.Add(new Message
                {
                    UserId = videoViewModel.UserId,
                    OperatorId = videoViewModel.OperatorId,
                    Message1 = videoFileName,
                    SendByUser = videoViewModel.SendByUser,
                    SendDate = videoViewModel.SendDate,
                    UserName = videoViewModel.UserName,
                    Type = "video"
                });
                _sql.SaveChanges();
                using (var stream = new FileStream(videoFilePath, FileMode.Create))
                {
                    userVideoFile.CopyTo(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receivevideo/{userDbId}/{operatorDbId}")]
        public IActionResult ReceiveVideo(string userDbId, string operatorDbId)
        {
            try
            {
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "videos");
                string folderName = userDbId + "-" + operatorDbId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                if (Directory.Exists(userOperatorFolderPath))
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(userOperatorFolderPath);
                    var videoFiles = directoryInfo.GetFiles()
                        .Where(f => f.Extension.Equals(".mp4", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".avi", StringComparison.OrdinalIgnoreCase)) // Filter video files by extensions like .mp4, .avi, etc.
                        .OrderByDescending(f => f.LastWriteTime) // Order files by last write time
                        .ToList();

                    if (videoFiles.Any())
                    {
                        var latestVideo = videoFiles.First(); // Retrieve the latest video file
                        var videoBytes = System.IO.File.ReadAllBytes(latestVideo.FullName);
                        return File(videoBytes, "video/mp4"); // Set appropriate MIME type based on the video format (e.g., video/mp4 for MP4 videos)
                    }
                }
                return Ok(); // If no files found or folder doesn't exist
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receiveoldvideo/{videoPath}/{userDbId}/{operatorDbId}")]
        public IActionResult ReceiveOldVideo(string videoPath, string userDbId, string operatorDbId)
        {
            try
            {
                // Assuming imagePath contains the file name or the relative path
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "videos");
                string folderName = userDbId + "-" + operatorDbId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                string videoFullPath = Path.Combine(userOperatorFolderPath, videoPath);

                if (System.IO.File.Exists(videoFullPath))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(videoFullPath);
                    return File(fileBytes, "video/mp4");
                }
                else
                {
                    return NotFound("Image not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("sendaudio")]
        public IActionResult SendAudio([FromForm] AudioViewModel audioViewModel)
        {
            try
            {
                IFormFile userAudioFile = audioViewModel.Audio;

                // Dosyayı sunucuda geçici bir yere kaydet
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "audios");
                string folderName = audioViewModel.UserId + "-" + audioViewModel.OperatorId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);
                if (!Directory.Exists(userOperatorFolderPath))
                {
                    Directory.CreateDirectory(userOperatorFolderPath);
                }

                // Fotoğraf dosyasının adını kısaltmak için yeni bir isim oluştur
                string audioFileName = GetShortenedFileNameWithTimestamp(userAudioFile.FileName, audioViewModel.SendByUser, audioViewModel.SendDate);
                string audioFilePath = Path.Combine(userOperatorFolderPath, audioFileName + ".mp3");
                _sql.Messages.Add(new Message
                {
                    UserId = audioViewModel.UserId,
                    OperatorId = audioViewModel.OperatorId,
                    Message1 = audioFileName,
                    SendByUser = audioViewModel.SendByUser,
                    SendDate = audioViewModel.SendDate,
                    UserName = audioViewModel.UserName,
                    Type = "audio"
                });
                _sql.SaveChanges();
                using (var stream = new FileStream(audioFilePath, FileMode.Create))
                {
                    userAudioFile.CopyTo(stream);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receiveaudio/{userDbId}/{operatorDbId}")]
        public IActionResult ReceiveAudio(string userDbId, string operatorDbId)
        {
            try
            {
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "audios");
                string folderName = userDbId + "-" + operatorDbId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                if (Directory.Exists(userOperatorFolderPath))
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(userOperatorFolderPath);
                    var audioFiles = directoryInfo.GetFiles()
                        .Where(f => f.Extension.Equals(".mp3", StringComparison.OrdinalIgnoreCase) || f.Extension.Equals(".wav", StringComparison.OrdinalIgnoreCase)) // Filter video files by extensions like .mp4, .avi, etc.
                        .OrderByDescending(f => f.LastWriteTime) // Order files by last write time
                        .ToList();

                    if (audioFiles.Any())
                    {
                        var latestAudio = audioFiles.First(); // Retrieve the latest video file
                        var audioBytes = System.IO.File.ReadAllBytes(latestAudio.FullName);
                        return File(audioBytes, "audio/mp3"); // Set appropriate MIME type based on the video format (e.g., video/mp4 for MP4 videos)
                    }
                }
                return Ok(); // If no files found or folder doesn't exist
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receiveoldaudio/{audioPath}/{userDbId}/{operatorDbId}")]
        public IActionResult ReceiveOldAudio(string audioPath, string userDbId, string operatorDbId)
        {
            try
            {
                audioPath = audioPath + ".mp3";
                // Assuming imagePath contains the file name or the relative path
                string uploadFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "audios");
                string folderName = userDbId + "-" + operatorDbId;
                string userOperatorFolderPath = Path.Combine(uploadFolderPath, folderName);

                string audioFullPath = Path.Combine(userOperatorFolderPath, audioPath);

                if (System.IO.File.Exists(audioFullPath))
                {
                    byte[] fileBytes = System.IO.File.ReadAllBytes(audioFullPath);
                    return File(fileBytes, "audio/mp3");
                }
                else
                {
                    return NotFound("audio not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("receiveoldmessage/{messageId}")]
        public IActionResult ReceiveOldMessage(int messageId)
        {
            try
            {
                string message = _sql.Messages.FirstOrDefault(m => m.Id == messageId).Message1;
                return Ok(message);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("rateOperator/{operatorId}/{userId}/{rateValue}")]
        public IActionResult RateOperator(string operatorId, string userId, string rateValue)
        {
            Rating rate = new Rating();
            rate.RatingOperatorId = Convert.ToInt32(operatorId);
            rate.RatingClientId = Convert.ToInt32(userId);
            rate.RatingAppealId = _sql.Appeals
            .Where(a => a.AppealOperatorId == Convert.ToInt32(operatorId) && a.AppealClientId == Convert.ToInt32(userId))
            .OrderByDescending(a => a.AppealId)
            .Select(a => a.AppealId)
            .FirstOrDefault();
            rate.RatingValue = Convert.ToInt32(rateValue);
            _sql.Ratings.Add(rate);
            _sql.SaveChanges();
            return Ok(rate);
        }


    }
}
