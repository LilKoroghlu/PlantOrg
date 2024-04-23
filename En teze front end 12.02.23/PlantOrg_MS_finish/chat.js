"use strict";

var connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7090/chathub")
  .configureLogging(signalR.LogLevel.Information)
  .build();

var globalUserId;
var globalOperatorId;

if (localStorage.getItem("UserStatus") == 2) {
  globalOperatorId = localStorage.getItem("UserId");
} else if (localStorage.getItem("UserStatus") == 3) {
  globalUserId = localStorage.getItem("UserId"); // Doğru atama operatörü kullanıldı
}

function showImageModalUser(imageUrl) {
  var modal = $('<div class="modal fade" tabindex="-1" role="dialog">\
                  <div class="modal-dialog modal-dialog-centered" role="document">\
                    <div class="modal-content">\
                      <div class="bigPhotoContainer">\
                        <div class="bigPhotoTextAndClose">\
                          <button class="closeModalButton">\
                            <i class="fa-solid fa-xmark"></i>\
                          </button>\
                        </div>\
                        <div id="bigPhotoDiv">\
                          <img src="" id="bigPhoto" class="img-fluid">\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </div>');

  modal.find('#bigPhotoDiv img').attr('src', imageUrl);

  $("body").append(modal);

  modal.modal("show");

  $('.closeModalButton').off('click').on('click', function () {
    modal.modal("hide");
  });

  modal.on("hidden.bs.modal", function () {
    modal.remove();
  });
}

function showImageModalOperator(imageUrl) {
  var modal = $('<div class="modal fade" tabindex="-1" role="dialog">\
                  <div class="modal-dialog modal-dialog-centered" role="document">\
                    <div class="modal-content">\
                      <div class="bigPhotoContainer">\
                        <div class="bigPhotoTextAndClose">\
                          <button class="closeModalButton">\
                            <i class="fa-solid fa-xmark"></i>\
                          </button>\
                        </div>\
                        <div id="bigPhotoDiv">\
                          <img src="" id="bigPhoto" class="img-fluid">\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </div>');

  modal.find('#bigPhotoDiv img').attr('src', imageUrl);

  $("body").append(modal);

  modal.modal("show");

  $('.closeModalButton').off('click').on('click', function () {
    modal.modal("hide");
  });

  modal.on("hidden.bs.modal", function () {
    modal.remove();
  });
}

function showImageModalReceive(imageUrl) {
  var modal = $('<div class="modal fade" tabindex="-1" role="dialog">\
                  <div class="modal-dialog modal-dialog-centered" role="document">\
                    <div class="modal-content">\
                      <div class="bigPhotoContainer">\
                        <div class="bigPhotoTextAndClose">\
                          <button class="closeModalButton">\
                            <i class="fa-solid fa-xmark"></i>\
                          </button>\
                        </div>\
                        <div id="bigPhotoDiv">\
                          <img src="" id="bigPhoto" class="img-fluid">\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </div>');

  modal.find('#bigPhotoDiv img').attr('src', imageUrl);

  $("body").append(modal);

  modal.modal("show");

  $('.closeModalButton').off('click').on('click', function () {
    modal.modal("hide");
  });

  modal.on("hidden.bs.modal", function () {
    modal.remove();
  });
}

function togglePopup() {
  var popup = document.getElementById("popUpDiv");
  popup.style.display = (popup.style.display === "flex") ? "none" : "flex";
  var plusIcon = document.getElementById("plusIcon");

  plusIcon.classList.toggle("rotate");
}


connection.on("UserConnected", function () {
  var userid = localStorage.getItem("UserId");
  var userName =
    localStorage.getItem("UserName") + localStorage.getItem("UserSurname");
  var userStatus = localStorage.getItem("UserStatus");
  if (userStatus == 2) {
    connection.invoke("GetOldMessages", userid);
  }
  if(userStatus == 3){
    connection.invoke("GetOldMessagesUser", userid);
  }
});

// Operator Old Messages

connection.on("SetOldMessages", function (messages) {
  var operatorId = localStorage.getItem("UserId");
  var uniqueUserIds = {};
  var uniqueUserNames = {};
  var listOfMessagesDiv = document.getElementById("listOfOldMessages");
  // document.getElementById("chatSectionWelcome").setAttribute("class","chat-section")
  listOfMessagesDiv.setAttribute("class", "messages");

  listOfMessagesDiv.style.overflowY = "auto";
  listOfMessagesDiv.style.overflowX = "hidden";
  listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;

  for (var i = 0; i < messages.length; i++) {
    var userId = messages[i].userId;
    uniqueUserIds[userId] = true;
  }
  for (var i = 0; i < messages.length; i++) {
    var userName = messages[i].userName;
    uniqueUserNames[userName] = true;
  }
  var numberOfDifferentUserIdInMessages = Object.keys(uniqueUserIds).length;

  for (let j = 0; j < numberOfDifferentUserIdInMessages; j++) {

    var photoIndex = 0;
    var userListDiv = document.getElementById("userList");
    userListDiv.setAttribute("class", "users")
    var userDiv = document.createElement("div");
    userDiv.setAttribute("class", "user");
    var acceptButton = document.createElement("button");
    acceptButton.setAttribute("class", "user-button btn btn-primary");
    acceptButton.innerHTML = Object.keys(uniqueUserNames)
    [j].split(/(?=[A-Z])/)
      .join(" ");
    acceptButton.setAttribute("id", Object.keys(uniqueUserIds)[j] + "User");
    acceptButton.addEventListener("click", async function () {
      document.getElementById("connectionType").textContent = "Busy";
      var listOfMessagesDiv = document.getElementById("listOfOldMessages");
      listOfMessagesDiv.classList.add("messages");
      document.getElementById("chatSectionWelcome").setAttribute("class", "chat-section");
      console.log(messages);
      for (var i = 0; i < messages.length; i++) {
        console.log(i);
        if (messages[i].userId == Object.keys(uniqueUserIds)[j]) {
          if (messages[i].type == "photo") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldimage/" +
                  messages[i].message1 +
                  "/" +
                  messages[i].userId +
                  "/" +
                  messages[i].operatorId,
                method: "GET",
                xhrFields: {
                  responseType: "blob",
                },
                success: function (blob) {


                  if (blob.size > 0) {
                    var url = URL.createObjectURL(blob);
                    var imgElement = document.createElement("img");
                    $(imgElement).attr("style", "width: 100px; height: 100px;");
                    imgElement.src = url;
                    var PhotoDiv = document.createElement("div");
                    var PhotoInnerDiv = document.createElement("div");
                    if (messages[i].sendByUser == true) {
                      PhotoDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px");
                    }
                    else {
                      PhotoDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");
                    }
                    PhotoInnerDiv.appendChild(imgElement);
                    PhotoDiv.appendChild(PhotoInnerDiv);
                    listOfMessagesDiv.appendChild(PhotoDiv);


                    resolve();
                  }
                },
                error: function (error) {
                  console.error(
                    "There was a problem with the AJAX request:",
                    error
                  );
                },
              });

            });
          } else if (messages[i].type == "video") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldvideo/" +
                  messages[i].message1 +
                  "/" +
                  messages[i].userId +
                  "/" +
                  messages[i].operatorId,
                method: "GET",
                xhrFields: {
                  responseType: "blob", // Assuming the response is a video blob
                },
                success: function (videoBlob) {
                  // listOfMessagesDiv.style.overflowY = "auto";
                  // listOfMessagesDiv.style.overflowX = "hidden";
                  // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                  var videoElement = document.createElement("video");
                  $(videoElement).attr("style", "width:100px;height:100px;");
                  videoElement.src = URL.createObjectURL(videoBlob);
                  videoElement.controls = true; // Adding controls for the video

                  var VideoDiv = document.createElement("div");
                  var VideoInnerDiv = document.createElement("div");
                  if (messages[i].sendByUser == true) {
                    VideoDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px");
                  }
                  else {
                    VideoDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");
                  }
                  VideoInnerDiv.appendChild(videoElement);
                  VideoDiv.appendChild(VideoInnerDiv);
                  listOfMessagesDiv.appendChild(VideoDiv);


                  resolve();
                },
                error: function (error) {
                  console.error("Error receiving video:", error);
                },
              });

            });
          } else if (messages[i].type == "audio") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldaudio/" +
                  messages[i].message1 +
                  "/" +
                  messages[i].userId +
                  "/" +
                  messages[i].operatorId,
                method: "GET",
                xhrFields: {
                  responseType: "blob", // Assuming the response is a video blob
                },
                success: function (audioBlob) {
                  // listOfMessagesDiv.style.overflowY = "auto";
                  // listOfMessagesDiv.style.overflowX = "hidden";
                  // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                  console.log("ses geldi");
                  var audioElement = document.createElement("audio");

                  // Sesin URL'sini base64 kodlaması ile oluştur
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    audioElement.src = reader.result;
                  };
                  reader.readAsDataURL(audioBlob);

                  audioElement.controls = true; // Kontrolleri göstermek için
                  audioElement.preload = "auto"; // Otomatik olarak yükle

                  var AudioDiv = document.createElement("div");
                  var AudioInnerDiv = document.createElement("div");

                  if (messages[i].sendByUser == true) {
                    AudioDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px");

                  }
                  else {
                    AudioDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");

                  }
                  AudioInnerDiv.appendChild(audioElement);
                  AudioDiv.appendChild(AudioInnerDiv);
                  listOfMessagesDiv.appendChild(AudioDiv);


                  // <audio> elementini listOfMessagesDiv'e ekle


                  // Scroll'u en aşağı kaydır, böylece yeni eklenen ses görünür olur
                  resolve();
                },
                error: function (error) {
                  console.error("Error receiving audio:", error);
                },
              });

            });
          } else if (messages[i].type == "message") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldmessage/" +
                  (i + 1),
                method: "GET",
                success: function (oldMessage) {
                  // listOfMessagesDiv.style.overflowY = "auto";
                  // listOfMessagesDiv.style.overflowX = "hidden";
                  // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                  var messageDiv = document.createElement("div");
                  var messageInnerDiv = document.createElement("div");
                  messageInnerDiv.setAttribute("class", "message");

                  if (messages[i].sendByUser == true) {
                    messageDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px;")
                    messageInnerDiv.setAttribute("class", "received");
                  }
                  else {
                    messageDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px;")
                    messageInnerDiv.setAttribute("class", "sent");
                  }
                  messageInnerDiv.innerHTML = oldMessage;
                  messageDiv.appendChild(messageInnerDiv);
                  listOfMessagesDiv.appendChild(messageDiv);
                  resolve();
                },
              });

            });
          }
        }

      }



      while (userListDiv.firstChild) {
        userListDiv.removeChild(userListDiv.firstChild);
      }

      var endButton = document.createElement("button");
      endButton.setAttribute("class", "end-old-message-button");
      var endIcon = document.createElement("i");
      endIcon.setAttribute("class", "fa-solid fa-circle-xmark");
      endButton.append(endIcon);
      endButton.addEventListener("click", function () {
        document.getElementById("connectionType").textContent = "Idle";
        location.reload();
      });
      userListDiv.appendChild(endButton);


      $("#chatSectionWelcome").append(listOfMessagesDiv);
    });
    userDiv.appendChild(acceptButton);
    userListDiv.appendChild(userDiv);
    // listOfMessagesDiv.style.overflowY = "auto";
    listOfMessagesDiv.style.overflowX = "hidden";
    // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
  }

});

// User Old Messages

