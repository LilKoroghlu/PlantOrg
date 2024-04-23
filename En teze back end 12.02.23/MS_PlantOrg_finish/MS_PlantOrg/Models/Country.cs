using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class Country
    {
        public Country()
        {
            Cities = new HashSet<City>();
            Users = new HashSet<User>();
        }

        public int CountryId { get; set; }
        public string CountryName { get; set; } = null!;
        public string CountryCode { get; set; } = null!;

        public virtual ICollection<City> Cities { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
