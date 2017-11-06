<?php 

     include 'db-config.php';

    //-------------------------------------------------------------------------------------------------
        // connection to db
    //-------------------------------------------------------------------------------------------------
    $mysqli = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

    if(mysqli_connect_errno()) {
        echo "Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }

    //-------------------------------------------------------------------------------------------------
        // get values from ajax
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["year"]))   { $year   = $_GET["year"];   } else { $year   = ""; };
    if (isset($_GET["month"]))  { $month  = $_GET["month"];  } else { $month  = ""; };
    if (isset($_GET["dayin"]))  { $dayin  = $_GET["dayin"];  } else { $dayin  = ""; }
    if (isset($_GET["dayout"])) { $dayout = $_GET["dayout"]; } else { $dayout = ""; }
    if (isset($_GET["room"]))   { $room   = $_GET["room"];   } else { $room   = ""; }
    if (isset($_GET["price"]))  { $price  = $_GET["price"];  } else { $price  = ""; }
    if (isset($_GET["paid"]))   { $paid   = $_GET["paid"];   } else { $paid   = ""; }
    if (isset($_GET["name"]))   { $name   = $_GET["name"];   } else { $name   = ""; }
    if (isset($_GET["tel"]))    { $tel    = $_GET["tel"];    } else { $tel    = ""; }
    if (isset($_GET["info"]))   { $info   = $_GET["info"];   } else { $info   = ""; }

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
    }

    //-------------------------------------------------------------------------------------------------
        // prepare queryes
    //-------------------------------------------------------------------------------------------------
    $query = "INSERT
                INTO gl001(dayin, dayout, room, price, paid, name, tel, info)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    //-------------------------------------------------------------------------------------------------
        // execute query 1
    //-------------------------------------------------------------------------------------------------
    if (!($stmt = $mysqli->prepare($query))) {
        echo "Не удалось подготовить запрос: (" . $mysqli->errno . ") " . $mysqli->error;
    }
    if (!$stmt->bind_param('ssiddsss', $begda, $endda, $room, $price, $paid, $name, $tel, $info)) {
        echo "Не удалось привязать параметры: (" . $stmt->errno . ") " . $stmt->error;
    }
    if (!$stmt->execute()) {
        echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
}   
    $data['id'] = mysqli_insert_id($mysqli);
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

?>
