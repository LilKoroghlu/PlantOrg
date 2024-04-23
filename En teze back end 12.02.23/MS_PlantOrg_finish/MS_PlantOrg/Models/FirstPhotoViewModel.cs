using System.Text.Json.Serialization;

namespace MS_PlantOrg.Models
{
    public class FirstPhotoViewModel
    {
        public int UserId { get; set; }
        [JsonIgnore]
        public IFormFile Photo { get; set; }
        public DateTime SendDate { get; set; }
    }
}