connection.on("SetOldMessagesUser", function (messages) {
  var uniqueUserIds = {};
  var uniqueUserNames = {};
  var listOfMessagesDiv = document.getElementById("listOfOldMessages");
  // document.getElementById("chatSectionWelcome").setAttribute("class","chat-section")
  listOfMessagesDiv.setAttribute("class", "messages");

  listOfMessagesDiv.style.overflowY = "auto";
  listOfMessagesDiv.style.overflowX = "hidden";
  listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;

  for(var i = 0; i< messages.length; i++){
    console.log(messages[i]);
  }

  for (var i = 0; i < messages.length; i++) {
    var userId = messages[i].operatorId;
    uniqueUserIds[userId] = true;
  }
  for (var i = 0; i < messages.length; i++) {
    var userName = messages[i].operatorName;
    uniqueUserNames[userName] = true;
  }
  var numberOfDifferentUserIdInMessages = Object.keys(uniqueUserIds).length;

  for (let j = 0; j < numberOfDifferentUserIdInMessages; j++) {

    var photoIndex = 0;
    var userListDiv = document.getElementById("userList");
    userListDiv.setAttribute("class", "users")
    var userDiv = document.createElement("div");
    userDiv.setAttribute("class", "user");
    var acceptButton = document.createElement("button");
    acceptButton.setAttribute("class", "user-button btn btn-primary");
    acceptButton.innerHTML = Object.keys(uniqueUserNames)
    [j].split(/(?=[A-Z])/)
      .join(" ");
    acceptButton.setAttribute("id", Object.keys(uniqueUserIds)[j] + "User");
    acceptButton.addEventListener("click", async function () {
      document.getElementById("connectionType").textContent = "ConnectToOperator";
      var listOfMessagesDiv = document.getElementById("listOfOldMessages");
      listOfMessagesDiv.classList.add("messages");
      document.getElementById("chatSectionWelcome").setAttribute("class", "chat-section");
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].operatorId == Object.keys(uniqueUserIds)[j]) {
          if (messages[i].type == "photo") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldimage/" +
                  messages[i].message1 +
                  "/" +
                  messages[i].userId +
                  "/" +
                  messages[i].operatorId,
                method: "GET",
                xhrFields: {
                  responseType: "blob",
                },
                success: function (blob) {


                  if (blob.size > 0) {
                    var url = URL.createObjectURL(blob);
                    var imgElement = document.createElement("img");
                    $(imgElement).attr("style", "width: 100px; height: 100px;");
                    imgElement.src = url;
                    var PhotoDiv = document.createElement("div");
                    var PhotoInnerDiv = document.createElement("div");
                    if (messages[i].sendByUser == false) {
                      PhotoDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px");
                    }
                    else {
                      PhotoDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");
                    }
                    PhotoInnerDiv.appendChild(imgElement);
                    PhotoDiv.appendChild(PhotoInnerDiv);
                    listOfMessagesDiv.appendChild(PhotoDiv);


                    resolve();
                  }
                },
                error: function (error) {
                  console.error(
                    "There was a problem with the AJAX request:",
                    error
                  );
                },
              });

            });
          } else if (messages[i].type == "video") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldvideo/" +
                  messages[i].message1 +
                  "/" +
                  messages[i].userId +
                  "/" +
                  messages[i].operatorId,
                method: "GET",
                xhrFields: {
                  responseType: "blob", // Assuming the response is a video blob
                },
                success: function (videoBlob) {
                  // listOfMessagesDiv.style.overflowY = "auto";
                  // listOfMessagesDiv.style.overflowX = "hidden";
                  // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                  var videoElement = document.createElement("video");
                  $(videoElement).attr("style", "width:100px;height:100px;");
                  videoElement.src = URL.createObjectURL(videoBlob);
                  videoElement.controls = true; // Adding controls for the video

                  var VideoDiv = document.createElement("div");
                  var VideoInnerDiv = document.createElement("div");
                  if (messages[i].sendByUser == false) {
                    VideoDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px");
                  }
                  else {
                    VideoDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");
                  }
                  VideoInnerDiv.appendChild(videoElement);
                  VideoDiv.appendChild(VideoInnerDiv);
                  listOfMessagesDiv.appendChild(VideoDiv);


                  resolve();
                },
                error: function (error) {
                  console.error("Error receiving video:", error);
                },
              });

            });
          } else if (messages[i].type == "audio") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldaudio/" +
                  messages[i].message1 +
                  "/" +
                  messages[i].userId +
                  "/" +
                  messages[i].operatorId,
                method: "GET",
                xhrFields: {
                  responseType: "blob", // Assuming the response is a video blob
                },
                success: function (audioBlob) {
                  // listOfMessagesDiv.style.overflowY = "auto";
                  // listOfMessagesDiv.style.overflowX = "hidden";
                  // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                  console.log("ses geldi");
                  var audioElement = document.createElement("audio");

                  // Sesin URL'sini base64 kodlaması ile oluştur
                  var reader = new FileReader();
                  reader.onloadend = function () {
                    audioElement.src = reader.result;
                  };
                  reader.readAsDataURL(audioBlob);

                  audioElement.controls = true; // Kontrolleri göstermek için
                  audioElement.preload = "auto"; // Otomatik olarak yükle

                  var AudioDiv = document.createElement("div");
                  var AudioInnerDiv = document.createElement("div");

                  if (messages[i].sendByUser == false) {
                    AudioDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px");

                  }
                  else {
                    AudioDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");

                  }
                  AudioInnerDiv.appendChild(audioElement);
                  AudioDiv.appendChild(AudioInnerDiv);
                  listOfMessagesDiv.appendChild(AudioDiv);


                  // <audio> elementini listOfMessagesDiv'e ekle


                  // Scroll'u en aşağı kaydır, böylece yeni eklenen ses görünür olur
                  resolve();
                },
                error: function (error) {
                  console.error("Error receiving audio:", error);
                },
              });

            });
          } else if (messages[i].type == "message") {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receiveoldmessage/" +
                  (i + 1),
                method: "GET",
                success: function (oldMessage) {
                  // listOfMessagesDiv.style.overflowY = "auto";
                  // listOfMessagesDiv.style.overflowX = "hidden";
                  // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                  var messageDiv = document.createElement("div");
                  var messageInnerDiv = document.createElement("div");
                  messageInnerDiv.setAttribute("class", "message");

                  if (messages[i].sendByUser == false) {
                    messageDiv.setAttribute("style", "display:flex; justify-content: flex-start; margin-top:10px;")
                    messageInnerDiv.setAttribute("class", "received");
                  }
                  else {
                    messageDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px;")
                    messageInnerDiv.setAttribute("class", "sent");
                  }
                  messageInnerDiv.innerHTML = oldMessage;
                  messageDiv.appendChild(messageInnerDiv);
                  listOfMessagesDiv.appendChild(messageDiv);
                  resolve();
                },
              });

            });
          }
        }

      }



      while (userListDiv.firstChild) {
        userListDiv.removeChild(userListDiv.firstChild);
      }

      var endButton = document.createElement("button");
      endButton.setAttribute("class", "end-old-message-button");
      var endIcon = document.createElement("i");
      endIcon.setAttribute("class", "fa-solid fa-circle-xmark");
      endButton.append(endIcon);
      endButton.addEventListener("click", function () {
        document.getElementById("connectionType").textContent = "Idle";
        location.reload();
      });
      userListDiv.appendChild(endButton);


      $("#chatSectionWelcome").append(listOfMessagesDiv);
    });
    userDiv.appendChild(acceptButton);
    userListDiv.appendChild(userDiv);
    // listOfMessagesDiv.style.overflowY = "auto";
    listOfMessagesDiv.style.overflowX = "hidden";
    // listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
  }

});

