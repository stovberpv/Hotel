<?php
    #
    #
    #
    $host      = $_SERVER['HTTP_HOST'];
    $uri       = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
    $loginPage = 'Location: http://' . $host . $uri . '/pages/login.php';
    $mainPage  = 'Location: http://' . $host . $uri . '/pages/main.php';
    #
    # first of all we must check a POST request
    #
    do {
        if (isset($_POST['user'])) {
            # check post data
            if (isset($_POST["user"])) { $auth_name = $_POST["user"]; } else { break; }
            if (isset($_POST["pass"])) { $auth_pass = $_POST["pass"]; } else { break; }
            # create db connection
            require $_SERVER['DOCUMENT_ROOT'] . '/db/conn.php';
            # get user
            $query = "SELECT COUNT( * ) AS isExist FROM us001 WHERE login = ? AND pass = ? AND active = 1";
            if (!($stmt = $mysqli->prepare($query)))                echo "prepare error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->bind_param('ss', $auth_name, $auth_pass))) echo 'bind_param error (' . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->execute()))                                echo 'execute error ('    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($result = $stmt->get_result()))                   echo 'get_result error (' . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            $row = $result->fetch_assoc();
            $stmt->free_result();
            $stmt->close();
            # check user
            if ($row['isExist']) {
                # create sessid for user
                $sessid = bin2hex(openssl_random_pseudo_bytes(10));
                # update sessid in user table
                $query = "UPDATE us001 SET sesid = ? WHERE login = ?";
                if (!($stmt = $mysqli->prepare($query)))             echo "prepare error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
                if (!($stmt->bind_param('ss', $sessid, $auth_name))) echo 'bind_param error (' . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
                if (!($stmt->execute()))                             echo 'execute error ('    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
                $stmt->close();
            } else {
                $mysqli->close();
                break;
            }
            # get sessid
            $query = "SELECT sesid FROM us001 WHERE login = ? AND pass = ? AND active = 1";
            if (!($stmt = $mysqli->prepare($query)))                echo "prepare error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->bind_param('ss', $auth_name, $auth_pass))) echo 'bind_param error (' . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->execute()))                                echo 'execute error ('    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($result = $stmt->get_result()))                   echo 'get_result error (' . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            $row = $result->fetch_assoc();
            $stmt->free_result();
            $stmt->close();
            # check sessid
            if ($row) {
                # authorization successful
                # start session
                session_start();
                $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
                $_SESSION['user_sesid'] = $row['sesid'];
                #
                session_write_close();
                # redirect to main page
                header($mainPage);
                die();
            }
            # authorization unsuccessful
            # go to next check
            $mysqli->close();
            break;
        }
    } while (0);
    #
    # the next one we check an active session
    #
    require 'utils.php';
    if (isAuthorized()) {
        header($mainPage);
        die();
    }
    #
    # finally we go to the login page
    #
    header($loginPage);
    die();
?>