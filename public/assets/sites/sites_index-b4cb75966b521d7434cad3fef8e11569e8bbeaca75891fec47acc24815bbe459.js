const bUL = $('.backup_links').eq(0),
  sBUL = $('.show_backups_link').eq(0),
  showBackupLinks = () => bUL.css("display") == "none" ? bUL.slideDown(200) : bUL.slideUp(200)

var t, l

(function(){
  t = sBUL.offset().top,
  l = sBUL.offset().left

  $('table').eq(0).css("top", `${t + 75}px`)
  bUL.css("margin-left", `${l}px`)
})()
;
