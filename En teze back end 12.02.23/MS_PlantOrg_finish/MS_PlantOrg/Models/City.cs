using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class City
    {
        public City()
        {
            Users = new HashSet<User>();
        }

        public int CityId { get; set; }
        public string CityName { get; set; } = null!;
        public int CityCountryId { get; set; }

        public virtual Country CityCountry { get; set; } = null!;
        public virtual ICollection<User> Users { get; set; }
    }
}
