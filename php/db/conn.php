<?php
    //-------------------------------------------------------------------------------------------------
        // db setup
    //-------------------------------------------------------------------------------------------------
    $db_host = 'localhost:3306';    //TODO: server host
    $db_user = 'root';              //TODO: find soultion
    $db_pass = 'root';              //TODO: find soultion
    $db_name = 'hm';                //TODO: server db

    //-------------------------------------------------------------------------------------------------
        // connection to db
    //-------------------------------------------------------------------------------------------------
    $mysqli = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

    if(mysqli_connect_errno()) {
        echo "Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
?>