'use strict';
$(document).ready(function () {
    var movementStrength = 25;
    var height = movementStrength / $(window).height();
    var width = movementStrength / $(window).width();
    $("body").mousemove(function (e) {
        var pageX = e.pageX - ($(window).width() / 2);
        var pageY = e.pageY - ($(window).height() / 2);
        var newvalueX = width * pageX * -1 - 25;
        var newvalueY = height * pageY * -1 - 50;
        $('body').css("background-position", newvalueX + "px     " + newvalueY + "px");
    });
});

$("#password").keyup(function () {
    if ($('#login').val().length >= 4 && $('#password').val().length >= 8) {
        if (isValid($('#password').val())) {

            var login = $('#login').val(),
                pass = $('#password').val(),
                salt = calcSalt(),
                hash = sha512(sha512(pass) + salt);
            
            $.ajax({
                url: "login.php",
                type: 'GET',
                data: { login: login, hash: hash, salt: salt } ,
                success: function (e) { $("#ajax-msg").append(e); }
            });
        }
    }
});

function isValid(input) {
  var regexp = /(?!.*\s)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}/;
  return regexp.test(input);
}

function calcSalt() {
    var min = 666,
        max = 9999999;
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}