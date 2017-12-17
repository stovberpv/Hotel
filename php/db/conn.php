<?php
    $db_host = '';
    $db_user = '';          
    $db_pass = '';          
    $db_name = '';            
    $mysqli = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    if(mysqli_connect_errno()) {
        echo "Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
?>