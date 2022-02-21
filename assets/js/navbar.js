function showNoty() {
    var x = document.getElementById("notificationResults");
    if (x.style.display === "none") {
      x.style.display = "block";
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
function searchTasks(e){
    return;
}
function searchPdfs(e){
    return;
}
function searchCodes(e){
    return;
}
  