/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

'use strict';

class SignOut extends RootModule {
    constructor() {
        super();
    }
    bind(target) { /*super.bind(target);*/ }
    init() {
        // super.init();

        (async () => {
            let result, del;
            try { await new ConfirmDialog({ intent: 'del', title: 'Завершение сеанса', text: GL.CONST.LOCALIZABLE.MSG000 }).bind().show().promise(); } catch (e) { return; }
            try { del = await new Update('', { types: 's', param: ['']}).update('us001').set(`seid=?`).where('user=?').connect(1); } catch (e) { return; } // FIX :
            if (!del.affectedRows) return;
            window.location.href = '../../index.php';
        })();
    }

    beginDataLoad() { super.beginDataLoad(); }
    finishDataLoad() { super.finishDataLoad(); }
}