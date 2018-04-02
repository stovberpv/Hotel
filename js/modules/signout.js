/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

(function () { 'use strict'; })();

class SignOut extends DataWrapper {
    constructor() {
        super();
    }
    bind(target) { /*super.bind(target);*/ }
    init() {
        // super.init();

        (async () => {
            let result, del;
            try {
                result = await new ConfirmDialog({
                    intent: 'del',
                    title: 'Завершение сеанса',
                    text: GL.CONST.LOCALIZABLE.MSG000
                }).bind().show().getPromise();
            } catch (e) { return; }
            if (!result) return;
            try {
                let opts = { types: 's', param: ['']};
                del = await new Update('', opts).update('us001').set(`sesid=?`).where('login=?').connect(1);
            } catch (e) { return; }
            if (!del.affectedRows) return;
            window.location.href = '../../index.php';
        })();
    }

    beginDataLoad() { super.beginDataLoad(); }
    finishDataLoad() { super.finishDataLoad(); }
}