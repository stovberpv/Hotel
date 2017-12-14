<?php

    require $_SERVER['DOCUMENT_ROOT'] . '/hm/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // 
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["sessionId"])) { $sessionId = $_GET["sessionId"]; } else { echo "Не удалось получить SESSION_ID: (" . $sessionId . ")"; }
    if (isset($_GET["year"])) { $year = $_GET["year"]; } else { die(err2echo(21, 'Выборка', ''));  };
    if (isset($_GET["month"])) { $month = $_GET["month"]; } else { die(err2echo(22, 'Выборка', '')); };

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
    $query = "UPDATE cf001 SET year = ?, month = ? WHERE user = ?";        
    if (!($stmt = $mysqli->prepare($query)))             { err2echo(10, "Выборка Настройки. ", $mysqli); }
    if (!$stmt->bind_param('sss', $year, $month, $user)) { err2echo(11, "Выборка Настройки. ", $mysqli); }
    if (!$stmt->execute())                               { err2echo(12, "Выборка Настройки. ", $mysqli); }   
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
            case 21: echo $text . "Год не определен: (" . $conn->errno . ") " . $conn->error; break;
            case 22: echo $text . "Месяц не определен: (" . $conn->errno . ") " . $conn->error; break;
            default: break;
        }
    }

?>