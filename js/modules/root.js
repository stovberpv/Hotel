/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */
'use strict';

class RootModule {

    constructor(opts) {
        this.opts = opts;
        this.loadingForm;
        this.wrapper;
    }

    bind(target) { this.wrapper = target; }

    init() { this.beginDataLoad(this.wrapper); }

    beginDataLoad() {
        this.loadingForm = new LoadingForm(this.wrapper);
        this.loadingForm.show();
    }
    finishDataLoad() { this.loadingForm.hide(); }
}