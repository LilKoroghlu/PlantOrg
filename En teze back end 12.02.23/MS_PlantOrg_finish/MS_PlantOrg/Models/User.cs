using System;
using System.Collections.Generic;

namespace MS_PlantOrg.Models
{
    public partial class User
    {
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserSurname { get; set; }
        public int? UserStatusId { get; set; }
        public string? UserPhone { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPassword { get; set; }
        public int? UserCountryId { get; set; }
        public int? UserCityId { get; set; }
        public DateTime? UserRegDate { get; set; }
        public string? UserProfilePhotoUrl { get; set; }

        public virtual City? UserCity { get; set; }
        public virtual Country? UserCountry { get; set; }
        public virtual Statuse? UserStatus { get; set; }
    }
}
