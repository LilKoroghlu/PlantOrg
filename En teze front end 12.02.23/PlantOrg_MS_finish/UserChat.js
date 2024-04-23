$('.user_name').text(localStorage.getItem('UserName') + ' ' + localStorage.getItem('UserSurname'))
$('.user-profile-image').attr('src', '/Admin/images/' + localStorage.getItem('UserProfilePhotoUrl'))
$('.user_email').text(localStorage.getItem('UserEmail'))
$('.user_location').text(localStorage.getItem('UserCity') + ", " + localStorage.getItem('UserCountry'))

$('.logout_btn').click(() => {
    localStorage.removeItem('UserId');
    localStorage.removeItem('UserName');
    localStorage.removeItem('UserProfilePhotoUrl');
    localStorage.removeItem('UserSurname');

    window.location.href = '/PlantOrgLogin.html'
})

$('.addChatUser').off('click').click(() => {


    var addChatUserModal = $('<div class="modal fade" id="addChat-exampleModal" tabindex="-1" role="dialog"\
    aria-labelledby="addContact-exampleModalLabel" aria-hidden="true">\
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">\
        <div class="modal-content modal-header-colored shadow-lg border-0">\
                <div class="modal-header">\
                    <h5 class="modal-title text-white font-size-16" id="addContact-exampleModalLabel">Müraciət yaradın</h5>\
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"\
                        aria-label="Close" id="hide_contact_modal">\
                    </button>\
                </div>\
                <div class="modal-body p-4">\
                    <div class="mb-3">\
                        <label class="form-label">Bitki növü</label>\
                        <select id="bitkiSelect" name="PlantId" style="display:block">\
						</select>\
                    </div>\
                    <div class="mb-3">\
                        <label class="form-label">Mesajınz</label>\
                        <input type="text" class="form-control" id="userMessage" placeholder="Mesaj">\
                        <div class="invalid-feedback"></div>\
                    </div>\
                    <div id="file-preview" class="mb-3"></div>\
                </div>\
                <div class="modal-footer" style="display:flex; align-items:center; justify-content:space-between">\
                    <div class="photoAndVideoDiv">\
                    <div id="photoSendDiv" style="width:5%;height:100%;display:flex;align-items:center;justify-content:center">\
                        <label for="fileInputForFirst">\
                            <i class="fa-solid fa-image" style="font-size:25px; color:#4eac6d"></i>\
                        </label>\
                        <input id="fileInputForFirst" type="file" accept="image/*" style="visibility:hidden">\
                        <p class="sendPhotoText">Şəkil göndər</p>\
                    </div>\
                    <div id="videoSendDiv" style="width:5%;height:100%;display:flex;align-items:center;justify-content:center">\
                        <label for="fileInputForFirstVideo">\
                            <i class="fa-solid fa-video" style="font-size:25px; color:#4eac6d"></i>\
                        </label>\
                        <input id="fileInputForFirstVideo" type="file" accept="video/*" style="visibility:hidden">\
                        <p class="sendVideoText">Video göndər</p>\
                    </div>\
                    </div>\
                    <div>\
                        <button type="button" class="btn btn-link" data-bs-dismiss="modal">Bağla</button>\
                        <button class="btn btn-primary" id="sendUserMessage">Göndər</button>\
                    </div>\
                </div>\
        </div>\
    </div>\
</div>')

    $('.chat-welcome-section').append(addChatUserModal)
    $('#addChat-exampleModal').modal('show')



    $.ajax({
        type: 'GET',
        url: 'https://localhost:7090/api/admin/getPlant',
        contentType: 'application/json',
        data: JSON.stringify(),
        success: function (data) {
            var select = $('#bitkiSelect')
            select.empty();
            for (var i = 0; i < data.length; i++) {
                select.append($('<option>', {
                    value: data[i].id,
                    text: data[i].name
                }));
            }
        },
        error: function () {
            console.log("Error")
        }
    })

    $('.sendUserMessage').off('click').click(() => {
        // Seçilen dosyaların isimlerini alert ile göster
        var fileNames = $('#fileInput').prop('files');
        for (var i = 0; i < fileNames.length; i++) {
            alert(fileNames[i].name);
        }
    });

    var previewArea = $('#file-preview');
    var selectedFiles = [];

    $('#fileInput').on('change', function (event) {
        var files = event.target.files;

        // Her bir dosya için önizleme ekleyin
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // Dosya önizleme için bir div öğesi ekleyin
            var imagePreview = $('<div class="img-preview-container"></div>');
            previewArea.append(imagePreview);

            // Dosyanın içeriğini okuyarak önizlemeyi ayarlayın
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e) {
                    // Önizleme için bir img öğesi ekleyin
                    var img = $('<img src="#" alt="file-preview" class="img-thumbnail">');
                    img.attr('src', e.target.result);

                    // Genişlik ve yükseklik ayarlamalarını yapın
                    img.css({
                        'width': '200px',
                        'height': '200px'
                    });

                    // Kapatma ikonu ekleyin ve sağ üst köşeye sabitleyin
                    var closeIcon = $('<span class="img-close-icon">×</span>');
                    closeIcon.click(function () {
                        // İlgili önizleme öğesini kaldır
                        $(this).parent('.img-preview-container').remove();
                        // Seçilen dosyalardan da kaldır
                        selectedFiles = selectedFiles.filter(function (selectedFile) {
                            return selectedFile !== file;
                        });
                    });

                    // İlgili önizleme öğesine img ve kapatma ikonunu ekleyin
                    imagePreview.append(img).append(closeIcon);
                };
            })(file);
            reader.readAsDataURL(file);

            // Seçilen dosyalar listesine ekle
            selectedFiles.push(file);
        }
    });

    $('#addChat-exampleModal').on('hidden.bs.modal', function () {
        // Dosya seçme öğesini temizle
        $('#fileInput').val('');
        // Önizleme bölgesini temizle
        previewArea.empty();
        // Seçilen dosyalar listesini temizle
        selectedFiles = [];
    });

    $('.img-close-icon').click(function () {
        // Kapatma ikonuna tıklandığında
        var parentContainer = $(this).parent('.img-preview-container');

        // İlgili önizleme öğesini ve seçilen dosyalar listesinden kaldır
        parentContainer.remove();
        var indexToRemove = previewArea.children('.img-preview-container').index(parentContainer);
        if (indexToRemove !== -1) {
            selectedFiles.splice(indexToRemove, 1);
        }
    });

    // var userId = '@User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value';

    // Profil fotoğrafının URL'sini almak için API endpoint'ini çağır

    

})

$(document).ready(function () {
    let id=localStorage.getItem('UserId')
    console.log(id)
    $.ajax({
        url: 'https://localhost:7090/api/login/getprofilephoto/'+ id,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (blob) {
            console.log("Salam");
            var url = URL.createObjectURL(blob);
            $('.user-profile-image').attr('src', url);
        },
        error: function (error) {
            console.error('There was a problem with the AJAX request:', error);
        }
    });

})