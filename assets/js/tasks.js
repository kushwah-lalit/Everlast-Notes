var filesList = $('#fetchedList');
var box = false;
var checked = false;

function showAndFill(id){
  if(!box){
    box = !box;
    let task = $(`#${id}`)[0];
    console.log(task);
    $(document.body).append(`<div id="sendFile" class="animate__animated animate__fadeInUp">
      <div id="shortdata">
      <div id="file-details">
          <div style="width:90%">${task.dataset.name}</div>
          <div id="del" style="width:10%;text-align:center;color:  #6BAAED;" class="question"><i onclick="hideAndEmpty()" class="fa-solid fa-xmark" data-toggle="tooltip" data-placement="top" title="Close"></i></div>
        </div>
      <pre class="form-container" style="overflow:auto">${task.dataset.desc}</pre>
      </div>
      </div>`);
  }else{
    box = !box;
    $('#sendFile').remove();
  }
}

function hideAndEmpty(){
  if(box){
    box = !box;
    $('#sendFile').remove();
  }
}

function sortByDate(){
    let childrens = filesList.children();
    let len = childrens.length;
    for (; len--;) {
        filesList.append(childrens[len])
    }
}

$("#selectallbtn").click(function() {
    if (!checked) {
      $("input[type=checkbox]").prop('checked',true);
    }else{
      $("input[type=checkbox]").prop('checked',false);
    }
    checked=!checked;
});

$("#deleted-selected").click(function() {
    $("#fetchedList").submit();
});

function addToCalender(id,start,end){
  let task = $(`#${id}`)[0];
  let add_to_calendar = "https://calendar.google.com/event?action=TEMPLATE&dates=" + start + "/" + end + "&text=" + task.dataset.name + "&location=&details=" + task.dataset.desc;
  add_to_calendar = formatCalendarUrl(add_to_calendar);
  console.log(add_to_calendar);
  window.open(add_to_calendar, '_blank');
  return;
}

function formatCalendarUrl(url) {
  url = url.slice(0, 60) + url.slice(61, 63) + url.slice(64, 69) + url.slice(70, 72) + url.slice(73, 75) + url.slice(79);
  url = url.slice(0, 77) + url.slice(78, 80) + url.slice(81, 86) + url.slice(87, 89) + url.slice(90, 92) + url.slice(96);
  text_index = url.indexOf('&text=') + 6;
  location_index = url.indexOf('&location=&details=');
  desc_index = location_index + 18;
  name = url.slice(text_index, location_index);
  desc = url.slice(desc_index);
  name = encodeURI(name);
  desc = encodeURI(desc);
  url = url.slice(0, text_index) + name + url.slice(location_index,desc_index)+ desc;
  return url;
}