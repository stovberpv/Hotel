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
    // FIX isset = false!
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
        $begda = $year . "-" . $mnth . "-" . $dbeg;
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
        $endda = $year . "-" . $mnth . "-" . $dend;
    }
    #
    if (strtotime($begda) > strtotime($endda)) {
        die(err2echo(26, 'Добавление гостя', $mysqli));
    }
    #
    // $timestamp = date('Y-m-d H:i:s');
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "INSERT
                INTO gl001 (dbeg, dend, days, room , base, adjs, cost, paid, name, teln, fnot, city, user)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Добавление гостя', $mysqli));
    !($stmt->bind_param('ssiiddddsssss', 
                                        $dbeg, 
                                        $dend, 
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
                                        $user)
    ) && die(err2echo(11, 'Добавление гостя', $mysqli));
    !($stmt->execute()) && die(err2echo(12, 'Добавление гостя', $mysqli));
    #
    $data['data']['year'] = $year;
    $data['data']['mnth'] = $mnth;
    $data['data']['unid'] = mysqli_insert_id($mysqli);
    $data['data']['dbeg'] = $dbeg;
    $data['data']['dend'] = $dend;
    $data['data']['days'] = $days;
    $data['data']['room'] = $room;
    $data['data']['base'] = $base;
    $data['data']['adjs'] = $adjs;
    $data['data']['cost'] = $cost;
    $data['data']['paid'] = $paid;
    $data['data']['name'] = $name;
    $data['data']['teln'] = $teln;
    $data['data']['fnot'] = $fnot;
    $data['data']['city'] = $city;
    #
    $stmt->free_result();
    $stmt->close();
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $mysqli->close();
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    // FIX 
    // include $_SERVER['DOCUMENT_ROOT'] . '/db/pb001/insert.php';
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------    
    $data['status'] = true;
    echo json_encode($data);
?>