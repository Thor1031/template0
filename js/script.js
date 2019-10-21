var speed_toTop = 1000; // ms

jQuery('.drawer-item a').on('click', function () {
  jQuery('#drawer-check').prop('checked', false);
});

jQuery('.drawer-toggler, .drawer-close').on('click', function () {
  jQuery('.drawer-toggler').toggleClass('m_checked');
  jQuery('.drawer-close').toggleClass('m_checked');
  jQuery('.drawer-contents').toggleClass('m_checked');
  jQuery(".drawer-toggler").attr("aria-expanded", function (i, attr) {
    return attr == 'true' ? 'false' : 'true'
  });
});

// ********** toTop button
jQuery("button.toTop").on("click", function () {
  jQuery('body, html').animate({ scrollTop: 0 }, speed_toTop);
  return false;
});
var controller = new ScrollMagic.Controller();
var scene = new ScrollMagic.Scene({
  offset: 50,
  triggerElement: "body",
  triggerHook: "onLeave",
})
  .setClassToggle(".float", "reveal")
  // .addIndicators()
  .addTo(controller);


// ********** dropdown
jQuery(".drop-ttl").on("click", function () {
  if (jQuery(this).hasClass("expanded")) {
    jQuery(this).removeClass("expanded");
    jQuery(this).next(".drop-conts").slideUp();
  } else {
    jQuery(".drop-ttl").removeClass("expanded");
    jQuery(".drop-conts").slideUp();
    jQuery(this).next(".drop-conts").slideToggle();
    jQuery(this).toggleClass("expanded");
  }
  return false;
});

// *********** ページ内リンク
jQuery(".").on("click", function () {
  var contactPadding = 40;
  var targetTop = jQuery("#").offset().top;
  jQuery("html,body").animate({
    scrollTop: targetTop - contactPadding
  }, 500);
  return false;
});