<?php
    #---------------------------------------------------------------------------------
    # debug settings
    #---------------------------------------------------------------------------------
    if (true) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    require $_SERVER['DOCUMENT_ROOT'] . '/db/utils.php';
    #---------------------------------------------------------------------------------
    # check autorization
    #---------------------------------------------------------------------------------
    !isAuthorized() && die(err2echo(23, '', ''));
    #
    $user = getAuthUserName();
    #---------------------------------------------------------------------------------
    # connect to db
    #---------------------------------------------------------------------------------
    require $_SERVER['DOCUMENT_ROOT'] . '/db/conn.php';
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    isset($_GET["id"])     ? $id     = $_GET["id"]     : $id     = "";
    isset($_GET["year"])   ? $year   = $_GET["year"]   : $year   = "";
    isset($_GET["month"])  ? $month  = $_GET["month"]  : $month  = "";
    isset($_GET["dayin"])  ? $dayin  = $_GET["dayin"]  : $dayin  = "";
    isset($_GET["dayout"]) ? $dayout = $_GET["dayout"] : $dayout = "";
    isset($_GET["room"])   ? $room   = $_GET["room"]   : $room   = "";
    isset($_GET["price"])  ? $price  = $_GET["price"]  : $price  = "";
    isset($_GET["paid"])   ? $paid   = $_GET["paid"]   : $paid   = "";
    isset($_GET["name"])   ? $name   = $_GET["name"]   : $name   = "";
    isset($_GET["tel"])    ? $tel    = $_GET["tel"]    : $tel    = "";
    isset($_GET["fn"])     ? $fn     = $_GET["fn"]     : $fn     = "";
    isset($_GET["city"])   ? $city   = $_GET["city"]   : $city   = "";
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $begda = "";
    if(strpos($dayin, ".")) {
        $date = explode(".", $dayin);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, (float)$year)) {
            $begda = $year . "-" . $m . "-" . $d;
        } else {
            die(err2echo(22, 'Обновление гостя ', $mysqli));
        }
    } else {
        $begda = $year . "-" . $month . "-" . $dayin;
    }
    #
    $endda = "";
    if(strpos($dayout, ".")) {
        $date = explode(".", $dayout);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, $year + 0)) {
            $endda = $year . "-" . $m . "-" . $d;
        } else {
            die(err2echo(21, 'Обновление гостя', $mysqli));
        }
    } else {
        $endda = $year . "-" . $month . "-" . $dayout;
    }
    #
    if ($begda > $endda) {
        die(err2echo(26, 'Обновление гостя', $mysqli));
    }
    #
    $timestamp = date('Y-m-d H:i:s');
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "SELECT * FROM gl001 WHERE id = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('i', $id))      && die(err2echo(11, 'Обновление гостя', $mysqli));
    !($stmt->execute())                 && die(err2echo(12, 'Обновление гостя', $mysqli));
    !($result = $stmt->get_result())    && die(err2echo(15, 'Обновление гостя', $mysqli));   
    $rows = []; 
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    #
    $data['old'] = $rows;
    #
    $stmt->free_result();
    $stmt->close();
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "UPDATE gl001
                SET dayin = ?, dayout = ?, room = ?, price = ?, paid = ?, name = ?, tel = ?, fn = ?, city = ?, user = ?, timestamp = ?
                WHERE id = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('ssiddssssssi', $begda, $endda, $room, $price, $paid, $name, $tel, $fn, $city, $user, $timestamp, $id)) && die(err2echo(11, 'Обновление гостя', $mysqli));
    !($stmt->execute()) && die(err2echo(12, 'Обновление гостя', $mysqli));
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "SELECT * FROM gl001 WHERE id = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('i', $id))      && die(err2echo(11, 'Обновление гостя', $mysqli));
    !($stmt->execute())                 && die(err2echo(12, 'Обновление гостя', $mysqli));
    !($result = $stmt->get_result())    && die(err2echo(15, 'Обновление гостя', $mysqli));   
    $rows = []; 
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    #
    $data['new'] = $rows;
    #
    $stmt->free_result();
    $stmt->close();
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $data['status'] = true;
    echo json_encode($data);
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $mysqli->close();
?>