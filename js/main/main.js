/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

(function (window, document) {
    'use strict';

    document.addEventListener('DOMContentLoaded', NAVIGATION.listeners.onLoad);
    document.addEventListener('mouseup', NAVIGATION.listeners.mouseUp);

    window.addEventListener('contextmenu', NAVIGATION.listeners.ctmClick, false);
    window.addEventListener('click', NAVIGATION.listeners.windowClick, false);

    (() => {
        EVENT_BUS.init();
        new MessageBox().init();
        new Tasker().run();
    })();

})(window, document);