$(document).ready(function(){$(".file-upload").on("change",function(){!function(i){if(i.files&&i.files[0]){var n=new FileReader;n.onload=function(i){$(".profile-pic").attr("src",i.target.result)},n.readAsDataURL(i.files[0])}}(this)}),$(".upload-button").on("click",function(){$(".file-upload").click()})});