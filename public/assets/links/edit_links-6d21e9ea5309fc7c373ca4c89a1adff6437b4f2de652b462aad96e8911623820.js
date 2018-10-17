(function(){
  $("#edit-links input[type=submit]").prop("disabled", true);
    var disabled = true;
    $("#ready").click(function(){
      if (disabled===true) {
        disabled = false;
        $("#edit-links input[type=submit]").removeAttr("disabled");
        $("#ready span").addClass("ready");
      } else {
        disabled = true;
        $("#edit-links input[type=submit]").prop("disabled", true);
        $("#ready span").removeClass();
      }
    });

  $("span.flaggedspan").each(function(i) {
    $(this).change(function() {
        flag(i);
    });
    if ($(this).find("input").is(":checked")) $("span.link").eq(i).addClass("flagged");
  });


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
}());

function flag(index) {
  $("span.flaggedspan").eq(index).find("input").is(":checked") ? $("span.link").eq(index).addClass("flagged") : $("span.link").eq(index).removeClass("flagged");
}

function caseChange(link, i, j, x) {
  var newLink = link.innerHTML;
  var reg = /^[a-zA-Z]$/;
  var cap;
  var sliced = false;
  var beg = false;

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
    console.log(link);
    link.classList.add("del");
    boxName = "del"
  } else if (delBox.is(":checked")) {
    if (sliced) {
      link.innerHTML = beg + newLink.toLowerCase();
    } else {
      link.innerHTML = newLink.toLowerCase();
    }
    link.classList.remove("del");
    boxName = "dc"
  } else if (newLink[0] === newLink[0].toUpperCase() && newLink !== newLink.toUpperCase()) {
    if (sliced) {
      link.innerHTML = beg + newLink.toUpperCase();
    } else {
      link.innerHTML = newLink.toUpperCase();
    }
    boxName = "uc"
  } else if (newLink === newLink.toLowerCase()) {
    if (sliced) {
      link.innerHTML = beg + newLink[0].toUpperCase() + newLink.slice(1);
    } else {
      link.innerHTML = newLink[0].toUpperCase() + newLink.slice(1);
    }
    boxName = "tc"
  }
  allBoxes.map(box=>box.prop("checked", (box.val()===boxName)))
}

function toggleInput(i, j) {
  var link = $(".section").eq(i).find($("span.link")).eq(j);
  if (link.find("span.author").text().length > 0) var author = link.find("span.author").text();
  var title = [];
  link.children().each((index) => {
    let word = link.find("span").eq(index);
    if (word.hasClass("")) {
      title.push(word.find("a").eq(0).text());
      if (!word.hasClass("flaggedspan")) {
        word.addClass("hide");
      }
    } else if (word.hasClass("author") || word.hasClass("edit-link")) {
      word.addClass("hide");
    }
  });

  $(".section").eq(i).find($("input.title-input")).eq(j).val(title.join(" "));
  $(".section").eq(i).find($("input.author-input")).eq(j).val(author.slice(0,-3));
  $(".section").eq(i).find($("input.title-input")).eq(j).removeClass("hide");
  $(".section").eq(i).find($("input.author-input")).eq(j).removeClass("hide");
}

$(window).on("beforeunload", e=>confirm("Are you sure you want to leave?"))
;
