// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery3
//= require jquery_ujs
//= require turbolinks
function handleUrlPreview() {
  $('.site_mask').fadeIn(200)
}

(function(){
  $('.site_mask_x').on("click", function(){
    $(this).parents('.site_mask').fadeOut(200)
    $('.preview_site').html("")
    // $('.preview_failure').fadeOut(200)
    // $.get('/reset_site', function(){
    //   console.log("reset site")
    // })
  })
})()
