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
    require $_SERVER['DOCUMENT_ROOT'] . '/utils.php';
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
    $unid =  isset($_GET["unid"]) ? $_GET["unid"] : "";
    $year =  isset($_GET["year"]) ? $_GET["year"] : "";
    $mnth =  isset($_GET["mnth"]) ? $_GET["mnth"] : "";
    $dbeg =  isset($_GET["dbeg"]) ? $_GET["dbeg"] : "";
    $dend =  isset($_GET["dend"]) ? $_GET["dend"] : "";
    $days =  isset($_GET["days"]) ? $_GET["days"] : "";
    $room =  isset($_GET["room"]) ? $_GET["room"] : "";
    $base =  isset($_GET["base"]) ? $_GET["base"] : "";
    $adjs =  isset($_GET["adjs"]) ? $_GET["adjs"] : "";
    $cost =  isset($_GET["cost"]) ? $_GET["cost"] : "";
    $paid =  isset($_GET["paid"]) ? $_GET["paid"] : "";
    $name =  isset($_GET["name"]) ? $_GET["name"] : "";
    $teln =  isset($_GET["teln"]) ? $_GET["teln"] : "";
    $fnot =  isset($_GET["fnot"]) ? $_GET["fnot"] : "";
    $city =  isset($_GET["city"]) ? $_GET["city"] : "";
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $begda = "";
    if(strpos($dbeg, ".")) {
        $date = explode(".", $dbeg); $m = $date[1]; $d = $date[0];
        if(checkdate($m, $d, (float)$year)) { $begda = $year . "-" . $m . "-" . $d; }
        else { die(err2echo(22, 'Обновление гостя ', $mysqli)); }
    } else { $begda = $year . "-" . $mnth . "-" . $dbeg; }
    #
    $endda = "";
    if(strpos($dend, ".")) {
        $date = explode(".", $dend); $m = $date[1]; $d = $date[0];
        if(checkdate($m, $d, $year + 0)) { $endda = $year . "-" . $m . "-" . $d; }
        else { die(err2echo(21, 'Обновление гостя', $mysqli)); }
    } else { $endda = $year . "-" . $mnth . "-" . $dend; }
    #
    if ($begda > $endda) { die(err2echo(26, 'Обновление гостя', $mysqli)); }
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
    while($row = $result->fetch_assoc()) { $rows[] = $row; }
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
                     city = ?,
                     user = ?
                WHERE unid = ?";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Обновление гостя', $mysqli));
    !($stmt->bind_param('ssiiddddsssssi', 
                                        $begda,
                                        $endda,
                                        $days,
                                        $room,
                                        $base,
                                        $adjs,
                                        $cost,
                                        $paid,
                                        $name,
                                        $teln,
                                        $fnot,
                                        $city,
                                        $user,
                                        $unid)) && die(err2echo(11, 'Обновление гостя', $mysqli));
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
    while($row = $result->fetch_assoc()) { $rows[] = $row; }
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