connection.on(
  "ReceiveMessageOperators",
  function (message, username, plantType, connectionId, userId, isSendPhoto, isSendVideo) {
    var userid = localStorage.getItem("UserId");
    var userName =
      localStorage.getItem("UserName") + localStorage.getItem("UserSurname");
    var userStatus = localStorage.getItem("UserStatus");




    if (userStatus == 2) {

      var connectionType =
        document.getElementById("connectionType").textContent;
      var plantName = localStorage.getItem("PlantName");
      if (plantName == plantType && connectionType == "Idle") {
        //  Eger operatordusa, mesgul deyilse ve plantName i musterinin sectiyi ile ust uste dusurse qebul eleme buttonu yaransin
        var userListDiv = document.getElementById("userList");

        var userDiv = document.createElement("div");
        userDiv.setAttribute("class", "btn btn-primary");
        var userNameLabel = document.createElement("label");
        userNameLabel.textContent = username.split(/(?=[A-Z])/).join(" ");
        var acceptButton = document.createElement("button");
        acceptButton.setAttribute("class", "fa-solid fa-check");
        acceptButton.setAttribute("style", "margin-left:20px;width:20px;height:20px;border:none;border-radis:50%;");
        acceptButton.setAttribute("id", "acceptButton");
        acceptButton.setAttribute("value", "Accept");
        userDiv.appendChild(userNameLabel);
        userDiv.appendChild(acceptButton);
        userListDiv.appendChild(userDiv);
        $(acceptButton)
          .off("click")
          .click((event) => {
            // Qebul eleme butonunun event listeneri
            document.getElementById("listOfOldMessages").classList.remove("messages")
            document.getElementById("connectionType").textContent = "Busy";
            document.getElementById("connectedUserId").textContent =
              connectionId;
            document.getElementById("connectedUserName").textContent = username;
            document.getElementById("connectedUserDbId").textContent = userId;

            if (isSendPhoto == true) {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receivefirstimage/" +
                  userId,


                method: "GET",
                xhrFields: {
                  responseType: "blob",
                },
                success: function (blob) {
                  var url = URL.createObjectURL(blob);

                  // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
                  var imgElement = document.createElement("img");
                  $(imgElement).attr(
                    "style",
                    "width: 200px; height: 200px;"
                  );
                  imgElement.src = url; // Fotoğrafın URL'sini ayarla

                  var PhotoDiv = document.createElement("div");
                  PhotoDiv.setAttribute("style", "display: flex; justify-content: flex-start; margin-top:10px;");
                  var PhotoInnerDiv = document.createElement("div");
                  PhotoInnerDiv.appendChild(imgElement);
                  PhotoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;")
                  PhotoDiv.appendChild(PhotoInnerDiv);
                  // <img> elementini listOfMessagesDiv'e ekle
                  document.getElementById("listOfMessages").appendChild(PhotoDiv);

                  // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
                  var listOfMessagesDiv = document.getElementById("listOfMessages");
                  listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                },
                error: function (error) {
                  console.error("There was a problem with the AJAX request:", error);
                },
              });
            }

            if (isSendVideo == true) {
              $.ajax({
                url:
                  "https://localhost:7090/api/home/receivefirstvideo/" +
                  userId,


                method: "GET",
                xhrFields: {
                  responseType: "blob",
                },
                success: function (blob) {
                  console.log("I'm here");
                  var url = URL.createObjectURL(blob);
                  console.log(typeof blob);

                  // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
                  var videoElement = document.createElement("video");
                  $(videoElement).attr(
                    "style",
                    "width: 200px; height: 200px;"
                  );
                  videoElement.src = url; // Fotoğrafın URL'sini ayarla
                  videoElement.controls = true; // Kontrolleri göstermek için
                  videoElement.preload = "auto"; // Otomatik olarak yükle

                  var VideoDiv = document.createElement("div");
                  VideoDiv.setAttribute("style", "display: flex; justify-content: flex-start; margin-top:10px;");
                  var VideoInnerDiv = document.createElement("div");
                  VideoInnerDiv.appendChild(videoElement);
                  VideoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;")
                  VideoDiv.appendChild(VideoInnerDiv);
                  // <img> elementini listOfMessagesDiv'e ekle
                  document.getElementById("listOfMessages").appendChild(VideoDiv);

                  // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
                  var listOfMessagesDiv = document.getElementById("listOfMessages");
                  listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
                },
                error: function (error) {
                  console.error("There was a problem with the AJAX request:", error);
                },
              });
            }



            //Muveqqeti narahatciliga gore uzr isteyir Roska

            var connectedOperatorInfoDiv = document.createElement("div");
            connectedOperatorInfoDiv.setAttribute("id", "connectedOperatorInfo");
            connectedOperatorInfoDiv.setAttribute("class", "info");
            var InnerConnectedOperatorInfoDiv = document.createElement("div");

            document.getElementById("chatSectionWelcome").appendChild(connectedOperatorInfoDiv);
            

            $.ajax({
              url: 'https://localhost:7090/api/login/getprofilephoto/' + userId,
              method: 'GET',
              xhrFields: {
                responseType: 'blob'
              },
              success: function (blob) {


                var imgElement = document.createElement("img");
                imgElement.setAttribute("class", "connectedProfile")
                imgElement.src = URL.createObjectURL(blob); // Fotoğrafın URL'sini ayarla
                var PhotoInnerDiv = document.createElement("div");
                PhotoInnerDiv.setAttribute("class", "connected-profile-div")
                PhotoInnerDiv.append(imgElement);

                function ayirIsim(isim) {
                  // Boşlukları kontrol etmek ve ismi ayırmak için bir dizi kullanalım
                  let ayirilmisIsim = [];

                  // Her harfi kontrol et
                  for (let i = 0; i < isim.length; i++) {
                    // Eğer harf büyükse ve dizinin sonu değilse bir önceki harfi boşlukla birleştir
                    if (isim[i] === isim[i].toUpperCase() && i !== 0) {
                      ayirilmisIsim.push(' ');
                    }
                    // Her harfi diziye ekle
                    ayirilmisIsim.push(isim[i]);
                  }

                  // Diziyi birleştirip sonucu döndür
                  return ayirilmisIsim.join('');
                }

                $("#connectedOperatorInfo").append(PhotoInnerDiv);
                var operatorNameText = document.createElement("p");
                operatorNameText.setAttribute("class", "name-text")
                operatorNameText.innerText = ayirIsim(username);
                $("#connectedOperatorInfo").append(operatorNameText);
              },
              error: function () {

              }
            })



            var listOfMessagesDiv = document.createElement("div");
            listOfMessagesDiv.classList.add("messages");
            listOfMessagesDiv.setAttribute("id", "listOfMessages");
            var messageSectionDiv = document.createElement("div");
            messageSectionDiv.classList.add("input-section");
            var sendMessageInput = document.createElement("input");
            sendMessageInput.classList.add("message-input");
            sendMessageInput.setAttribute("id", "operatorMessage");
            sendMessageInput.setAttribute("placeholder", "  Mesaj yazın...");
            var messageSendButton = document.createElement("input");
            messageSendButton.setAttribute("id", "sendButton");
            messageSendButton.setAttribute("value", "Send");
            messageSendButton.setAttribute("type", "submit");
            messageSendButton.setAttribute("class", "message-send-button");
            $("#chatSectionWelcome").append(listOfMessagesDiv);
            $("#chatSectionWelcome").append(messageSectionDiv);
            var sendMessageDiv = document.createElement("div");
            sendMessageDiv.appendChild(sendMessageInput);
            sendMessageDiv.appendChild(messageSendButton);
            messageSectionDiv.appendChild(sendMessageDiv);

            var plusIconDiv = document.createElement("div");
            plusIconDiv.setAttribute("id", "plusIconDiv");
            plusIconDiv.setAttribute("onclick", "togglePopup()");
            plusIconDiv.setAttribute("style", "display:flex; justify-content:center;align-items:center;padding: 8px 20px;background-color:#4eac6d;height:60px;border-radius:6px; margin-right:10px;");
            var plusIcon = document.createElement("i");
            plusIcon.setAttribute("class", "fa-solid fa-plus");
            plusIcon.setAttribute("id", "plusIcon");
            plusIcon.setAttribute("style", "font-size:25px;color:white;");
            plusIconDiv.append(plusIcon);

            var popUpDiv = document.createElement("div");
            popUpDiv.setAttribute("id", "popUpDiv");
            popUpDiv.setAttribute("class", "popUp");
            //PopUp-in ici


            var closePopUp = document.createElement("span");
            closePopUp.setAttribute("class", "close");
            closePopUp.setAttribute("onclick", "togglePopup()");
            var closePopUpIcon = document.createElement("i");
            closePopUpIcon.setAttribute("class", "fa-solid fa-xmark");
            closePopUp.append(closePopUpIcon);

            popUpDiv.append(closePopUp);

            var messageDiv = document.createElement("div");
            messageDiv.setAttribute("id", "mesaj2")
            var messageInnerDiv = document.createElement("div");
            messageInnerDiv.setAttribute("class", "message received")
            // messageInnerDiv.setAttribute("style", "padding: 10px; border-radius: 20px; background-color: rgb(192,192,192)")
            messageInnerDiv.innerHTML = message;
            // messageDiv.setAttribute("class", "messageSend");
            messageDiv.appendChild(messageInnerDiv);
            listOfMessagesDiv.appendChild(messageDiv);




            //Send Photo from Operator to User

            //Bunun eynisini audio, video ucun (ve user to operatorda da)
              var photoSendDiv = document.createElement("div");
              photoSendDiv.setAttribute("style", "display:flex; align-items:center; justify-content:center;");
              photoSendDiv.setAttribute("class", "photoSendDiv");
              var fileInput = document.createElement("input");
              var photoIcon = document.createElement("i");
              photoIcon.setAttribute("class", "fa-solid fa-image");
              photoIcon.setAttribute("style", "font-size:25px;");
              var photoLabel = document.createElement("label");
              var sendPhotoButton = document.createElement("button");


              fileInput.setAttribute("id", "fileInput");
              fileInput.setAttribute("type", "file");
              fileInput.setAttribute("accept", "image/*");
              fileInput.setAttribute("style", "visibility:hidden;width:20%;");
              photoLabel.setAttribute("for", "fileInput");
              photoLabel.append(photoIcon)
              sendPhotoButton.setAttribute("id", "sendImageButton");
              sendPhotoButton.setAttribute("style", "background-color: #4eac6d;border:none; color: white;");
              var sendIcon = document.createElement("i");
              sendIcon.setAttribute("class", "fa-solid fa-paper-plane");
              sendIcon.setAttribute("style", "font-size:25px;");
              sendPhotoButton.append(sendIcon);

              photoSendDiv.append(photoLabel);
              photoSendDiv.append(fileInput);
              photoSendDiv.append(sendPhotoButton);

              messageSectionDiv.append(photoSendDiv);
              var fileInput = document.getElementById("fileInput");
              fileInput.removeAttribute("hidden");
              var sendPhotoButton = document.getElementById("sendImageButton");
              sendPhotoButton.removeAttribute("hidden");

              $("#sendImageButton")
                .off("click")
                .click(function () {
                  var photo = $("#fileInput")[0].files[0];
                  var formDataPhoto = new FormData();
                  formDataPhoto.append("UserId", userId);
                  formDataPhoto.append("OperatorId", userid);
                  formDataPhoto.append("Photo", photo);
                  formDataPhoto.append("SendByUser", false);
                  formDataPhoto.append("SendDate", new Date().toISOString());
                  formDataPhoto.append(
                    "UserName",
                    document.getElementById("connectedUserName").textContent
                  );



                  $.ajax({
                    url: "https://localhost:7090/api/home/sendimage",
                    type: "POST",
                    data: formDataPhoto,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                      // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
                      var imgElement = document.createElement("img");
                      $(imgElement).attr(
                        "style",
                        "width: 200px; height: 200px;"
                      );
                      imgElement.src = URL.createObjectURL(photo); // Fotoğrafın URL'sini ayarla
                      var photoDiv = document.createElement("div");
                      photoDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top:10px");
                      var photoInnerDiv = document.createElement("div");
                      photoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;");
                      photoInnerDiv.appendChild(imgElement);
                      photoDiv.appendChild(photoInnerDiv);
                      // <img> elementini listOfMessagesDiv'e ekle
                      document
                        .getElementById("listOfMessages")
                        .appendChild(photoDiv);

                      // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
                      var listOfMessagesDiv =
                        document.getElementById("listOfMessages");
                      listOfMessagesDiv.scrollTop =
                        listOfMessagesDiv.scrollHeight;


                        $(document).ready(function () {
                          $("#listOfMessages").off('click').on("click", "img", function () {
                            var imageUrl = $(this).attr("src");
                            showImageModalOperator(imageUrl);
                            // Modal penceresini oluştur
                            // var modal = $('<div class="modal fade" tabindex="-1" role="dialog">\
                            //                 <div class="modal-dialog modal-dialog-centered" role="document">\
                            //                   <div class="modal-content">\
                            //                     <div class="bigPhotoContainer">\
                            //                       <div class="bigPhotoTextAndClose">\
                            //                         <button class="closeModalButton">\
                            //                           <i class="fa-solid fa-xmark"></i>\
                            //                         </button>\
                            //                       </div>\
                            //                       <div id="bigPhotoDiv">\
                            //                         <img src="" id="bigPhoto" class="img-fluid">\
                            //                       </div>\
                            //                     </div>\
                            //                   </div>\
                            //                 </div>\
                            //               </div>');
                        
                            // modal.find('#bigPhotoDiv img').attr('src', imageUrl);
                        
                            // Body'ye modalı ekle
                            // $("body").append(modal);
                        
                            // Modal penceresini göster
                            // modal.modal("show");
                            // $('.closeModalButton').click(()=>{
                            //   modal.modal("hide");
                            // })
                            // Modal kapatıldığında temizle
                            // modal.on("hidden.bs.modal", function () {
                            //   modal.remove();
                            // });
                          });
                        });




                      if (photo != null) {
                        connection.invoke(
                          "SendImageToUser",
                          localStorage.getItem("UserId"),
                          document.getElementById("connectedUserId").textContent
                        );
                      }
                      // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
                    },
                    error: function (xhr, status, error) {
                      console.error("Error:", xhr.responseText);
                      // Hata durumunda kullanıcıya bilgi verebilirsin
                    },
                  });
                });


            //Send video from Operator to User

            var videoSendDiv = document.createElement("div");
            videoSendDiv.setAttribute("style", "display:flex; align-items:center; justify-content:center;");
            videoSendDiv.setAttribute("class", "send-image-button marginVideoSendDiv");
            var fileInputVideo = document.createElement("input");
            var sendVideoButton = document.createElement("button");
            var videoLabel = document.createElement("label");
            var videoIcon = document.createElement("i");
            var sendVideoIcon = document.createElement("i");

            sendVideoIcon.setAttribute("class", "fa-solid fa-paper-plane");
            sendVideoIcon.setAttribute("style", "font-size:25px;")
            fileInputVideo.setAttribute("id", "fileInputVideo");
            fileInputVideo.setAttribute("type", "file");
            fileInputVideo.setAttribute("accept", "video/*");
            fileInputVideo.setAttribute("style", "visibility:hidden;width:20%;")
            sendVideoButton.setAttribute("id", "sendVideoButton");
            sendVideoButton.setAttribute("style", "background-color: #4eac6d; border:none; color: white;")
            // sendVideoButton.innerHTML = "send Video";

            videoLabel.setAttribute("for", "fileInputVideo");
            videoIcon.setAttribute("class", "fa-solid fa-video");
            videoIcon.setAttribute("style", "font-size:25px;")

            videoLabel.append(videoIcon);
            sendVideoButton.append(sendVideoIcon);
            videoSendDiv.appendChild(videoLabel);
            videoSendDiv.appendChild(fileInputVideo);
            videoSendDiv.appendChild(sendVideoButton);
            messageSectionDiv.appendChild(videoSendDiv);



            var fileInput = document.getElementById("fileInputVideo");
            fileInput.removeAttribute("hidden");
            var sendPhotoButton = document.getElementById("sendVideoButton");
            sendPhotoButton.removeAttribute("hidden");

            $("#sendVideoButton")
              .off("click")
              .click(function () {
                var video = $("#fileInputVideo")[0].files[0];
                var formDataVideo = new FormData();
                formDataVideo.append("UserId", userId);
                formDataVideo.append("OperatorId", userid);
                formDataVideo.append("Video", video);
                formDataVideo.append("SendByUser", false);
                formDataVideo.append("SendDate", new Date().toISOString());
                formDataVideo.append(
                  "UserName",
                  document.getElementById("connectedUserName").textContent
                );

                for (var pair of formDataVideo.entries()) {
                  console.log(pair[0] + ": " + pair[1]);
                }

                $.ajax({
                  url: "https://localhost:7090/api/home/sendvideo",
                  type: "POST",
                  data: formDataVideo,
                  contentType: false,
                  processData: false,
                  success: function (data) {
                    // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
                    var videoElement = document.createElement("video");
                    $(videoElement).attr(
                      "style",
                      "width:100%;height:100%px;"
                    );
                    videoElement.src = URL.createObjectURL(video); // Fotoğrafın URL'sini ayarla
                    videoElement.controls = true; // Kontrolleri göstermek için
                    videoElement.preload = "auto"; // Otomatik olarak yükle

                    var VideoDiv = document.createElement("div");
                    VideoDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top:10px");
                    var VideoInnerDiv = document.createElement("div");
                    VideoInnerDiv.setAttribute("style", "display: flex;justify-content: center;align-items: center;width:200px;height:200px;border: 3px solid #4eac6d");
                    VideoInnerDiv.appendChild(videoElement);
                    VideoDiv.appendChild(VideoInnerDiv);
                    // <img> elementini listOfMessagesDiv'e ekle
                    if (video != null) {
                      document
                        .getElementById("listOfMessages")
                        .appendChild(VideoDiv);
                    }

                    // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
                    var listOfMessagesDiv =
                      document.getElementById("listOfMessages");
                    listOfMessagesDiv.scrollTop =
                      listOfMessagesDiv.scrollHeight;

                    if (video != null) {
                      connection.invoke(
                        "SendVideoToUser",
                        localStorage.getItem("UserId"),
                        document.getElementById("connectedUserId").textContent
                      );
                    }
                    // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
                  },
                  error: function (xhr, status, error) {
                    console.error("Error:", xhr.responseText);
                    // Hata durumunda kullanıcıya bilgi verebilirsin
                  },
                });
              });


            //Send Audio from Operator To User
            var sendAudioDiv = document.createElement("div");
            sendAudioDiv.setAttribute("class", "send-image-button");
            sendAudioDiv.setAttribute("style", "display:flex; align-items:center; justify-content:space-around;");
            sendAudioDiv.setAttribute("class", "photoSendDiv marginVideoSendDiv")

            var startRecordingBtn = document.createElement("button");
            var startIcon = document.createElement("i");
            startIcon.setAttribute("class", "fa-solid fa-microphone");
            startIcon.setAttribute("style", "font-size: 25px; margin-left:5px;");
            startRecordingBtn.append(startIcon);


            var audioPlayer = document.createElement("audio");
            var sendAudioButton = document.createElement("button");
            sendAudioButton.setAttribute("style", "margin-right:7px;");
            var sendAudioIcon = document.createElement("i");
            sendAudioIcon.setAttribute("class", "fa-solid fa-paper-plane");
            sendAudioIcon.setAttribute("style", "font-size:25px;margin-right:5px;");
            sendAudioButton.append(sendAudioIcon);
            startRecordingBtn.setAttribute("id", "startRecording");
            startRecordingBtn.setAttribute("style", "background-color: #4eac6d; border:none; color: white;")

            audioPlayer.setAttribute("id", "audioPlayer");
            audioPlayer.setAttribute("controls", "true");
            audioPlayer.setAttribute("style", "display:none");
            sendAudioButton.setAttribute("id", "sendAudioButton");
            sendAudioButton.setAttribute("style", "background-color: #4eac6d; border:none; color: white;");
            sendAudioDiv.appendChild(startRecordingBtn);
            sendAudioDiv.appendChild(audioPlayer);

            sendAudioDiv.appendChild(sendAudioButton);
            messageSectionDiv.appendChild(sendAudioDiv);
            messageSectionDiv.append(plusIconDiv);

            messageSectionDiv.append(popUpDiv);
            popUpDiv.append(photoSendDiv);
            popUpDiv.append(videoSendDiv);
            popUpDiv.append(sendAudioDiv);

            // document.getElementById("startRecording").removeAttribute("hidden");
            // document.getElementById("stopRecording").removeAttribute("hidden");
            // document.getElementById("audioPlayer").removeAttribute("hidden");
            // document
            //   .getElementById("sendAudioButton")
            //   .removeAttribute("hidden");
            // const startRecordingBtn = document.getElementById("startRecording");
            // const stopRecordingBtn = document.getElementById("stopRecording");
            // const audioPlayer = document.getElementById("audioPlayer");

            let mediaRecorder;
            let audioChunks = [];

            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);


                mediaRecorder.ondataavailable = (event) => {
                  audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                  var audioBlob = new Blob(audioChunks, {
                    type: "audio/wav",
                  }); // Change the type as needed
                  // audioChunks = [];
                  const audioUrl = URL.createObjectURL(audioBlob);
                  audioPlayer.src = audioUrl;
                };
              })
              .catch((error) => {
                console.error("Error accessing microphone:", error);
              });

            let isRecording = false;

            function toggleRecording() {
              if (isRecording == false) {
                startIcon.setAttribute("class", "fa-solid fa-stop");
                audioChunks = [];
                mediaRecorder.start();
                isRecording = true;
              } else {
                startIcon.setAttribute("class", "fa-solid fa-microphone");
                mediaRecorder.stop();
                isRecording = false;
              }
            }

            startRecordingBtn.addEventListener("click", toggleRecording);

            $("#sendAudioButton")
              .off("click")
              .click(function () {
                // Eğer hiç ses kaydı alınmamışsa ve kayıt yapılmıyorsa işlem yapma
                if (audioChunks.length === 0 && !isRecording) {
                  alert("No audio recorded.");
                  return;
                }

                console.log(audioChunks.length);

                var formDataAudio = new FormData();
                formDataAudio.append("UserId", userId);
                formDataAudio.append("OperatorId", userid);
                var audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                formDataAudio.append("Audio", audioBlob);
                formDataAudio.append("SendByUser", false);
                formDataAudio.append("SendDate", new Date().toISOString());
                formDataAudio.append(
                  "UserName",
                  document.getElementById("connectedUserName").textContent
                );

                for (var pair of formDataAudio.entries()) {
                  console.log(pair[0] + ": " + pair[1]);
                }

                $.ajax({
                  url: "https://localhost:7090/api/home/sendaudio",
                  type: "POST",
                  data: formDataAudio,
                  contentType: false,
                  processData: false,
                  success: function (data) {
                    // Başarılıysa, sesi çalmak için bir <audio> elementi oluştur
                    var audioElement = document.createElement("audio");

                    // Sesin URL'sini base64 kodlaması ile oluştur
                    var reader = new FileReader();
                    reader.onloadend = function () {
                      audioElement.src = reader.result;
                    };
                    reader.readAsDataURL(audioBlob);

                    audioElement.controls = true; // Kontrolleri göstermek için
                    audioElement.preload = "auto"; // Otomatik olarak yükle

                    var AudioDiv = document.createElement("div");
                    AudioDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top: 10px");
                    var AudioInnerDiv = document.createElement("div");
                    AudioInnerDiv.appendChild(audioElement);
                    AudioDiv.appendChild(AudioInnerDiv);

                    // <audio> elementini listOfMessagesDiv'e ekle
                    if (audioChunks.length != 0) {
                      document
                        .getElementById("listOfMessages")
                        .appendChild(AudioDiv);
                    }

                    // Scroll'u en aşağı kaydır, böylece yeni eklenen ses görünür olur
                    var listOfMessagesDiv =
                      document.getElementById("listOfMessages");
                    listOfMessagesDiv.scrollTop =
                      listOfMessagesDiv.scrollHeight;
                    if (audioChunks.length != 0) {
                      connection.invoke(
                        "SendAudioToUser",
                        localStorage.getItem("UserId"),
                        document.getElementById("connectedUserId").textContent
                      );
                    }
                    audioChunks = [];
                    audioBlob = null;
                  },
                  error: function (xhr, status, error) {
                    console.error("Error:", xhr.responseText);
                    // Hata durumunda kullanıcıya bilgi verebilirsin
                  },
                });
              });
            messageSendButton.addEventListener("click", function (event) {
              //  operatorun qebul etdiyi usere mesaj gondermesi
              var operatorMessage =
                document.getElementById("operatorMessage").value;
              var operatorMessageDiv = document.createElement("div");
              operatorMessageDiv.setAttribute("id", "messageDiv")
              var operatorMessageInnerDiv = document.createElement("div");
              operatorMessageInnerDiv.setAttribute("class", "message sent")
              operatorMessageInnerDiv.innerHTML = operatorMessage
              // operatorMessageDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top:10px")
              // operatorMessageInnerDiv.setAttribute("style", "padding: 10px; border-radius: 20px; background-color: rgb(192,192,192)");
              operatorMessageDiv.appendChild(operatorMessageInnerDiv);
              document
                .getElementById("listOfMessages")
                .appendChild(operatorMessageDiv);
              document.getElementById("operatorMessage").value = "";
              connection.invoke(
                "SendMessageToUser",
                document.getElementById("connectedUserId").textContent,
                operatorMessage,
                userName,
                userid,
                document.getElementById("connectedUserDbId").textContent,
                document.getElementById("connectedUserName").textContent,
                username
              );
            });
            connection.invoke(
              "SetOperatorId",
              userName,
              username,
              userid,
              userId
            );
          });
      }
    }
  }
);
connection.on("ReceiveImageForUser", function (DbId) {
  if (localStorage.getItem("UserStatus") == 3) {
    var userDbId = localStorage.getItem("UserId");
    var operatorDbId = DbId;
    const alertSound = new Audio('chat-sound (1).mp3');
    alertSound.play();
  } else if (localStorage.getItem("UserStatus") == 2) {
    const alertSound = new Audio('chat-sound (1).mp3');
    alertSound.play();
    var userDbId = DbId;
    var operatorDbId = localStorage.getItem("UserId");
  }

  $.ajax({
    url:
      "https://localhost:7090/api/home/receiveimage/" +
      userDbId +
      "/" +
      operatorDbId,
    type: "GET",

    contentType: false,
    processData: false,
    success: function (data) {
      $(document).ready(function () {
        $.ajax({
          url:
            "https://localhost:7090/api/home/receiveimage/" +
            userDbId +
            "/" +
            operatorDbId,
          method: "GET",
          xhrFields: {
            responseType: "blob",
          },
          success: function (blob) {
            console.log("I'm here");
            var url = URL.createObjectURL(blob);
            console.log(typeof blob);

            // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
            var imgElement = document.createElement("img");
            $(imgElement).attr(
              "style",
              "width: 200px; height: 200px;"
            );
            imgElement.src = url; // Fotoğrafın URL'sini ayarla

            var PhotoDiv = document.createElement("div");
            PhotoDiv.setAttribute("style", "display: flex; justify-content: flex-start; margin-top:10px;");
            var PhotoInnerDiv = document.createElement("div");
            PhotoInnerDiv.appendChild(imgElement);
            PhotoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;")
            PhotoDiv.appendChild(PhotoInnerDiv);
            // <img> elementini listOfMessagesDiv'e ekle
            document.getElementById("listOfMessages").appendChild(PhotoDiv);

            // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
            var listOfMessagesDiv = document.getElementById("listOfMessages");
            listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;

            $(document).ready(function () {
              $("#listOfMessages").off('click').on("click", "img", function () {
                var imageUrl = $(this).attr("src");
                showImageModalReceive(imageUrl);
                // Modal penceresini oluştur
                // var modal = $('<div class="modal fade" tabindex="-1" role="dialog">\
                //                 <div class="modal-dialog modal-dialog-centered" role="document">\
                //                   <div class="modal-content">\
                //                     <div class="bigPhotoContainer">\
                //                       <div class="bigPhotoTextAndClose">\
                //                         <button class="closeModalButton">\
                //                           <i class="fa-solid fa-xmark"></i>\
                //                         </button>\
                //                       </div>\
                //                       <div id="bigPhotoDiv">\
                //                         <img src="" id="bigPhoto" class="img-fluid">\
                //                       </div>\
                //                     </div>\
                //                   </div>\
                //                 </div>\
                //               </div>');
            
                // modal.find('#bigPhotoDiv img').attr('src', imageUrl);
            
                // Body'ye modalı ekle
                // $("body").append(modal);
            
                // Modal penceresini göster
                // modal.modal("show");
                // $('.closeModalButton').click(()=>{
                //   modal.modal("hide");
                // })
                // Modal kapatıldığında temizle
                // modal.on("hidden.bs.modal", function () {
                //   modal.remove();
                // });
              });
            });  

          },
          error: function (error) {
            console.error("There was a problem with the AJAX request:", error);
          },
        });
      });
      // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
    },
    error: function (xhr, status, error) {
      console.error("Error:", xhr.responseText);
      // Hata durumunda kullanıcıya bilgi verebilirsin
    },
  });
});

