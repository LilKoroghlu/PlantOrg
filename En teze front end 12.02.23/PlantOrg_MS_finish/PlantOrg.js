

$.ajax({
    url: 'https://localhost:7090/api/login',
    type: 'GET',
    dataContext: "application/json",
    success: function (x) {
        var id = localStorage.getItem('UserId')
        console.log(id)
    },
    error: function (x) {
        console.log("Error");
    }
})

$('#login_button').click(() => {
    var url = new URL(window.location.href);
    var pageName = url.pathname.split('/').pop();
    let info = {
        "UserEmail": $('#useremail').val(),
        "UserPassword": $('#password-input').val()
    }

    $.ajax({
        url: 'https://localhost:7090/api/login/giris?url=' + encodeURIComponent(pageName),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(info),
        success: function (x) {

            var UserId = x.userClaims[0].value;
            var UserName = x.userClaims[1].value;
            var UserProfilePhotoUrl = x.userClaims[2].value;
            var UserSurname = x.userClaims[3].value;
            var UserEmail = x.userClaims[4].value;
            var UserCountry = x.userClaims[5].value;
            var UserCity = x.userClaims[6].value;
            var Status= x.userClaims[7].value;
            if(Status=="2"){
                var PlantName = x.userClaims[8].value;
                localStorage.setItem('PlantName',PlantName)
            }
            localStorage.setItem('UserId', UserId);
            localStorage.setItem('UserName', UserName);
            localStorage.setItem('UserProfilePhotoUrl', UserProfilePhotoUrl)
            localStorage.setItem('UserSurname', UserSurname)
            localStorage.setItem('UserEmail', UserEmail)
            localStorage.setItem('UserCountry', UserCountry)
            localStorage.setItem('UserCity', UserCity)
            localStorage.setItem('UserStatus', Status)
            

            window.location.href = x.redirectUrl;
        },
        error: function (error) {
            console.error("Hata:", error.responseText);
        }
    })
});

$.ajax({
    type: 'GET',
    url: 'https://localhost:7090/api/admin/getCountry',
    contentType: 'application/json',
    success: function (data) {
        var countrySelect = $('#countrySelectRegister');
        var citySelect = $("#citySelectRegister");

        countrySelect.empty();
        citySelect.empty();

        for (var i = 0; i < data.length; i++) {
            countrySelect.append($('<option class="countryOPT">').text(data[i].countryName).val(data[i].countryId));
        }

        // Ülke seçildiğinde
        countrySelect.on("change", function () {
            var selectedCountryId = $(this).val();

            $.ajax({
                type: 'GET',
                url: 'https://localhost:7090/api/admin/getCity/' + selectedCountryId,
                contentType: 'application/json',
                data: JSON.stringify(),
                success: function (cityData) {
                    citySelect.empty();
                    for (var i = 0; i < cityData.length; i++) {
                        citySelect.append($('<option class="cityOPT">').text(cityData[i].cityName).val(cityData[i].cityId));
                    }
                },
                error: function () {
                    console.log("Error");
                }
            });
        });
    },
    error: function () {
        console.log("Error");
    }
});

$.ajax({
    type: 'GET',
    url: 'https://localhost:7090/api/admin/getCountry',
    contentType: 'application/json',
    success: function (data) {
        // Ülke seçildiğinde
        $("#countrySelectRegister").off('click').on("click", function () {
            var selectedCountryId = $(this).val();
            console.log(data, selectedCountryId )
            // Seçilen ülkenin ülke bilgisini al
            var selectedCountry = getCountry(data, selectedCountryId);

            // Eğer ülke varsa, telefon alanını doldur ve disable yap
            if (selectedCountry && selectedCountry.countryCode) {
                $("#userCountryCode").val(selectedCountry.countryCode).prop("disabled", true);
            } else {
                // Eğer ülke yoksa veya ülke kodu yoksa, telefon alanını boşalt ve enable yap
                $("#userCountryCode").val("").prop("disabled", false);
            }
        });
    },
    error: function () {
        console.log("Error");
    }
});

// Ülke bilgisini döndüren bir yardımcı fonksiyon
function getCountry(countryData, countryId) {
    // Burada, countryId ile ilgili ülke bilgisini alacak bir yöntem kullanmanız gerekecek
    // Şu anda burada doğrudan bir örnek kullanıyorum. Bu kısmı projenizin gereksinimlerine uygun olarak güncellemeniz gerekebilir.
    return countryData.find(country => country.countryId === parseInt(countryId));
}

$(document).ready(function () {
    $("#registerBtn").click(function () {
        // Kullanıcının girdiği bilgileri al
        var email = $("#useremail").val();
        var username = $("#username").val();
        var surname = $("#usersurname").val();
        var country = $("#countrySelectRegister").val();
        var city = $("#citySelectRegister").val();
        var password = $("#userpassword").val();
        var phone = $('#userCountryCode').val() + $("#userphone").val();
        var photo = $("#userphoto")[0].files[0];

        // FormData oluştur
        var formData = new FormData();
        formData.append("useremail", email);
        formData.append("username", username);
        formData.append("usersurname", surname);
        formData.append("userCountryId", country);
        formData.append("userCityId", city);
        formData.append("userpassword", password);
        formData.append("userphone", phone);
        formData.append("UserPhoto", photo);

        

        // API'ya POST isteği gönder
        $.ajax({
            url: "https://localhost:7090/api/login/register",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                alert("Success");
                // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
            },
            error: function (error) {
                console.error("Error:", error);
                // Hata durumunda kullanıcıya bilgi verebilirsin
            }
        });
    });
})


