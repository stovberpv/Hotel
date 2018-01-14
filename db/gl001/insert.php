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
    isset($_GET['data']["year"])       ? $year       = $_GET['data']["year"]       : $year       = "";
    isset($_GET['data']["month"])      ? $month      = $_GET['data']["month"]      : $month      = "";
    isset($_GET['data']["dayin"])      ? $dayin      = $_GET['data']["dayin"]      : $dayin      = "";
    isset($_GET['data']["dayout"])     ? $dayout     = $_GET['data']["dayout"]     : $dayout     = "";
    isset($_GET['data']["days"])       ? $days       = $_GET['data']["days"]       : $days       = "";
    isset($_GET['data']["room"])       ? $room       = $_GET['data']["room"]       : $room       = "";
    isset($_GET['data']["baseline"])   ? $baseline   = $_GET['data']["baseline"]   : $baseline   = "";
    isset($_GET['data']["adjustment"]) ? $adjustment = $_GET['data']["adjustment"] : $adjustment = "";
    isset($_GET['data']["cost"])       ? $cost       = $_GET['data']["cost"]       : $cost       = "";
    isset($_GET['data']["paid"])       ? $paid       = $_GET['data']["paid"]       : $paid       = "";
    isset($_GET['data']["name"])       ? $name       = $_GET['data']["name"]       : $name       = "";
    isset($_GET['data']["tel"])        ? $tel        = $_GET['data']["tel"]        : $tel        = "";
    isset($_GET['data']["fn"])         ? $fn         = $_GET['data']["fn"]         : $fn         = "";
    isset($_GET['data']["city"])       ? $city       = $_GET['data']["city"]       : $city       = "";
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $begda = "";
    if(strpos($dayin, ".")) {
        $date = explode(".", $dayin);
        $m = $date[1];
        $d = $date[0];
        if(checkdate($m, $d, $year)) {
            $begda = $year . "-" . $m . "-" . $d;
        } else {
            die(err2echo(22, 'Добавление гостя', $mysqli));
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
        if(checkdate($m, $d, $year)) {
            $endda = $year . "-" . $m . "-" . $d;
        } else {
            die(err2echo(21, 'Добавление гостя', $mysqli));
        }
    } else {
        $endda = $year . "-" . $month . "-" . $dayout;
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
                INTO gl001(dayin, 
                            dayout, 
                            days, 
                            room, 
                            baseline, 
                            adjustment, 
                            cost, 
                            paid, 
                            name, 
                            tel, 
                            fn, 
                            city, 
                            user)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Добавление гостя', $mysqli));
    !($stmt->bind_param('ssiiddddsssss', $begda, 
                                        $endda, 
                                        $days, 
                                        $room, 
                                        $baseline, 
                                        $adjustment, 
                                        $cost, 
                                        $paid, 
                                        $name, 
                                        $tel, 
                                        $fn, 
                                        $city, 
                                        $user)
    ) && die(err2echo(11, 'Добавление гостя', $mysqli));
    !($stmt->execute()) && die(err2echo(12, 'Добавление гостя', $mysqli));
    #
    $data['data'][0]['id'] = mysqli_insert_id($mysqli);
    $data['data'][0]['dayin'] = $begda;
    $data['data'][0]['dayout'] = $endda;
    $data['data'][0]['days'] = $days;
    $data['data'][0]['room'] = $room;
    $data['data'][0]['baseline'] = $baseline;
    $data['data'][0]['adjustment'] = $adjustment;
    $data['data'][0]['cost'] = $cost;
    $data['data'][0]['paid'] = $paid;
    $data['data'][0]['name'] = $name;
    $data['data'][0]['city'] = $city;
    $data['data'][0]['tel'] = $tel;
    $data['data'][0]['fn'] = $fn;
    #
    $data['year'] = $year;
    $data['month'] = $month;
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
    include $_SERVER['DOCUMENT_ROOT'] . '/db/pb001/insert.php';
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------    
    $data['status'] = true;
    echo json_encode($data);
?>