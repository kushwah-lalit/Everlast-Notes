function toggleBookmark(link){
    $.ajax({
        type: 'get',
        url: link,
        success: function(data){
            if($(`#${data.data.problem_id}`)[0].classList.value === "fa-solid fa-bookmark"){
                $(`#${data.data.problem_id}`)[0].classList.value = "fa-regular fa-bookmark";
            }else{
                $(`#${data.data.problem_id}`)[0].classList.value = "fa-solid fa-bookmark";
            }
            return;
        },error: function(error){
            console.log(error.responseText);
        }
    });
}