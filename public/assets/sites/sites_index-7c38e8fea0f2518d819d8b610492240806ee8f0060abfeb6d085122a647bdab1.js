(function(){
  var top = $('.show_backups_link').eq(0).offset(),
    backup = false
  $('table').eq(0).css("top", `${top + 50}px`)

  function showBackupLinks(){
    backup ?
      $('.sites_backup_link').slideDown(400)
      : $('.sites_backup_link').slideUp(400)
    backup = !backup
  }
})()
;