connection.on("ReceiveVideoForUser", function (DbId) {
  var userDbId, operatorDbId;

  if (localStorage.getItem("UserStatus") == 3) {
    const alertSound = new Audio('chat-sound (1).mp3');
    alertSound.play();
    userDbId = localStorage.getItem("UserId");
    operatorDbId = DbId;
  } else if (localStorage.getItem("UserStatus") == 2) {
    const alertSound = new Audio('chat-sound (1).mp3');
    alertSound.play();
    userDbId = DbId;
    operatorDbId = localStorage.getItem("UserId");
  }

  console.log(userDbId);
  console.log(operatorDbId);

  $.ajax({
    url:
      "https://localhost:7090/api/home/receivevideo/" +
      userDbId +
      "/" +
      operatorDbId,
    type: "GET",
    success: function (data) {
      // Assuming the 'data' received is the video content

      var listOfMessagesDiv = document.getElementById("listOfMessages");
      $.ajax({
        url:
          "https://localhost:7090/api/home/receivevideo/" +
          userDbId +
          "/" +
          operatorDbId,
        method: "GET",
        xhrFields: {
          responseType: "blob", // Assuming the response is a video blob
        },
        success: function (videoBlob) {
          console.log("Video received");

          var videoElement = document.createElement("video");
          $(videoElement).attr("style", "display: flex;justify-content: center;align-items: center;width:200px;height:200px;border: 3px solid #4eac6d");
          videoElement.src = URL.createObjectURL(videoBlob);
          videoElement.controls = true; // Adding controls for the video

          var VideoDiv = document.createElement("div");
          VideoDiv.setAttribute("style", "display:flex; justify-content:flex-start; margin-top:10px");
          var VideoInnerDiv = document.createElement("div");
          VideoInnerDiv.setAttribute("style", "display:flex;justify-content:center; align-items:center")
          VideoInnerDiv.appendChild(videoElement);
          VideoDiv.appendChild(VideoInnerDiv);


          listOfMessagesDiv.appendChild(VideoDiv);
          listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
        },
        error: function (error) {
          console.error("Error receiving video:", error);
        },
      });
    },
    error: function (xhr, status, error) {
      console.error("Error:", xhr.responseText);
      // Handle error here
    },
  });
});

