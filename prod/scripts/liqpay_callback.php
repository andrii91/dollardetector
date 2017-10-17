<?php
//database
$sql_user = 'dollar';
$sql_pass='YP6@575QsFXGY5BR';
$sql_db = 'dollar';
$sql_host = 'localhost';
$private_key = '3OpOHodrLkp1Ut3x8PWPsDhYVqwGegvzBuao351A';
$sms_user = 'konstantin.melnik@pochta.ru';
$sms_pass = '2199514';
$phone = '+380972199514';
$date_time = date("Y-m-d H:i:s"); 

$details = json_decode(base64_decode($_POST['data']),true);
if ($_POST['signature'] == base64_encode( sha1($private_key.$_POST['data'].$private_key, 1 ))) {
	if ($details["status"] == 'success' || $details["status"] == 'sandbox') {
		$liqpay = json_decode(base64_decode($details['dae']),true);
		$order_id = intval($liqpay['order_id']);
		$lp_order = $liqpay['lp_order'];
		try {
			$link = mysqli_connect($sql_host,$sql_user,$sql_pass);
			mysqli_select_db($link, $sql_db);
			mysqli_set_charset($link, "utf8");
		} catch (Exception $e) {
			echo mysqli_connect_error();
		}
		
		$query = "update orders set status='Оплачено', status_changed=NOW() where order_id=".$order_id." AND lp_order = '".$lp_order."'";
		
		try {
			$result = mysqli_fetch_row(mysqli_query($link, $query));		
		} catch (Exception $e) {
			echo mysqli_error($link);
		}
		
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
			<text><![CDATA[Заказ №' . $order_id . ' оплачен через LiqPay!]]></text>
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
		
		
		echo 'OK';
	}
}
?>