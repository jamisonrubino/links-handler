
var linkCount = $('.link').length,
  titleCount = new Array(linkCount),
  flagData = []

function handleFlag(i, len, author = null, link = null) {
  let author = (author || link.find('input[name=author]').eq(0).val()),
    title = link.find('input[name=title]').eq(0).val(),
    len = author.length + title.length,
    flag = $('input[type=checkbox].flagged').eq(i)

  flagData[i] = (flagData[i] || {})
  let data = flagData[i]

  if (len > 74) {
    data.message = "Too long."
    data.color = "#ef8"
    if (title === "manual")
      data.message = " Manual entry."
  } else if (author === "manual") {
    data.message = "Manual entry."
    data.color = "#f75"
  } else {
    data.message = null
    data.color = "#4ea"
  }

  if (data.message) {
    flag.prop("checked", true)
  } else {
    flagData[i] = data
    flag.prop("checked", false)
  }
}

$('.link').each(input=>{
  var $that = $(this)
  $(this).children('input[type=text]').on("change", function(i){
    var author = $that.find('.author-input').eq(0).val(),
      title = $that.find('.title-input').eq(0).val(),
      len = author.length + title.length
    handleFlag(i, len, author, $that)
  })
})
