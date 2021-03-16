'use strict';
let toggle=false;
$(document).ready(function () {

	setTimeout(function () {
		$('#errors').fadeOut(400);
		$('#success').fadeOut(400);
	}, 3000);
var shopChecked=false;
function shopSliderClick(e){
	
	var group = document.querySelector(".shop-section");
	var nodes = document.querySelectorAll(".slick-slide");
	var total = nodes.length;
	var ease  = Power1.easeInOut;
	var boxes = [];

	console.log("total: "+total);

	for (var i = 0; i < total; i++) {
		
	var node = nodes[i];
	
	// Initialize transforms on node
	TweenLite.set(node, { x: 0 });
	
	boxes[i] = {
		transform: node._gsTransform,
		x: node.offsetLeft,
		y: node.offsetTop,
		node    
	};
	} 


	function layout(e) {
		shopChecked=true;
		group.classList.add("shop-active"); //.add("shop-active");  //toggle("shop-active");  






		for (var i = 0; i < total; i++) {
			
			var box = boxes[i];
				
			var lastX = box.x;
			var lastY = box.y;   
			
			box.x = box.node.offsetLeft;
			box.y = box.node.offsetTop;
			
			// Continue if box hasn't moved
			if (lastX === box.x && lastY === box.y) continue;
			
			// Reversed delta values taking into account current transforms
			var x = box.transform.x + lastX - box.x;
			var y = box.transform.y + lastY - box.y;  
			
			// Tween to 0 to remove the transforms
			TweenLite.fromTo(box.node, 0.5, { x, y }, { x: 0, y: 0, ease });    
		} 
	}

	nodes.forEach((item, e)=>{
		item.addEventListener('click', (event)=> {
			event.preventDefault();
			nodes.forEach((item)=>{
				item.classList.remove("slick-slide-checked");
			});
			nodes[e].classList.add("slick-slide-checked");
			return !shopChecked?layout(e):'';
		});

	});

	// group.addEventListener("mouseenter", layout);
	// group.addEventListener("mouseleave", layout);



};
	console.log("1");
	$('.shop-slider').slick({
		dots: true,
		infinite: true,
		speed: 300,
		arrows: false,
		slidesToShow: 3,
		fade: false,
		centerMode: false,
		centerPadding: '0px',
		responsive: [
			{
				breakpoint: 820,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
	shopSliderClick(shopChecked);



	$('.news-slider').slick({
		dots: true,
		infinite: true,
		speed: 300,
		arrows: false,
		slidesToShow: 3,
		fade: false,
		centerMode: false,
		centerPadding: '0px',
		responsive: [
			{
				breakpoint: 800,
				settings: {
					slidesToShow: 1,
					dots: false,
					slidesToScroll: 1
				}
			}
		]
	});

	$('.demo-slider').slick({
		dots: true,
		infinite: true,
		speed: 300,
		arrows: false,
		slidesToShow: 1,
		fade: true,
		centerMode: false,
		centerPadding: '0px',
	});

	jQuery.fn.lightTabs = function (options) {

		var create_work_Tabs = function () {
			var tabes = this,
				i = 0;

			var showPage = function (i) {
				$(tabes).children(".game-list").children("li").removeClass("active");
				$(tabes).children(".game-list").children("li").eq(i).addClass("active");
				$(tabes).children(".game-items").children(".item").hide();
				$(tabes).children(".game-items").children(".item").eq(i).show();
			}

			showPage(0);

			$(tabes).children(".game-list").children("li").each(function (index, element) {
				$(element).attr("data-page", i);
				i++;
			});

			$(tabes).children(".game-list").children("li").click(function () {
				showPage(parseInt($(this).attr("data-page")));
			});
		};
		return this.each(create_work_Tabs);
	};

	jQuery.fn.lightworksTabs = function (options) {

		var create_work_Tabs = function () {
			var tabes = this,
				i = 0;

			var showPage = function (i) {
				$(tabes).find(".works-tabs-title").children(".works-tabs-title__item").removeClass("active");
				$(tabes).find(".works-tabs-title").children(".works-tabs-title__item").eq(i).addClass("active");
				$(tabes).children(".works-tabs-box").children(".works-tabs-box__item").hide();
				$(tabes).children(".works-tabs-box").children(".works-tabs-box__item").eq(i).show();
			}

			showPage(0);

			$(tabes).find(".works-tabs-title").children(".works-tabs-title__item").each(function (index, element) {
				$(element).attr("data-page", i);
				i++;
			});

			$(tabes).find(".works-tabs-title").children(".works-tabs-title__item").click(function () {
				showPage(parseInt($(this).attr("data-page")));
			});
		};
		return this.each(create_work_Tabs);
	};

	$(".game-list-container").lightTabs();
	$(".works-tabs").lightworksTabs();


	$('.accordion .title').click(function (j) {
		var dropDown = $(this).parents('li').find('.text');

		$(this).parents('.accordion').find('.text').not(dropDown).slideUp();

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).parents('.accordion').find('.title.active').removeClass('active');
			$(this).addClass('active');
		}

		dropDown.stop(false, true).slideToggle();

		j.preventDefault();
	});

	$('.menu').on('click', function () {
		if ($(this).hasClass('close')) {
			$(this).removeClass('close');
			$(this).addClass('active');
			$(".menu-dropdown,.menu-dropdown-header").addClass("show");
			$(".language-dropdown").hide();
			$(".language").removeClass("show");
			$("body").addClass("ovh");
		}else{
			$(this).removeClass('active');
			$(this).addClass('close');
			//$("#model-reg,#model-password").hide();
			$("#model-reg,#model-password,#model-login,.menu-dropdown,.menu-dropdown-header").removeClass("show");
			$("body").removeClass("ovh");
		}
	});

	$('.btn-close').on('click', function () {
		$("#model-reg,#model-password").hide();
		$("#model-login,.menu-dropdown,.menu-dropdown-header").removeClass("show");
		$("body").removeClass("ovh");
	});

	var scrollTriggerdownload = 600,
		backdownload = function () {
			var scrollTop = $(window).scrollTop();
			if ((scrollTop > scrollTriggerdownload)&&!toggle) {
				$('.download-loader').addClass('show');
			} else {
				$('.download-loader').removeClass('show');
			}
		};


	$(".menu-dropdown-link").on("click", function () {
		if ($(this).hasClass('login-in')) {
			$(this).parent().toggleClass('login-in');
		} else {
			$('html,body').animate({
				scrollTop: 0
			}, 100);
			$("#model-login").toggleClass("show");//.toggle();
			$("body").toggleClass("ovh");
			$("#model-password,#model-reg,.menu-dropdown").removeClass("show");
			//$("#model-password,#model-reg").hide();
		}
	});

	if (window.location.hash === '#login') {
		$(".menu-dropdown-link").trigger('click');
	}


	$(".help-password").on("click", function () {
		$("#model-password").addClass('show');//.show();
		//$("#model-reg").hide();
		$("#model-reg,#model-login,.menu-dropdown").removeClass("show");
	});


	$(".create-acc").on("click", function () {
		$("#model-reg").addClass('show');//.show();
		//$("#model-login").hide();
		$("#model-login,.menu-dropdown").removeClass("show");
	});

	$('.input-wrap input').focus(function () {
		me = $(this);
		me.parent().addClass("anim");
		$("label[for='" + me.attr('id') + "']").addClass("animate-label");
	});

	$('.input-wrap input').blur(function () {
		me = $(this);
		if (me.val() == "") {
			me.parent().removeClass("anim")
			$("label[for='" + me.attr('id') + "']").removeClass("animate-label");
		}
	});


	if ($('#back-to-top').length) {
		var scrollTrigger = 1000,
			backToTop = function () {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > scrollTrigger) {
					$('#back-to-top').addClass('show');
				} else {
					$('#back-to-top').removeClass('show');
				}
			};
		backToTop();
		$(window).on('scroll', function () {
			backToTop();
		});
		$('#back-to-top').on('click', function (e) {
			e.preventDefault();
			$('html,body').animate({
				scrollTop: 0
			}, 700);
		});
	}

	// new

	var menuItems = $("body").find(".anchor"),
		scrollItems = menuItems.map(function () {
			var item = $(this).attr("href");
			if (item.length) {
				return item;
			}
		});

	menuItems.click(function (e) {
		// $(this).parent().addClass("active");
		var href = $(this).attr("rel"),
			offsetTop = href === "#" ? 0 : $(href).offset().top;
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 600);
		$("#model-login,.menu-dropdown,.menu-dropdown-header").removeClass("show");
		$("#model-reg,#model-password").hide();
		$("body").removeClass("ovh");
		e.preventDefault();
	});

	$("#add-btn-license").on('click', function () {
		$(".add-form-license").toggle();
	});

	if (document.cookie.replace(/(?:(?:^|.*;\s*)acceptCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true") {
		$('.cookie').hide();
		$(window).on('scroll', function () {
			backdownload();
		});
	}
	//Assign cookie on click
	$(".accept-cookie-button").on('click', function () {
		document.cookie = "acceptCookie=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
		$('.cookie').fadeOut();

		$(window).on('scroll', function () {
			backdownload();
		});

	});

});

$(window).on("load", function () {
	$('.input-wrap.error input').each(function () {
		var input = $(this);
		input.parent().addClass("anim");
		console.log(input);
		$("label[for='" + input.attr('id') + "']").addClass("animate-label");
	});

	if($(window).width() < 820) {
		$(".language").on('click', function () {
			$(".language").toggleClass('show');
			$(".language-dropdown").toggle();
		});
	} else {
		// change functionality for larger screens
	}
});





window.addEventListener('DOMContentLoaded', ()=>{

	
	// $('#show_list_item').on('click', function () {
	// 	if(!toggle){
	// 		$('html,body').animate({
	// 			scrollTop: $("#list_info").offset().top+80
	// 		}, 300);
	// 	}
	// });
	const infoBlock=document.querySelector('.info-block'),
		  showListItem = document.getElementById("show_list_item"),
		  hideListItem = document.getElementById("info-block__title-ico");
	function showInfoBlock(){
		toggle=(toggle)?false:true;
		console.log("toggle:"+toggle);
		if(toggle){
			infoBlock.classList.add('info-block__show');
			showListItem.classList.add('to_top');
			$('.download-loader').removeClass('show');
		}else{
			infoBlock.classList.remove('info-block__show');
			showListItem.classList.remove('to_top');
		}

	}
	showListItem.onclick = showInfoBlock;
	hideListItem.onclick = showInfoBlock;

	const tabs=document.querySelectorAll('.info-block__item-icon'),
	tabsContent=document.querySelectorAll('.info-block__content-block'),
	tabsParent=document.querySelector('.info-block__item'),
	tabsContentParent=document.querySelector('.info-block__content'),
	infoBlockDescription=document.getElementById('info-block-description');
	var tabId=0;
	const description=[
		"AWAX Android",
		"AWAX iOS", 
		"AWAX PC (Mac OS/Windows)", 
		"AWAX Android TV"
	];


let timer=0;
function typeWriter(timers, e, txt, s=4, i=s) {
	if(timer!==timers)return false;
	if (i < txt.length) {
		let a=(i < txt.length-1)?'_':'';
		let txti = txt.substring(0,s)+txt.substring(s,1+i)+a;//.charAt(i);.substring(0,i)
		console.log("text: "+i+" "+ txti);//.slice(0, i)
		e.innerHTML = txti;
		i++;
		setTimeout(() => typeWriter(timers, e, txt, s, i), 70);
	}
}





console.log('start');
	function hideTabsContent(){
		tabs.forEach(i => {
			i.classList.remove('active');
		});
		tabsContent.forEach(i => {
			i.classList.remove('item-show');
			i.classList.add('item-hide');
			i.classList.remove('blockLeft');
			i.classList.remove('blockRight');
		});
	};
	function showTabsContent(i=0){
		tabsContent[i].classList.remove('item-hide');
		tabsContent[i].classList.add('item-show');
		tabs[i].classList.add('active');
		infoBlockDescription.innerHTML='';//description[i];
		timer=i;
		typeWriter(timer, infoBlockDescription, description[i]);
		tabId=i;
	};	
	hideTabsContent();
	showTabsContent();
	
	tabsParent.addEventListener('click', (event)=> {
		if(event.target&&event.target.classList.contains('info-block__item-icon')){
			tabs.forEach((item, i)=>{
				if(event.target===item){
					hideTabsContent();
					showTabsContent(i);
				}
			});
		}
	});

	const installUrls=[
		"https://play.google.com/store/apps/details?id=com.awaxtech.app",
		"https://apps.apple.com/ru/app/awax/id1485689157", 
		"https://chrome.google.com/webstore/detail/awax/aadlckelcockpdgplkdllgokjnckncll", 
		"https://play.google.com/store/apps/details?id=com.awaxtech.app"
	];
	function installHref(){
		window.open(installUrls[tabId], '_blank');
	}
	document.getElementById("install-href").onclick=installHref;




var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};   

function swipe(e){
	let i=tabId+e;
	if(i>(tabs.length-1))i=0;
	if(i<0)i=(tabs.length-1);
	hideTabsContent();
	showTabsContent(i);
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    // немного поясню здесь. Тут берутся модули движения по оси абсцисс и ординат (почему модули? потому что если движение сделано влево или вниз, то его показатель будет отрицательным) и сравнивается, чего было больше: движения по абсциссам или ординатам. Нужно это для того, чтобы, если пользователь провел вправо, но немного наискосок вниз, сработал именно коллбэк для движения вправо, а ни как-то иначе.
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
			swipe(1);
        } else {
            /* right swipe */
			swipe(-1);
        }                       
    } else { // Это вам, в общем-то, не надо, вы ведь только влево-вправо собираетесь двигать
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};
// Вешаем на прикосновение функцию handleTouchStart
tabsContentParent.addEventListener('touchstart', handleTouchStart, false);  
// А на движение пальцем по экрану - handleTouchMove      
tabsContentParent.addEventListener('touchmove', handleTouchMove, false);



	
	//const buyButtons=document.querySelectorAll('.click_buy'),
	//buyButtonsParent=document.querySelector('.shop-section');
	//buyButtonsParent=document.querySelector('.info-block__item');
	//buyButtonsParent=document.getElementById("shop");
/*
	function showBuyBlock(i){
		buyButtonsParent.classList.toggle("shop-active");
		console.log("buy"+i);
	}


	buyButtons.forEach((item, i)=>{
		//event.preventDefault();
		item.addEventListener('click', (event)=> {
		showBuyBlock(i);
		});
	
	});

	buyButtonsParent.addEventListener('click', (event)=> {
		if(event.target&&event.target.classList.contains('click_buy')){
			buyButtons.forEach((item, i)=>{
					//event.preventDefault();
					showBuyBlock(i);
				
			});
		};
	});
*/
/*

const arrowIco=`
	<div class="center-con">
		<div class="round">
			<div class="qwert_get-img_cta">
				<span class="arrow primera next "></span>
				<span class="arrow segunda next "></span>
			</div>
		</div>
	</div>
`;
function getImg() {
	console.log("*** start node");
	let div=document.getElementById("qwert_get-img");
	if(!div){
		div = document.createElement("div");
		div.id="qwert_get-img";
		document.body.appendChild(div);
	}
	function addElement(i, y, x, e) {

		var el = document.createElement("a");
			el.id="qwert_get-img"+i;
			el.classList.add('qwert_get-img');
			el.innerHTML = `<div class="qwert_get-img_bg" style="background-image:  url(${e});"></div>${arrowIco}`;
			el.href=e;
			el.setAttribute("download", true);
			el.setAttribute("style", "top: "+y+"px; left: "+x+"px;");

		div.appendChild(el);
	}
	document.querySelectorAll('*').forEach(function(node, i) {
		if(node.tagName==="IMG"){		
			console.log("*** nodeIMG: "+i);
			console.log(node.src);
			console.log(node.tagName);
			let c = node.getBoundingClientRect();
			addElement(i, c.top+pageYOffset+(node.scrollHeight/2), c.left+pageXOffset+(node.scrollWidth/2), node.src);
		}
		var prop = window.getComputedStyle(node).getPropertyValue('background-image');
		var re = /url\((['"])?(.*?)\1\)/gi;
		var matches;
		while ((matches = re.exec(prop)) !== null) {
			console.log("*** node: "+i);
			console.log(matches[2]);
			console.log(node.tagName);
			let c = node.getBoundingClientRect();
			addElement(i, c.top+pageYOffset+(node.scrollHeight/2), c.left+pageXOffset+(node.scrollWidth/2), matches[2]);
		}
	});
	console.log("*** stop node");

	var element = document.querySelector(".android_block");
	var prop = window.getComputedStyle(element).getPropertyValue('background-image');
	var re = /url\((['"])?(.*?)\1\)/gi;
	var matches;
	while ((matches = re.exec(prop)) !== null) {
		console.log(matches[2]);
	}

	  document.head.insertAdjacentHTML("beforeend",
		`<style data-style=qwert>
			.qwert_get-img {
				z-index: 999; 
				position: absolute;  
				filter: drop-shadow(1px 0px 2px #000);
				transform: translateX(0px);
			}
			.center-con {
				filter: drop-shadow(1px 0px 2px #000);
			}
			.qwert_get-img_bg{
				position: absolute;   
				width:0px;
				height:0px;
				background-repeat:no-repeat;
				background-size:contain;
				background-position: 10px 10px;
				filter: drop-shadow(1px 0px 2px #000);
			}
			.qwert_get-img:hover {
				z-index: 1000; 
				width:100px;
				height:100px;
				transform: translateX(-50px);
			}
			.qwert_get-img:hover .qwert_get-img_bg {
				width:100px;
				height:100px;
				background-position:center center;
			}
			.qwert_get-img:hover::before{    
				content: '';
				width: 100px;
				height: 100px;
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==);
				background-repeat: repeat;
				display: block;
				position: absolute;
			}

			.qwert_get-img .center-con {
				transform: rotate(90deg);
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.qwert_get-img .round {
				position: absolute;
				border: 2px solid #fff;
				width: 40px;
				height: 40px;
				border-radius: 100%;
				
			}
			
			.qwert_get-img_cta{
				width:100%; cursor: pointer; position: absolute;
			}
			
			.qwert_get-img_cta .arrow{left: 30%;}
			.arrow {position: absolute; bottom: 0;  margin-left:0px; width: 12px; height: 12px; background-size: contain; top:12px;}
			.segunda{margin-left: 8px;}
			.next {
				background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHN0eWxlPi5zdDB7ZmlsbDojZmZmfTwvc3R5bGU+PHBhdGggY2xhc3M9InN0MCIgZD0iTTMxOS4xIDIxN2MyMC4yIDIwLjIgMTkuOSA1My4yLS42IDczLjdzLTUzLjUgMjAuOC03My43LjZsLTE5MC0xOTBjLTIwLjEtMjAuMi0xOS44LTUzLjIuNy03My43UzEwOSA2LjggMTI5LjEgMjdsMTkwIDE5MHoiLz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzE5LjEgMjkwLjVjMjAuMi0yMC4yIDE5LjktNTMuMi0uNi03My43cy01My41LTIwLjgtNzMuNy0uNmwtMTkwIDE5MGMtMjAuMiAyMC4yLTE5LjkgNTMuMi42IDczLjdzNTMuNSAyMC44IDczLjcuNmwxOTAtMTkweiIvPjwvc3ZnPg==);
			}
			
			@keyframes bounceAlpha {
			  0% {opacity: 1; transform: translateX(0px) scale(1);}
			  25%{opacity: 0; transform:translateX(10px) scale(0.9);}
			  26%{opacity: 0; transform:translateX(-10px) scale(0.9);}
			  55% {opacity: 1; transform: translateX(0px) scale(1);}
			}
			
			.bounceAlpha {
				animation-name: bounceAlpha;
				animation-duration:1.4s;
				animation-iteration-count:infinite;
				animation-timing-function:linear;
			}
			
			.arrow.primera.bounceAlpha {
				animation-name: bounceAlpha;
				animation-duration:1.4s;
				animation-delay:0.2s;
				animation-iteration-count:infinite;
				animation-timing-function:linear;
			}
			
			.qwert_get-img:hover .arrow{
				animation-name: bounceAlpha;
				animation-duration:1.4s;
				animation-iteration-count:infinite;
				animation-timing-function:linear;
			}
			.qwert_get-img:hover .arrow.primera{
				animation-name: bounceAlpha;
				animation-duration:1.4s;
				animation-delay:0.2s;
				animation-iteration-count:infinite;
				animation-timing-function:linear;
			}
		</style>`);  
}

setTimeout(function () {
	getImg();
}, 1000);


*/

});
