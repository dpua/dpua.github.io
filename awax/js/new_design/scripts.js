'use strict';
var InfoBlockScroll=true;
var toggle=!InfoBlockScroll;
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
				breakpoint: 820,
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
		if ($(this).hasClass('close')) {
			$(this).removeClass('close');
			$(this).addClass('active');
			$(".menu-dropdown,.menu-dropdown-header").addClass("show");
			$(".language-dropdown").hide();
			$(".language").removeClass("show");
			$("body").addClass("ovh");
		} else {
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
			if ((scrollTop > scrollTriggerdownload) && !toggle) {
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
		$("label[for='" + input.attr('id') + "']").addClass("animate-label");
	});

	if ($(window).width() < 820) {
		$(".language").on('click', function () {
			$(".language").toggleClass('show');
			$(".language-dropdown").toggle();
		});
	} else {
		// change functionality for larger screens
	}
	initChooseDevice();
	initHeader();
});

function initHeader(){
	const videoPlayer=document.getElementById('video-player');
	function showVideoPlayer(){
		//var iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/2BA0RFw-Zsk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
		//videoPlayer.innerHTML=iframe;
		document.querySelector('#start-video-player').classList.remove('delay');
		videoPlayer.classList.add('active');
		document.querySelector('#start-video-player').classList.add('active');
		setTimeout(
			() => {
				var iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/2BA0RFw-Zsk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
				videoPlayer.innerHTML=iframe;
			}, 300
		);
	}
	function videoPlayerClose(){
		videoPlayer.innerHTML='';
		videoPlayer.classList.remove('active');
		document.querySelector('#start-video-player').classList.remove('active');
	}

	videoPlayer.onclick=videoPlayerClose;

	document.getElementById('start-video-player').onclick=showVideoPlayer;

	document.querySelector(".header_img_group").classList.add("active");
	document.querySelector(".mob_header_img_group").classList.add("active");
	document.getElementById('start-video-player').classList.remove("hidden");
}

function initChooseDevice() {


	const infoBlock = document.querySelector('.info-block'),
		showListItem = document.getElementById("show_list_item"),
		hideListItem = document.getElementById("info-block__title-ico");

	function showInfoBlock(iScroll) {
		toggle = (toggle) ? false : true;
		if (toggle) {
			window.history.replaceState(null, null, "?device="+(1+tabId));
			
			var times = 0;
			if(iScroll){
				times = 300;
				$('html,body').animate({
					scrollTop: $("#list_info").offset().top - 70//+80
				}, times);
			}
			setTimeout(
				() => {
					infoBlock.classList.add('info-block__show');
					showListItem.classList.add('to_top');
					$('.download-loader').removeClass('show');
					$('#info-block__title-logo').addClass('start');
				}, times + 100
			);

		} else {
			infoBlock.classList.remove('info-block__show');
			showListItem.classList.remove('to_top');
			$('#info-block__title-logo').removeClass('start');
			window.history.replaceState(null, null, "?");
		}
	}

	showListItem.onclick = ()=>showInfoBlock(true);
	hideListItem.onclick = showInfoBlock;

	$(window).on('scroll', function () {
		if(InfoBlockScroll){
			let e = $("#list_info").offset().top-70;
			let scrollTop = $(window).scrollTop();
			if(scrollTop>=e){
				InfoBlockScroll=false;
				showInfoBlock();
			}
		}
	});

	const tabs = document.querySelectorAll('.info-block__item-icon'),
		tabsContent = document.querySelectorAll('.info-block__content-block'),
		tabsParent = document.querySelector('.info-block__item'),
		tabsContentParent = document.querySelector('.info-block__content'),
		infoBlockDescription = document.getElementById('info-block-description');

	let description = [], installUrls = [];
	var tabId = 0;
	let timer = 0;

	tabs.forEach(i => {
		description.push(i.dataset.description);
		installUrls.push(i.dataset.urls);
	});

	function typeWriter(timers, e, txt, s = 4, i = s) {
		if (timer !== timers) return false;
		if (i < txt.length) {
			let a = (i < txt.length - 1) ? '_' : '';
			let txti = txt.substring(0, s) + txt.substring(s, 1 + i) + a;
			e.innerHTML = txti;
			i++;
			setTimeout(() => typeWriter(timers, e, txt, s, i), 300 / (txt.length - s));
		}
	}

	function hideTabsContent() {
		tabs.forEach(i => {
			i.classList.remove('active');
		});
		tabsContent.forEach(i => {
			i.classList.remove('item-show');
			i.classList.add('item-hide');
			i.classList.remove('blockLeft');
			i.classList.remove('blockRight');
		});
	}

	function showTabsContent(i = 0) {
		tabsContent[i].classList.remove('item-hide');
		tabsContent[i].classList.add('item-show');
		tabs[i].classList.add('active');
		infoBlockDescription.innerHTML = '';//description[i];
		timer = i;
		typeWriter(timer, infoBlockDescription, description[i]);
		tabId = i;
	}
	hideTabsContent();
	showTabsContent();

	tabsParent.addEventListener('click', (event) => {
		if (event.target && event.target.classList.contains('info-block__item-icon')) {
			tabs.forEach((item, i) => {
				if (event.target === item && i !== tabId) {
					window.history.replaceState(null, null, "?device="+(1+i));
					hideTabsContent();
					showTabsContent(i);
				}
			});
		}
	});

	let params = new URLSearchParams(location.search);
	let device = parseInt(params.get("device"));
	if(device){
		InfoBlockScroll=false;
		hideTabsContent();
		showTabsContent(device-1);
		showInfoBlock();
	}


	function installHref() {
		window.open(installUrls[tabId], '_blank');
	}

	document.getElementById("install-href").onclick = installHref;


	var xDown = null;
	var yDown = null;

	function handleTouchStart(evt) {
		xDown = evt.touches[0].clientX;
		yDown = evt.touches[0].clientY;
	}

	function swipe(e) {
		let i = tabId + e;
		if (i > (tabs.length - 1)) i = 0;
		if (i < 0) i = (tabs.length - 1);
		hideTabsContent();
		showTabsContent(i);
	}

	function handleTouchMove(evt) {
		if (!xDown || !yDown) {
			return;
		}

		var xUp = evt.touches[0].clientX;
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;
		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			if (xDiff > 0) {
				swipe(1);
			} else {
				swipe(-1);
			}
		}
		/* reset values */
		xDown = null;
		yDown = null;
	}
	tabsContentParent.addEventListener('touchstart', handleTouchStart, false);
	tabsContentParent.addEventListener('touchmove', handleTouchMove, false);

}
