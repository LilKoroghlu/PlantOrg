using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class OperatorPlantType
    {
        public int OptId { get; set; }
        public int? OptOperatorId { get; set; }
        public int? OptPlanTypetId { get; set; }
    }
}
