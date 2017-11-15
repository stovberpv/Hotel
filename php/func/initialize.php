<?php

    require $_SERVER['DOCUMENT_ROOT'] . '/hm/php/db/hm.php';
    
    //-------------------------------------------------------------------------------------------------
        // 
    //-------------------------------------------------------------------------------------------------
    $mysqli = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    if(mysqli_connect_errno()) { err2echo(0, "", $mysqli); }
    
    //-------------------------------------------------------------------------------------------------
        // 
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["sessionId"])) {
        $sessionId = $_GET["sessionId"];
    } else { 
        echo "Не удалось получить SESSION_ID: (" . $sessionId . ")";
    }
    //-------------------------------------------------------------------------------------------------
        // Выборка 0 TODO session ID
    //-------------------------------------------------------------------------------------------------
    /*
    $query = "SELECT user FROM sessions WHERE session = ?";
    if (!($stmt = $mysqli->prepare($query))) { err2echo(10, "Выборка 0. ", $mysqli); }
    if (!$stmt->bind_param('s', $sessionId)) { err2echo(11, "Выборка 0. ", $mysqli); }
    if (!$stmt->execute())                   { err2echo(12, "Выборка 0. ", $mysqli); }   
    if (!$stmt->bind_result($user))          { err2echo(13, "Выборка 0. ", $mysqli); }
    if (!$stmt->fetch())                     { err2echo(14, "Выборка 0. ", $mysqli); }
    
    $stmt->close();
    */
    $user = $sessionId;
    //-------------------------------------------------------------------------------------------------
        // Выборка 1
    //-------------------------------------------------------------------------------------------------
    $query = "SELECT year, month FROM config WHERE user = ?";        
    if (!($stmt = $mysqli->prepare($query))) { err2echo(10, "Выборка 1. ", $mysqli); }
    if (!$stmt->bind_param('s', $user))      { err2echo(11, "Выборка 1. ", $mysqli); }
    if (!$stmt->execute())                   { err2echo(12, "Выборка 1. ", $mysqli); }   
    if (!$stmt->bind_result($year, $month))  { err2echo(13, "Выборка 1. ", $mysqli); }
    if (!$stmt->fetch())                     { err2echo(14, "Выборка 1. ", $mysqli); }
    
    $data['year'] = $year;
    $data['month'] = $month;
    
    $stmt->close();
    
    //-------------------------------------------------------------------------------------------------
        // Выборка 2
    //-------------------------------------------------------------------------------------------------
    $query = "SELECT room FROM rooms";
    if (!($result = $mysqli->query($query))) { err2echo(12, "Выборка 2. ", $mysqli); }
    $rooms = [];
    while($row = $result->fetch_array()) {
        $rooms[] = $row;
    }
    
    $data['rooms'] = $rooms;
    
    //-------------------------------------------------------------------------------------------------
        // Выборка 3
    //-------------------------------------------------------------------------------------------------        
    $dayin  = $year . "-" . $month . "-" . 01;
    $dayout = $year . "-" . $month . "-" . cal_days_in_month(CAL_GREGORIAN, $month, $year);
    
    $query = "SELECT * FROM gl001 WHERE dayout >= ? AND dayin  <= ?";
    if (!($stmt = $mysqli->prepare($query)))       { err2echo(10, "Выборка 3. ", $mysqli); }
    if (!$stmt->bind_param('ss', $dayin, $dayout)) { err2echo(11, "Выборка 3. ", $mysqli); }
    if (!$stmt->execute())                         { err2echo(12, "Выборка 3. ", $mysqli); }  
    if (!($result = $stmt->get_result()))          { err2echo(15, "Выборка 3. ", $mysqli); }
    $guestList = []; 
    while($row = $result->fetch_array()) {
        $guestList[] = $row;
    }
    
    $data['guestList'] = $guestList;
    
    $stmt->close();
    
    $mysqli->close();
    /*
    printf($data['year']);
    printf(' / ');
    printf($data['month']);
    printf(' / ');
    printf(count($data['rooms']));
    printf(' / ');
    printf(count($data['guestList']));
    */
    echo json_encode($data);
        
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