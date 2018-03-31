/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

class LoadingForm {

    constructor(target) {
        this.id = Math.floor(Math.random() * 100000);
        this.target = target;
        return this;
    }
/*
    get id () { return this._id; }
    get target() { return this._target; }
*/
    show() {
        let tree =
            [{ tag: 'div', id: `loading-form-${this.id}`, class: 'loading-form-wrapper' },
                [{ tag: 'div', class: 'loading-form-container' },
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                    { tag: 'span', class: 'loading-form-el-block'},
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) this.target.appendChild(tree);
        else console.log('tree is ' + tree);

        return this;
    }

    hide() {
        let loadingForm = document.getElementById(`loading-form-${this.id}`);
        if (!loadingForm) return;
        loadingForm.parentNode.removeChild(loadingForm);
    }
}
