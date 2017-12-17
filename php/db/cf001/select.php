<?php

    require $_SERVER['DOCUMENT_ROOT'] . '/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // 
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["sessionId"])) {
        $sessionId = $_GET["sessionId"];
    } else { 
        echo "Не удалось получить SESSION_ID: (" . $sessionId . ")";
    }


    //-------------------------------------------------------------------------------------------------
        // Выборка Пользователь 
        
        /* TODO: session ID
        */
    //-------------------------------------------------------------------------------------------------
    /*
    $query = "SELECT us001 FROM sessions WHERE session = ?";
    if (!($stmt = $mysqli->prepare($query))) { err2echo(10, "Выборка Пользователь. ", $mysqli); }
    if (!$stmt->bind_param('s', $sessionId)) { err2echo(11, "Выборка Пользователь. ", $mysqli); }
    if (!$stmt->execute())                   { err2echo(12, "Выборка Пользователь. ", $mysqli); }   
    if (!$stmt->bind_result($user))          { err2echo(13, "Выборка Пользователь. ", $mysqli); }
    if (!$stmt->fetch())                     { err2echo(14, "Выборка Пользователь. ", $mysqli); }
    
    $stmt->close();
    */
    $user = $sessionId;


    //-------------------------------------------------------------------------------------------------
        // Выборка Настройки 
    //-------------------------------------------------------------------------------------------------
    $query = "SELECT year, month FROM cf001 WHERE user = ?";        
    if (!($stmt = $mysqli->prepare($query))) { err2echo(10, "Выборка Настройки. ", $mysqli); }
    if (!$stmt->bind_param('s', $user))      { err2echo(11, "Выборка Настройки. ", $mysqli); }
    if (!$stmt->execute())                   { err2echo(12, "Выборка Настройки. ", $mysqli); }   
    if (!$stmt->bind_result($year, $month))  { err2echo(13, "Выборка Настройки. ", $mysqli); }
    if (!$stmt->fetch())                     { err2echo(14, "Выборка Настройки. ", $mysqli); }
    
    $data['year'] = $year;
    $data['month'] = $month;
    
    $stmt->close();

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