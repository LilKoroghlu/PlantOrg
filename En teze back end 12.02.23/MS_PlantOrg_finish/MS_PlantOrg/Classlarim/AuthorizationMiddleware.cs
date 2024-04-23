using System.Net;

namespace MS_PlantOrg.Classlarim
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var user = context.User;

            // Kullanıcının Admin rolüne sahip olduğunu kontrol et
            if (user.IsInRole("Admin"))
            {
                // Admin sayfasına yönlendir
                context.Response.Redirect("/Admin/Admin.html");
                return;
            }

            // Diğer roller için gerekli kontrolleri gerçekleştir ve yönlendir
            // Örneğin, Operator için farklı sayfalara yönlendirme yapabilirsiniz.

            // Eğer hiçbir rol ile eşleşmiyorsa, erişim reddedilir.
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return;
        }
    }
}
