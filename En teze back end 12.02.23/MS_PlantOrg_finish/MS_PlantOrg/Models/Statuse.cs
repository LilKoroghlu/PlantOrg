using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class Statuse
    {
        public Statuse()
        {
            Users = new HashSet<User>();
        }

        public int StatusId { get; set; }
        public string? StatusName { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
