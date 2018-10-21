var linkCount = $('.link').length,
  titleCount = new Array(linkCount),
  flaggedSpan = $("span.flaggedspan"),
  flaggedMsg = $("span.flaggedmessage"),
  flagObj = []

function flag(index) {
  flaggedSpan.eq(index).find("input").is(":checked") ?
    $("span.link").eq(index).addClass("flagged") :
    $("span.link").eq(index).removeClass("flagged")
}

function handleFlag(i, len, author = null, link = null) {
  console.log("handleFlag started")

  let flag = $('input[type=checkbox].flagged').eq(i),
    messages = [],
    cL = [],
    allWords = [],
    authorLength

  link = (link || $('.link').eq(i))
  $('.link').eq(i).find('.title-word').map(w=>wordsArr.push(w.text()))

  // array of title anchors
  // array of deleted anchors
  // length of a - b

  if (!author) authorLength = $('.link').eq(i).find('.author > b').val().length
  else authorLength = author.length

  for (let j=0; j<l.length; j++)
    wordsArr.push(l.eq(j).text().length)
  var count = wordsArr.reduce((acc, curr)=>acc + curr) - newLink.length
  author = (author || link.find('input[name=author]').eq(0).val())

  flagObj[i] = flagObj[i] || {author: aLen, title: len}

  if (len > 74) {
    messages.push("Too long.")
    cL.push("length")
  }
  if (author === "manual") {
    messages.push("Manual entry.")
    cL.push("manual")
  }

  if (cL.length > 0) {
    flag.prop("checked", true)
    flaggedSpan.addClass(cL.join(" "))
    flaggedMsg.text(messages.join(" "))
  } else {
    flag.prop("checked", false)
    flaggedSpan.removeClass(cL.join(" "))
  }

  console.log("handleFlag finished", messages, len)
}


function caseChange(link, i, j, x) {
  var newLink = link.innerHTML,
    reg = /^[a-zA-Z]$/,
    cap,
    sliced = false,
    beg = false

  var boxes = $("input:checkbox[name='"+i+"["+j+"["+x+"]][]']"),
    tcBox = boxes.filter("[value='tc']"),
    ucBox = boxes.filter("[value='uc']"),
    dcBox = boxes.filter("[value='dc']"),
    delBox = boxes.filter("[value='del']"),
    allBoxes = [tcBox, ucBox, dcBox, delBox],
    boxName,
    checked = $("input:checkbox[name='"+i+"["+j+"["+x+"]][]']:checked").eq(0)


  // FIND THE FIRST A-Za-z CHAR, SEPARATE BEGINNING CHARS FROM LETTERS, MANIPULATE LETTERS, REJOIN LATER
  if (reg.test(newLink[0]) === false) {
    for (var i=0; i<newLink.length; i++) {
      if (reg.test(newLink[i]) === true) {
        sliced = true
        beg = newLink.slice(0,i)
        newLink = newLink.slice(i)
        break
      }
    }
  }

  if (newLink === newLink.toUpperCase() && delBox.is(":checked") == false) {
    console.log(link)
    link.classList.add("del")
    boxName = "del"

    var wordsArr = [],
      l = $('.link').eq(i).find('.title-word')
    for (let j=0; j<l.length; j++)
      wordsArr.push(l.eq(j).text().length)
    var count = wordsArr.reduce((acc, curr)=>acc + curr) - newLink.length
    handleFlag(i, count)
  } else if (delBox.is(":checked")) {
    if (sliced) {
      link.innerHTML = beg + newLink.toLowerCase()
    } else {
      link.innerHTML = newLink.toLowerCase()
    }
    link.classList.remove("del")
    boxName = "dc"
  } else if (newLink[0] === newLink[0].toUpperCase() && newLink !== newLink.toUpperCase()) {
    if (sliced) {
      link.innerHTML = beg + newLink.toUpperCase()
    } else {
      link.innerHTML = newLink.toUpperCase()
    }
    boxName = "uc"
  } else if (newLink === newLink.toLowerCase()) {
    if (sliced) {
      link.innerHTML = beg + newLink[0].toUpperCase() + newLink.slice(1)
    } else {
      link.innerHTML = newLink[0].toUpperCase() + newLink.slice(1)
    }
    boxName = "tc"
  }
  allBoxes.map(box=>box.prop("checked", (box.val()===boxName)))
}


// EDIT BUTTON, COPY AUTHOR AND TITLE WORDS INTO TEXT INPUTS
function toggleInput(i, j) {
  var link = $(".section").eq(i).find("span.link").eq(j),
    authorSpan = link.find(".author"),
    titleSpan = link.find(".title"),
    title = []
  if (authorSpan.text().length > 0) var author = authorSpan.text()
  link.find('.word-span').each(index => {
    let word = link.find('.word-span').eq(index),
      a = word.find("a").eq(0)
    if (!a.hasClass("del")) title.push(a.text())
    word.addClass("hide")

    authorSpan.addClass("hide")
    titleSpan.addClass("hide")
  });

  link.find(".title-input").eq(0).val(title.join(" ")).removeClass("hide")
  link.find(".author-input").eq(0).val(author.slice(0,-3)).removeClass("hide")
  link.find('.edit-link').eq(0).addClass('hide')
  // $(".section").eq(i).find($("input.title-input")).eq(j).removeClass("hide")
  // $(".section").eq(i).find($("input.author-input")).eq(j).removeClass("hide")
}



(function(){
  $("#edit-links input[type=submit]").prop("disabled", true)
    var disabled = true
  $("#ready").click(function(){
    if (disabled===true) {
      disabled = false
      $("#edit-links input[type=submit]").removeAttr("disabled")
      $("#ready span").addClass("ready")
    } else {
      disabled = true
      $("#edit-links input[type=submit]").prop("disabled", true)
      $("#ready span").removeClass()
    }
  })

  flaggedSpan.each(function(i) {
    $(this).change(function() {
        flag(i)
    })
    if ($(this).find("input").is(":checked")) $("span.link").eq(i).addClass("flagged")
  })


// LINK URL "OPEN FRAME" BUTTON APPEARS ON HOVER
  $(".url").each(function(i){
    var $that = $(this),
      sibling = $that.siblings('.url_open_frame'),
      inTimeout,
      outTimeout

    $(this).mouseenter(function() {
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

    $('.url_open_frame').eq(i).css("top", `${$that.offset().top - 25}px`)
  })

// LINK FLAGGING
  $('.link').each(i=>{
    var $that = $('.link').eq(i)
    console.log("this: ", $(this))
    $('.link').eq(i).find('input[type=text]').on("keyup", function(i){
      var author = $that.find('.author-input').eq(0).val(),
        title = $that.find('.title-input').eq(0).val(),
        len = author.length + title.length
      console.log(author, title, len)
      handleFlag(i, len, author, $that)
    })
  })

})();

$(window).on("beforeunload", e=>confirm("Are you sure you want to leave?"))
;
