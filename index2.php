<?php
    #
    #
    #
    $host      = $_SERVER["HTTP_HOST"];
    $uri       = rtrim(dirname($_SERVER["PHP_SELF"]), "/\\");
    #
    # first of all we must check a POST request
    #
    do {
        if (isset($_POST["user"])) {
            # check post data
            if (isset($_POST["user"])) { $auth_name = $_POST["user"]; } else { break; }
            if (isset($_POST["pswd"])) { $auth_pass = $_POST["pswd"]; } else { break; }
            # create db connection
            require $_SERVER["DOCUMENT_ROOT"] . "/php/conn.php";
            # get user
            $query = "SELECT COUNT( * ) AS isExist FROM us001 WHERE user = ? AND pswd = ? AND actv = 1";
            if (!($stmt = $mysqli->prepare($query)))                echo "prepare error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->bind_param("ss", $auth_name, $auth_pass))) echo "bind_param error (" . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->execute()))                                echo "execute error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($result = $stmt->get_result()))                   echo "get_result error (" . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            $row = $result->fetch_assoc();
            $stmt->free_result();
            $stmt->close();
            # check user
            if ($row["isExist"]) {
                # create sessid for user
                $sessid = bin2hex(openssl_random_pseudo_bytes(10));
                # update sessid in user table
                $query = "UPDATE us001 SET seid = ? WHERE user = ?";
                if (!($stmt = $mysqli->prepare($query)))             echo "prepare error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
                if (!($stmt->bind_param("ss", $sessid, $auth_name))) echo "bind_param error (" . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
                if (!($stmt->execute()))                             echo "execute error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
                $stmt->close();
            } else {
                $mysqli->close();
                break;
            }
            # get sessid
            $query = "SELECT seid FROM us001 WHERE user = ? AND pswd = ? AND actv = 1";
            if (!($stmt = $mysqli->prepare($query)))                echo "prepare error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->bind_param("ss", $auth_name, $auth_pass))) echo "bind_param error (" . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($stmt->execute()))                                echo "execute error ("    . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            if (!($result = $stmt->get_result()))                   echo "get_result error (" . $mysqli->connect_errno . ") " . $mysqli->connect_error, die();
            $row = $result->fetch_assoc();
            $stmt->free_result();
            $stmt->close();
            # check sessid
            if ($row) {
                # authorization successful
                # start session
                session_start();
                $_SESSION["user_agent"] = $_SERVER["HTTP_USER_AGENT"];
                $_SESSION["user_sesid"] = $row["seid"];
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
    require $_SERVER["DOCUMENT_ROOT"] . "/php/utils.php";
    if (isAuthorized()) {
        echo('
            <!DOCTYPE html>
            <html>

                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="language" content="russian" />
                    <meta name="author" content="Stovber Pavel" />
                    <title>Hotel Manager</title>
                    <link rel="icon" href="/res/icons/favicon.png" />

                    <link rel="stylesheet" href="/css/components/normalize.css" />

                    <link rel="stylesheet" href="/css/main/vars.css" />
                    <link rel="stylesheet" href="/css/main/animation.css" />
                    <link rel="stylesheet" href="/css/main/main.css" />
                    <link rel="stylesheet" href="/css/components/loadingform.css" />
                    <link rel="stylesheet" href="/css/components/modal.css" />
                    <link rel="stylesheet" href="/css/components/date.picker.css" />
                    <link rel="stylesheet" href="/css/modules/journal.css" />
                    <link rel="stylesheet" href="/css/modules/contacts.css" />
                    <link rel="stylesheet" href="/css/modules/diagrams.css" />
                    <link rel="stylesheet" href="/css/modules/todolist.css" />
                    <link rel="stylesheet" href="/css/modules/settings.css" />
                    <link rel="stylesheet" href="/css/modules/signout.css" />
                </head>

                <body>
                    <svg id="svg-icons" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" display="none">
                        <defs>

                            <symbol id="svg-calendar" viewBox="0 0 1024 1024">
                                <path class="path1" d="M947.2 102.4h-128v-25.6c0-14.138-11.461-25.6-25.6-25.6s-25.6 11.462-25.6 25.6v25.6h-512v-25.6c0-14.138-11.462-25.6-25.6-25.6s-25.6 11.462-25.6 25.6v25.6h-128c-42.347 0-76.8 34.453-76.8 76.8v716.8c0 42.349 34.453 76.8 76.8 76.8h870.4c42.349 0 76.8-34.451 76.8-76.8v-716.8c0-42.347-34.451-76.8-76.8-76.8zM76.8 153.6h128v76.8c0 14.138 11.462 25.6 25.6 25.6s25.6-11.462 25.6-25.6v-76.8h512v76.8c0 14.138 11.461 25.6 25.6 25.6s25.6-11.462 25.6-25.6v-76.8h128c14.115 0 25.6 11.485 25.6 25.6v128h-921.6v-128c0-14.115 11.485-25.6 25.6-25.6zM947.2 921.6h-870.4c-14.115 0-25.6-11.485-25.6-25.6v-537.6h921.6v537.6c0 14.115-11.485 25.6-25.6 25.6z"></path>
                                <path class="path2" d="M384 512h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path3" d="M537.6 512h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path4" d="M691.2 512h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path5" d="M844.8 512h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path6" d="M230.4 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path7" d="M384 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path8" d="M537.6 614.4h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path9" d="M691.2 614.4h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path10" d="M844.8 614.4h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path11" d="M230.4 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path12" d="M384 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path13" d="M537.6 716.8h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path14" d="M691.2 716.8h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path15" d="M844.8 716.8h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path16" d="M230.4 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path17" d="M384 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.138 0 25.6 11.461 25.6 25.6s-11.462 25.6-25.6 25.6z"></path>
                                <path class="path18" d="M537.6 819.2h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path19" d="M691.2 819.2h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                                <path class="path20" d="M844.8 819.2h-51.2c-14.139 0-25.6-11.461-25.6-25.6s11.461-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path>
                            </symbol>

                            <symbol id="svg-contacts" viewBox="0 0 1024 1024">
                                <path class="path1" d="M819.2 1024c-90.691 0-187.154-25.699-286.706-76.386-91.794-46.736-182.48-113.654-262.258-193.522-79.763-79.853-146.595-170.624-193.272-262.498-50.608-99.61-76.269-196.102-76.269-286.795 0-58.774 54.765-115.55 78.31-137.232 33.85-31.17 87.104-67.568 125.794-67.568 19.245 0 41.803 12.589 70.994 39.616 21.782 20.17 46.27 47.51 70.814 79.067 14.794 19.021 88.592 116.267 88.592 162.917 0 38.27-43.25 64.853-89.037 92.998-17.694 10.875-35.992 22.122-49.226 32.73-14.114 11.315-16.645 17.288-17.061 18.629 48.602 121.128 197.141 269.651 318.203 318.184 1.085-0.341 7.067-2.699 18.592-17.075 10.608-13.234 21.854-31.531 32.73-49.227 28.144-45.789 54.726-89.038 92.998-89.038 46.648 0 143.896 73.798 162.917 88.592 31.557 24.546 58.898 49.032 79.067 70.816 27.029 29.189 39.616 51.747 39.616 70.992 0 38.701-36.378 92.115-67.528 126.099-21.693 23.662-78.491 78.701-137.272 78.701zM204.477 51.203c-13.731 0.262-50.634 17.054-90.789 54.029-38.115 35.099-61.792 73.25-61.792 99.568 0 344.523 423.093 768 767.304 768 26.28 0 64.418-23.795 99.528-62.099 37.003-40.366 53.806-77.413 54.069-91.178-1.662-9.728-28.57-47.563-102.232-104.283-63.322-48.762-114.699-74.886-127.901-75.237-0.925 0.274-6.656 2.467-18.277 17.222-10.104 12.832-20.912 30.418-31.366 47.424-28.683 46.666-55.774 90.744-95.122 90.744-6.336 0-12.597-1.219-18.608-3.624-134.376-53.75-293.31-212.685-347.061-347.061-6.456-16.138-7.485-41.414 24.272-70.184 16.882-15.293 40.25-29.656 62.848-43.546 17.006-10.453 34.59-21.261 47.422-31.366 14.755-11.619 16.95-17.352 17.222-18.277-0.352-13.203-26.475-64.579-75.237-127.902-56.72-73.659-94.554-100.568-104.282-102.23z"></path>
                            </symbol>

                            <symbol id="svg-diagrams" viewBox="0 0 1024 1024">
                                <path class="path1" d="M435.2 1024c-116.246 0-225.534-45.269-307.733-127.467s-127.467-191.488-127.467-307.733c0-116.246 45.269-225.534 127.467-307.733s191.486-127.467 307.733-127.467c14.138 0 25.6 11.462 25.6 25.6v384h384c14.139 0 25.6 11.461 25.6 25.6 0 116.245-45.269 225.534-127.467 307.733s-191.488 127.467-307.733 127.467zM409.6 205.643c-199.842 13.226-358.4 180.026-358.4 383.157 0 211.739 172.262 384 384 384 203.131 0 369.931-158.558 383.157-358.4h-383.157c-14.138 0-25.6-11.461-25.6-25.6v-383.157z"></path>
                                <path class="path2" d="M947.2 512h-409.6c-14.139 0-25.6-11.462-25.6-25.6v-409.6c0-14.138 11.461-25.6 25.6-25.6 116.245 0 225.534 45.269 307.733 127.467s127.467 191.486 127.467 307.733c0 14.138-11.461 25.6-25.6 25.6zM563.2 460.8h357.557c-12.664-191.374-166.184-344.891-357.557-357.557v357.557z"></path>
                            </symbol>

                            <symbol id="svg-todolist" viewBox="0 0 1024 1024">
                            <path class="path1" d="M978.101 45.898c-28.77-28.768-67.018-44.611-107.701-44.611-40.685 0-78.933 15.843-107.701 44.611l-652.8 652.8c-2.645 2.645-4.678 5.837-5.957 9.354l-102.4 281.6c-3.4 9.347-1.077 19.818 5.957 26.85 4.885 4.888 11.43 7.499 18.104 7.499 2.933 0 5.891-0.502 8.744-1.541l281.6-102.4c3.515-1.28 6.709-3.312 9.354-5.958l652.8-652.8c28.768-28.768 44.613-67.018 44.613-107.702s-15.843-78.933-44.613-107.701zM293.114 873.883l-224.709 81.71 81.712-224.707 566.683-566.683 142.997 142.997-566.683 566.683zM941.899 225.098l-45.899 45.899-142.997-142.997 45.899-45.899c19.098-19.098 44.49-29.614 71.498-29.614s52.4 10.518 71.499 29.616c19.098 19.098 29.616 44.49 29.616 71.498s-10.52 52.4-29.616 71.498z"></path>
                            </symbol>

                            <symbol id="svg-settings" viewBox="0 0 1024 1024">
                                <path class="path1" d="M390.71 1008.755c-2.109 0-4.248-0.262-6.378-0.81-45.976-11.803-90.149-30.042-131.291-54.21-11.923-7.003-16.13-22.21-9.501-34.344 8.15-14.925 12.459-31.866 12.459-48.992 0-56.464-45.936-102.4-102.4-102.4-17.125 0-34.066 4.309-48.992 12.459-12.133 6.627-27.339 2.421-34.342-9.501-24.17-41.142-42.408-85.315-54.211-131.293-3.333-12.989 3.92-26.349 16.629-30.629 41.699-14.037 69.717-53.034 69.717-97.037s-28.018-83-69.718-97.040c-12.707-4.278-19.962-17.638-16.627-30.627 11.803-45.976 30.042-90.149 54.211-131.291 7.003-11.923 22.21-16.13 34.344-9.501 14.923 8.15 31.864 12.459 48.99 12.459 56.464 0 102.4-45.936 102.4-102.4 0-17.126-4.309-34.067-12.459-48.99-6.629-12.134-2.422-27.341 9.501-34.344 41.141-24.168 85.314-42.408 131.291-54.211 12.994-3.334 26.349 3.92 30.627 16.627 14.040 41.701 53.037 69.718 97.040 69.718s83-28.018 97.038-69.717c4.28-12.71 17.645-19.965 30.629-16.629 45.976 11.802 90.15 30.042 131.293 54.211 11.922 7.003 16.128 22.208 9.501 34.342-8.152 14.926-12.461 31.867-12.461 48.992 0 56.464 45.936 102.4 102.4 102.4 17.126 0 34.067-4.309 48.992-12.459 12.138-6.629 27.341-2.421 34.344 9.501 24.166 41.141 42.406 85.314 54.21 131.291 3.334 12.989-3.918 26.349-16.627 30.627-41.701 14.040-69.718 53.037-69.718 97.040s28.018 83 69.718 97.038c12.707 4.28 19.962 17.638 16.627 30.629-11.803 45.976-30.042 90.15-54.21 131.291-7.005 11.925-22.208 16.128-34.344 9.502-14.926-8.152-31.867-12.461-48.992-12.461-56.464 0-102.4 45.936-102.4 102.4 0 17.125 4.309 34.066 12.461 48.992 6.627 12.136 2.421 27.341-9.502 34.344-41.141 24.166-85.314 42.406-131.291 54.21-12.992 3.336-26.349-3.918-30.629-16.627-14.038-41.701-53.035-69.718-97.038-69.718s-83 28.018-97.040 69.718c-3.578 10.624-13.502 17.437-24.25 17.437zM512 870.4c57.715 0 109.693 32.138 135.917 82.029 26.637-8.218 52.507-18.875 77.299-31.846-5.541-16.077-8.416-33.075-8.416-50.182 0-84.696 68.904-153.6 153.6-153.6 17.107 0 34.106 2.875 50.181 8.418 12.971-24.792 23.63-50.662 31.846-77.299-49.89-26.226-82.027-78.203-82.027-135.918s32.138-109.691 82.029-135.918c-8.218-26.637-18.875-52.506-31.846-77.299-16.077 5.542-33.074 8.418-50.182 8.418-84.696 0-153.6-68.904-153.6-153.6 0-17.107 2.875-34.106 8.418-50.181-24.792-12.971-50.662-23.63-77.299-31.846-26.226 49.89-78.203 82.027-135.918 82.027s-109.691-32.138-135.917-82.027c-26.637 8.216-52.507 18.874-77.299 31.846 5.542 16.075 8.416 33.072 8.416 50.181 0 84.696-68.904 153.6-153.6 153.6-17.109 0-34.106-2.874-50.181-8.418-12.973 24.794-23.63 50.662-31.846 77.299 49.89 26.227 82.027 78.203 82.027 135.918s-32.138 109.693-82.027 135.917c8.216 26.637 18.875 52.507 31.846 77.299 16.075-5.541 33.074-8.416 50.181-8.416 84.696 0 153.6 68.904 153.6 153.6 0 17.109-2.875 34.106-8.418 50.181 24.794 12.971 50.662 23.63 77.299 31.846 26.227-49.89 78.203-82.027 135.918-82.027z"></path>
                                <path class="path2" d="M512 665.6c-84.696 0-153.6-68.904-153.6-153.6s68.904-153.6 153.6-153.6 153.6 68.904 153.6 153.6-68.904 153.6-153.6 153.6zM512 409.6c-56.464 0-102.4 45.936-102.4 102.4s45.936 102.4 102.4 102.4c56.464 0 102.4-45.936 102.4-102.4s-45.936-102.4-102.4-102.4z"></path>
                            </symbol>

                            <symbol id="svg-signout" viewBox="0 0 1024 1024">
                                <path class="path1" d="M486.4 614.4c-14.138 0-25.6-11.461-25.6-25.6v-460.8c0-14.138 11.462-25.6 25.6-25.6s25.6 11.462 25.6 25.6v460.8c0 14.139-11.462 25.6-25.6 25.6z"></path>
                                <path class="path2" d="M486.4 972.8c-102.57 0-199-39.944-271.53-112.47-72.528-72.528-112.47-168.96-112.47-271.53 0-84.395 26.859-164.478 77.674-231.594 49.15-64.915 118.979-113.394 196.624-136.501 13.55-4.034 27.805 3.683 31.838 17.234s-3.683 27.805-17.234 31.838c-139.955 41.654-237.702 172.84-237.702 319.022 0 183.506 149.294 332.8 332.8 332.8s332.8-149.294 332.8-332.8c0-146.187-97.75-277.374-237.71-319.024-13.552-4.034-21.267-18.288-17.234-31.838 4.032-13.552 18.29-21.267 31.837-17.235 77.646 23.106 147.48 71.582 196.632 136.499 50.816 67.115 77.675 147.202 77.675 231.598 0 102.57-39.942 199.002-112.47 271.53-72.528 72.526-168.96 112.47-271.53 112.47z"></path>
                            </symbol>

                        </defs>
                    </svg>
                    <div id="nav-container">
                        <ul id="nav-menu">
                            <li id="nav-el-calendar"><svg><use xlink:href="#svg-calendar"/></svg></li>
                            <li id="nav-el-contacts"><svg><use xlink:href="#svg-contacts"/></svg></li>
                            <li id="nav-el-diagrams"><svg><use xlink:href="#svg-diagrams"/></svg></li>
                            <li id="nav-el-todolist"><svg><use xlink:href="#svg-todolist"/></svg></li>
                            <li id="nav-el-settings"><svg><use xlink:href="#svg-settings"/></svg></li>
                            <li id="nav-el-signout"> <svg><use xlink:href="#svg-signout"/></svg></li>
                        </ul>
                    </div>
                    <div id="view-container">
                        <div id="vc-dw-1" class="vc-data-wrapper"></div>
                        <div id="vc-dw-2" class="vc-data-wrapper"></div>
                        <div id="vc-dw-3" class="vc-data-wrapper"></div>
                        <div id="vc-dw-4" class="vc-data-wrapper"></div>
                        <div id="vc-dw-5" class="vc-data-wrapper"></div>
                        <div id="vc-dw-6" class="vc-data-wrapper"></div>
                    </div>

                    <script type="text/javascript" src="/js/main/global.values.js"></script>

                    <script type="text/javascript" src="/js/database/query.js"></script>
                    <script type="text/javascript" src="/js/database/entity.js"></script>
                    <script type="text/javascript" src="/js/database/schema.js"></script>

                    <script type="text/javascript" src="/js/components/date.format.js"></script>
                    <script type="text/javascript" src="/js/components/date.picker.js"></script>

                    <script type="text/javascript" src="/js/components/sandbox.js"></script>
                    <script type="text/javascript" src="/js/components/dom.tree.js"></script>
                    <script type="text/javascript" src="/js/components/event.bus.js"></script>
                    <script type="text/javascript" src="/js/components/loading.form.js"></script>
                    <script type="text/javascript" src="/js/components/modal.control.js"></script>
                    <script type="text/javascript" src="/js/components/modal.dialog.js"></script>
                    <script type="text/javascript" src="/js/components/modal.message.js"></script>
                    <script type="text/javascript" src="/js/components/event.tasker.js"></script>
                    <script type="text/javascript" src="/js/components/chart.js"></script>

                    <script type="text/javascript" src="/js/main/data.wrapper.js"></script>

                    <script type="text/javascript" src="/js/modules/journal.js"></script>
                    <script type="text/javascript" src="/js/modules/contacts.js"></script>
                    <script type="text/javascript" src="/js/modules/diagrams.js"></script>
                    <script type="text/javascript" src="/js/modules/settings.js"></script>
                    <script type="text/javascript" src="/js/modules/todolist.js"></script>
                    <script type="text/javascript" src="/js/modules/signout.js"></script>

                    <script type="text/javascript" src="/js/main/main.js"></script>
                </body>

            </html>
        ');
    } else {
        echo('
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="language" content="russian" />
                    <meta name="author" content="Stovber Pavel" />
                    <title>Hotel Manager</title>
                    <link rel="icon" href="/res/icons/favicon.png">
                    <link rel="stylesheet" href="/css/components/normalize.css" />
                    <link rel="stylesheet" href="/css/main/login.css">
                </head>
                <body>
                    <form id="login-form" action="../index.php" method="post">
                        <div> <input id="login" name="user" type="text" placeholder="username" maxlength="10"/> </div>
                        <div> <input id="password" name = "pswd" type="password" placeholder="password" maxlength="10"/> </div>
                        <div> <button id="submit" type="submit" value="submit"/>login</button> </div>
                    </form>
                </body>
            </html>
        ');
    }
?>