<?php
    #
    # EZYRO
    #
    $db_host = 'sql213.ezyro.com';
    $db_user = 'ezyro_21252859';          
    $db_pass = 'zaq12wsX';          
    $db_name = 'ezyro_21252859_hm';
    #
    # ZZZ HOSTING
    #
    // $db_host = 'mysql.zzz.com.ua';
    // $db_user = 'stovberpv';          
    // $db_pass = 'Kolbaska131';          
    // $db_name = 'stovberpv';      

    #
    #
    #
    $mysqli = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    if(mysqli_connect_errno()) {
        die();
    }
    #
    #
    #
    mysqli_set_charset($mysqli, 'utf8');
?>