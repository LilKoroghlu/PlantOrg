
using System.Text.Json.Serialization;

namespace MS_PlantOrg.Models
{
    public class AudioViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OperatorId { get; set; }
        [JsonIgnore]
        public IFormFile Audio { get; set; }
        public bool SendByUser { get; set; }
        public string UserName { get; set; }
        public DateTime SendDate { get; set; }
    }
}

