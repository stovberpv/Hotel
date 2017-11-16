<?php

    require $_SERVER['DOCUMENT_ROOT'] . '/hm/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // get values from ajax
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["year"])) { 
        $year = $_GET["year"]; 
    } else { 
        echo "Year was not set"; 
    };

    if (isset($_GET["month"])) { 
        $month = $_GET["month"]; 
    } else { 
        echo "Month was not set";
    };

    //-------------------------------------------------------------------------------------------------
        // setup values
    //-------------------------------------------------------------------------------------------------
    //    $dayin = 01 . "." . $month . "." . $year;
    //    $dayout = cal_days_in_month(CAL_GREGORIAN, $month, $year) . "." . $month . "." . $year;
    $dayin  = $year . "-" . $month . "-" . 01;
    $dayout = $year . "-" . $month . "-" . cal_days_in_month(CAL_GREGORIAN, $month, $year);
    
    //-------------------------------------------------------------------------------------------------
        // prepare queryes
    //-------------------------------------------------------------------------------------------------
    $query = "SELECT * 
                FROM gl001 
                WHERE dayout >= ? 
                  AND dayin  <= ?";

    //-------------------------------------------------------------------------------------------------
        // execute query 1
    //-------------------------------------------------------------------------------------------------
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('ss', $dayin, $dayout);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = []; 
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $data['data'] = $rows;
    
    //-------------------------------------------------------------------------------------------------
        // execute query 2
    //-------------------------------------------------------------------------------------------------
    $data['total'] = mysqli_num_rows($result);

    //-------------------------------------------------------------------------------------------------
        // send result
    //-------------------------------------------------------------------------------------------------
    echo json_encode($data);
    
    //-------------------------------------------------------------------------------------------------
        // close connection
    //-------------------------------------------------------------------------------------------------
    $stmt->free_result();
    $stmt->close();

    $mysqli->close();

    function err2echo($id, $text, $conn) {
        switch ($id) {
            case 0 : echo $text . "Не удалось подключиться к MySQL: (" . $conn->connect_errno . ") " . $conn->connect_error; break;
            case 10: echo $text . "Ошибка подготовки: (" . $conn->errno . ") " . $conn->error; break;
            case 11: echo $text . "Ошибка привязки: : (" . $conn->errno . ") " . $conn->error; break;
            case 12: echo $text . "Ошибка выполнения: (" . $conn->errno . ") " . $conn->error; break;
            case 13: echo $text . "Ошибка переменных: (" . $conn->errno . ") " . $conn->error; break;
            case 14: echo $text . "Ошибка выборки:  : (" . $conn->errno . ") " . $conn->error; break;
            case 15: echo $text . "Ошибка результата: (" . $conn->errno . ") " . $conn->error; break;
            default: break;
        }
    }
    
?>
