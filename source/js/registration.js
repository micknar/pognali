var regForm = document.querySelector(".registration__form");

if (regForm) {
  var regEmail = regForm.querySelector(".registration__email");

  regForm.addEventListener("submit", function (evt) {
    if (!regEmail.value) {
      evt.preventDefault();
      regEmail.classList.add("registration__email--error");
    }
  });

  regEmail.addEventListener("focus", function() {
    regEmail.classList.remove("registration__email--error");
  });
}
