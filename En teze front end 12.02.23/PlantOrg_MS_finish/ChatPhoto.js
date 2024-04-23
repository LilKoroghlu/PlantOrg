// var globalUserId;
// var globalOperatorId;

// if (localStorage.getItem("UserStatus") == 2) {
//     globalOperatorId = localStorage.getItem("UserId");
// }
// else if (localStorage.getItem("UserStatus") == 3) {
//     globalUserId = localStorage.getItem("UserId"); // Doğru atama operatörü kullanıldı
// }

// console.log(globalOperatorId)
// console.log(globalUserId)

// if(document.getElementById("fileInput") != null) {
//     var fileInput = document.getElementById("fileInput");
//     fileInput.removeAttribute("hidden");
//     var sendPhotoButton = document.getElementById("sendImageButton");
//     sendPhotoButton.removeAttribute("hidden");

//     $("#sendImageButton").off('click').click(function() {
//         var photo = $("#fileInput")[0].files[0];
//         var formDataPhoto = new FormData();
//         formDataPhoto.append("UserId", 1);
//         formDataPhoto.append("OperatorId", globalOperatorId);
//         formDataPhoto.append("Photo", photo);
//         formDataPhoto.append("SendByUser", false);
//         formDataPhoto.append("SendDate", new Date().toISOString());

//         for (var pair of formDataPhoto.entries()) {
//             console.log(pair[0] + ': ' + pair[1]);
//         }

//         $.ajax({
//             url: 'https://localhost:7090/api/home/sendimage',
//             type: 'POST',
//             data: formDataPhoto,
//             contentType: false,
//             processData: false,
//             success: function (data) {
//                 alert("Success");
//                 // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
//             },
//             error: function (xhr, status, error) {
//                 console.error("Error:", xhr.responseText);
//                 // Hata durumunda kullanıcıya bilgi verebilirsin
//             }
//         });

//     })
// }