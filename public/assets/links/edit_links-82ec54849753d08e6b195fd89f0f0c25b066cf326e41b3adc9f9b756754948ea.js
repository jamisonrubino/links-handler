var linkCount = $('.link').length,
  titleCount = new Array(linkCount),
  flaggedSpan = $("span.flaggedspan"),
  flagObj = []

function flag(index) {
  flaggedSpan.eq(index).find("input").is(":checked") ?
    $("span.link").eq(index).addClass("flagged") :
    $("span.link").eq(index).removeClass("flagged")
}

function handleFlag(i, j, len, author = null, link = null) {
  console.log("handleFlag started")
  let flag = $('.section').eq(i).find('input[type=checkbox].flagged').eq(j),
    flaggedMsg = $('.section').eq(i).find("span.flaggedmessage").eq(j),
    messages = [],
    cL = []
  console.log(messages, cL)
  author = (author || $('.section').eq(i).find('.author').eq(j).text().slice(0,-3))
  link = (link || $('.section').eq(i).find('.link').eq(j))
  len += author.length
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
    link.addClass(cL.join(" "))
    flaggedMsg.text(messages.join(" "))
  } else {
    flag.prop("checked", false)
    flaggedSpan.removeClass("length manual")
    flaggedMsg.text("")
  }

  console.log("handleFlag finished, author: ", author, messages, len)
}


function toggleDel(i, j) {
  var wordsArr = [],
    l = $('.section').eq(i).find('.link').eq(j).find('.title-word'),
    len
  for (let x=0; x<l.length; x++) {
    if (!l.eq(x).hasClass("del")) wordsArr.push(l.eq(x).text().length)
    console.log(l.eq(x).text(), l.eq(x).text().length)
  }
  console.log(wordsArr)
  len = wordsArr.reduce((acc, curr)=>acc + curr) + (wordsArr.length - 1)
  handleFlag(i, j, len)
}


function caseChange(i, j, x) {
  var link = $('.section').eq(i).find('.link').eq(j).find('.title-word').eq(x)
    newLink = link.text(),
    reg = /^[a-zA-Z]$/,
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
    for (var y=0; y<newLink.length; y++) {
      if (reg.test(newLink[y]) === true) {
        sliced = true
        beg = newLink.slice(0,y)
        newLink = newLink.slice(y)
        break
      }
    }
  }

  if (newLink === newLink.toUpperCase() && delBox.is(":checked") == false) {
    console.log(link)
    link.addClass("del")
    boxName = "del"

    toggleDel(i, j)
    console.log("newLink: ", newLink)

  } else if (delBox.is(":checked")) {
    if (sliced) {
      link.text(`${beg + newLink.toLowerCase()}`)
    } else {
      link.text(`${newLink.toLowerCase()}`)
    }
    link.removeClass("del")
    boxName = "dc"

    toggleDel(i, j)

  } else if (newLink[0] === newLink[0].toUpperCase() && newLink !== newLink.toUpperCase()) {
    if (sliced) {
      link.text(`${beg + newLink.toUpperCase()}`)
    } else {
      link.text(`${newLink.toUpperCase()}`)
    }
    boxName = "uc"
  } else if (newLink === newLink.toLowerCase()) {
    if (sliced) {
      link.text(`${beg + newLink[0].toUpperCase() + newLink.slice(1)}`)
    } else {
      link.text(`${newLink[0].toUpperCase() + newLink.slice(1)}`)
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

    // $('.url_open_frame').eq(i).css("top", `${$that.offset().top - 42}px`)
  })

// LINK FLAGGING
  $('.section').each(i=>{
    $('.section').eq(i).find('.link').each(j=>{
      var $that = $('.section').eq(i).find('.link').eq(j)
      console.log("this: ", $(this))
      $('.section').eq(i).find('.link').eq(j).find('input[type=text]').on("keyup", function(x){
        var author = $that.find('.author-input').eq(0).val(),
          title = $that.find('.title-input').eq(0).val(),
          len = title.length
        console.log(author, title, len)
        handleFlag(i, j, len, author, $that)
      })

      var wordsArr = [],
        l = $('.section').eq(i).find('.link').eq(j).find('.title-word'),
        len
      for (let y=0; y<l.length; y++)
        wordsArr.push(l.eq(y).text().length)
      len = wordsArr.reduce((acc, curr)=>acc + curr) + (wordsArr.length - 1)
      handleFlag(i, j, len)
      wordsArr = []
    })
  })

})();

$(window).on("beforeunload", e=>confirm("Are you sure you want to leave?"))
;