connection.on("ReceiveAudioForUser", function (DbId) {
  var userDbId, operatorDbId;

  if (localStorage.getItem("UserStatus") == 3) {
    const alertSound = new Audio('chat-sound (1).mp3');
    alertSound.play();
    userDbId = localStorage.getItem("UserId");
    operatorDbId = DbId;
  } else if (localStorage.getItem("UserStatus") == 2) {
    const alertSound = new Audio('chat-sound (1).mp3');
    alertSound.play();
    userDbId = DbId;
    operatorDbId = localStorage.getItem("UserId");
  }

  console.log(userDbId);
  console.log(operatorDbId);

  $.ajax({
    url:
      "https://localhost:7090/api/home/receiveaudio/" +
      userDbId +
      "/" +
      operatorDbId,
    type: "GET",
    success: function (data) {
      // Assuming the 'data' received is the video content

      $.ajax({
        url:
          "https://localhost:7090/api/home/receiveaudio/" +
          userDbId +
          "/" +
          operatorDbId,
        method: "GET",
        xhrFields: {
          responseType: "blob", // Assuming the response is a video blob
        },
        success: function (audioBlob) {
          var audioElement = document.createElement("audio");
          // Sesin URL'sini base64 kodlaması ile oluştur
          var reader = new FileReader();
          reader.onloadend = function () {
            audioElement.src = reader.result;
          };
          reader.readAsDataURL(audioBlob);
          console.log(reader);
          audioElement.controls = true; // Kontrolleri göstermek için
          audioElement.preload = "auto"; // Otomatik olarak yükle

          var AudioDiv = document.createElement("div");
          AudioDiv.setAttribute("style", "display: flex; justify-content: flex-start; margin-top: 10px");
          var AudioInnerDiv = document.createElement("div");
          AudioInnerDiv.appendChild(audioElement);
          AudioDiv.appendChild(AudioInnerDiv);

          // <audio> elementini listOfMessagesDiv'e ekle

          document.getElementById("listOfMessages").appendChild(AudioDiv);

          // Scroll'u en aşağı kaydır, böylece yeni eklenen ses görünür olur
          var listOfMessagesDiv = document.getElementById("listOfMessages");
          listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
        },
        error: function (error) {
          console.error("Error receiving video:", error);
        },
      });
    },
    error: function (xhr, status, error) {
      console.error("Error:", xhr.responseText);
      // Handle error here
    },
  });
});

connection.on(
  "ReceiveMessageUser",
  function (message, operatorName, userId, userDbId) {
    var userid = localStorage.getItem("UserId");
    var userName =
      localStorage.getItem("UserName") + localStorage.getItem("UserSurname");
    var userStatus = localStorage.getItem("UserStatus");
    if (
      userStatus == 3 &&
      document.getElementById("connectedOperatorDbId").textContent == userId
    ) {
      const alertSound = new Audio('chat-sound (1).mp3');
      alertSound.play();
      //  Operatorun elaqeli oldugu userin mesajii qebul etmesi
      var messageDiv = document.createElement("div");
      messageDiv.setAttribute("id", "mesaj2");
      var messageInnerDiv = document.createElement("div");
      messageInnerDiv.setAttribute("class", "message received");
      messageInnerDiv.innerHTML = message;

      messageDiv.appendChild(messageInnerDiv);
      document.getElementById("listOfMessages").appendChild(messageDiv);
    }
  }
);

