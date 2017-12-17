<?php

    require $_SERVER['DOCUMENT_ROOT'] . '/php/db/conn.php';

    //-------------------------------------------------------------------------------------------------
        // get values from ajax
    //-------------------------------------------------------------------------------------------------
    if (isset($_GET["year"])) { 
        $year = $_GET["year"]; 
    } else { 
        die(err2echo(23, 'Выборка', '')); 
    };

    if (isset($_GET["month"])) { 
        $month = $_GET["month"]; 
    } else { 
        die(err2echo(24, 'Выборка', '')); 
    };

    //-------------------------------------------------------------------------------------------------
        // setup values
    //-------------------------------------------------------------------------------------------------
    //    $dayin = 01 . "." . $month . "." . $year;
    //    $dayout = cal_days_in_month(CAL_GREGORIAN, $month, $year) . "." . $month . "." . $year;
    $dayin  = $year . "-" . $month . "-" . 01;
    $dayout = $year . "-" . $month . "-" . cal_days_in_month(CAL_GREGORIAN, $month, $year);
    
    //-------------------------------------------------------------------------------------------------
        // prepare queryes
    //-------------------------------------------------------------------------------------------------
    $query = "SELECT * 
                FROM gl001 
                WHERE dayout >= ? 
                  AND dayin  <= ?";

    //-------------------------------------------------------------------------------------------------
        // execute query 1
    //-------------------------------------------------------------------------------------------------
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('ss', $dayin, $dayout);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = []; 
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $data['data'] = $rows;
    
    //-------------------------------------------------------------------------------------------------
        // execute query 2
    //-------------------------------------------------------------------------------------------------
    $data['total'] = mysqli_num_rows($result);

    $data['year'] = $year;
    $data['month'] = $month;
    
    //-------------------------------------------------------------------------------------------------
        // send result
    //-------------------------------------------------------------------------------------------------
    echo json_encode($data);
    
    //-------------------------------------------------------------------------------------------------
        // close connection
    //-------------------------------------------------------------------------------------------------
    $stmt->free_result();
    $stmt->close();

    $mysqli->close();

    function err2echo($id, $text, $conn) {
        $error = "";
        $errno = 666;
        switch ($id) {
            case 0 : $error = "Ошибка подключения: (" . $conn->connect_error . ") "; $errno = $conn->connect_errno;   break;
            case 10: $error = "Ошибка подготовки: ("  . $conn->error         . ") "; $errno = $conn->errno;           break;
            case 11: $error = "Ошибка привязки: ("    . $conn->error         . ") "; $errno = $conn->errno;           break;
            case 12: $error = "Ошибка выполнения: ("  . $conn->error         . ") "; $errno = $conn->errno;           break;
            case 13: $error = "Ошибка переменных: ("  . $conn->error         . ") "; $errno = $conn->errno;           break;
            case 14: $error = "Ошибка выборки: ("     . $conn->error         . ") "; $errno = $conn->errno;           break;
            case 15: $error = "Ошибка результата: ("  . $conn->error         . ") "; $errno = $conn->errno;           break;
            case 20: $error = "Начальная дата не может быть больше конечной"       ;                                  break;
            case 21: $error = "Не удалось вычислить день и месяц выезда"           ;                                  break;
            case 22: $error = "Не удалось вычислить день и месяц въезда"           ;                                  break;
            case 23: $error = "Не удалось определить год"                          ;                                  break;
            case 24: $error = "Не удалось определить месяц"                        ;                                  break;
            default: break;
        }

        $errTable = 
        "
        <br/>
        <br/>
        <table class='errorTable-MySQLi' border='1' cellspacing='0' cellpadding='3' style='border-color: black; width: auto; height: auto; margin-left: auto; margin-right: auto'>
            <thead style='background-color: Crimson; color: white; font-weight: bold; text-align:center'>
                <tr>
                    <td colspan='4'>Ошибка</td>
                </tr>
                <tr>
                    <td>ID</td>
                    <td>Источник</td>
                    <td>Номер</td>
                    <td>Описание</td>
                </tr>
            </thead>
            <tbody style='background-color: Cornsilk; color: SlateGray; text-align: left'>
                <tr>
                    <td>" . $id . "</td>
                    <td>" . $text . "</td>
                    <td>" . $errno . "</td>
                    <td>" . $error . "</td>
                </tr>
            </tbody>
        </table>";

        echo $errTable;
    }
    
?>
