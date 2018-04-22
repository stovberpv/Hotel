/* jshint esversion: 6 */
/* jshint -W030 */
/* jshint -W040 */
/* jshint -W083 */

'use strict';

class Diagrams extends RootModule {

    constructor() { super(); }

    bind(target) {
        super.bind(target);

        let tree =
            [{ tag: 'div', id: 'chart' },
                [{ tag: 'div', class: 'chart-container-1' },
                    { tag: 'div', class: 'chart-1' }
                ],
                [{ tag: 'div', class: 'chart-container-2' },
                    { tag: 'div', class: 'chart-2' }
                ],
                [{ tag: 'div', class: 'chart-container-3' },
                    { tag: 'div', class: 'chart-3' }
                ],
                [{ tag: 'div', class: 'chart-container-4' },
                    { tag: 'div', class: 'chart-4' }
                ],
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);
    }

    init() {
        // super.init();

        this.create();
        EVENT_BUS.register(GL.CONST.EVENTS.DIAGRAM.UPD, this.create.bind(this));
    }

    beginDataLoad() { super.beginDataLoad(); }
    finishDataLoad() { super.finishDataLoad(); }

    create() {
        let self = this;

        self.beginDataLoad();

        (async () => {
            let cf001 = new CF001(),
                gl001 = new GL001();

            try { cf001 = await cf001.load(); } catch (e) { return; }
            gl001.entity = new Guest({
                dbeg: new Date(cf001.year, '00', '01').format('yyyy-mm-dd'),
                dend: new Date(cf001.year, '12', '00').format('yyyy-mm-dd')
            });
            try { gl001 = await gl001.load(); } catch (e) { return; }

            (() => { // chart-1 доход помесячно
                let data = ((data) => {
                    let result = [], y = {};

                    (() => {
                        data.sort((a,b)=>{
                            let d1 = new Date(a.dbeg), d2 = new Date(b.dbeg);
                            return (d1 < d2) ? -1 : (d1 > d2) ? 1 : 0;
                        });
                    })();

                    (() => {
                        data.forEach(el => {
                            let m = new Date(el.dbeg).format('m'), paid = parseFloat(el.paid);
                            y[m] =  y[m] ? y[m] += paid : paid;
                        });
                    })();

                    (() => {
                        Object.keys(y).forEach((k, i) => {
                            let text = new Date(cf001.year, (k - 1)).toLocaleString(GL.CONST.LOCALE, { month: 'long' });
                            result.push({ x: (i + 1), y: y[k], value: `${text}: ${y[k]} ₽`, id: k, label: { x: k, y: '' } });
                        });
                    })();

                    return result;

                })(gl001);
                new SVGChart(data, { title: 'Доход помесячно' }).bind(document.querySelector('#chart .chart-1'));
            })();

            (() => { // chart-2 доход по номерам
                let data = ((data) => {
                    let result = [], y = {};

                    (() => {
                        data.sort((a, b)=>{
                            let r1 = a.room, r2 = a.room;
                            return (r1 < r2) ? -1 : (r1 > r2) ? 1 : 0;
                        });
                    })();

                    (() => {
                        data.forEach(el => {
                            let r = el.room, paid = parseFloat(el.paid);
                            y[r] =  y[r] ? y[r] += paid : paid;
                        });
                    })();

                    (() => {
                        Object.keys(y).forEach((k, i) => {
                            result.push({ x: (i + 1), y: y[k], value: `комната ${k}: ${y[k]} ₽`, id: k, label: { x: k, y: '' } });
                        });
                    })();

                    return result;

                })(gl001);
                new SVGChart(data, { title: 'Доход на номер за год' }).bind(document.querySelector('#chart .chart-2'));
            })();

            (() => { // chart-3 загруженность помесячно
                let data = ((data) => {
                    let result = [], y = {};

                    (() => {
                        data.sort((a,b)=>{
                            let d1 = new Date(a.dbeg), d2 = new Date(b.dbeg);
                            return (d1 < d2) ? -1 : (d1 > d2) ? 1 : 0;
                        });
                    })();

                    (() => {
                        data.forEach(el => {
                            let m = new Date(el.dbeg).format('m');
                            y[m] =  y[m] ? y[m] += 1 : 1;
                        });
                    })();

                    (() => {
                        Object.keys(y).forEach((k, i) => {
                            let text = new Date(cf001.year, (k - 1)).toLocaleString(GL.CONST.LOCALE, { month: 'long' });
                            result.push({ x: (i + 1), y: y[k], value: `${text}: ${y[k]} гостя(ей)`, id: k, label: { x: k, y: '' } });
                        });
                    })();

                    return result;

                })(gl001);
                new SVGChart(data, { title: 'Загруженность помесячно' }).bind(document.querySelector('#chart .chart-3'));
            })();

            (() => { // chart-4 загруженность по номерам
                let data = ((data) => {
                    let result = [], y = {};

                    (() => {
                        data.sort((a, b)=>{
                            let r1 = a.room, r2 = a.room;
                            return (r1 < r2) ? -1 : (r1 > r2) ? 1 : 0;
                        });
                    })();

                    (() => {
                        data.forEach(el => {
                            let r = el.room;
                            y[r] =  y[r] ? y[r] += 1 : 1;
                        });
                    })();

                    (() => {
                        Object.keys(y).forEach((k, i) => {
                            result.push({ x: (i + 1), y: y[k], value: `комната ${k}: ${y[k]} гостя(ей)`, id: k, label: { x: k, y: '' } });
                        });
                    })();

                    return result;

                })(gl001);
                new SVGChart(data, { title: 'Загруженность номеров за год' }).bind(document.querySelector('#chart .chart-4'));
            })();

            this.finishDataLoad();
        })();
    }
}