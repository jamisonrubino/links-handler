function showBackupLinks() {
  let links = $('.sites_backup_link')
  links.css("display") == "none" ? links.show(400) : links.hide(400)
}

var offset = document.getElementsByClassName('show_backups_link')[0].getBoundingClientRect(),
  table,
  bL

(function(){
  table = $('.sites_table')
  bL = $('.backup_links')
  bL.css("margin-left", `${offset.left}px`)
  table.css("top", `${offset.top + 60}px`)
})()
;
