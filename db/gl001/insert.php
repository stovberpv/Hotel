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
    isset($_GET["year"])   ? $year   = $_GET["year"]   : $year   = "";
    isset($_GET["month"])  ? $month  = $_GET["month"]  : $month  = "";
    isset($_GET["dayin"])  ? $dayin  = $_GET["dayin"]  : $dayin  = "";
    isset($_GET["dayout"]) ? $dayout = $_GET["dayout"] : $dayout = "";
    isset($_GET["room"])   ? $room   = $_GET["room"]   : $room   = "";
    isset($_GET["price"])  ? $price  = $_GET["price"]  : $price  = "";
    isset($_GET["paid"])   ? $paid   = $_GET["paid"]   : $paid   = "";
    isset($_GET["name"])   ? $name   = $_GET["name"]   : $name   = "";
    isset($_GET["tel"])    ? $tel    = $_GET["tel"]    : $tel    = "";
    isset($_GET["fn"])     ? $fn     = $_GET["fn"]     : $fn   = "";
    isset($_GET["city"])   ? $city   = $_GET["city"]   : $city   = "";
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
    $timestamp = date('Y-m-d H:i:s');
    #---------------------------------------------------------------------------------
    # 
    #---------------------------------------------------------------------------------
    $query = "INSERT
                INTO gl001(dayin, dayout, room, price, paid, name, tel, fn, city, user, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    #
    !($stmt = $mysqli->prepare($query)) && die(err2echo(10, 'Добавление гостя', $mysqli));
    !($stmt->bind_param('ssiddssssss', $begda, $endda, $room, $price, $paid, $name, $tel, $fn, $user, $city, $timestamp)) && die(err2echo(11, 'Добавление гостя', $mysqli));
    !($stmt->execute()) && die(err2echo(12, 'Добавление гостя', $mysqli));
    #
    $data['data'][0]['id'] = mysqli_insert_id($mysqli);
    $data['data'][0]['dayin'] = $begda;
    $data['data'][0]['dayout'] = $endda;
    $data['data'][0]['room'] = $room;
    $data['data'][0]['price'] = $price;
    $data['data'][0]['paid'] = $paid;
    $data['data'][0]['name'] = $name;
    $data['data'][0]['tel'] = $tel;
    $data['data'][0]['fn'] = $fn;
    $data['data'][0]['city'] = $city;
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