  function showNoty() {
    var x = document.getElementById("notificationResults");
    var bell = document.getElementById("bell");
    if (x.style.display === "none") {
      x.style.display = "block";
      bell.style.color = "#838383";
    } else {
      x.style.display = "none";
    }
  }

  function showMenu() {
    var x = document.getElementById("catList");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  function showOptions() {
    var x = document.getElementById("platList");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  function showList() {
    var x = document.getElementById("siteList");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  function searchProblems(e){
    var Results = document.getElementById("searchResults");
    // allow only char and spaces
    let match = e.value.match(/^[a-zA-Z ]*/);
    // prevent leading spaces
    let match2 = e.value.match(/\s*/);
    if(match2[0] === e.value){
        Results.innerHTML = '';
        return;
    }
    if(match[0] === e.value){
        fetch('/search/problems',{
            method:'post',
            headers:{'content-type':'application/json'},
            body: JSON.stringify({payload:e.value})
        }).then(res => res.json()).then(data => {
            let payload = data.payload;
            console.log(payload);
            Results.innerHTML = '';
            if(payload.length<1){
                Results.innerHTML = '<a class="animate__animated animate__fadeInUp">No such problem solved :(</a>';
                return;   
            }
            payload.forEach((item) => {
                Results.innerHTML += `<a class="animate__animated animate__fadeInUp" href="/problem/view/${item._id}" data-toggle="tooltip" data-placement="top" title="View Problem">${item.name}</a>`;
            });
        });
        return;
    }
    Results.innerHTML = '';
  }

function searchFiles(e){
  var Results = document.getElementById("searchResults");
    // allow only char and spaces
    let match = e.value.match(/^[a-zA-Z ]*/);
    // prevent leading spaces
    let match2 = e.value.match(/\s*/);
    if(match2[0] === e.value){
        Results.innerHTML = '';
        return;
    }
    if(match[0] === e.value){
        fetch('/search/documents',{
            method:'post',
            headers:{'content-type':'application/json'},
            body: JSON.stringify({payload:e.value})
        }).then(res => res.json()).then(data => {
            let payload = data.payload;
            console.log(payload);
            Results.innerHTML = '';
            if(payload.length<1){
                Results.innerHTML = '<a class="animate__animated animate__fadeInUp">No such File found :(</a>';
                return;   
            }
            payload.forEach((item) => {
                if(item.uploadWay === "Google Drive Link"){
                  Results.innerHTML += `<a class="animate__animated animate__fadeInUp" href="${item.downloadLink}" target="_blank" data-toggle="tooltip" data-placement="top" title="Download File">${item.name}</a>`;
                }else{
                  Results.innerHTML += `<a class="animate__animated animate__fadeInUp" href="/documents/download/${item._id}" data-toggle="tooltip" data-placement="top" title="Download File">${item.name}</a>`;
                }
            });
        });
        return;
    }
    Results.innerHTML = '';
}
function searchCodes(e){
  var Results = document.getElementById("searchResults");
    // allow only char and spaces
    let match = e.value.match(/^[a-zA-Z ]*/);
    // prevent leading spaces
    let match2 = e.value.match(/\s*/);
    if(match2[0] === e.value){
        Results.innerHTML = '';
        return;
    }
    if(match[0] === e.value){
        fetch('/search/codes',{
            method:'post',
            headers:{'content-type':'application/json'},
            body: JSON.stringify({payload:e.value})
        }).then(res => res.json()).then(data => {
            let payload = data.payload;
            console.log(payload);
            Results.innerHTML = '';
            if(payload.length<1){
                Results.innerHTML = '<a class="animate__animated animate__fadeInUp">No such Code stored :(</a>';
                return;   
            }
            payload.forEach((item) => {
                Results.innerHTML += `<a class="animate__animated animate__fadeInUp" href="/code/view/${item._id}" data-toggle="tooltip" data-placement="top" title="View Code Snippet">${item.name}</a>`;
            });
        });
        return;
    }
    Results.innerHTML = '';
}
function searchTasks(e){
  var Results = document.getElementById("searchResults");
  // allow only char and spaces
  let match = e.value.match(/^[a-zA-Z ]*/);
  // prevent leading spaces
  let match2 = e.value.match(/\s*/);
  if(match2[0] === e.value){
      Results.innerHTML = '';
      return;
  }
  if(match[0] === e.value){
      fetch('/search/tasks',{
          method:'post',
          headers:{'content-type':'application/json'},
          body: JSON.stringify({payload:e.value})
      }).then(res => res.json()).then(data => {
          let payload = data.payload;
          console.log(payload);
          Results.innerHTML = '';
          if(payload.length<1){
              Results.innerHTML = '<a class="animate__animated animate__fadeInUp">No such Code stored :(</a>';
              return;   
          }
          payload.forEach((item) => {
              Results.innerHTML += `<a class="animate__animated animate__fadeInUp" onclick="showAndFill('${item._id}')" data-toggle="tooltip" data-placement="top" title="View Task Details">${item.name}</a>`;
          });
      });
      return;
  }
  Results.innerHTML = '';
}


  