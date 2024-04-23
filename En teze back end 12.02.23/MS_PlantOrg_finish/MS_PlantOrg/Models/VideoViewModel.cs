
using System.Text.Json.Serialization;

namespace MS_PlantOrg.Models
{
    public class VideoViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OperatorId { get; set; }
        [JsonIgnore]
        public IFormFile Video { get; set; }
        public bool SendByUser { get; set; }
        public DateTime SendDate { get; set; }
        public string UserName { get; set; }
    }
}
