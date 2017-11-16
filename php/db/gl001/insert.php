<?php 

    require $_SERVER['DOCUMENT_ROOT'] . '/hm/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // get values from ajax
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["year"]))      { $year      = $_GET["year"];      } else { $year      = ""; };
    if (isset($_GET["month"]))     { $month     = $_GET["month"];     } else { $month     = ""; };
    if (isset($_GET["dayin"]))     { $dayin     = $_GET["dayin"];     } else { $dayin     = ""; }
    if (isset($_GET["dayout"]))    { $dayout    = $_GET["dayout"];    } else { $dayout    = ""; }
    if (isset($_GET["room"]))      { $room      = $_GET["room"];      } else { $room      = ""; }
    if (isset($_GET["price"]))     { $price     = $_GET["price"];     } else { $price     = ""; }
    if (isset($_GET["paid"]))      { $paid      = $_GET["paid"];      } else { $paid      = ""; }
    if (isset($_GET["name"]))      { $name      = $_GET["name"];      } else { $name      = ""; }
    if (isset($_GET["tel"]))       { $tel       = $_GET["tel"];       } else { $tel       = ""; }
    if (isset($_GET["info"]))      { $info      = $_GET["info"];      } else { $info      = ""; }
    if (isset($_GET["sessionId"])) { $sessionId = $_GET["sessionId"]; } else { $sessionId = ""; }

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
        // setup values
    //-------------------------------------------------------------------------------------------------
    $begda = "";
    if(strpos($dayin, ".")) {
        $date = explode(".", $dayin);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, $year)) {
            $begda = $year . "-" . $m . "-" . $d;
        } else {
            echo "Не удалось вычислить день и месяц въезда из: (" . $dayin . ")";
        }
    } else {
        $begda = $year . "-" . $month . "-" . $dayin;
    }

    $endda = "";
    if(strpos($dayout, ".")) {
        $date = explode(".", $dayout);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, $year)) {
            $endda = $year . "-" . $m . "-" . $d;
        } else {
            echo "Не удалось вычислить день и месяц выезда из: (" . $dayout . ")";
        }
    } else {
        $endda = $year . "-" . $month . "-" . $dayout;
    }

    $timestamp = date('Y-m-d H:i:s');

    //-------------------------------------------------------------------------------------------------
        // prepare queryes
    //-------------------------------------------------------------------------------------------------
    $query = "INSERT
                INTO gl001(dayin, dayout, room, price, paid, name, tel, info, user, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    //-------------------------------------------------------------------------------------------------
        // execute query 1
    //-------------------------------------------------------------------------------------------------
    if (!($stmt = $mysqli->prepare($query))) { err2echo(10, 'Добавление гостя. ', $mysqli); }
    if (!$stmt->bind_param('ssiddsssss', $begda, $endda, $room, $price, $paid, $name, $tel, $info, $user, $timestamp)) { err2echo(11, 'Добавление гостя. ', $mysqli); }
    if (!$stmt->execute()) { err2echo(12, 'Добавление гостя. ', $mysqli); }

    //-------------------------------------------------------------------------------------------------
        // 
    //-------------------------------------------------------------------------------------------------
    $data[0]['id'] = mysqli_insert_id($mysqli);
    $data[0]['dayin'] = $begda;
    $data[0]['dayout'] = $endda;
    $data[0]['room'] = $room;
    $data[0]['price'] = $price;
    $data[0]['paid'] = $paid;
    $data[0]['name'] = $name;
    $data[0]['tel'] = $tel;
    $data[0]['info'] = $info;

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
