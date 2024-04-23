using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class Plant
    {
        public Plant()
        {
            Appeals = new HashSet<Appeal>();
        }

        public int PlantId { get; set; }
        public string? PlantName { get; set; }
        public string? PlantNameEng { get; set; }
        public int? PlantPlantTypeId { get; set; }

        public virtual PlantType? PlantPlantType { get; set; }
        public virtual ICollection<Appeal> Appeals { get; set; }
    }
}
