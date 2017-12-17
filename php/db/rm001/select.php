<?php

    require $_SERVER['DOCUMENT_ROOT'] . '/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // Выборка Комнаты
    //-------------------------------------------------------------------------------------------------
    $query = "SELECT room FROM rm001";
    if (!($result = $mysqli->query($query))) { err2echo(12, "Выборка Комнаты. ", $mysqli); }
    $rooms = [];
    while($row = $result->fetch_array()) {
        $rooms[] = $row;
    }
    
    $data['rooms'] = $rooms;

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