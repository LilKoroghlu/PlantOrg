using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class Appeal
    {
        public int AppealId { get; set; }
        public int? AppealClientId { get; set; }
        public int? AppealOperatorId { get; set; }
        public DateTime? AppealDate { get; set; }
        public int? PaidOrUnpaid12 { get; set; }
        public bool? EndOrNotEnd { get; set; }
        public int? AppealPlantId { get; set; }

        public virtual Plant? AppealPlant { get; set; }
    }
}
