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


jQuery("button.toTop").on("click", function () {
  jQuery('body, html').animate({ scrollTop: 0 }, 1000); //1秒かけてトップへ戻る
  return false;
})

jQuery(".dropdown-ttl").on("click", function () {
  jQuery("dropdown-list").toggleClass("expanded");
})
