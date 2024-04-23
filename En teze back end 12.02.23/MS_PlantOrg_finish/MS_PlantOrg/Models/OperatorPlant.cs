using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class OperatorPlant
    {
        public int OpId { get; set; }
        public int? OpOperatorId { get; set; }
        public int? OpPlantId { get; set; }
    }
}
