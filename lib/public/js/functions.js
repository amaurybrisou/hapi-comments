var hapi_add_comment = function () {
  HC_textarea = document.getElementById("HC_textarea").value;
  HC_email = document.getElementById("HC_email").value;
  HC_nickname = document.getElementById("HC_nickname").value;
  HC_captcha_validate = document.getElementById("HC_captcha_validate").value;

  // if (!HC_textarea.lenght || !HC_email || !HC_captcha_validate) {
  //   return;
  // }

  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }


  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      drawComments(JSON.parse(xmlhttp.responseText));
      document.getElementById("HC_status").innerHTML = 'Comment added'
      updateCaptcha();
    }
    if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
      var response = JSON.parse(xmlhttp.responseText);

      document.getElementById("HC_status").innerHTML =
        response.message || "An Error Occured";

      updateCaptcha();

    }
  }

  xmlhttp.open("POST", "/comments", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify({
    HC_textarea: HC_textarea,
    HC_email: HC_email,
    HC_nickname: HC_nickname,
    HC_captcha_validate: HC_captcha_validate,
    HC_Id: document.URL.split('blog/')[1]
  }));
}

var drawComments = function (comments) {
  var attach = document.getElementById("HC_comment_block");
  attach.innerHTML = "";
  comments.forEach(function (comment) {
    console.log(comment)
    attach.innerHTML += '<li>' +
      '<div class="HC_comments_nickname">' + comment.HC_nickname + ' a écrit le</div>' +
      '<div class="HC_comments_date">' + comment.HC_date + '</div>' +
      '<div class="HC_comments_textarea">' + comment.HC_textarea + '</div>' +
      '</li>';
  });

}

var updateCaptcha = function () {
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var arr = new Uint8Array(this.response);

      var raw = String.fromCharCode.apply(null, arr);


      var b64 = btoa(raw);
      var dataURL = "data:image/png;base64," + b64;
      document.getElementById("HC_captcha").src = dataURL;
    }
  }

  xmlhttp.open("GET", '/comments/updateCaptcha', true);
  xmlhttp.responseType = 'arraybuffer';
  xmlhttp.send();
}







var attach = document.getElementById("HC_form_block");


attach.innerHTML =
  '<TEXTAREA id="HC_textarea" class="HC_textarea" placeholder="comment"></TEXTAREA>' +
  '<INPUT id="HC_nickname" type="TEXT" class="HC_nickname" placeholder="nickname"></INPUT>' +
  '<INPUT id="HC_email" type="TEXT" class="HC_email" placeholder="email"></INPUT>' +
  '<img id="HC_captcha" class="HC_captcha" src="' + GU_comment_box_server + '/comments/captcha"></img>' +
  '<INPUT id="HC_captcha_validate" type="TEXT" class="HC_captcha_validate" placeholder="captcha"></INPUT>' +
  '<INPUT id="HC_button" type="BUTTON" onclick="hapi_add_comment()" class="HC_button" value="Send"></INPUT>' +
  '<DIV id="HC_status" class="HC_status"></div>';

var xmlhttp;
if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
} else { // code for IE6, IE5
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}


xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

    drawComments(JSON.parse(xmlhttp.responseText));
  }
  if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
    var response = JSON.parse(xmlhttp.responseText);

    document.getElementById("HC_comments").innerHTML =
      response.message || "Error fetching comments";
    updateCaptcha();
  }
}

xmlhttp.open("GET", '/comments?HC_Id=' + document.URL.split('blog/')[1], true);
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.send();