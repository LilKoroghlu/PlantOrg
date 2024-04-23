using System.Text.Json.Serialization;

namespace MS_PlantOrg.Models
{
    public class FirstVideoViewModel
    {
        public int UserId { get; set; }
        [JsonIgnore]
        public IFormFile Video { get; set; }
        public DateTime SendDate { get; set; }
    }
}
