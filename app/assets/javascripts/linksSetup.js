    function caseChange(link, i, j, x) {
        var newLink = link.innerHTML;
        var reg = /^[a-zA-Z]$/;
        var cap; 
        var sliced = false;
        var beg = false;
        
        var tcBox = $("input:checkbox[name='"+i+"["+j+"["+x+"]][]']").filter("[value='tc']");
        var ucBox = $("input:checkbox[name='"+i+"["+j+"["+x+"]][]']").filter("[value='uc']");
        var dcBox = $("input:checkbox[name='"+i+"["+j+"["+x+"]][]']").filter("[value='dc']");
        var delBox = $("input:checkbox[name='"+i+"["+j+"["+x+"]][]']").filter("[value='del']");
        
        // FIND THE FIRST A-Za-z CHAR
        if (reg.test(newLink[0]) == false) {  
          for (var i=0; i<newLink.length; i++) {
            if (reg.test(newLink[i]) == true) {
              sliced = true;
              beg = newLink.slice(0,i);
              newLink = newLink.slice(i);
              break;
            }
          }
        }
        
      if (newLink === newLink.toUpperCase() && delBox.is(":checked") == false) {
        
        console.log(link);
        link.classList.add("del");
      
        tcBox.prop("checked", false);
        ucBox.prop("checked", false);
        dcBox.prop("checked", false);  
        delBox.prop("checked", true);
        
      } else if (delBox.is(":checked")) {
        if (sliced) {
          link.innerHTML = beg + newLink.toLowerCase();
        } else {
          link.innerHTML = newLink.toLowerCase();
        }
        
        link.classList.remove("del");
        
        delBox.prop("checked", false);
        tcBox.prop("checked", false);
        ucBox.prop("checked", false);
        dcBox.prop("checked", true);
  
      } else if (newLink[0] === newLink[0].toUpperCase() && newLink !== newLink.toUpperCase()) {
        if (sliced) {
          link.innerHTML = beg + newLink.toUpperCase();
        } else {
          link.innerHTML = newLink.toUpperCase();
        }
        
        tcBox.prop("checked", false);
        dcBox.prop("checked", false);
        ucBox.prop("checked", true);
        
      } else if (newLink === newLink.toLowerCase()) {
        if (sliced) {
          link.innerHTML = beg + newLink[0].toUpperCase() + newLink.slice(1);
        } else {
          link.innerHTML = newLink[0].toUpperCase() + newLink.slice(1);
        }
        dcBox.prop("checked", false);
        ucBox.prop("checked", false);
        tcBox.prop("checked", true);
      }
    }
    
    function toggleInput(i, j) {
      $("");
    }
