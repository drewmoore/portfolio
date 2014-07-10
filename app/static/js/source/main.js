(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('.scroll-panel').on('mouseover', mouseOnMenu);
  }

  function mouseOnMenu(event) {
    var mouseY = event.pageY;
    var $container = $(this);
    var containerHeight = parseInt(($container.css('height').split('p')[0]));
    var borderWidth = parseInt(($container.css('border').split('p')[0]));
    var containerTop = $container.offset().top;
    var containerBottom = containerTop + containerHeight;
    var displayTop = containerTop + borderWidth;
    var displayBottom = containerTop + containerHeight - borderWidth;
    var displayHeight = displayBottom - displayTop;
    var scrollZoneHeight = containerHeight / 4;
    var mouseDiffTop = Math.abs(containerTop - mouseY);
    var mouseDiffBottom = Math.abs(containerBottom - mouseY);
    var $scrollMenu = $($('.scroll-menu')[0]);
    var scrollMenuHeight = parseInt(($scrollMenu.css('height').split('p')[0]));
    var menuElementsCount = $('.scroll-menu > ul > li').children().length;
    var scrollInt = scrollMenuHeight / (menuElementsCount / 1.5);
    var scrollMenuTop = Math.abs(parseInt($scrollMenu.position().top));
    var amountToScroll;
    var scrollDiff;
    var scrollTopLimit = scrollMenuHeight - displayHeight;

    if((mouseDiffBottom <= scrollZoneHeight) && (scrollMenuTop < scrollTopLimit)) {
      scrollDiff = scrollTopLimit - scrollMenuTop;
      amountToScroll = scrollInt + scrollMenuTop;
      if(amountToScroll < scrollDiff) {
        $scrollMenu.css('top', '-' + amountToScroll +'px');
      } else {
        $scrollMenu.css('top', '-' + (scrollDiff + scrollMenuTop) +'px');
      }
    }
    if(mouseDiffTop <= scrollZoneHeight) {
      scrollDiff = scrollMenuTop - displayTop;
      amountToScroll = scrollMenuTop - scrollInt;
      if(amountToScroll > scrollDiff) {
        $scrollMenu.css('top', '-' + amountToScroll +'px');
      } else {
        $scrollMenu.css('top', '-' + (scrollMenuTop - scrollDiff) + 'px');
      }
    }
  }

})();

