<?php
    #---------------------------------------------------------------------------------
    # debug settings
    #---------------------------------------------------------------------------------
    if (true) {
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }
    #
    #
    #
    function isAuthorized() {
        #
        session_start();
        if (isset($_SESSION['user_sesid'])) {
            # some security check
            if ($_SESSION['user_agent'] != $_SERVER['HTTP_USER_AGENT']) {
                session_write_close();
                return false;
            }
            # get cookie session id
            $sessid = $_SESSION['user_sesid'];
            #
            session_write_close();
            # create db connection
            require $_SERVER['DOCUMENT_ROOT'] . '/php/conn.php';
            # check is user was aurorized
            $query = "SELECT COUNT(*) AS isAuth FROM us001 WHERE sesid = ? AND active = 1";
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('s', $sessid) ;
            $stmt->execute()                ;
            $result = $stmt->get_result()   ;
            $row = $result->fetch_assoc();
            $stmt->free_result();
            $stmt->close();
            $mysqli->close();
            #
            if ($row['isAuth']) {
                return true;
            } else {
                return false;
            }
        } else {
            session_write_close();
            return false;
        }
    }
    #
    #
    #
    function getAuthUserName() {
        #
        session_start();
        # get cookie session id
        $sessid = $_SESSION['user_sesid'];
        #
        session_write_close();
        # create db connection
        require $_SERVER['DOCUMENT_ROOT'] . '/php/conn.php';
        # check is user was aurorized
        $query = "SELECT login FROM us001 WHERE sesid = ? AND active = 1";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('s', $sessid) ;
        $stmt->execute()                ;
        $result = $stmt->get_result()   ;
        $row = $result->fetch_assoc();
        $stmt->free_result();
        $stmt->close();
        $mysqli->close();
        #
        return $row['login'];
    }
    #---------------------------------------------------------------------------------
    # error to echo
    #---------------------------------------------------------------------------------
    function err2echo($id, $text, $conn) {
        switch ($id) {
            case 10: echo2json($text . "Ошибка подготовки: (" . $conn->errno . ") " . $conn->error); break;
            case 11: echo2json($text . "Ошибка привязки: : (" . $conn->errno . ") " . $conn->error); break;
            case 12: echo2json($text . "Ошибка выполнения: (" . $conn->errno . ") " . $conn->error); break;
            case 13: echo2json($text . "Ошибка переменных: (" . $conn->errno . ") " . $conn->error); break;
            case 14: echo2json($text . "Ошибка выборки:  : (" . $conn->errno . ") " . $conn->error); break;
            case 15: echo2json($text . "Ошибка результата: (" . $conn->errno . ") " . $conn->error); break;
            case 20: echo2json($text . "Начальная дата не может быть больше конечной"); break;
            case 21: echo2json($text . "Не удалось вычислить день и месяц выезда"); break;
            case 22: echo2json($text . "Не удалось вычислить день и месяц въезда"); break;
            case 23: echo2json($text . "Неавторизованный пользовтаель. В доступе отказано."); break;
            case 24: echo2json($text . "Не удалось определить год"); break;
            case 25: echo2json($text . "Не удалось определить месяц"); break;
            case 26: echo2json($text . "Начальная дата не может быть больше конечной"); break;
            case 27: echo2json($text . 'Не удалось получить ID'); break;
            default: break;
        }
    }
    #
    #
    #
    function echo2json($text) {
        $data['msg'] = $text;
        $data['status'] = false;
        echo json_encode($data);
    }
?>