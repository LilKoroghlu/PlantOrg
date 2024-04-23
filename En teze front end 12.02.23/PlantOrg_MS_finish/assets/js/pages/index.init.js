document.querySelectorAll(".theme-img , .theme-color").forEach(function (item) {
  item.addEventListener("click", function (event) {
    // choose theme color
    var colorRadioElements = document.querySelector("input[name=bgcolor-radio]:checked");
    if (colorRadioElements) {
      colorRadioElements = colorRadioElements.id;
      var elementsColor = document.getElementsByClassName(colorRadioElements);
      if (elementsColor) {
        var color = window.getComputedStyle(elementsColor[0], null).getPropertyValue("background-color");
        var userChatOverlay = document.querySelector(".user-chat-overlay");
        userChatOverlay.style.background = color;
        rgbColor = color.substring(
          color.indexOf("(") + 1,
          color.indexOf(")")
        );
        document.documentElement.style.setProperty(
          "--bs-primary-rgb",
          rgbColor
        );
      }
    }
    // choose theme image
    var imageRadioElements = document.querySelector(
      "input[name=bgimg-radio]:checked"
    );
    if (imageRadioElements) {
      imageRadioElements = imageRadioElements.id;
      var elementsImage = document.getElementsByClassName(imageRadioElements);
      if (elementsColor) {
        var image = window.getComputedStyle(elementsImage[0], null).getPropertyValue("background-image");
        var userChat = document.querySelector(".user-chat");
        userChat.style.backgroundImage = image;
      }
    }
  });
});