<?php

    $dbhost = 'localhost:3036';
    $dbuser = 'root';
    $dbpass = 'rootpassword';
    $dbname = 'mydb';

    $conn = new mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

    if(mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    echo "I have a .";
    $month = $_POST['selectMonth'];
    $year = $_POST['selectYear'];
    $dayin = 1;
    $dayout = cal_days_in_month(CAL_GREGORIAN, $month, $year);
    
    $query = 'SELECT * FROM gl001 WHERE dayout >= ? AND dayin <= ?';
    $statement = $conn->prepare($query);
    $statement.bind_param('ss', $dayin, $dayout);
    $statement.execute();
    $statement.bind_result();

?>
