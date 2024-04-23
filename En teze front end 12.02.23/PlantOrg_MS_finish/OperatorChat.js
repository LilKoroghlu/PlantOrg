
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

$('.chat-leftsidebar').content("");
