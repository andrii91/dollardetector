function onYouTubeIframeAPIReady(){player=new YT.Player("ytplayer",{events:{onReady:onPlayerReady}})}function onPlayerReady(){player.playVideo(),player.mute()}var tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);var player;$(document).ready(function(){var e=$(document).scrollTop(),t=$(".nav-top").height(),o=parseInt($(".nav-top").css("padding-top"));e>47&&($("nav").css({position:"fixed"}),$(".nav-top").css({height:0,padding:0})),$(document).scroll(function(){e=$(document).scrollTop(),$(".nav-top").css({height:t-e,"padding-top":o-e,"padding-bottom":o-e}),e>47?($("nav").css({position:"fixed"}),$(".nav-top").css({height:0,padding:0})):$(".nav-top").css({height:t+20,"padding-top":o,"padding-bottom":o})}),$(".characteristics-acordion h6").click(function(){$(this).parent().find(".content").slideToggle(400),$(this).toggleClass("active")}),$(".scroll").click(function(){var e=$(".registration").offset().top-0;$("body,html").animate({scrollTop:e},500)}),$(".scroll-uf_detectop").click(function(){var e=$(".uf_detectop").offset().top-63;$("body,html").animate({scrollTop:e},500)}),$(".scroll-m_detectop").click(function(){var e=$(".m_detectop").offset().top-40;$("body,html").animate({scrollTop:e},500)}),$(".scroll-characteristics").click(function(){var e=$(".characteristics").offset().top-40;$("body,html").animate({scrollTop:e},500)}),$(".scroll-video").click(function(){var e=$(".video").offset().top-40;$("body,html").animate({scrollTop:e},500)}),$(".mob-btn").click(function(){$(".menu").slideToggle()});var a=$(window).width();a<1040&&$(".menu li").click(function(){$(".menu").hide()}),$(".modal-btn").click(function(e){e.preventDefault,$("#"+$(this).data("modal")).show("1000"),$("#"+$(this).data("modal")).animate({opacity:1}),$("body").addClass("overl-h"),$(".overlay").show("1000")}),$(".overlay, .popup__close").click(function(){$("body").removeClass("overl-h"),$(".modal").hide("1000"),$(".overlay").hide("1000"),$(".modal").animate({opacity:0})})}),jQuery(document).ready(function(e){function t(e){var t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return e.replace(/[&<>"']/g,function(e){return t[e]})}e("select").each(function(){e(this).show(),e(this).width("100%")}),e("#phone").inputmask("+38 (099) 999-99-99"),e("#payment, #shipping").chosen({disable_search:"true"}),e("#city").chosen({disable_search_threshold:7,no_results_text:"Такой город не найден"}),e("#city_chosen").hide(),e("#warehouse").chosen({disable_search_threshold:7,no_results_text:"Такой склад не найден"}),e("#warehouse_chosen").hide(),e("#payment").change(function(){"np"==e(this).val()?e("#shipping_cost").html("Стоимость доставки согласно <br/>тарифов Новой Почты!"):e("#shipping_cost").html('<br/><span class="bigger">Бесплатная доставка!</span>')}),e("#city").change(function(){e.getJSON("scripts/dollardetector.php",{action:"getCityWarehouses",city:e(this).find(":selected").data("ref")},function(o){e("#warehouse").empty(),e("#warehouse").append('<option value="0" disabled selected>Выберите отделение</option>'),e.each(o.data,function(){e("#warehouse").append('<option value="'+t(this.DescriptionRu)+'">'+this.DescriptionRu+"</option>")}),e("#warehouse").trigger("chosen:updated")})}),e("#shipping").change(function(){"none"==e("#city_chosen").css("display")?e.getJSON("scripts/dollardetector.php",{action:"getCities"},function(o){e("#city").append('<option value="0" disabled selected>Выберите город</option>'),e.each(o.data,function(){e("#city").append('<option data-ref="'+this.Ref+'" value="'+t(this.DescriptionRu)+'">'+this.DescriptionRu+"</option>")}),e("#city").trigger("chosen:updated"),e("#city_chosen").show(),"address"==e("#shipping").val()?(e("#warehouse_chosen").hide(),e("#address").show()):(e("#address").hide(),e("#warehouse_chosen").show())}):"address"==e(this).val()?(e("#warehouse_chosen").hide(),e("#address").show()):(e("#address").hide(),e("#warehouse_chosen").show())}),e("#countbox").change(function(){e(this).val()<1&&e(this).val(1);var t=e(this).val()*e("#ppo").val(),o=e(this).val()*e("#oldprice").val();e("#total").text(t),e("#old").text(o),e("#totalsum").val(t)}),e(".chosen-container").each(function(){e(this).width("100%")}),e(".contacts_link").click(function(){e("#popup_overlay").show(),e("#popup").show()}),e("#popup_close, #popup_overlay").click(function(){e("#popup_overlay").hide(),e("#popup").hide()}),e("#submit_button").click(function(){var t="",o=e("#fio").val(),a=e("#phone").val(),s=e("#payment").find(":selected").val(),i=e("#shipping").find(":selected").val(),n=e("#city").find(":selected").val(),c=e("#warehouse").find(":selected").val(),l=e("#address").val();if(""==o&&(t+="Не указано имя и фамилия получателя\n"),""==a&&(t+="Не указан номер телефона\n"),0==s&&(t+="Не выбран способ оплаты\n"),0==i?t+="Не выбран способ доставки\n":(0==n&&(t+="Не выбран город для доставки\n"),"warehouse"!=i||0!=c&&"undefined"!=typeof c||(t+="Не выбрано отделение для доставки\n"),"address"==i&&""==l&&(t+="Не указан адрес для доставки\n")),""!=t)t+="\nПожалуйста, укажите необходимые данные и попробуйте ещё раз",alert(t);else{e("#sel_payment").val(s),e("#sel_shipping").val(i),e("#sel_city").val(n),e("#sel_warehouse").val(c),e("#sel_address").val(l),e("#submit_button").hide("slow"),e("#message").hide();var r=e("#zakaz").serialize();e.ajax({type:"POST",async:!0,url:"scripts/dollardetector.php",data:r,success:function(t){e("#message").html(t),e("#message").show("slow")},error:function(e,t){alert("Возникла ошибка: "+e.responseCode)}})}})});