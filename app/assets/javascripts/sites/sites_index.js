(function(){
  var top = $('.show_backups_link').eq(0).offset().top,
    bULL = $('.show_backups_link').eq(0).offset().left
  $('table').eq(0).css("top", `${top + 75}px`)
  $('.backup_links').eq(0).css("margin-left", `${bULL}px`)
})()

var backup = false

function showBackupLinks(){
  backup ?
    $('.backup_links').slideUp(400)
    : $('.backup_links').slideDown(400)
  backup = !backup
}
