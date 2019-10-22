// DOMを全て読み込んでから処理する
jQuery(function () {
  var speed_toTop = 1000; // ms

  jQuery('.drawer-item a').on('click', function () {
    jQuery('#drawer-check').prop('checked', false);
  });

  jQuery('.drawer-toggler, .drawer-close').on('click', function () {
    jQuery('.drawer-toggler').toggleClass('m_checked');
    jQuery('.drawer-close').toggleClass('m_checked');
    jQuery('.drawer-contents').toggleClass('m_checked');
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


  // ********** panel
  jQuery(".panel-heading").on("click", function () {
    var $toggle = jQuery(this);
    var target = jQuery(this).data("target");
    if ($toggle.hasClass("expanded")) {
      $toggle.removeClass("expanded");
      jQuery('#' + target).slideUp();
    } else {
      jQuery(".panel-heading").removeClass("expanded");
      jQuery(".panel-collapse").slideUp();
      jQuery('#' + target).slideToggle();
      $toggle.toggleClass("expanded");
    }
    return false;
  });

  // *********** data-toggle="collapse"をもつ要素にaria-expanded属性を加える
  jQuery("[data-toggle='collapse']").on("click", function () {
    jQuery(this).attr("aria-expanded", function (i, attr) {
      return attr == 'true' ? 'false' : 'true';
    });
  });


  //　********* aria属性追加
  jQuery("i").attr("aria-hidden", "true"); // fontawesome icon
  jQuery("[data-toggle='collapse']").attr("aria-expanded", "false");


  // *********** ページ内リンク　使わないならコメントアウト
  // jQuery(".").on("click", function () {
  //   var contactPadding = 40;
  //   var targetTop = jQuery("#").offset().top;
  //   jQuery("html,body").animate({
  //     scrollTop: targetTop - contactPadding
  //   }, 500);
  //   return false;
  // });
});
