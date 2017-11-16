<?php 

    require $_SERVER['DOCUMENT_ROOT'] . '/hm/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // get values from ajax
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["id"])) {
        $id = $_GET["id"];
    } else { 
        echo "Не удалось получить ID: (" . $id . ") ";
    };

    //-------------------------------------------------------------------------------------------------
        // prepare queryes
    //-------------------------------------------------------------------------------------------------
    $query = "DELETE
                FROM gl001
                WHERE id = ?";

    //-------------------------------------------------------------------------------------------------
        // execute query 1
    //-------------------------------------------------------------------------------------------------
    if (!($stmt = $mysqli->prepare($query))) {
        echo "Не удалось подготовить запрос: (" . $mysqli->errno . ") " . $mysqli->error;
    }
    if (!$stmt->bind_param('i', $id)) {
        echo "Не удалось привязать параметры: (" . $stmt->errno . ") " . $stmt->error;
    }
    if (!$stmt->execute()) {
        echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
    }   

    $data['id'] = $id;
    $data['rows'] = mysqli_affected_rows($mysqli);
    
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