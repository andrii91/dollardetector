var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady() {
  player.playVideo();
  // Mute!
  player.mute();
}

$(document).ready(function () {
  var y = $(document).scrollTop();
  var navTopHeight = $('.nav-top').height();
  var navTopPaddingTop = parseInt($('.nav-top').css("padding-top"));
  if (y > 47) {
    $('nav').css({
      'position': 'fixed',
    });
    $('.nav-top').css({
      'height': 0,
      'padding': 0
    });
  }

  $(document).scroll(function () {
    y = $(document).scrollTop();
    $('.nav-top').css({
      'height': navTopHeight - y,
      'padding-top': navTopPaddingTop - y,
      'padding-bottom': navTopPaddingTop - y,
    });
    if (y > 47) {
      $('nav').css({
        'position': 'fixed',
      });
      $('.nav-top').css({
        'height': 0,
        'padding': 0
      });
    } else {
      $('.nav-top').css({
        'height': navTopHeight +20,
        'padding-top': navTopPaddingTop,
        'padding-bottom': navTopPaddingTop,
      });
    }
  });
  
  $('.characteristics-acordion h6').click(function(){
    $(this).parent().find('.content').slideToggle(400);
    $(this).toggleClass('active');
  });

  $('.scroll').click(function () {
    var destination = $(".registration").offset().top - 0;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.scroll-uf_detectop').click(function () {
    var destination = $(".uf_detectop").offset().top - 63;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.scroll-m_detectop').click(function () {
    var destination = $(".m_detectop").offset().top - 40;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.scroll-characteristics').click(function () {
    var destination = $(".characteristics").offset().top - 40;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.scroll-video').click(function () {
    var destination = $(".video").offset().top - 40;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  
  
  $('.mob-btn').click(function(){
      $('.menu').slideToggle();
  });
  var viewportWidth = $(window).width();
  if (viewportWidth < 1040) {
    $('.menu li').click(function(){
        $('.menu').hide();
    });
  };
  if (viewportWidth < 414) {
  	$('.registration-btn').remove();
    $('.menu').append('<li><button class="registration-btn scroll">Купить</button></li>')
  };
  
    $('.modal-btn').click(function (e) {
    e.preventDefault;
    $('#' + $(this).data('modal')).show('1000');
    $('#' + $(this).data('modal')).animate({
      opacity: 1,
    });
    $('body').addClass('overl-h');
    $('.overlay').show('1000');
  });
  $('.overlay, .popup__close').click(function () {
    $('body').removeClass('overl-h');
    $('.modal').hide('1000');
    $('.overlay').hide('1000');
    $('.modal').animate({
      opacity: 0,
    });
  });
  
});
jQuery(document).ready(function($) {
	
	$('select').each(function() {
		$(this).show();
		$(this).width('100%');
	});
	
	 $('#phone').inputmask("+38 (099) 999-99-99");
	 //$('#phone').mask("+38 (000) 00-00-00", {placeholder: "+38 (___) ___-__-__"});
	
	$("#payment, #shipping").chosen({
		disable_search: "true"
	});
		
	$("#city").chosen({
			disable_search_threshold: 7,
			no_results_text: "Такой город не найден",
	});
	
	$("#city_chosen").hide();	
		
	$("#warehouse").chosen({
		disable_search_threshold: 7,
		no_results_text: "Такой склад не найден",
	});
	
	$("#warehouse_chosen").hide();	

	$("#payment").change(function() {
		if ($(this).val()=='np'){
			$("#shipping_cost").html('Стоимость доставки согласно <br/>тарифов Новой Почты!');
		} else {
			$("#shipping_cost").html('<br/><span class="bigger">Бесплатная доставка!</span>');	
		}
	});
	
	$("#city").change(function() {
		$.getJSON("scripts/dollardetector.php", {action : "getCityWarehouses", city : $(this).find(':selected').data('ref')}, function(data) {
			//console.log(data.data);
			$("#warehouse").empty();
			$("#warehouse").append('<option value="0" disabled selected>Выберите отделение</option>');
			$.each(data.data, function(){
				$("#warehouse").append('<option value="'+ escapeHtml(this.DescriptionRu) +'">'+ this.DescriptionRu +'</option>');
			});
			$("#warehouse").trigger("chosen:updated");
		})
	});
	
	$("#shipping").change(function() {
		//console.log($("#city_chosen").css('display'));
		if ($("#city_chosen").css('display')=='none') {
			$.getJSON("scripts/dollardetector.php", {action : "getCities"}, function(data) {
				$("#city").append('<option value="0" disabled selected>Выберите город</option>');
				$.each(data.data, function(){
					$("#city").append('<option data-ref="'+this.Ref+'" value="'+ escapeHtml(this.DescriptionRu) +'">'+ this.DescriptionRu +'</option>');
				});
				$("#city").trigger("chosen:updated");
				$("#city_chosen").show();
				if ($("#shipping").val()=='address'){
					$("#warehouse_chosen").hide();	
					$("#address").show();	
				} else {
					$("#address").hide();
					$("#warehouse_chosen").show();
				}
			})
		} else {
			if ($(this).val()=='address'){
				$("#warehouse_chosen").hide();	
				$("#address").show();	
			} else {
				$("#address").hide();
				$("#warehouse_chosen").show();
			}

		}
	});
	
	$("#countbox").change(function() {
		if ($(this).val() < 1) $(this).val(1);
		var total = $(this).val()*$("#ppo").val();
		var old = $(this).val()*$("#oldprice").val();
		$("#total").text(total);
		$("#old").text(old);
		$("#totalsum").val(total);
	});
		
	$('.chosen-container').each(function() {
		$(this).width('100%');
	});
	
	$(".contacts_link").click(function () {			
		$('#popup_overlay').show();	
		$('#popup').show();							    
	});
	
	$('#popup_close, #popup_overlay').click(function(){
		$('#popup_overlay').hide();
		$('#popup').hide();				
	});
		
	$("#submit_button").click(function() {
		var errors = '';
		var fio = $('#fio').val();
		var phone = $('#phone').val();
		var payment = $('#payment').find(':selected').val();
		var shipping = $('#shipping').find(':selected').val();
		var city = $('#city').find(':selected').val();
		var warehouse = $('#warehouse').find(':selected').val();
		var address = $('#address').val();
		/*console.log('shipping - '+shipping);
		console.log('address - '+address);
		console.log('city - '+city);
		console.log('warehouse - '+warehouse);*/
		if (fio == '') errors += 'Не указано имя и фамилия получателя\n';
		if (phone == '') errors += 'Не указан номер телефона\n';
		if (payment == 0) errors += 'Не выбран способ оплаты\n';
		if (shipping ==0) {
			errors += 'Не выбран способ доставки\n';
		} else {
			if (city == 0) errors += 'Не выбран город для доставки\n';
			if (shipping == 'warehouse' && (warehouse == 0 || typeof warehouse == 'undefined')) errors += 'Не выбрано отделение для доставки\n';
			if (shipping == 'address' && address == '') errors += 'Не указан адрес для доставки\n';
		}
		
		if (errors !='') {
			errors += '\nПожалуйста, укажите необходимые данные и попробуйте ещё раз';
			alert(errors);
		} else {
			$('#sel_payment').val(payment);
			$('#sel_shipping').val(shipping);
			$('#sel_city').val(city);
			$('#sel_warehouse').val(warehouse);
			$('#sel_address').val(address);
			$('#submit_button').hide("slow");
			$('#message').hide();
			var formdata   = $('#zakaz').serialize();
			$.ajax({
				type: 'POST',
				async: true,
				url: 'scripts/dollardetector.php',
				data: formdata,
				success: function(data) {
					$('#message').html(data);
					$('#message').show("slow");
				},
				error:  function(xhr, str){
					alert('Возникла ошибка: ' + xhr.responseCode);
				}
			});
		}
	});
	
	function escapeHtml(texta) {
	  var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	  };

	  return texta.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	
});