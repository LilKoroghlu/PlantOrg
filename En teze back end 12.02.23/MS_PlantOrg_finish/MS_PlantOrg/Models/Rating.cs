using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class Rating
    {
        public int RatingId { get; set; }
        public int? RatingOperatorId { get; set; }
        public int? RatingClientId { get; set; }
        public int? RatingAppealId { get; set; }
        public int? RatingValue { get; set; }
    }
}
