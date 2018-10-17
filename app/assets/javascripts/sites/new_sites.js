var updatedSiteRow,
  warning = null,
  warningTimeout
  
function updateSite(id, i) {
  let tr = $('tbody tr').eq(i),
    author = tr.find('td input[name=author]').eq(0).val(),
    url = tr.find('td input[name=url]').eq(0).val(),
    css = tr.find('td input[name=css]').eq(0).val(),
    data = {
      id: id,
      author: author,
      url: url,
      css: css,
      new: 0,
      i: i
    }
  if (tr.hasClass('filled')) {
    $.post(`/update_new_site`, data)
  } else {
    tr.find('td.warning').fadeIn(200).delay(4000).fadeOut(400)
  }

}

function checkInputs(tr) {
  let els = tr.find('td input[type=text]'),
    empty = false
    // submit = tr.find('td input[type=submit]').eq(0)

  for (var item of els)
    if (item.value.length < 1) empty = true

  if (empty) {
    tr.removeClass('filled')
    // submit.prop("disabled", true)
  } else {
    // let author = tr.find('td input[name=author]').eq(0).val(),
    //   url = tr.find('td input[name=url]').eq(0).val(),
    //   css = tr.find('td input[name=css]').eq(0).val(),
    //   params = [['updateUrl', url], ['updateCss', css], ['updateAuthor', author]]
    //
    // for(let i=0; i<params.length; i++)
    //   tr.find(`input[type=hidden][name=${params[i][0]}]`).val(params[i][1])

    tr.addClass('filled')
    // submit.prop("disabled", false)
  }
}



var allChecked = true,
  checkboxes = $('input[type=checkbox]'),
  textInputs = $('input[type=text]')

function toggleAllCheckboxes() {
  checkboxes.prop('checked', !allChecked)
  allChecked = !allChecked
  checkboxes.each(function(i){
    handleCheckboxChange(checkboxes.eq(i))
    checkInputs(checkboxes.eq(i).parents('tr'))
  })
}

function handleCheckboxChange(chbx) {
  var tr = chbx.parents('tr')
  if (chbx.is(":checked")) {
    checkInputs(tr)
    tr.removeClass('deselected')
  } else {
    tr.addClass('deselected')
  }
}

(function(){
  checkboxes.each(function(i){
    var $that = $(this)
    $(this).parents('td').on("click", function(e){
      $that.prop("checked", !$that.prop("checked"))
      handleCheckboxChange($that)
    })
  })

  textInputs.each(function(i){
    var $that = $(this)
    $(this).on("keyup", function(){
      let tr = textInputs.eq(i).parents('tr')
      checkInputs(tr)
    })
  })

  $('input[name=submit_checkbox]').on("change", function(){
    $('input[name=commit]').eq(0).prop('disabled', !$(this).prop("checked"))
  })

  $(".url").each(function(i){
    var $that = $(this),
      sibling = $that.siblings('.url_open_frame'),
      inTimeout,
      outTimeout

    $(this).mouseenter(function() {
      console.log($that, $that.offset().top)
      inTimeout = setTimeout(function(){
        if (jQuery(':hover').filter($that).length > 0)
          sibling.fadeIn(200)
      }, 300)
      clearTimeout(outTimeout)

    }).mouseleave(function() {
      clearTimeout(outTimeout)
      clearTimeout(inTimeout)
      outTimeout = setTimeout(function(){
        if (jQuery(':hover').filter(sibling).length===0)
          sibling.fadeOut(200)
      }, 1000)
    })

    sibling.mouseleave(function() {
      clearTimeout(outTimeout)
      outTimeout = setTimeout(function(){
        if (jQuery(':hover').filter(sibling).length===0)
          sibling.fadeOut(200)
      }, 1000)
    })

    $('.url_open_frame').eq(i).css("top", `${$that.offset().top - 5}px`)
  })


})()
