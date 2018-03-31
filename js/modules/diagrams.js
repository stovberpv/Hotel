/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

(() => { 'use strict'; })();

class CanvasChart {
    construnctor(opts) {
        this.data = opts.data;
        this.style = opts.style;
    }

    bind(target){
        let canvas = target;
    }

    get data() { return this.data; }
    get style() { return this.style; }
}

class SVGChart {

    constructor(data, config, opts = {}) {
        this._id = Math.floor(Math.random() * 100000);
        this._viewBox = {
            width: 1000,
            height: 1000
        };
        this._data = data;
        this._title = config.title;
        this._style = {
            size: {
                width: 1000,
                height: 1000
            },
            color: {
                axis: {
                    x: '#6a737b', //x axis
                    y: 'transparent', //y axis
                },
                label: {
                    x: '#00a4e4', //label
                    y: '#00a4e4', //label
                },
                value: {
                    t: '#06D85F', //text
                    b: '#ffdd00', //text background
                    d: '#ffdd00', //dot point
                },
                line: '#00a4e4'
            }
        };
        this._config = {
            scale: {
                x: config.scale ? config.scale.x : this.data.map((e) => { return e.x; }).filter((e,i,a) => { return i === a.indexOf(e); }).length + 1,
                y: config.scale ? config.scale.y : (() => {
                    let max = Math.max.apply(Math, this.data.map((o) => { return o.y; }));
                    max += max * 0.20;
                    return max;
                })()
            },
            aspectRatio: config.aspectRatio ? config.aspectRatio : 'xMidYMid meet', //none
        };
        this._step = {
            x: (x) => { return Math.round(x * (this.viewBox.width / this.config.scale.x)); },
            y: (y) => { return y !== 0 ? Math.round((y / this.config.scale.y) * this.viewBox.height) : 0; }
        };
        this._ns = 'http://www.w3.org/2000/svg';

        return this;
    }

    get id() { return this._id;}
    get viewBox() { return this._viewBox;}
    get data() { return this._data; }
    get title() { return this._title; }
    get style() { return this._style; }
    get config() { return this._config; }
    get step() { return this._step; }
    get ns() {return this._ns; }

