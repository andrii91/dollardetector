<?php
//error_reporting( E_ALL );ini_set("display_errors", true);

$order_start_number = 45777;

//database
$sql_user = 'dollar';
$sql_pass='YP6@575QsFXGY5BR';
$sql_db = 'dollar';
$sql_host = 'localhost';

//sms
$sms_user = 'konstantin.melnik@pochta.ru';
$sms_pass = '2199514';

//liqpay
$lp_public = 'i91320815812';
$lp_private = '3OpOHodrLkp1Ut3x8PWPsDhYVqwGegvzBuao351A';

//novaposhta
$np_apikey = '99389ca7fee3a0eae73f908adf15b398';

//mailgun
$mg_apikey = 'key-72056e4858dad96342bde8668955808b';
$mg_domain = 'dollardetector.com.ua';
$to = array('dollardetector.com.ua@gmail.com');
$from = 'zakaz@dollardetector.com.ua';
/****************************************************************/

if($_POST) {
	//get form & prepare data
	$name = addslashes($_POST["fio"]);
	$phone = addslashes($_POST["phone"]);
	$address = addslashes($_POST["address"]);
	$exp = addslashes($_POST["exp"]);
	$ppo = addslashes($_POST["ppo"]);
	$payment = addslashes($_POST["sel_payment"]);
	$shipping  = addslashes($_POST["sel_shipping"]);
	if ($shipping == 'warehouse') $shipping = 'в отделение';
	if ($shipping == 'address') $shipping = 'адресная доставка курьером';
	$city = addslashes($_POST["sel_city"]);
	$warehouse = addslashes($_POST["sel_warehouse"]);
	$address = addslashes($_POST["sel_address"]);
	$count = addslashes($_POST["countbox"]);
	$sum = addslashes($_POST["totalsum"]);
	$fake=''; 
	$ppo=299;
	$sum = $count*$ppo;
	try {
		$link = mysqli_connect($sql_host,$sql_user,$sql_pass);
		mysqli_select_db($link, $sql_db);
		mysqli_set_charset($link, "utf8");
	} catch (Exception $e) {
		echo mysqli_connect_error();
	}
	
	$query = 'select count(*) as cnt from orders';
	try {
		$result = mysqli_fetch_row(mysqli_query($link, $query));		
	} catch (Exception $e) {
		echo mysqli_error($link);
	}
	
	$order_id = (($result[0]!= 0) ? $result[0]+$order_start_number : time());
	
	/*if ($exp == 'VuhuVDX9pB6Q9Pwa'){ 
		$ppo=399;
		if($count*$ppo != $sum) {
			$fake='Определена попытка наломать систему! Цена за 1 шт была 399 грн.';
			$sum = $count*$ppo;
		}
	}
	if ($exp == '5NpCQT3WmjwxXE3n') {
		$ppo=599;
		if ($count*$ppo != $sum) {
			$fake='Определена попытка наломать систему! Цена за 1 шт была 599 грн.';
			$sum = $count*$ppo;
		}
	}
	if ($exp == '4NvRPxdwQHZ7u8c8') {
		if ($count*$ppo != $sum) {
			$fake='Определена попытка наломать систему! Цена за 1 шт была 499 грн.';
			$sum = $count*$ppo;
		}
	}*/	
	
	$pay_info = '';  	$lp_order = '';  	$liqpay_html = '';
	
	if ($payment == 'np') $payment = 'наложенный платёж';
	
	if ($payment == 'lp') {
		require("liqpay_api.php");
		$payment = 'LiqPay';
		$lp_order = date("YmdHis") . sprintf("%06d", (microtime(true) - floor(microtime(true))) * 1000000);
		$liqpay = new LiqPay($lp_public, $lp_private);
		$liqpay_html = $liqpay->cnb_form(array(
			'version' => '3',
			'amount' => $sum,
			'currency' => 'UAH',
			'description' => 'DollarDetector, заказ №'.$order_id,
			'sandbox' => '0', //no sandbox!!!
			'result_url' => '',
			'server_url' => 'http://dollardetector.com.ua/scripts/liqpay_callback.php',
			'order_id' => $lp_order,
			'dae' => base64_encode(json_encode(array('order_id' => $order_id, 'lp_order' => $lp_order, 'phone' => $phone)))
		));
	}
	
	if ($payment == 'pb') {
		$payment = 'оплата на карту';
		$pay_info = 'Оплата '.$sum.' грн на карту Приватбанк 5169-3305-0873-8652 (Мельник К.В.)';
	}
	
	//$order_id = time();//date("Ymd-His");
	$date_time = date("Y-m-d H:i:s"); 
	
	//prepare & send email
	$subject="Заказ №$order_id ($name)";
	$body="
	Номер заказа: $order_id
	Дата и время: $date_time
	Получатель: $name
	Телефон: $phone
	Способ оплаты: $payment
	Способ доставки: $shipping
	Город: $city
	Склад: $warehouse
	Адрес: $address
	Количество: $count
	Цена за ед.: $ppo
	Сумма: $sum
	Примечание: $fake";
	

	try {
		include_once("Mailgun.php");
		$mg = new Mailgun($mg_apikey, $mg_domain );
		$mg->sendMessage($to, $from, $subject, $body); 
	} catch (Exception $e) {
		echo 'Проблема с отправкой письма';
	}

	
	//send sms
	
	$sms = '<?xml version="1.0" encoding="UTF-8"?>
	<SMS>
		<operations>
		<operation>SEND</operation>
		</operations>
		<authentification>
		<username><![CDATA[' . $sms_user .']]></username>
		<password><![CDATA[' . $sms_pass .']]></password>
		</authentification>
		<message>
		<sender>DETECTOR</sender>
		<text><![CDATA[Ваш заказ №' . $order_id . ' на сайте DollarDetector.com.ua успешно оформлен! '.$pay_info.']]></text>
		</message>
		<numbers>
		<number messageID="' . md5($phone.$date_time) . '">' . $phone . '</number>
		</numbers>
	</SMS>';

	$Curl = curl_init();
	$CurlOptions = array(
		CURLOPT_URL=>'http://api.atompark.com/members/sms/xml.php',
		CURLOPT_FOLLOWLOCATION=>false,
		CURLOPT_POST=>true,
		CURLOPT_HEADER=>false,
		CURLOPT_RETURNTRANSFER=>true,
		CURLOPT_CONNECTTIMEOUT=>5,
		CURLOPT_TIMEOUT=>5,
		CURLOPT_POSTFIELDS=>array('XML'=>$sms),
	);
	curl_setopt_array($Curl, $CurlOptions);
	if(false === ($result = curl_exec($Curl))) {
		echo 'Проблема с отправкой SMS';
	}
	curl_close($Curl);

	//write to DB
	$query = 'INSERT INTO orders (order_id, date_time, name, phone, payment, shipping, city, warehouse, address, count, ppo, sum, status, ttn, expid, lp_order) VALUES ('.$order_id.', now(), "'.$name.'", "'.$phone.'", "'.$payment.'", "'.$shipping.'", "'.$city.'", "'.$warehouse.'", "'.$address.'", '.$count.', '.$ppo.', '.$sum.', "Новый", "", "'.$exp.'", "'.$lp_order.'")';
	try {
		mysqli_query($link, $query); 
	} catch (Exception $e) {
		echo mysqli_error($link);
	}
	
	//return result
	echo "Заказ №$order_id оформлен!";
	if ($payment == 'LiqPay') echo $liqpay_html;
	
} else {
	//get cities list
    if ($_GET['action'] == 'getCities') {
		$post_data = array ( 
			"apiKey" => $np_apikey, 
			"modelName" => "Address", 
			"calledMethod" => "getCities", 
			"methodProperties" => array("" => "")
		);
		$data_string = json_encode($post_data);
		$curl = curl_init('https://api.novaposhta.ua/v2.0/json/');
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json',
			'Content-Length: ' . strlen($data_string))
		);					 
		$result = curl_exec($curl);
		echo $result;
	}
	//get warehouese lists
    if ($_GET['action'] == 'getCityWarehouses') {
		$post_data = array ( 
			"apiKey" => $np_apikey, 
			"modelName" => "Address", 
			"calledMethod" => "getWarehouses", 
			"methodProperties" => array("CityRef" => $_GET['city'])
		);
		$data_string = json_encode($post_data);
		$curl = curl_init('https://api.novaposhta.ua/v2.0/json/');
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json',
			'Content-Length: ' . strlen($data_string))
		);					 
		$result = curl_exec($curl);
		echo $result;
    }

}


?>