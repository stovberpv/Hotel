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
    isset($_GET['data']["unid"]) ? $unid = $_GET['data']["unid"] : $unid = "";
    isset($_GET['data']["year"]) ? $year = $_GET['data']["year"] : $year = "";
    isset($_GET['data']["mnth"]) ? $mnth = $_GET['data']["mnth"] : $mnth = "";
    isset($_GET['data']["dbeg"]) ? $dbeg = $_GET['data']["dbeg"] : $dbeg = "";
    isset($_GET['data']["dend"]) ? $dend = $_GET['data']["dend"] : $dend = "";
    isset($_GET['data']["days"]) ? $days = $_GET['data']["days"] : $days = "";
    isset($_GET['data']["room"]) ? $room = $_GET['data']["room"] : $room = "";
    isset($_GET['data']["base"]) ? $base = $_GET['data']["base"] : $base = "";
    isset($_GET['data']["adjs"]) ? $adjs = $_GET['data']["adjs"] : $adjs = "";
    isset($_GET['data']["cost"]) ? $cost = $_GET['data']["cost"] : $cost = "";
    isset($_GET['data']["paid"]) ? $paid = $_GET['data']["paid"] : $paid = "";
    isset($_GET['data']["name"]) ? $name = $_GET['data']["name"] : $name = "";
    isset($_GET['data']["teln"]) ? $teln = $_GET['data']["teln"] : $teln = "";
    isset($_GET['data']["fnot"]) ? $fnot = $_GET['data']["fnot"] : $fnot = "";
    isset($_GET['data']["city"]) ? $city = $_GET['data']["city"] : $city = "";
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $begda = "";
    if(strpos($dbeg, ".")) {
        $date = explode(".", $dbeg);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, (float)$year)) {
            $begda = $year . "-" . $m . "-" . $d;
        } else {
            die(err2echo(22, 'Обновление гостя ', $mysqli));
        }
    } else {
        $begda = $year . "-" . $month . "-" . $dbeg;
    }
    #
    $endda = "";
    if(strpos($dend, ".")) {
        $date = explode(".", $dend);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, $year + 0)) {
            $endda = $year . "-" . $m . "-" . $d;
        } else {
            die(err2echo(21, 'Обновление гостя', $mysqli));
        }
    } else {
        $endda = $year . "-" . $month . "-" . $dend;
    }
    #
    if ($begda > $endda) {
        die(err2echo(26, 'Обновление гостя', $mysqli));
    }
    #
    // $timestamp = date('Y-m-d H:i:s');
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "SELECT * FROM gl001 WHERE unid = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('i', $unid))    && die(err2echo(11, 'Обновление гостя', $mysqli));
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
                 SET dbeg = ?,
                     dend = ?,
                     days = ?,
                     room = ?,
                     base = ?,
                     adjs = ?,
                     cost = ?,
                     paid = ?,
                     name = ?,
                     teln = ?,
                     fnot = ?, 
                     city = ?                     
                WHERE id = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('ssiiddddsssssi', $dbeg, $dend, $days, $room, $base, $adjs, $cost, $paid, $name, $teln, $fnot, $city, $user, $unid)) && die(err2echo(11, 'Обновление гостя', $mysqli));
    !($stmt->execute()) && die(err2echo(12, 'Обновление гостя', $mysqli));
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "SELECT * FROM gl001 WHERE unid = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('i', $unid))    && die(err2echo(11, 'Обновление гостя', $mysqli));
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