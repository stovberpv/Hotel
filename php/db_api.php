<?php

    echo json_encode("success");
/*
    $db_host = 'localhost:3306';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'hm';

    $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

    if(mysqli_connect_errno()) {
        die("Failed to connect to MySQL: " . mysqli_connect_error());
    }

    if (isset($_POST["year"])) { 
        $year = $_POST["year"]; 
    } else { 
        die("Year was not set"); 
    };

    if (isset($_POST["month"])) { 
        $month = $_POST["month"]; 
    } else { 
        die("Month was not set"); 
    };
/*
    $dayin = 1;
    $dayout = cal_days_in_month(CAL_GREGORIAN, $month, $year);
    
    $query = 'SELECT * FROM gl001 WHERE dayout >= ? AND dayin <= ?';

    $stmt = $conn->prepare($query);
    $stmt.bind_param('ss', $dayin, $dayout);
    $stmt.execute();
    $stmt.bind_result();

    $result = $stmt->get_result();
    
    echo json_encode(["agada"]);

    $stmt->free_result();
    $stmt->close();

    $conn->close();
*/
?>