connection.on("EndConversationUser", function (operatorDbId, connectionId) {
  document.getElementById("addChatUser").disabled = false;
  document.getElementById("connectedOperatorId").textContent = "";
  document.getElementById("connectedOperatorName").textContent = "";
  document.getElementById("connectedOperatorDbId").textContent = "";
  document.getElementById("connectionType").textContent = "FindOperator";



  while (document.getElementById("chatSectionWelcome").firstChild) {
    document
      .getElementById("chatSectionWelcome")
      .removeChild(document.getElementById("chatSectionWelcome").firstChild);
  }
  var rating;

  var RatingDiv = $('<div class="feedback">\
  <div class="rating">\
    <input type="radio" name="rating" id="rating-5">\
    <label for="rating-5"></label>\
    <input type="radio" name="rating" id="rating-4">\
    <label for="rating-4"></label>\
    <input type="radio" name="rating" id="rating-3">\
    <label for="rating-3"></label>\
    <input type="radio" name="rating" id="rating-2">\
    <label for="rating-2"></label>\
    <input type="radio" name="rating" id="rating-1">\
    <label for="rating-1"></label>\
    <div class="emoji-wrapper">\
      <div class="emoji">\
        <svg class="rating-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
         <circle cx="256" cy="256" r="256" fill="#ffd93b"/>\
         <path d="M512 256c0 141.44-114.64 256-256 256-80.48 0-152.32-37.12-199.28-95.28 43.92 35.52 99.84 56.72 160.72 56.72 141.36 0 256-114.56 256-256 0-60.88-21.2-116.8-56.72-160.72C474.8 103.68 512 175.52 512 256z" fill="#f4c534"/>\
         <ellipse transform="scale(-1) rotate(31.21 715.433 -595.455)" cx="166.318" cy="199.829" rx="56.146" ry="56.13" fill="#fff"/>\
         <ellipse transform="rotate(-148.804 180.87 175.82)" cx="180.871" cy="175.822" rx="28.048" ry="28.08" fill="#3e4347"/>\
         <ellipse transform="rotate(-113.778 194.434 165.995)" cx="194.433" cy="165.993" rx="8.016" ry="5.296" fill="#5a5f63"/>\
         <ellipse transform="scale(-1) rotate(31.21 715.397 -1237.664)" cx="345.695" cy="199.819" rx="56.146" ry="56.13" fill="#fff"/>\
         <ellipse transform="rotate(-148.804 360.25 175.837)" cx="360.252" cy="175.84" rx="28.048" ry="28.08" fill="#3e4347"/>\
         <ellipse transform="scale(-1) rotate(66.227 254.508 -573.138)" cx="373.794" cy="165.987" rx="8.016" ry="5.296" fill="#5a5f63"/>\
         <path d="M370.56 344.4c0 7.696-6.224 13.92-13.92 13.92H155.36c-7.616 0-13.92-6.224-13.92-13.92s6.304-13.92 13.92-13.92h201.296c7.696.016 13.904 6.224 13.904 13.92z" fill="#3e4347"/>\
        </svg>\
        <svg class="rating-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
         <circle cx="256" cy="256" r="256" fill="#ffd93b"/>\
         <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>\
         <path d="M328.4 428a92.8 92.8 0 0 0-145-.1 6.8 6.8 0 0 1-12-5.8 86.6 86.6 0 0 1 84.5-69 86.6 86.6 0 0 1 84.7 69.8c1.3 6.9-7.7 10.6-12.2 5.1z" fill="#3e4347"/>\
         <path d="M269.2 222.3c5.3 62.8 52 113.9 104.8 113.9 52.3 0 90.8-51.1 85.6-113.9-2-25-10.8-47.9-23.7-66.7-4.1-6.1-12.2-8-18.5-4.2a111.8 111.8 0 0 1-60.1 16.2c-22.8 0-42.1-5.6-57.8-14.8-6.8-4-15.4-1.5-18.9 5.4-9 18.2-13.2 40.3-11.4 64.1z" fill="#f4c534"/>\
         <path d="M357 189.5c25.8 0 47-7.1 63.7-18.7 10 14.6 17 32.1 18.7 51.6 4 49.6-26.1 89.7-67.5 89.7-41.6 0-78.4-40.1-82.5-89.7A95 95 0 0 1 298 174c16 9.7 35.6 15.5 59 15.5z" fill="#fff"/>\
         <path d="M396.2 246.1a38.5 38.5 0 0 1-38.7 38.6 38.5 38.5 0 0 1-38.6-38.6 38.6 38.6 0 1 1 77.3 0z" fill="#3e4347"/>\
         <path d="M380.4 241.1c-3.2 3.2-9.9 1.7-14.9-3.2-4.8-4.8-6.2-11.5-3-14.7 3.3-3.4 10-2 14.9 2.9 4.9 5 6.4 11.7 3 15z" fill="#fff"/>\
         <path d="M242.8 222.3c-5.3 62.8-52 113.9-104.8 113.9-52.3 0-90.8-51.1-85.6-113.9 2-25 10.8-47.9 23.7-66.7 4.1-6.1 12.2-8 18.5-4.2 16.2 10.1 36.2 16.2 60.1 16.2 22.8 0 42.1-5.6 57.8-14.8 6.8-4 15.4-1.5 18.9 5.4 9 18.2 13.2 40.3 11.4 64.1z" fill="#f4c534"/>\
         <path d="M155 189.5c-25.8 0-47-7.1-63.7-18.7-10 14.6-17 32.1-18.7 51.6-4 49.6 26.1 89.7 67.5 89.7 41.6 0 78.4-40.1 82.5-89.7A95 95 0 0 0 214 174c-16 9.7-35.6 15.5-59 15.5z" fill="#fff"/>\
         <path d="M115.8 246.1a38.5 38.5 0 0 0 38.7 38.6 38.5 38.5 0 0 0 38.6-38.6 38.6 38.6 0 1 0-77.3 0z" fill="#3e4347"/>\
         <path d="M131.6 241.1c3.2 3.2 9.9 1.7 14.9-3.2 4.8-4.8 6.2-11.5 3-14.7-3.3-3.4-10-2-14.9 2.9-4.9 5-6.4 11.7-3 15z" fill="#fff"/>\
        </svg>\
        <svg class="rating-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
         <circle cx="256" cy="256" r="256" fill="#ffd93b"/>\
         <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>\
         <path d="M336.6 403.2c-6.5 8-16 10-25.5 5.2a117.6 117.6 0 0 0-110.2 0c-9.4 4.9-19 3.3-25.6-4.6-6.5-7.7-4.7-21.1 8.4-28 45.1-24 99.5-24 144.6 0 13 7 14.8 19.7 8.3 27.4z" fill="#3e4347"/>\
         <path d="M276.6 244.3a79.3 79.3 0 1 1 158.8 0 79.5 79.5 0 1 1-158.8 0z" fill="#fff"/>\
         <circle cx="340" cy="260.4" r="36.2" fill="#3e4347"/>\
         <g fill="#fff">\
          <ellipse transform="rotate(-135 326.4 246.6)" cx="326.4" cy="246.6" rx="6.5" ry="10"/>\
          <path d="M231.9 244.3a79.3 79.3 0 1 0-158.8 0 79.5 79.5 0 1 0 158.8 0z"/>\
         </g>\
         <circle cx="168.5" cy="260.4" r="36.2" fill="#3e4347"/>\
         <ellipse transform="rotate(-135 182.1 246.7)" cx="182.1" cy="246.7" rx="10" ry="6.5" fill="#fff"/>\
        </svg>\
        <svg class="rating-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
         <circle cx="256" cy="256" r="256" fill="#ffd93b"/>\
         <path d="M407.7 352.8a163.9 163.9 0 0 1-303.5 0c-2.3-5.5 1.5-12 7.5-13.2a780.8 780.8 0 0 1 288.4 0c6 1.2 9.9 7.7 7.6 13.2z" fill="#3e4347"/>\
         <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>\
         <g fill="#fff">\
          <path d="M115.3 339c18.2 29.6 75.1 32.8 143.1 32.8 67.1 0 124.2-3.2 143.2-31.6l-1.5-.6a780.6 780.6 0 0 0-284.8-.6z"/>\
          <ellipse cx="356.4" cy="205.3" rx="81.1" ry="81"/>\
         </g>\
         <ellipse cx="356.4" cy="205.3" rx="44.2" ry="44.2" fill="#3e4347"/>\
         <g fill="#fff">\
          <ellipse transform="scale(-1) rotate(45 454 -906)" cx="375.3" cy="188.1" rx="12" ry="8.1"/>\
          <ellipse cx="155.6" cy="205.3" rx="81.1" ry="81"/>\
         </g>\
         <ellipse cx="155.6" cy="205.3" rx="44.2" ry="44.2" fill="#3e4347"/>\
         <ellipse transform="scale(-1) rotate(45 454 -421.3)" cx="174.5" cy="188" rx="12" ry="8.1" fill="#fff"/>\
        </svg>\
        <svg class="rating-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
         <circle cx="256" cy="256" r="256" fill="#ffd93b"/>\
         <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>\
         <path d="M232.3 201.3c0 49.2-74.3 94.2-74.3 94.2s-74.4-45-74.4-94.2a38 38 0 0 1 74.4-11.1 38 38 0 0 1 74.3 11.1z" fill="#e24b4b"/>\
         <path d="M96.1 173.3a37.7 37.7 0 0 0-12.4 28c0 49.2 74.3 94.2 74.3 94.2C80.2 229.8 95.6 175.2 96 173.3z" fill="#d03f3f"/>\
         <path d="M215.2 200c-3.6 3-9.8 1-13.8-4.1-4.2-5.2-4.6-11.5-1.2-14.1 3.6-2.8 9.7-.7 13.9 4.4 4 5.2 4.6 11.4 1.1 13.8z" fill="#fff"/>\
         <path d="M428.4 201.3c0 49.2-74.4 94.2-74.4 94.2s-74.3-45-74.3-94.2a38 38 0 0 1 74.4-11.1 38 38 0 0 1 74.3 11.1z" fill="#e24b4b"/>\
         <path d="M292.2 173.3a37.7 37.7 0 0 0-12.4 28c0 49.2 74.3 94.2 74.3 94.2-77.8-65.7-62.4-120.3-61.9-122.2z" fill="#d03f3f"/>\
         <path d="M411.3 200c-3.6 3-9.8 1-13.8-4.1-4.2-5.2-4.6-11.5-1.2-14.1 3.6-2.8 9.7-.7 13.9 4.4 4 5.2 4.6 11.4 1.1 13.8z" fill="#fff"/>\
         <path d="M381.7 374.1c-30.2 35.9-75.3 64.4-125.7 64.4s-95.4-28.5-125.8-64.2a17.6 17.6 0 0 1 16.5-28.7 627.7 627.7 0 0 0 218.7-.1c16.2-2.7 27 16.1 16.3 28.6z" fill="#3e4347"/>\
         <path d="M256 438.5c25.7 0 50-7.5 71.7-19.5-9-33.7-40.7-43.3-62.6-31.7-29.7 15.8-62.8-4.7-75.6 34.3 20.3 10.4 42.8 17 66.5 17z" fill="#e24b4b"/>\
        </svg>\
        <svg class="rating-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\
         <g fill="#ffd93b">\
          <circle cx="256" cy="256" r="256"/>\
          <path d="M512 256A256 256 0 0 1 56.8 416.7a256 256 0 0 0 360-360c58 47 95.2 118.8 95.2 199.3z"/>\
         </g>\
         <path d="M512 99.4v165.1c0 11-8.9 19.9-19.7 19.9h-187c-13 0-23.5-10.5-23.5-23.5v-21.3c0-12.9-8.9-24.8-21.6-26.7-16.2-2.5-30 10-30 25.5V261c0 13-10.5 23.5-23.5 23.5h-187A19.7 19.7 0 0 1 0 264.7V99.4c0-10.9 8.8-19.7 19.7-19.7h472.6c10.8 0 19.7 8.7 19.7 19.7z" fill="#e9eff4"/>\
         <path d="M204.6 138v88.2a23 23 0 0 1-23 23H58.2a23 23 0 0 1-23-23v-88.3a23 23 0 0 1 23-23h123.4a23 23 0 0 1 23 23z" fill="#45cbea"/>\
         <path d="M476.9 138v88.2a23 23 0 0 1-23 23H330.3a23 23 0 0 1-23-23v-88.3a23 23 0 0 1 23-23h123.4a23 23 0 0 1 23 23z" fill="#e84d88"/>\
         <g fill="#38c0dc">\
          <path d="M95.2 114.9l-60 60v15.2l75.2-75.2zM123.3 114.9L35.1 203v23.2c0 1.8.3 3.7.7 5.4l116.8-116.7h-29.3z"/>\
         </g>\
         <g fill="#d23f77">\
          <path d="M373.3 114.9l-66 66V196l81.3-81.2zM401.5 114.9l-94.1 94v17.3c0 3.5.8 6.8 2.2 9.8l121.1-121.1h-29.2z"/>\
         </g>\
         <path d="M329.5 395.2c0 44.7-33 81-73.4 81-40.7 0-73.5-36.3-73.5-81s32.8-81 73.5-81c40.5 0 73.4 36.3 73.4 81z" fill="#3e4347"/>\
         <path d="M256 476.2a70 70 0 0 0 53.3-25.5 34.6 34.6 0 0 0-58-25 34.4 34.4 0 0 0-47.8 26 69.9 69.9 0 0 0 52.6 24.5z" fill="#e24b4b"/>\
         <path d="M290.3 434.8c-1 3.4-5.8 5.2-11 3.9s-8.4-5.1-7.4-8.7c.8-3.3 5.7-5 10.7-3.8 5.1 1.4 8.5 5.3 7.7 8.6z" fill="#fff" opacity=".2"/>\
        </svg>\
      </div>\
    </div>\
</div>')

  var acceptRateDiv = document.createElement("div");
  acceptRateDiv.setAttribute("style", "display: flex; justify-content: center; align-items: center; width: 100%; height: 100px");

  var rateBtn = document.createElement("button");
  rateBtn.setAttribute("class", "btn btn-success")
  rateBtn.innerHTML = "Rate";

  var skipBtn = document.createElement("button");
  skipBtn.setAttribute("class", "btn btn-warning");
  skipBtn.setAttribute("style", "margin-left: 5px;")
  skipBtn.innerHTML = "Skip";

  acceptRateDiv.append(rateBtn);
  acceptRateDiv.append(skipBtn);


  $('.chat-welcome-section').append(RatingDiv);
  $('.chat-welcome-section').append(acceptRateDiv);

  var ratingStars = $('.rating input');

// Rate butonunu seç
var rateBtn = $('.btn-success');

// Seçilen yıldıza göre değeri takip etmek için değişken
var selectedRating = 0;

// Yıldızlara tıklama olayını ekle
ratingStars.on('click', function() {
  // Tıklanan yıldızın değerini al
  var starId = $(this).attr('id');
  selectedRating = parseInt(starId.split('-')[1]);

});


    $(rateBtn).click(function () {
      $.ajax({
        url: 'https://localhost:7090/api/home/rateOperator/' + operatorDbId + "/" + localStorage.getItem("UserId") + "/" + selectedRating,
        method: 'POST',
        success: function (data) {
          alert("Geri dönüşünüz qeydə alındı")
        },
        error: function (error) {
          console.log(error)
        }
      })
      while (document.getElementById("chatSectionWelcome").firstChild) {
        document
          .getElementById("chatSectionWelcome")
          .removeChild(document.getElementById("chatSectionWelcome").firstChild);
      }
      location.reload();
    })

    $(skipBtn).click(function () {
      while (document.getElementById("chatSectionWelcome").firstChild) {
        document
          .getElementById("chatSectionWelcome")
          .removeChild(document.getElementById("chatSectionWelcome").firstChild);
      }
      location.reload();

    })
  });

connection.on(
  "ReceiveOperatorId",
  function (operatorName, username, connectionId, operatorId, userId, avgValue, rateCount) {

    var userid = localStorage.getItem("UserId");
    var userName =
      localStorage.getItem("UserName") + localStorage.getItem("UserSurname");
    var userStatus = localStorage.getItem("UserStatus");
    if (userStatus == 3 && userId == userid) {

      while (document.getElementById("connectedOperatorInfo").firstChild) {
        document.getElementById("connectedOperatorInfo").removeChild(document.getElementById("connectedOperatorInfo").firstChild);
      }

      $.ajax({
        url: 'https://localhost:7090/api/login/getprofilephoto/' + operatorId,
        method: 'GET',
        xhrFields: {
          responseType: 'blob'
        },
        success: function (blob) {
          console.log("men burdayam");

          var imgElement = document.createElement("img");
          imgElement.setAttribute("class", "connectedProfile")
          imgElement.src = URL.createObjectURL(blob); // Fotoğrafın URL'sini ayarla
          var PhotoInnerDiv = document.createElement("div");
          PhotoInnerDiv.setAttribute("class", "connected-profile-div")
          PhotoInnerDiv.append(imgElement);

          function ayirIsim(isim) {
            // Boşlukları kontrol etmek ve ismi ayırmak için bir dizi kullanalım
            let ayirilmisIsim = [];

            // Her harfi kontrol et
            for (let i = 0; i < isim.length; i++) {
              // Eğer harf büyükse ve dizinin sonu değilse bir önceki harfi boşlukla birleştir
              if (isim[i] === isim[i].toUpperCase() && i !== 0) {
                ayirilmisIsim.push(' ');
              }
              // Her harfi diziye ekle
              ayirilmisIsim.push(isim[i]);
            }

            // Diziyi birleştirip sonucu döndür
            return ayirilmisIsim.join('');
          }

          //  Userin sorgunu bitirmesi
        var endConnectionButton = document.createElement("div");
        endConnectionButton.setAttribute("class","btn btn-primary");
        endConnectionButton.setAttribute("style","border:1px solid white; border-radius: 50%; display:flex; justify-content:center; align-items:center; width:30px;height:30px; margin-left: 870px");
        var closeUserChatIcon = document.createElement("i");
        closeUserChatIcon.setAttribute("class","fa-solid fa-xmark");
        closeUserChatIcon.setAttribute("style","font-size:20px")
        endConnectionButton.append(closeUserChatIcon);
        endConnectionButton.addEventListener("click", function(){
          console.log("User ended connection");
          connection.invoke("EndConnectionUser", document.getElementById("connectedOperatorId").textContent);
          document.getElementById("addChatUser").disabled = false;
          document.getElementById("connectedOperatorId").textContent = "";
          document.getElementById("connectedOperatorName").textContent = "";
          document.getElementById("connectedOperatorDbId").textContent = "";
          document.getElementById("connectionType").textContent = "FindOperator";
        
          while (document.getElementById("chatSectionWelcome").firstChild) {
            document
              .getElementById("chatSectionWelcome")
              .removeChild(document.getElementById("chatSectionWelcome").firstChild);
          }

          while(document.getElementById("userList").firstChild){
            document.getElementById("userList").removeChild(document.getElementById("userList").firstChild);
          }
        });

        


          $("#connectedOperatorInfo").append(PhotoInnerDiv);
          var operatorNameText = document.createElement("p");
          var valueText = document.createElement("p");
          var valueIcon = document.createElement("i");
          valueIcon.setAttribute("class","fa-solid fa-star");
          valueIcon.setAttribute("style","font-size:12px;")
          valueText.innerText = avgValue;
          valueText.append(valueIcon);
          operatorNameText.setAttribute("class", "name-text")
          valueText.setAttribute("class","name-text");
          operatorNameText.innerText = ayirIsim(operatorName);
          $("#connectedOperatorInfo").append(operatorNameText);

          if(rateCount)
          {
          $("#connectedOperatorInfo").append(valueText);
          }

          document.getElementById("connectedOperatorInfo").appendChild(endConnectionButton);
        },
        error: function () {

        }
      })


      // Eger user sorgunu gonderen userdise qebul eden operatorla elaqeni saxlamaq ucun credentialslari ozunde saxlamasi
      document.getElementById("sendButton").disabled = false;
      document.getElementById("connectedOperatorDbId").textContent = operatorId;
      document.getElementById("connectedOperatorName").textContent =
        operatorName;
      document.getElementById("connectedOperatorId").textContent = connectionId;
      document.getElementById("connectionType").textContent =
        "ConnectToOperator";

      var plusIconDiv = document.createElement("div");
      plusIconDiv.setAttribute("id", "plusIconDiv");
      plusIconDiv.setAttribute("onclick", "togglePopup()");
      plusIconDiv.setAttribute("style", "display:flex; justify-content:center;align-items:center;padding: 8px 20px;background-color:#4eac6d;height:60px;border-radius:6px; margin-right:10px;");
      var plusIcon = document.createElement("i");
      plusIcon.setAttribute("class", "fa-solid fa-plus");
      plusIcon.setAttribute("style", "font-size:25px; color:white;");
      plusIcon.setAttribute("id", "plusIcon");
      plusIconDiv.append(plusIcon);

      var popUpDiv = document.createElement("div");
      popUpDiv.setAttribute("id", "popUpDiv");
      popUpDiv.setAttribute("class", "popUpUser");
      //PopUp-in ici


      var closePopUp = document.createElement("span");
      closePopUp.setAttribute("class", "close");
      closePopUp.setAttribute("onclick", "togglePopup()");
      var closePopUpIcon = document.createElement("i");
      closePopUpIcon.setAttribute("class", "fa-solid fa-xmark");
      closePopUp.append(closePopUpIcon);

      popUpDiv.append(closePopUp);
      // var messageSectionDiv = document.createElement("div");
      // messageSectionDiv.classList.add("chatSection");
      // $("#chatSectionWelcome").append(messageSectionDiv);
      // var sendMessageDiv = document.createElement("div");
      // sendMessageDiv.appendChild(sendMessageInput);
      // sendMessageDiv.appendChild(messageSendButton);
      // messageSectionDiv.appendChild(sendMessageDiv);
      var messageSectionDiv = document.getElementsByClassName("input-section")[0];



      //Send Photo from User to Operator
      var photoSendDiv = document.createElement("div");
      photoSendDiv.setAttribute("style", "display:flex; align-items:center; justify-content:center;");
      photoSendDiv.setAttribute("class", "photoSendDiv");
      var fileInput = document.createElement("input");
      var photoIcon = document.createElement("i");
      photoIcon.setAttribute("class", "fa-solid fa-image");
      photoIcon.setAttribute("style", "font-size:25px;")
      var photoLabel = document.createElement("label");
      var sendPhotoButton = document.createElement("button");



      fileInput.setAttribute("id", "fileInput");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("accept", "image/*");
      fileInput.setAttribute("style", "visibility:hidden;width:20%;");
      photoLabel.setAttribute("for", "fileInput");
      photoLabel.append(photoIcon)
      sendPhotoButton.setAttribute("id", "sendImageButton");
      sendPhotoButton.setAttribute("style", "background-color: #4eac6d;border:none; color: white;");
      var sendIcon = document.createElement("i");
      sendIcon.setAttribute("class", "fa-solid fa-paper-plane");
      sendIcon.setAttribute("style", "font-size:25px;");
      sendPhotoButton.append(sendIcon);

      photoSendDiv.append(photoLabel);
      photoSendDiv.append(fileInput);
      photoSendDiv.append(sendPhotoButton);

      messageSectionDiv.append(photoSendDiv);

      // var fileInput = document.getElementById("fileInput");
      // fileInput.removeAttribute("hidden");
      // var sendPhotoButton = document.getElementById("sendImageButton");
      // sendPhotoButton.removeAttribute("hidden");

      $("#sendImageButton")
        .off("click")
        .click(function () {
          var photo = $("#fileInput")[0].files[0];
          var formDataPhoto = new FormData();
          formDataPhoto.append("UserId", localStorage.getItem("UserId"));
          formDataPhoto.append(
            "OperatorId",
            document.getElementById("connectedOperatorDbId").textContent
          );
          formDataPhoto.append("Photo", photo);
          formDataPhoto.append("SendByUser", true);
          formDataPhoto.append("SendDate", new Date().toISOString());
          formDataPhoto.append("UserName", userName);



          $.ajax({
            url: "https://localhost:7090/api/home/sendimage",
            type: "POST",
            data: formDataPhoto,
            contentType: false,
            processData: false,
            success: function (data) {
              // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
              var imgElement = document.createElement("img");
              $(imgElement).attr(
                "style",
                "width: 200px; height: 200px;"
              );
              imgElement.src = URL.createObjectURL(photo); // Fotoğrafın URL'sini ayarla
              var PhotoDiv = document.createElement("div");
              PhotoDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top: 10px")
              var PhotoInnerDiv = document.createElement("div");
              PhotoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;");
              PhotoInnerDiv.appendChild(imgElement);
              PhotoDiv.appendChild(PhotoInnerDiv);

              // <img> elementini listOfMessagesDiv'e ekle
              if (photo != null) {
                document
                  .getElementById("listOfMessages")
                  .appendChild(PhotoDiv);
              }

              // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
              var listOfMessagesDiv =
                document.getElementById("listOfMessages");
              listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;

              $(document).ready(function () {
                $("#listOfMessages").off('click').on("click", "img", function () {
                  var imageUrl = $(this).attr("src");
                  showImageModalUser(imageUrl);
                  
                });
              });


              if (photo != null) {
                connection.invoke(
                  "SendImageToUser",
                  localStorage.getItem("UserId"),
                  document.getElementById("connectedOperatorId").textContent
                );
              }
              // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
            },
            error: function (xhr, status, error) {
              console.error("Error:", xhr.responseText);
              // Hata durumunda kullanıcıya bilgi verebilirsin
            },
          });
        });

      //Send video from User to Operator

      var videoSendDiv = document.createElement("div");
      videoSendDiv.setAttribute("style", "display:flex; align-items:center; justify-content:center;");
      videoSendDiv.setAttribute("class", "photoSendDiv marginVideoSendDiv");
      var fileInputVideo = document.createElement("input");
      var sendVideoButton = document.createElement("button");
      var videoLabel = document.createElement("label");
      var videoIcon = document.createElement("i");
      var sendVideoIcon = document.createElement("i");
      sendVideoIcon.setAttribute("class", "fa-solid fa-paper-plane");
      sendVideoIcon.setAttribute("style", "font-size:25px;")
      fileInputVideo.setAttribute("id", "fileInputVideo");
      fileInputVideo.setAttribute("type", "file");
      fileInputVideo.setAttribute("accept", "video/*");
      fileInputVideo.setAttribute("style", "visibility:hidden;width:20%;")
      sendVideoButton.setAttribute("id", "sendVideoButton");
      sendVideoButton.setAttribute("style", "background-color: #4eac6d; border:none; color: white;")
      // sendVideoButton.innerHTML = "send Video";

      videoLabel.setAttribute("for", "fileInputVideo");
      videoIcon.setAttribute("class", "fa-solid fa-video");
      videoIcon.setAttribute("style", "font-size:25px;")

      videoLabel.append(videoIcon);
      sendVideoButton.append(sendVideoIcon);
      videoSendDiv.appendChild(videoLabel);
      videoSendDiv.appendChild(fileInputVideo);
      videoSendDiv.appendChild(sendVideoButton);
      messageSectionDiv.appendChild(videoSendDiv);

      // var fileInput = document.getElementById("fileInputVideo");
      // fileInput.removeAttribute("hidden");
      // var sendPhotoButton = document.getElementById("sendVideoButton");
      // sendPhotoButton.removeAttribute("hidden");

      $("#sendVideoButton")
        .off("click")
        .click(function () {
          var video = $("#fileInputVideo")[0].files[0];
          var formDataVideo = new FormData();
          formDataVideo.append("UserId", localStorage.getItem("UserId"));
          formDataVideo.append(
            "OperatorId",
            document.getElementById("connectedOperatorDbId").textContent
          );
          formDataVideo.append("Video", video);
          formDataVideo.append("SendByUser", true);
          formDataVideo.append("SendDate", new Date().toISOString());
          formDataVideo.append("UserName", userName);

          for (var pair of formDataVideo.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }

          $.ajax({
            url: "https://localhost:7090/api/home/sendvideo",
            type: "POST",
            data: formDataVideo,
            contentType: false,
            processData: false,
            success: function (data) {
              // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
              var videoElement = document.createElement("video");
              videoElement.setAttribute("style", "width:100%;height:100%;");
              videoElement.src = URL.createObjectURL(video); // Fotoğrafın URL'sini ayarla
              videoElement.controls = true; // Kontrolleri göstermek için
              videoElement.preload = "auto"; // Otomatik olarak yükle

              var VideoDiv = document.createElement("div");
              VideoDiv.setAttribute("style", "display:flex; justify-content: flex-end; margin-top: 10px");
              var VideoInnerDiv = document.createElement("div");
              VideoInnerDiv.setAttribute("style", "width: 200px; height:200px;display: flex;align-items: center;justify-content: center;border: 3px solid #4eac6d;");
              VideoInnerDiv.appendChild(videoElement);
              VideoDiv.appendChild(VideoInnerDiv);

              // <img> elementini listOfMessagesDiv'e ekle
              if (video != null) {
                document
                  .getElementById("listOfMessages")
                  .appendChild(VideoDiv);
              }

              // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
              var listOfMessagesDiv =
                document.getElementById("listOfMessages");
              listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
              if (video != null) {
                connection.invoke(
                  "SendVideoToUser",
                  localStorage.getItem("UserId"),
                  document.getElementById("connectedOperatorId").textContent
                );
              }
              // Başarılıysa gerekli işlemleri yapabilirsin, örneğin bir yönlendirme
            },
            error: function (xhr, status, error) {
              console.error("Error:", xhr.responseText);
              // Hata durumunda kullanıcıya bilgi verebilirsin
            },
          });
        });

      //Send Audio from User To Operator
      var sendAudioDiv = document.createElement("div");
      sendAudioDiv.setAttribute("class", "photoSendDiv marginVideoSendDiv");
      sendAudioDiv.setAttribute("style", "display:flex; align-items:center; justify-content:space-around;");

      var startRecordingBtn = document.createElement("button");
      var startIcon = document.createElement("i");
      startIcon.setAttribute("class", "fa-solid fa-microphone");
      startIcon.setAttribute("style", "font-size: 25px");
      startRecordingBtn.append(startIcon);

      var audioPlayer = document.createElement("audio");
      var sendAudioButton = document.createElement("button");
      var sendAudioIcon = document.createElement("i");
      sendAudioIcon.setAttribute("class", "fa-solid fa-paper-plane");
      sendAudioIcon.setAttribute("style", "font-size:25px; margin-right:5px");
      sendAudioButton.append(sendAudioIcon);
      startRecordingBtn.setAttribute("id", "startRecording");
      startRecordingBtn.setAttribute("style", "background-color: #4eac6d; border:none; color: white; margin-left:7px;")

      audioPlayer.setAttribute("id", "audioPlayer");
      audioPlayer.setAttribute("controls", "true");
      audioPlayer.setAttribute("style", "display: none");
      sendAudioButton.setAttribute("id", "sendAudioButton");
      sendAudioButton.setAttribute("style", "background-color: #4eac6d; border:none; color: white;");
      sendAudioDiv.appendChild(startRecordingBtn);
      sendAudioDiv.appendChild(audioPlayer);
      sendAudioDiv.appendChild(sendAudioButton);
      messageSectionDiv.appendChild(sendAudioDiv);
      messageSectionDiv.appendChild(plusIconDiv);

      messageSectionDiv.append(popUpDiv);
      popUpDiv.append(photoSendDiv);
      popUpDiv.append(videoSendDiv);
      popUpDiv.append(sendAudioDiv);

      // document.getElementById("startRecording").removeAttribute("hidden");
      // document.getElementById("stopRecording").removeAttribute("hidden");
      // document.getElementById("audioPlayer").removeAttribute("hidden");
      // document.getElementById("sendAudioButton").removeAttribute("hidden");
      // const startRecordingBtn = document.getElementById("startRecording");
      // const stopRecordingBtn = document.getElementById("stopRecording");
      // const audioPlayer = document.getElementById("audioPlayer");
      let mediaRecorder;
      let audioChunks = [];

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = () => {
            var audioBlob = new Blob(audioChunks, {
              type: "audio/wav",
            }); // Change the type as needed
            // audioChunks = [];
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
          };
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });

      let isRecording = false;

      function toggleRecording() {
        if (isRecording == false) {
          startIcon.setAttribute("class", "fa-solid fa-stop");
          audioChunks = [];
          mediaRecorder.start();
          isRecording = true;
        } else {
          startIcon.setAttribute("class", "fa-solid fa-microphone");
          mediaRecorder.stop();
          isRecording = false;
        }
      }

      startRecordingBtn.addEventListener("click", toggleRecording);

      $("#sendAudioButton")
        .off("click")
        .click(function () {
          // Eğer hiç ses kaydı alınmamışsa ve kayıt yapılmıyorsa işlem yapma
          if (audioChunks.length === 0 && !isRecording) {
            alert("No audio recorded.");
            return;
          }

          console.log(audioChunks.length);

          var formDataAudio = new FormData();
          formDataAudio.append("UserId", localStorage.getItem("UserId"));
          formDataAudio.append(
            "OperatorId",
            document.getElementById("connectedOperatorDbId").textContent
          );
          var audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          formDataAudio.append("Audio", audioBlob);
          formDataAudio.append("SendByUser", true);
          formDataAudio.append("SendDate", new Date().toISOString());
          formDataAudio.append("UserName", userName);

          for (var pair of formDataAudio.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }

          $.ajax({
            url: "https://localhost:7090/api/home/sendaudio",
            type: "POST",
            data: formDataAudio,
            contentType: false,
            processData: false,
            success: function (data) {
              // Başarılıysa, sesi çalmak için bir <audio> elementi oluştur
              var audioElement = document.createElement("audio");

              // Sesin URL'sini base64 kodlaması ile oluştur
              var reader = new FileReader();
              reader.onloadend = function () {
                audioElement.src = reader.result;
              };
              reader.readAsDataURL(audioBlob);

              audioElement.controls = true; // Kontrolleri göstermek için
              audioElement.preload = "auto"; // Otomatik olarak yükle

              var AudioDiv = document.createElement("div");
              AudioDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top: 10px");
              var AudioInnerDiv = document.createElement("div");
              AudioInnerDiv.appendChild(audioElement);
              AudioDiv.appendChild(AudioInnerDiv);

              // <audio> elementini listOfMessagesDiv'e ekle
              if (audioChunks.length != 0) {
                document
                  .getElementById("listOfMessages")
                  .appendChild(AudioDiv);
              }

              // Scroll'u en aşağı kaydır, böylece yeni eklenen ses görünür olur
              var listOfMessagesDiv =
                document.getElementById("listOfMessages");
              listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;
              if (audioChunks.length != 0) {
                connection.invoke(
                  "SendAudioToUser",
                  localStorage.getItem("UserId"),
                  document.getElementById("connectedOperatorId").textContent
                );
              }
              audioChunks = [];
              audioBlob = null;
            },
            error: function (xhr, status, error) {
              console.error("Error:", xhr.responseText);
              // Hata durumunda kullanıcıya bilgi verebilirsin
            },
          });
        });


      document
        .getElementById("sendButton")
        .addEventListener("click", function (event) {
          var userMessage = document.getElementById("userMessageInput").value;
          var messageDiv = document.createElement("div");
          messageDiv.setAttribute("id", "messageDiv")
          var messageInnerDiv = document.createElement("div");
          messageInnerDiv.innerHTML = userMessage;
          // messageInnerDiv.setAttribute("style", "padding: 10px; border-radius: 20px; background-color: rgb(192,192,192)");

          // messageDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top: 10px")
          messageInnerDiv.classList.add("message");
          messageInnerDiv.classList.add("sent");
          messageDiv.appendChild(messageInnerDiv);
          document.getElementById("listOfMessages").appendChild(messageDiv);
          document.getElementById("userMessageInput").value = "";
          connection.invoke(
            "SendMessageToOperator",
            document.getElementById("connectedOperatorId").textContent,
            userMessage,
            userName,
            userid,
            document.getElementById("connectedOperatorDbId").textContent,
            userName,
            document.getElementById("connectedOperatorName").textContent
          );


        });

        
    }

    if (userStatus == 2) {
      //  Eger operator sorgunu qebul eden deyilse onda sorgu gonderen userin sorgu butonunun hemin operatordan silinmesi
      var userListDiv = document.getElementById("userList");
      var userDivs = userListDiv.getElementsByTagName("div");
      for (var i = 0; i < userDivs.length; i++) {
        var userDiv = userDivs[i];
        var userNameLabel = userDiv.querySelector("label");
        console.log(username);
        if (
          userNameLabel &&
          userNameLabel.textContent.split(" ").join("") == username
        ) {
          userListDiv.removeChild(userDiv);
        }
      }
    }
    if (operatorId == userid) {
      var userListDiv = document.getElementById("userList");
      while (userListDiv.firstChild) {
        userListDiv.removeChild(userListDiv.firstChild);
      }
      var userDiv = document.createElement("div");
      userDiv.setAttribute("class", "btn btn-primary");
      var userNameLabel = document.createElement("label");
      userNameLabel.textContent = document
        .getElementById("connectedUserName")
        .textContent.split(/(?=[A-Z])/)
        .join(" ");
      var acceptButton = document.createElement("button");
      acceptButton.setAttribute("class", "fa-solid fa-xmark");
      acceptButton.setAttribute("style", "margin-left:20px;border-radius:50%;border:none;width:20px;height:20px");
      acceptButton.setAttribute("id", "endConversation");
      acceptButton.setAttribute("value", "End");
      acceptButton.addEventListener("click", function (event) {
        while (document.getElementById("chatSectionWelcome").firstChild) {
          document
            .getElementById("chatSectionWelcome")
            .removeChild(
              document.getElementById("chatSectionWelcome").firstChild
            );
        }
        userListDiv.removeChild(userDiv);
        connection.invoke(
          "EndConnectionOperator",
          document.getElementById("connectedUserDbId").textContent,
          localStorage.getItem("UserId"),
          localStorage.getItem("PlantName"),
          document.getElementById("connectedUserId").textContent
        );
        document.getElementById("connectedUserName").textContent = "";
        document.getElementById("connectedUserId").textContent = "";
        document.getElementById("connectionType").textContent = "Idle";
        document.getElementById("connectedUserDbId").textContent = "";
        location.reload();
      });
      userDiv.appendChild(userNameLabel);
      userDiv.appendChild(acceptButton);
      userListDiv.appendChild(userDiv);

      
    }
  }
);

