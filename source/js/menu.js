var headerNav = document.querySelector('.header__nav');
var navToggle = document.querySelector('.header__menu-trigger');

headerNav.classList.remove('header__nav--nojs');

navToggle.addEventListener('click', function() {
  if (headerNav.classList.contains('header__nav--closed')) {
    headerNav.classList.remove('header__nav--closed');
    headerNav.classList.add('header__nav--expanded');
  } else {
    headerNav.classList.add('header__nav--closed');
    headerNav.classList.remove('header__nav--expanded');
  }
});

window.addEventListener("scroll", function() {
  if (window.pageYOffset > 1) {
    headerNav.classList.add("header__nav--sticky")
  } else {
    headerNav.classList.remove("header__nav--sticky");
  }
});
