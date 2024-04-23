using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class Message
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? OperatorId { get; set; }
        public bool? SendByUser { get; set; }
        public string? Message1 { get; set; }
        public string? Type { get; set; }
        public string? UserName { get; set; }
        public DateTime? SendDate { get; set; }
        public string? OperatorName { get; set; }
    }
}
