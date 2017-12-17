
<?php session_start(); ?>
<?php
    error_reporting(E_ALL | E_WARNING | E_NOTICE);
    ini_set('display_errors', TRUE);
    require $_SERVER['DOCUMENT_ROOT'] . '/php/db/conn.php';
    if (isset($_GET["login"])) { $login = $_GET["login"]; } else { die(); }
    if (isset($_GET["hash"]))  { $hash = $_GET["hash"];   } else { die(); }
    if (isset($_GET["salt"]))  { $salt = $_GET["salt"];   } else { die(); }
    $stmt = $mysqli->prepare("SELECT * FROM us001  WHERE user = ? AND active = 1");
    $stmt->bind_param('s', $login);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->free_result();
    $stmt->close();
    $mysqli->close();
    $dbpass =  $row['pass'];
    $dbpass = str_replace(' ','',$dbpass); 
    $dbpass = strtolower($dbpass);
    $dbhash = hash('sha512', $dbpass . $salt);
    $dbhash = str_replace(' ','',$dbhash); 
    if ($dbhash == $hash) {
        // $_SESSION["Login"] = "YES";
        echo "<script>window.location = 'index.php';</script>";
        die();
    } else {
        die();
    }
?>