connection.on("EndConversationOperator", function(){
  while (document.getElementById("chatSectionWelcome").firstChild) {
    document
      .getElementById("chatSectionWelcome")
      .removeChild(
        document.getElementById("chatSectionWelcome").firstChild
      );
  }

  document.getElementById("connectedUserName").textContent = "";
  document.getElementById("connectedUserId").textContent = "";
  document.getElementById("connectionType").textContent = "Idle";
  document.getElementById("connectedUserDbId").textContent = "";
  location.reload();
});

connection.on(
  "ReceiveMessageOperator",
  function (message, username, userId, operatorDbId) {
    var userid = localStorage.getItem("UserId");
    var userName =
      localStorage.getItem("UserName") + localStorage.getItem("UserSurname");
    var userStatus = localStorage.getItem("UserStatus");
    if (userStatus == 2) {
      if (document.getElementById("connectedUserDbId").textContent == userId) {

        const alertSound = new Audio('chat-sound (1).mp3');
        alertSound.play();
        //  Operatorun elaqeli oldugu userden mesaji qebul etmesi (accept etdikden sonra)
        var messageDiv = document.createElement("div");
        messageDiv.setAttribute("id", "mesaj2")
        // messageDiv.setAttribute("style", "display: flex; justify-content: flex-start; margin-top:10px");
        var messageInnerDiv = document.createElement("div");
        messageInnerDiv.setAttribute("class", "message received")
        // messageInnerDiv.setAttribute("style", "padding: 10px; border-radius: 20px; background-color: rgb(192,192,192)")
        messageInnerDiv.innerHTML = message;

        messageDiv.appendChild(messageInnerDiv);
        document.getElementById("listOfMessages").appendChild(messageDiv);
      }
    }
  }
);

