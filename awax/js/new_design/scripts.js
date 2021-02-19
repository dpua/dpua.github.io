$(document).ready(function () {

	setTimeout(function () {
		$('#errors').fadeOut(400);
		$('#success').fadeOut(400);
	}, 3000);

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
				breakpoint: 800,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

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
		$(".menu-dropdown,.menu-dropdown-header").addClass("show");
		$(".language-dropdown").hide();
		$(".language").removeClass("show");
	});

	$('.btn-close').on('click', function () {
		$("#model-login,#model-reg,#model-password").hide();
		$(".menu-dropdown,.menu-dropdown-header").removeClass("show");
		$("body").removeClass("ovh");
	});

	var scrollTriggerdownload = 600,
		backdownload = function () {
			var scrollTop = $(window).scrollTop();
			if (scrollTop > scrollTriggerdownload) {
				$('.download-loader').addClass('show');
			} else {
				$('.download-loader').removeClass('show');
			}
		};


	$(".menu-dropdown-link").on("click", function () {
		if ($(this).hasClass('login-in')) {
			$(this).parent().toggleClass('login-in')
		} else {
			$("#model-login").toggle();
			$("body").toggleClass("ovh");
			$(".menu-dropdown").removeClass("show");
			$("#model-password,#model-reg").hide();
		}
	});

	if (window.location.hash === '#login') {
		$(".menu-dropdown-link").trigger('click');
	}


	$(".help-password").on("click", function () {
		$("#model-password").show();
		$("#model-login,#model-reg").hide();
		$(".menu-dropdown").removeClass("show");
	});


	$(".create-acc").on("click", function () {
		$("#model-reg").show();
		$("#model-login").hide();
		$(".menu-dropdown").removeClass("show");
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
		$(".menu-dropdown,.menu-dropdown-header").removeClass("show");
		$("#model-login,#model-reg,#model-password").hide();
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
			$(".language").toggleClass('show')
			$(".language-dropdown").toggle();
		});
	} else {
		// change functionality for larger screens
	}
});





window.addEventListener('DOMContentLoaded', ()=>{
	let toggle=false;
	const infoBlock=document.querySelector('.info-block'),
		  showListItem = document.getElementById("show_list_item");
	function showInfoBlock(){
		toggle=(toggle)?false:true;
		console.log("toggle:"+toggle);
		if(toggle){
			infoBlock.classList.add('info-block__show');
			showListItem.classList.add('to_top');
		}else{
			infoBlock.classList.remove('info-block__show');
			showListItem.classList.remove('to_top');
		}

	}
	showListItem.onclick = showInfoBlock;

	const tabs=document.querySelectorAll('.info-block__item-icon'),
	tabsContent=document.querySelectorAll('.info-block__content-block'),
	tabsParent=document.querySelector('.info-block__item');
console.log('start');
	function hideTabsContent(){
		tabs.forEach(i => {
			i.classList.remove('active');
		});
		tabsContent.forEach(i => {
			i.classList.remove('show');
			i.classList.add('hide');
			i.classList.remove('blockLeft');
			i.classList.remove('blockRight');
		});
	};
	function showTabsContent(i=0){

		tabsContent[i].classList.remove('hide');
		tabsContent[i].classList.add('show');
		tabs[i].classList.add('active');
	};	
	hideTabsContent();
	showTabsContent();
	
	tabsParent.addEventListener('click', (event)=> {
		if(event.target&&event.target.classList.contains('info-block__item-icon')){
			tabs.forEach((item, i)=>{
				if(event.target==item){
					hideTabsContent();
					showTabsContent(i);
				}
			});
		};
	});




	
	const buyButtons=document.querySelectorAll('.click_buy'),
	buyButtonsParent=document.querySelector('.info-block__item');
	function showBuyBlock(i){
		consele.log("buy"+i);
	}

	buyButtonsParent.addEventListener('click', (event)=> {
		event.preventDefault();
		if(event.target&&event.target.classList.contains('info-block__item-icon')){
			buyButtons.forEach((item, i)=>{
				if(event.target==item){
					event.preventDefault();
					showBuyBlock(i);
				}
			});
		};
	});





});