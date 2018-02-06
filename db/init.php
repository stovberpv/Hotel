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
    if (!isAuthorized()) {
        die(err2echo(23,'', ''));
    }
    #---------------------------------------------------------------------------------
    # connect to db
    #---------------------------------------------------------------------------------
    require $_SERVER['DOCUMENT_ROOT'] . '/db/conn.php';
    #---------------------------------------------------------------------------------
    # query 1 -- get settings
    #---------------------------------------------------------------------------------
    $user = getAuthUserName();
    #
    $query = "SELECT year, month FROM cf001 WHERE user = ?";        
    !($stmt = $mysqli->prepare($query))  && die(err2echo(10, "Выборка 1. ", $mysqli));
    !($stmt->bind_param('s', $user))     && die(err2echo(11, "Выборка 1. ", $mysqli));
    !($stmt->execute())                  && die(err2echo(12, "Выборка 1. ", $mysqli));   
    !($stmt->bind_result($year, $month)) && die(err2echo(13, "Выборка 1. ", $mysqli));
    !($stmt->fetch())                    && die(err2echo(14, "Выборка 1. ", $mysqli));
    #
    $data['year'] = $year;
    $data['month'] = $month;
    #
    $stmt->close();
    #---------------------------------------------------------------------------------
    # query 2 -- get room list
    #---------------------------------------------------------------------------------
    $query = "SELECT * FROM rm001";
    !($result = $mysqli->query($query)) && die(err2echo(12, "Выборка 2. ", $mysqli));
    $rooms = [];
    while($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
    #
    $data['rooms'] = $rooms;
    #---------------------------------------------------------------------------------
    # query 3 -- get guest list
    #---------------------------------------------------------------------------------
    $dbeg = $year . "-" . $month . "-" . 01;
    $dend = $year . "-" . $month . "-" . cal_days_in_month(CAL_GREGORIAN, $month, $year);
    #
    $query = "SELECT * FROM gl001 WHERE dbeg >= ? AND dend  <= ?";
    !($stmt = $mysqli->prepare($query))      && die(err2echo(10, "Выборка 3. ", $mysqli));
    !($stmt->bind_param('ss', $dbeg, $dend)) && die(err2echo(11, "Выборка 3. ", $mysqli));
    !($stmt->execute() )                     && die(err2echo(12, "Выборка 3. ", $mysqli));
    !($result = $stmt->get_result())         && die(err2echo(15, "Выборка 3. ", $mysqli));
    $guestList = []; 
    while($row = $result->fetch_array()) {
        $guestList[] = $row;
    }
    #
    $data['data'] = $guestList;
    #
    $stmt->close();
    #---------------------------------------------------------------------------------
    # close connection
    #---------------------------------------------------------------------------------
    $mysqli->close();
    #---------------------------------------------------------------------------------
    # result
    #---------------------------------------------------------------------------------
    $data['status'] = true;
    echo json_encode($data);
?>