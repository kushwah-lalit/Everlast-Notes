var filesList = $('#fetchedList');
var currentType = "google-link";
var box = false;

$('#select-upload').on('change',function(){
  console.log('hola')
  if(currentType!=this.value){
    console.log(currentType);
    currentType=this.value;
    if(currentType === "Google Drive Link"){
      $('#file-input').replaceWith('<input type="url" id="file-input" name="doc" placeholder="Enter Publicly shareable Google Drive Link of file" style="width:55%;"  class="form-container" required>');
    }else{
      $('#file-input').replaceWith('<input type="file" id="file-input" name="doc" style="width:55%;"  class="form-container" onchange="ValidateSize(this)" required>');
    }
    return;
  }
  return;
});

function showAndFill(name,fileId,requestUserId){
  if(!box){
    box = !box;
      $(document.body).append(`<div id="sendFile" class="animate__animated animate__fadeInUp">
      <form id="shortdata" action="/documents/share" method="post" class="shareViaEmail">
      <div id="file-details">
          <div style="width:90%">${name}</div>
          <div id="del" style="width:10%;text-align:center;color:  #6BAAED;" class="question"><i onclick="hideAndEmpty()" class="fa-solid fa-xmark" data-toggle="tooltip" data-placement="top" title="Close"></i></div>
        </div>
      <div id="lastrow">
      <input type="text" name="fileId" value="${fileId}" style="width:75%;display:none"  class="form-container" required>
      <input type="text" name="userId" value="${requestUserId}" style="width:75%;display:none"  class="form-container" required>
      <input type="email" name="mail" placeholder="Enter recipient's Email.." style="width:75%;"  class="form-container" required>
      <button type="submit" class="submit" style="width:22%;"><i class="fa-solid fa-paper-plane"></i> Share</button>
      </div>
      </form>
      </div>`);
      shareFile();
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

function ValidateSize(file) {
  const FileSize = file.files[0].size / 1024 / 1024;
  if (FileSize > 20) {
      alert('File size exceeds 20 MB');
      document.getElementById('file-input').value = null;
      // $('#file-input').value() = null;
  }
}

let shareFile = function(){
    // this is how we fetched the form
    let newEmailForm = $('.shareViaEmail');
    // now preventing the default feature and making the ajax request
    console.log(newEmailForm);
    newEmailForm.submit(function(e){
        e.preventDefault();
  // creating ajax request to submit the post
        $.ajax({
            type: 'post',
            url: '/documents/share',
            // to make form data to json
            data: newEmailForm.serialize(),
            success: function(data){
                console.log(data);
                hideAndEmpty();
                alert(data.message);
            }, error: function(error){
                console.log(error.responseText);
            }
        });
    });

};
  