    bind(target) {
        let self = this;

        (() => {
            target.innerHTML =
                `<svg
                    version='1.2'
                    xmlns='${self.ns}'
                    xmlns:xlink='http://www.w3.org/1999/xlink'
                    id='svg-chart-${self.id}'
                    width="100%"
                    height="100%"
                    viewBox='0 0 ${self.viewBox.width} ${self.viewBox.height}'
                    preserveAspectRatio='${self.config.aspectRatio}'>
                    <g class='axis' stroke-width='3' stroke='#f1f1f1' fill='transparent' font-size='30'>
                        <g class='x-axis' stroke-dasharray="5, 5">
                            <line class="0%" x1='0' y1='100%' x2='100%' y2='100%' stroke='transparent'></line>
                            <line class="75%" x1="0" y1="0250" x2="100%" y2="0250"></line>
                            <line class="50%" x1="0" y1="0500" x2="100%" y2="0500"></line>
                            <line class="25%" x1="0" y1="0750" x2="100%" y2="0750"></line>
                        </g>
                        <g class='y-axis' stroke-dasharray="5, 5">
                            <line x1='0' y1='0000' x2='0000' y2='100%' stroke='transparent'></line>
                        </g>
                    </g>
                    <g class='chart-data'>
                    </g>
                </svg>`;
        })();

        (() => {

            let queue = {
                path: { M: '', L: '' },
                xAxis: [],
                yAxis: [],
                title: [],
                dots: [],
                popup: [],
                animation: []
            }

            self.data.forEach(entry => {

                let point;

                (()=>{ // формирую точку
                    point = { x: self.step.x(entry.x), y: self.invertY(self.step.y(entry.y)), value: entry.value, id: entry.id, label: entry.label };
                })();

                (()=>{ //сохраняю точку для формирования пути
                    (queue.path.M) ? (queue.path.L +=`L${point.x},${point.y}`) : (queue.path.M = `M${point.x},${point.y}`);
                })();

                (() => { // вертикальная пунктирная линия
                    queue.yAxis.push(self.lineY(point));
                    let text = self.text((point.x + 10), 95, point.label.x);
                    text.setAttributeNS(null, 'fill', '#6a737b');
                    text.setAttributeNS(null, 'stroke', 'transparent');
                    text.setAttributeNS(null, 'stroke-width', '2');
                    queue.yAxis.push(text);
                })();

                (() => { // тексты к точкам
                    let balloon = document.createElementNS(null, 'g');
                    balloon.setAttributeNS(null, 'id', `chart${self.id}popup${entry.id}`);
                    balloon.setAttributeNS(null, 'opacity', `0`);
                    balloon.setAttributeNS(null, 'class', `popup`);
                    // нужно для транфформации из css, трансформация в процентах внутри SVG не работает
                    balloon.appendChild(self.text(point.x, (point.y - 20), point.value));
                    queue.popup.push(balloon);
                })();

                (() => { // точки вершин
                    let circle = self.circle(point, '1%');
                    circle.setAttributeNS(null, 'id', `chart${self.id}point${entry.id}`);
                    circle.setAttributeNS(null, 'class', `point`);
                    queue.dots.push(circle);
                })();

                (() => { // анимация
                    let g = document.createElementNS(null, 'g');
                    g.setAttributeNS(null, 'id', `chart${self.id}animation${entry.id}`);
                    g.appendChild(self.animation(`popup${entry.id}`, `point${entry.id}`, 'mouseover', 0, 1));
                    g.appendChild(self.animation(`popup${entry.id}`, `point${entry.id}`, 'mouseout', 1, 0));
                    queue.animation.push(g);
                })();

            });

            let chartData = target.querySelector('.chart-data');

            (() => { // 1. путь
                let path = document.createElementNS(self.ns, 'path');
                path.setAttributeNS(null, 'd', `${queue.path.M} ${queue.path.L}`);
                let g = document.createElementNS(null, 'g');
                g.setAttributeNS(null, 'class', 'path-group');
                g.setAttributeNS(null, 'stroke-linejoin','round');
                g.setAttributeNS(null, 'fill', 'transparent');
                g.setAttributeNS(null, 'stroke', '#00a4e4'); // FIX :
                g.setAttributeNS(null, 'stroke-width', '3');
                g.appendChild(path);
                chartData.appendChild(g);
            })();

            (() => { // 2. оси X Y
                (() => { // тексты к оси x
                    let text;
                    text = self.text(0, 740, Math.round(self.config.scale.y * 0.25));
                    text.setAttributeNS(null, 'fill', '#6a737b'); // FIX :
                    text.setAttributeNS(null, 'stroke', 'transparent');
                    text.setAttributeNS(null, 'stroke-width', '2');
                    queue.xAxis.push(text);

                    text = self.text(0, 490,  Math.round(self.config.scale.y * 0.50));
                    text.setAttributeNS(null, 'fill', '#6a737b'); // FIX :
                    text.setAttributeNS(null, 'stroke', 'transparent');
                    text.setAttributeNS(null, 'stroke-width', '2');
                    queue.xAxis.push(text);

                    text = self.text(0, 240,  Math.round(self.config.scale.y * 0.75));
                    text.setAttributeNS(null, 'fill', '#6a737b'); // FIX :
                    text.setAttributeNS(null, 'stroke', 'transparent');
                    text.setAttributeNS(null, 'stroke-width', '2');
                    queue.xAxis.push(text);
                })();

                let xAxis = target.querySelector('.x-axis');
                let yAxis = target.querySelector('.y-axis');
                queue.xAxis.forEach(axis => { xAxis.appendChild(axis); });
                queue.yAxis.forEach(axis => { yAxis.appendChild(axis); });
            })();

            (() => { // заголовок
                let g = document.createElementNS(null, 'g');
                g.setAttributeNS(null, 'class', 'title-group');

                let path = document.createElementNS(null, 'path');
                path.setAttributeNS(null, 'fill', '#06D85F7F'); // FIX :
                path.setAttributeNS(null, 'stroke', 'none');
                path.setAttributeNS(null, 'd', 'M 0,5 H 1000 V 60 H 0 Z');
                g.appendChild(path);

                let text = document.createElementNS(null, 'text');
                text.setAttributeNS(null, 'x', '50%');
                text.setAttributeNS(null, 'y', '45');
                text.setAttributeNS(null, 'fill', '#f1f1f1'); // FIX :
                text.setAttributeNS(null, 'stroke', 'none');
                text.setAttributeNS(null, 'font-size', '40');
                text.setAttributeNS(null, 'text-anchor', 'middle');
                text.innerHTML = self.title;
                g.appendChild(text);

                queue.title.push(g);

                queue.title.forEach(el => { chartData.appendChild(el); });
            })();

            (() => { // точки
                let g = document.createElementNS(null, 'g');
                g.setAttributeNS(null, 'class', 'point-group');
                g.setAttributeNS(null, 'fill', 'white'); // FIX :
                g.setAttributeNS(null, 'stroke', 'orange'); // FIX :
                queue.dots.forEach(dot => { g.appendChild(dot); });
                chartData.appendChild(g);
            })();

            (() => { // текст точки
                let g = document.createElementNS(null, 'g');
                g.setAttributeNS(null, 'class', 'popup-group');
                g.setAttributeNS(null, 'stroke', 'transparent');
                g.setAttributeNS(null, 'fill', '#6a737b'); // FIX :
                g.setAttributeNS(null, 'stroke-width', '2');
                g.setAttributeNS(null, 'font-size', '30');
                g.setAttributeNS(null, 'text-anchor', 'middle');
                queue.popup.forEach(popup => { g.appendChild(popup); });
                chartData.appendChild(g);
            })();

            (() => { // анимация
                let g = document.createElementNS(null, 'g');
                g.setAttributeNS(null, 'class', 'animation-group');
                queue.animation.forEach(animation => { g.appendChild(animation); });
                chartData.appendChild(g);
            })();

            (()=>{
                /*
                    На сколько я понимаю есть какая-то особенность в создании svg,
                    о которой я не знаю, из-за чего SVG не отрисовыается полностью.
                    эта строчка, видимо, заставляет движок заново построить SVG
                    и добавить недостающие теги(?) к дереву.
                    В результате график формирует как надо.
                */
                chartData.innerHTML += '<g></g>';
            })();

        })();
    }