connection.start();

// Modal ile ilk mesaj gonderme
if (document.getElementById("addChatUser") != null) {
  $("#addChatUser")
    .off("click")
    .click((event) => {
      $("#sendUserMessage")
        .off("click")
        .click(async function (event2) {

          $("#addChat-exampleModal").modal("hide");
          document.getElementById("addChatUser").disabled = true;

          $("#Welcome").remove();
          var userId = localStorage.getItem("UserId");
          var userName =
            localStorage.getItem("UserName") +
            localStorage.getItem("UserSurname");
          var userStatus = localStorage.getItem("UserStatus");
          var groupElement = document.getElementById("bitkiSelect");
          var groupValue =
            groupElement.options[groupElement.selectedIndex].innerText;
          var plantName = groupValue;
          var message = document.getElementById("userMessage").value;
          var listOfMessagesDiv = document.createElement("div");

          var connectedOperatorInfoDiv = document.createElement("div");
          var waitingMessageText = document.createElement("p");
          waitingMessageText.innerText = "Operator axtarılır, zəhmət olmasa gözləyin...";
          waitingMessageText.setAttribute("style", "margin-top:0px;margin-bottom:0px;color:white;font-size:18px;margin-left: 10px;");
          connectedOperatorInfoDiv.setAttribute("id", "connectedOperatorInfo");
          connectedOperatorInfoDiv.setAttribute("class", "info");
          connectedOperatorInfoDiv.append(waitingMessageText);
          document.getElementById("listOfOldMessages").remove();

          listOfMessagesDiv.classList.add("messages");
          listOfMessagesDiv.setAttribute("id", "listOfMessages");
          var messageSectionDiv = document.createElement("div");

          messageSectionDiv.classList.add("input-section");
          var sendMessageInput = document.createElement("input");
          sendMessageInput.setAttribute("id", "userMessageInput");
          sendMessageInput.setAttribute("placeholder", "  Mesaj yazın...");
          sendMessageInput.classList.add("message-input");
          var messageSendButton = document.createElement("input");
          messageSendButton.setAttribute("id", "sendButton");
          messageSendButton.setAttribute("value", "Send");
          messageSendButton.setAttribute("type", "submit");
          messageSendButton.setAttribute("class", "message-send-button");
          var messageDiv = document.createElement("div");
          var messageInnerDiv = document.createElement("div");
          messageInnerDiv.setAttribute("class", "sent message")
          // messageInnerDiv.setAttribute("style", "padding: 10px; border-radius: 20px; background-color: rgb(192,192,192)")
          messageDiv.setAttribute("id", "messageDiv");
          messageInnerDiv.innerHTML = message;
          messageDiv.appendChild(messageInnerDiv);
          listOfMessagesDiv.appendChild(messageDiv);
          document.getElementById("chatSectionWelcome").appendChild(connectedOperatorInfoDiv);
          document.getElementById("chatSectionWelcome").appendChild(listOfMessagesDiv);
          document.getElementById("chatSectionWelcome").appendChild(messageSectionDiv);
          messageSectionDiv.appendChild(sendMessageInput);
          messageSectionDiv.appendChild(messageSendButton);

          
          var photo = $("#fileInputForFirst")[0].files[0];
          var video = $("#fileInputForFirstVideo")[0].files[0];
          console.log(photo);
          var firstFormData = new FormData();
          firstFormData.append("UserId", localStorage.getItem("UserId"));
          firstFormData.append("Photo", photo);
          firstFormData.append("Video", video);
          firstFormData.append("SendDate", new Date().toISOString());
          console.log(firstFormData);

          var isSendPhoto = false;
          if (photo != null) {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url: "https://localhost:7090/api/home/sendfirstimage",
                type: "POST",
                data: firstFormData,
                contentType: false,
                processData: false,
                success: function (data) {
                  // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
                  var imgElement = document.createElement("img");
                  $(imgElement).attr(
                    "style",
                    "width: 200px; height: 200px;"
                  );
                  console.log("Burdayam")
                  imgElement.src = URL.createObjectURL(photo); // Fotoğrafın URL'sini ayarla
                  var PhotoDiv = document.createElement("div");
                  PhotoDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top: 10px")
                  var PhotoInnerDiv = document.createElement("div");
                  PhotoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;");
                  PhotoInnerDiv.appendChild(imgElement);
                  PhotoDiv.appendChild(PhotoInnerDiv);


                  // <img> elementini listOfMessagesDiv'e ekle
                  if (photo != null) {
                    isSendPhoto = true;
                    document
                      .getElementById("listOfMessages")
                      .appendChild(PhotoDiv);
                  }

                  // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
                  var listOfMessagesDiv =
                    document.getElementById("listOfMessages");
                  listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;


                  resolve();
                },
                error: function (xhr, status, error) {
                  console.error("Error:", xhr.responseText);
                  // Hata durumunda kullanıcıya bilgi verebilirsin
                },
              });
            });
          }

          var isSendVideo = false;
          if (video != null) {
            const response = await new Promise((resolve, reject) => {
              $.ajax({
                url: "https://localhost:7090/api/home/sendfirstvideo",
                type: "POST",
                data: firstFormData,
                contentType: false,
                processData: false,
                success: function (data) {
                  console.log("salam");
                  // Başarılıysa, fotoğrafı görüntülemek için bir <img> elementi oluştur
                  var videoElement = document.createElement("video");
                  $(videoElement).attr(
                    "style",
                    "width: 200px; height: 200px;"
                  );
                  console.log("Burdayam")
                  videoElement.src = URL.createObjectURL(video); // Fotoğrafın URL'sini ayarla
                  videoElement.controls = true; // Kontrolleri göstermek için
                  videoElement.preload = "auto"; // Otomatik olarak yükle

                  var VideoDiv = document.createElement("div");
                  VideoDiv.setAttribute("style", "display: flex; justify-content: flex-end; margin-top: 10px")
                  var VideoInnerDiv = document.createElement("div");
                  VideoInnerDiv.setAttribute("style", "border: 3px solid #4eac6d;");
                  VideoInnerDiv.appendChild(videoElement);
                  VideoDiv.appendChild(VideoInnerDiv);


                  // <video> elementini listOfMessagesDiv'e ekle
                  if (video != null) {
                    isSendVideo = true;
                    document
                      .getElementById("listOfMessages")
                      .appendChild(VideoDiv);
                  }

                  // Scroll'u en aşağı kaydır, böylece yeni eklenen fotoğraf görünür olur
                  var listOfMessagesDiv =
                    document.getElementById("listOfMessages");
                  listOfMessagesDiv.scrollTop = listOfMessagesDiv.scrollHeight;


                  resolve();
                },
                error: function (xhr, status, error) {
                  console.error("Error:", xhr.responseText);
                  // Hata durumunda kullanıcıya bilgi verebilirsin
                },
              });
            });
          }




          messageSendButton.disabled = true;
          connection.invoke(
            "SendMessageToOperators",
            message,
            userName,
            plantName,
            userId,
            isSendPhoto,
            isSendVideo
          );
          event2.preventDefault();
        });
      event.preventDefault();
    });
}
