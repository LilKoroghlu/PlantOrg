using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class PlantType
    {
        public PlantType()
        {
            Plants = new HashSet<Plant>();
        }

        public int PlantTypeId { get; set; }
        public string? PlantTypeName { get; set; }
        public int? PlantPrice { get; set; }
        public string? PlantTypeNameEng { get; set; }

        public virtual ICollection<Plant> Plants { get; set; }
    }
}