    polyline(pre, cur) {
        let polyline = document.createElementNS(this.ns, 'polyline');
        polyline.setAttributeNS(this.ns, 'data-cid', cur.id);
        polyline.setAttributeNS(this.ns, 'data-pid', pre.id);
        polyline.setAttributeNS(this.ns, 'points', `${pre.x},${pre.y} ${cur.x},${cur.y}`);
        return polyline;
    }

    text(x, y, v) {
        let text = document.createElementNS(this.ns, 'text');
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y);
        text.innerHTML = v;
        return text;
    }

    circle(p, r) {
        let circle = document.createElementNS(this.ns, 'circle');
        circle.setAttributeNS(null, 'cx', p.x);
        circle.setAttributeNS(null, 'cy', p.y);
        circle.setAttributeNS(null, 'r', r);
        return circle;
    }

    animation(targetId, sourceId, trigger, start, end) {
        let animation = document.createElementNS(null, 'animate');
        animation.setAttributeNS(null, 'href', `#chart${this.id}${targetId}`);
        animation.setAttributeNS(null, 'attributeName', 'opacity');
        animation.setAttributeNS(null, 'from', start);
        animation.setAttributeNS(null, 'to', end);
        animation.setAttributeNS(null, 'dur', '0.5s');
        animation.setAttributeNS(null, 'begin', `chart${this.id}${sourceId}.${trigger}`);
        animation.setAttributeNS(null, 'fill', 'freeze');
        animation.setAttributeNS(null, 'repeatCount', '1');
        return animation;
    }

    lineX(p) {
        let line = document.createElementNS(this.ns, 'line');
        line.setAttributeNS(null, 'x1', '0');
        line.setAttributeNS(null, 'y1', p.y);
        line.setAttributeNS(null, 'x2', '100%');
        line.setAttributeNS(null, 'y2', p.y);
        return line;
    }

    lineY(p) {
        let line = document.createElementNS(this.ns, 'line');
        line.setAttributeNS(null, 'x1', p.x);
        line.setAttributeNS(null, 'y1', '0');
        line.setAttributeNS(null, 'x2', p.x);
        line.setAttributeNS(null, 'y2', '100%');
        return line;
    }

    attr(target, attr, val) { target.setAttributeNS(this.ns, attr, val); }
    invertY(y) { return this.viewBox.height - y; }
}

class Diagrams extends DataWrapper {

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
            try {
                let config = await new Select().select('year').from('cf001').join('us001').on('us001.login = cf001.user').where('us001.login = ?').connect(1);
                if (!config.affectedRows) return;
                let year = config.data[0].year;
                let dbeg = new Date(year, '00', '01').format('yyyy-mm-dd'),
                    dend = new Date(year, '12', '00').format('yyyy-mm-dd');
                let select = await new Select('', { types: 'ss', param: [dend,dbeg] }).select('*').from('gl001').where('dbeg <= ? and dend >= ?').connect();
                if (!select.affectedRows) return;

                (() => { // chart-1 доход помесячно
                    let data = ((data) => {
                        let result = [];
                        let y = {};

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
                                let text = new Date(2000, (k - 1)).toLocaleString(GL.CONST.LOCALE, { month: 'long' });
                                result.push({ x: (i + 1), y: y[k], value: `${text}: ${y[k]} ₽`, id: k, label: { x: k, y: '' } });
                            });
                        })();

                        return result;

                    })(select.data);
                    new SVGChart(data, { title: 'Доход помесячно' }).bind(document.querySelector('#chart .chart-1'));
                })();

                (() => { // chart-2 доход по номерам
                    let data = ((data) => {
                        let result = [];
                        let y = {};

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

                    })(select.data);
                    new SVGChart(data, { title: 'Доход на номер за год' }).bind(document.querySelector('#chart .chart-2'));
                })();

                (() => { // chart-3 загруженность помесячно
                    let data = ((data) => {
                        let result = [];
                        let y = {};

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
                                let text = new Date(2000, (k - 1)).toLocaleString(GL.CONST.LOCALE, { month: 'long' });
                                result.push({ x: (i + 1), y: y[k], value: `${text}: ${y[k]} гостя(ей)`, id: k, label: { x: k, y: '' } });
                            });
                        })();

                        return result;

                    })(select.data);
                    new SVGChart(data, { title: 'Загруженность помесячно' }).bind(document.querySelector('#chart .chart-3'));
                })();

                (() => { // chart-4 загруженность по номерам
                    let data = ((data) => {
                        let result = [];
                        let y = {};

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

                    })(select.data);
                    new SVGChart(data, { title: 'Загруженность номеров за год' }).bind(document.querySelector('#chart .chart-4'));
                })();

                this.finishDataLoad();

            } catch (error) {
                this.finishDataLoad();
                // TODO error
            }
        })();
    }
}