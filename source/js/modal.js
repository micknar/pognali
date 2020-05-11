var ratesLink = document.querySelector(".rates__btn");
var ratesPopup = document.querySelector(".business-rates");
var ratesClose = ratesPopup.querySelector(".modal__close");

ratesLink.addEventListener("click", function (evt) {
  evt.preventDefault();
  ratesPopup.classList.add("modal--show");
});

ratesClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  ratesPopup.classList.remove("modal--show");
});
