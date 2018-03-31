<?php
    require $_SERVER['DOCUMENT_ROOT'] . '/php/utils.php';
    if (isAuthorized()) {
        header('Location: ../pages/main.php');
        die();
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Hotel Manager</title>
        <link rel='icon' href='/res/icons/favicon.png'>
        <link rel='stylesheet' href='/css/utils/normalize.css' />
        <link rel='stylesheet' href='/css/core/login.css'>
    </head>
    <body>
        <form id='login-form' action='../index.php' method='post'>
            <div>
                <input id='login' name="user" type='text' placeholder='username' maxlength='10'/>
            </div>
            <div>
                <input id='password' name = "pass" type='password' placeholder='password' maxlength='10'/>
            </div>
            <div>
                <button id='submit' type="submit" value='submit'/>login</button>
            </div>
        </form>
        <script type="text/javascript" src="/js/core/login.js"></script>
    </body>
</html>