<?
header('Content-Type: text/html; charset=utf-8');
echo"121321321231321231321231321";
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Telegram канал</title>
<script src="jquery.min.js"></script>
<!--script src="telegramform.js"></script-->
<script src="bootstrap.min.js"></script>
<script src="moment-with-locales.js"></script>
<script src="jquery.mask.min.js"></script>

<!--script src="bootstrap-datetimepicker.js"></script>
<script src="moment-with-locales.js"></script-->

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  
  
  <!-- Latest compiled and minified CSS --
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/css/bootstrap-select.min.css">
<!-- Latest compiled and minified JavaScript 
<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>
-->


<style>
body{
	background: white; 
	color: white; 
	font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
	width: 400px;
    margin: 20px auto;}
a{color: white; }
a:hover{color: white; }
.con{
    width: 300px;
    padding: 20px;
    background: #00b9a2;
    margin: 20px auto;
	border-radius: 10px;
	box-shadow: 0px 1px 5px -1px black, 0px 10px 10px 0px grey;
}
.dashed_{border-bottom: dashed 3px white; padding: 5px 0px;}
.center{    text-align: center;}



input {
    border: 1px solid #c4c4c4;
    border-radius: 4px;
    margin-bottom: 14px;
    color: #8f8f8f;
    font-family: sans-serif, "OpenSans", Arial;
    font-size: 14px;
    width: 298px;
    padding: 9px 35px 9px 38px;
}
.input-group {
    margin: 10px auto;
}
label {
    position: relative;
    cursor: text;
    padding-left: 25px;
    margin-right: 15px;
    font-size: 15px;
    font-family: sans-serif, "geinsp", Arial;
    color: #7b7b7b;
}
label:before {
    content: "";
    border: none;
    top: -2px;
    margin-right: 10px;
    position: absolute;
    left: 0;
    bottom: 1px;
    left: -180;
}
.labelphone:before {
    background: url(https://widget.gettable.ru/assets/newwidget/icons-sba93ce21a1-e17c4704addabdcba153de621ce4492907cce052c1bce73077e424083c02803b.png) 0 -2749px no-repeat;
    width: 17px;
    height: 22px;
}
.labelname:before {
    background: url(https://widget.gettable.ru/assets/newwidget/icons-sba93ce21a1-e17c4704addabdcba153de621ce4492907cce052c1bce73077e424083c02803b.png) 0 -2290px no-repeat;
    width: 16px;
    height: 22px;
}



select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
select::-ms-expand {  /* для IE */ 
    display: none;
}
option {
  padding: 6px 28px 6px 0;
}
option::after {
  content: " " url(http://www.blogger.com/img/icon_28_followers.png);
  vertical-align: middle;
}
textarea { color: #8f8f8f; resize: vertical; height-min: 60px; border: none;}
</style>
</head>
<body>
<div class=con>
<h1>Cat Cafe</h1>
<h4>Закажите лучший столик</h4>
      <form id="form-contact" method="POST" class="form-element" autocomplete="off">
<fieldset>

    <div class="input-group">
      <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
      <input id="name" type="text" class="form-control" name="name" placeholder="Как Вас зовут?" required="required" minlength="3">
    </div>
    <div class="input-group">
      <span class="input-group-addon"><i class="glyphicon glyphicon-earphone"></i></span>
      <input id="phone-number" type="Phone" class="form-control" name="phone" placeholder="+38 (___) ___-__-__" required="required" minlength="19">
    </div>
    <div class="input-group">
      <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
      <!--input id="аааааdatepicker" type="Phone" class="form-control" name="Phone" placeholder="12/12/2012" required="required"-->
<select name="datepicker" id="datepicker" data-remote="true" name="data"  class="form-control" dir="rtl" onChange="time__(this.selectedIndex)">
</select>
    </div>
<div class="input-group">
      <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
<select name="timepicker" id="timepicker" name="time"  class="form-control">
</select>
    </div>
	<div class="input-group">
      <span class="input-group-addon"><i class="glyphicon glyphicon-cutlery"></i></span>

<select name="cutlerypicker" id="cutlerypicker" class="form-control">
<option value="1-2 чел.">Столик на двоих</option>
<option value="3-4 чел.">Столик на 3-4 чел.</option>
<option value="5-8 чел.">Компания 5-8 чел.</option>
<option value="больше 9 чел.">Больше 9 чел.</option>
</select>
    </div>
	<div class="input-group">
      <span class="input-group-addon"><i class="glyphicon glyphicon-pencil"></i></span>
<textarea cols="30" id="guest__wish" name="text" placeholder="Ваши пожелания к брони" rows="3" class="form-control" maxlength="240"></textarea>
    </div>
	
	
	
	
	</fieldset>
    <br>
	
	
	
<script>
var now = moment().locale('ru');
moment.locale('ru', {
    calendar : {
        lastDay : '[Вчера:] ddd, Do MMMM YYYY',
        sameDay : '[Сегодня:] ddd, Do MMMM YYYY',
        nextDay : '[Завтра:] ddd, Do MMMM YYYY',
        lastWeek : '[Прошлые:] ddd, Do MMMM YYYY',
        nextWeek : '[]ddd, Do MMMM YYYY',
        sameElse : '[&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;&#8194;]ddd, Do MMMM YYYY'
    }
});
for (var i = 0; i < 7; i++) {
  var checkday=moment().locale('ru');
  d__=checkday.add(i, 'days').calendar();
  s__="";
  if(i==1)s__="selected";
  $('<option ' +s__+ ' value="' +d__+ '">'+d__+ '</option>').appendTo('#datepicker');
};



function timepicker(a, b){
$("#timepicker").empty();
for (var i = 0; i < a; i++) {
	d__=b+i;
  $('<option id="' +d__+ '" value="' +d__+':00 ">'+d__+ ':00 </option>').appendTo('#timepicker');
  $('<option id="' +d__+ '" value="' +d__+ ':30">'+d__+ ':30</option>').appendTo('#timepicker');
};
if(a<=0)$('<option distabled id="-1" value="На сегодня бронь закрыта">На сегодня бронь закрыта</option>').appendTo('#timepicker');
};
function time__(a){
	if(a==0){
var time=moment().format('HH')//.format('LT').replace(/\:.*/, '');
if(time<7){
	timepicker(12, 9);
}else{
	t__=time-7;
	timepicker(12-t__, 9+t__);
};
}else{timepicker(12, 9);};	
};
time__(1);
//if(){}else{};
$(document).ready(function(){
  $('#phone-number').mask('+38 (000) 000-00-00');
});
</script>

          <input type="submit" class="btn btn-default" style="
    width: 100%;
" value="Забронировать">
      </form>

<!--h3 class="dashed_ center">Это бесплатно glyphicon glyphicon-map-marker</h3-->

<a href="tel:+3809353835669"><h3 class="center"><i class="glyphicon glyphicon-earphone"></i>+380953835669</h3></a>
    </div>
	
	
	
	
	
	
	
	      <script>
            $(document).ready(function () {
    $(".form-element").submit(function () {
var formNm = $('#form-contact');// + formID);
        var message = $(formNm).find(".form-message");
        var formTitle = $(formNm).find(".form-title");
		var mess='Имя: '+$('#name').val()+' \n Телефон: '+$('#phone-number').val()+' \n Дата: '+$('#datepicker').val()+' \n  Время: '+$('#timepicker').val()+' \n Чел: '+$('#cutlerypicker').val()+' \n <br>+<br>  Коммент: '+$('#guest__wish').val()+' \n ';
		
		
		
		
		
        $.ajax({
            type: "POST",
            url: 'https://api.telegram.org/bot876530454:AAHpvXr4X5hHTeq2L2g0qrRwRz4hx4_Q-jY/sendMessage?chat_id=-362609574&parse_mode=html&text='+mess,
            data: formNm.serialize(),
            success: function (data) {
              // Вывод сообщения об успешной отправке
              message.html(data);
              formTitle.css("display","none");
              setTimeout(function(){
                formTitle.css("display","block");
                message.html('');
                $('input').not(':input[type=submit], :input[type=hidden]').val('');
              }, 3000);
            },
            error: function (jqXHR, text, error) {
                // Вывод сообщения об ошибке отправки
                message.html(error);
                formTitle.css("display","none");
                setTimeout(function(){
                  formTitle.css("display","block");
                  message.html('');
                  $('input').not(':input[type=submit], :input[type=hidden]').val('');
                }, 3000);
            }
        });
        return false;
	});
});


		function submit(){
        //var formID = $(this).attr('id');
        var formNm = $('#form-contact');// + formID);
        var message = $(formNm).find(".form-message");
        var formTitle = $(formNm).find(".form-title");
		var mess='Имя: '+$('#name').val()+' \n Телефон: '+$('#phone-number').val()+' \n Дата: '+$('#datepicker').val()+' \n  Время: '+$('#timepicker').val()+' \n Чел: '+$('#cutlerypicker').val()+' \n  Коммент: '+$('#guest__wish').val()+' \n ';
		
		
		
		
		
        $.ajax({
            type: "POST",
            url: 'https://api.telegram.org/bot876530454:AAHpvXr4X5hHTeq2L2g0qrRwRz4hx4_Q-jY/sendMessage?chat_id=-362609574&parse_mode=html&text='+mess.serialize(),
            data: formNm.serialize(),
            success: function (data) {
              // Вывод сообщения об успешной отправке
              message.html(data);
              formTitle.css("display","none");
              setTimeout(function(){
                formTitle.css("display","block");
                message.html('');
                $('input').not(':input[type=submit], :input[type=hidden]').val('');
              }, 3000);
            },
            error: function (jqXHR, text, error) {
                // Вывод сообщения об ошибке отправки
                message.html(error);
                formTitle.css("display","none");
                setTimeout(function(){
                  formTitle.css("display","block");
                  message.html('');
                  $('input').not(':input[type=submit], :input[type=hidden]').val('');
                }, 3000);
            }
        });
        return false;
    };
      </script>
	
	
	
</body>


сегодня
завтра





<?
/*
876530454:AAHpvXr4X5hHTeq2L2g0qrRwRz4hx4_Q-jY
catcafe_Bot
cat.dp.ua.bot
chat id:362609574

{"ok":true,"result":[{"update_id":34206204,
"message":{"message_id":4,"from":{"id":407311315,"is_bot":false,"first_name":"Bruno","last_name":"X","username":"bruno_x","language_code":"ru"},"chat":{"id":-362609574,"title":"catcafe_Bot","type":"group","all_members_are_administrators":true},"date":1563445423,"text":"/join","entities":[{"offset":0,"length":5,"type":"bot_command"}]}},{"update_id":34206205,
"message":{"message_id":5,"from":{"id":407311315,"is_bot":false,"first_name":"Bruno","last_name":"X","username":"bruno_x","language_code":"ru"},"chat":{"id":-362609574,"title":"catcafe_Bot","type":"group","all_members_are_administrators":true},"date":1563445426,"text":"/join","entities":[{"offset":0,"length":5,"type":"bot_command"}]}}]}




https://forms.gle/x9BCgZkfLkDqsjJs8



https://api.telegram.org/bot876530454:AAHpvXr4X5hHTeq2L2g0qrRwRz4hx4_Q-jY/sendMessage?chat_id=-362609574&parse_mode=html&text=asasasas
*/?>
