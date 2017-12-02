<?php
    $db_host = 'localhost:3306';
    $db_user = 'root';          
    $db_pass = 'root';          
    $db_name = 'hm';            
    $mysqli = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    if(mysqli_connect_errno()) {
        echo "Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
?>