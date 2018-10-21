const bUL = $('.backup_links').eq(0),
  sBUL = $('.show_backups_link').eq(0),
  showBackupLinks = () => bUL.css("display") == "none" ? bUL.slideDown(400) : bUL.slideUp(400)

(function(){
  const  t = sBUL.offset().top,
    l = sBUL.offset().left,
    table = $('table').eq(0)
  table.css("top", `${t + 75}px`)
  bUL.css("margin-left", `${l}px`)
})()
;
