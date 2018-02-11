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
    $year = isset($_GET["year"]) ? $_GET["year"] : "";
    $mnth = isset($_GET["mnth"]) ? $_GET["mnth"] : "";
    $dbeg = isset($_GET["dbeg"]) ? $_GET["dbeg"] : "";
    $dend = isset($_GET["dend"]) ? $_GET["dend"] : "";
    $days = isset($_GET["days"]) ? $_GET["days"] : "";
    $room = isset($_GET["room"]) ? $_GET["room"] : "";
    $base = isset($_GET["base"]) ? $_GET["base"] : "";
    $adjs = isset($_GET["adjs"]) ? $_GET["adjs"] : "";
    $cost = isset($_GET["cost"]) ? $_GET["cost"] : "";
    $paid = isset($_GET["paid"]) ? $_GET["paid"] : "";
    $name = isset($_GET["name"]) ? $_GET["name"] : "";
    $teln = isset($_GET["teln"]) ? $_GET["teln"] : "";
    $fnot = isset($_GET["fnot"]) ? $_GET["fnot"] : "";
    $city = isset($_GET["city"]) ? $_GET["city"] : "";
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
    if (strtotime($begda) > strtotime($endda)) { die(err2echo(26, 'Добавление гостя', $mysqli)); }
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
                                        $user)
    ) && die(err2echo(11, 'Добавление гостя', $mysqli));
    !($stmt->execute()) && die(err2echo(12, 'Добавление гостя', $mysqli));
    #
    // TODO replace for select
    $data['guest']['year'] = $year;
    $data['guest']['mnth'] = $mnth;
    $data['guest']['unid'] = mysqli_insert_id($mysqli);
    $data['guest']['dbeg'] = $begda;
    $data['guest']['dend'] = $endda;
    $data['guest']['days'] = $days;
    $data['guest']['room'] = $room;
    $data['guest']['base'] = $base;
    $data['guest']['adjs'] = $adjs;
    $data['guest']['cost'] = $cost;
    $data['guest']['paid'] = $paid;
    $data['guest']['name'] = $name;
    $data['guest']['teln'] = $teln;
    $data['guest']['fnot'] = $fnot;
    $data['guest']['city'] = $city;
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