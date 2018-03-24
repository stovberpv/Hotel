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

    constructor(data, config = {}, opts = {}) {
        this._id = Math.floor(Math.random() * 100000);
        this._viewBox = {
            width: 1000,
            height: 1000
        };
        this._data = data;
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
                    <g class='axis' stroke-width='3' stroke='#f1f1f1' fill='transparent'>
                        <g class='x-axis' stroke-dasharray="5, 5">
                            <line class="0%" x1='0' y1='100%' x2='100%' y2='100%'  stroke='transparent'></line>
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
                dots: [],
                balloon: [],
                animation: []
            }

            let xAxis = target.querySelector('.x-axis');
            let yAxis = target.querySelector('.y-axis');

            self.data.forEach(entry => {

                let point;

                (()=>{ // формирую точку
                    point = { x: self.step.x(entry.x), y: self.invertY(self.step.y(entry.y)), v: entry.v, id: entry.id, l: entry.l };
                })();

                (()=>{ //сохраняю точку для формирования пути
                    (queue.path.M) ? (queue.path.L +=`L${point.x},${point.y}`) : (queue.path.M = `M${point.x},${point.y}`);
                })();

                (() => { // вертикальная пунктирная линия
                    queue.yAxis.push(self.lineY(point));
                    queue.yAxis.push(self.text((point.x + 10), 30, point.l));
                })();

                (() => { // тексты к точкам
                    let balloon = document.createElementNS(null, 'g');
                    balloon.setAttributeNS(null, 'id', `popup${entry.id}`);
                    balloon.setAttributeNS(null, 'opacity', `0`);
                    balloon.setAttributeNS(null, 'class', `popup`);
                    // нужно для транфформации из css, трансформация в прцоентах внутри SVG не работает
                    balloon.appendChild(self.text(point.x, (point.y - 10), point.v));
                    queue.balloon.push(balloon);
                })();

                (() => { // точки вершин
                    let circle = self.circle(point, '1%');
                    circle.setAttributeNS(null, 'id', `point${entry.id}`);
                    circle.setAttributeNS(null, 'class', `point`);
                    queue.dots.push(circle);
                })();

                (() => { // анимация
                    let g = document.createElementNS(null, 'g');
                    g.setAttributeNS(null, 'id', `animation${entry.id}`);
                    g.appendChild(self.animation(`popup${entry.id}`, `point${entry.id}`, 'mouseover', 0, 1));
                    g.appendChild(self.animation(`popup${entry.id}`, `point${entry.id}`, 'mouseout', 1, 0));
                    queue.animation.push(g);
                })();

            });

            (() => { // путь
                path = document.createElementNS(self.ns, 'path');
                circle.setAttributeNS(null, 'stroke-linejoin','round');
                circle.setAttributeNS(null, 'fill', 'transparent');
                circle.setAttributeNS(null, 'stroke', '#00a4e4');
                circle.setAttributeNS(null, 'stroke-width', '3');
                circle.setAttributeNS(null, 'd', `${queue.path.M} ${queue.path.L}`);
                queue.path = path;
            })();

            (() => { // оси X Y

            })();

            (() => { // точки

            })();

            (() => { // текст точки

            })();

            (() => { // анимация

            })();
            /*
            (() => {
                let cd = target.querySelector('.chart-data');
                cd.appendChild(path);
                g.forEach(g => { cd.appendChild(g); });
                cd.innerHTML += '<g></g>';
            })();

            (() => {
                xAxis.appendChild(self.text(0, 240, (self.config.scale.y * 0.75))); //75%
                xAxis.appendChild(self.text(0, 490, (self.config.scale.y * 0.50))); //50%
                xAxis.appendChild(self.text(0, 740, (self.config.scale.y * 0.25))); //25%
            })();
            */
        })();
    }

    polyline(pre, cur) {
        let polyline = document.createElementNS(this.ns, 'polyline');
        polyline.setAttributeNS(this.ns, 'id', cur.id);
        polyline.setAttributeNS(this.ns, 'data-cid', cur.id);
        polyline.setAttributeNS(this.ns, 'data-pid', pre.id);
        polyline.setAttributeNS(this.ns, 'points', `${pre.x},${pre.y} ${cur.x},${cur.y}`);
        return polyline;
    }

    text(x, y, v) {
        let text = document.createElementNS(this.ns, 'text');
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y);
        text.setAttributeNS(null, 'stroke', 'transparent');
        text.setAttributeNS(null, 'fill', '#6a737b');
        text.setAttributeNS(null, 'stroke-width', '2');
        text.setAttributeNS(null, 'font-size', '30');
        text.innerHTML = v;
        return text;
    }

    circle(p, r) {
        let circle = document.createElementNS(this.ns, 'circle');
        circle.setAttributeNS(null, 'cx', p.x);
        circle.setAttributeNS(null, 'cy', p.y);
        circle.setAttributeNS(null, 'r', r);
        circle.setAttributeNS(null, 'fill', 'white');
        circle.setAttributeNS(null, 'stroke', 'orange');
        return circle;
    }

    animation(targetId, sourceId, trigger, start, end) {
        let animation = document.createElementNS(null, 'animate');
        animation.setAttributeNS(null, 'href', `#${targetId}`);
        animation.setAttributeNS(null, 'attributeName', 'opacity');
        animation.setAttributeNS(null, 'from', start);
        animation.setAttributeNS(null, 'to', end);
        animation.setAttributeNS(null, 'dur', '0.5s');
        animation.setAttributeNS(null, 'begin', `${sourceId}.${trigger}`);
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

    block(p) {
        // let path = document.createElementNS(this.ns, 'path');
        // this.attr(p, 'd', `M ${p.x},${p.y} L ${cur.x},${cur.y}`);
        // return path;
    }

    attr(target, attr, val) { target.setAttributeNS(this.ns, attr, val); }
    invertY(y) { return this.viewBox.height - y; }
}

class Diagrams extends DataWrapper {

    constructor() { super(); }

    bind(target) {
        let tree =
            [{ tag: 'div', id: 'chart-wrapper' },
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
        let self = this;
        (async () => {
            try {
                let config = await new Select().select('year').from('cf001').join('us001').on('us001.login = cf001.user').where('us001.login = ?').connect(1);
                if (!config.affectedRows) return;
                let year = config.data[0].year;
                let dbeg = new Date(year, '00', '01').format('yyyy-mm-dd'),
                    dend = new Date(year, '12', '00').format('yyyy-mm-dd');
                let select = await new Select('', { types: 'ss', param: [dend,dbeg] }).select('*').from('gl001').where('dbeg <= ? and dend >= ?').connect();
                if (!select.affectedRows) return;

                //
                let data = ((data) => {
                    let obj = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0};
                    data.forEach(el => {
                        let month = new Date(el.dbeg).format('m');
                        obj[month] += parseFloat(el.paid);
                    });
                    let parsed = [];
                    for (let el in obj) {
                        let month = new Date(1900, el).toLocaleString(GL.CONST.LOCALE, { month: 'long' });
                        parsed.push({ x: el, y: obj[el], v: `${month}: ${obj[el]}`, id: el, l: el });
                    }
                    return parsed;
                })(select.data);

                let chart = new SVGChart(data).bind(document.querySelector('#chart-wrapper .chart-1'));

            } catch (error) {

            }
        })();
    }
}

/*
 NOTE вполне рабочий вариант.
    Заморочился с расчетом позиций, по этому не стоит удалять.
    Лучше оставить, возможно однажды пригодится.

let chart = new Chart(data).create();
document.querySelector('#chart-wrapper .chart-wrapper-1').appendChild(chart);
class SVGChart {
    constructor(data, config = {}, opts = {}) {
        this._id = Math.floor(Math.random() * 100000);
        this._viewBox = {
            width: 1000,
            height: 1000
        };
        this._data = data;
        this._style = {
            size: {
                width: opts.size ? opts.size.width : 1000,
                height: opts.size ? opts.size.height : 1000
            },
            color: {
                x: opts.color ? opts.color.x : '#6a737b', //x axis
                y: opts.color ? opts.color.y : '#6a737b', //y axis
                l: opts.color ? opts.color.l : '#00a4e4', //label
                v: opts.color ? opts.color.v : '#06D85F', //value
                d: opts.color ? opts.color.v : '#ffdd00', //dot point
            }
        };
        this._config = {
            scale: {
                x: config.scale ? config.scale.x : this.data.map((e) => { return e.x; }).filter((e,i,a) => { return i === a.indexOf(e); }).length + 1,
                y: config.scale ? config.scale.y : Math.max.apply(Math, this.data.map((o) => { return o.y; }))
            },
            aspectRatio: config.aspectRatio ? config.aspectRatio : 'xMinYMin meet', //none
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
    get style() { return this._style; }
    get config() { return this._config; }
    get step() { return this._step; }
    get ns() {return this._ns; }

    create() {
        let self = this,
            container,
            points = [];

        (() => {
            container = document.createElement('div');
            container.classList.add('chart-container');
            container.innerHTML =
                `<svg
                    version='1.2'
                    xmlns='${self.ns}'
                    xmlns:xlink='http://www.w3.org/1999/xlink'
                    id='svg-graph-${self.id}'
                    class='graph'
                    viewBox='0 0 ${self.viewBox.width} ${self.viewBox.height}'
                    preserveAspectRatio='${self.config.aspectRatio}'
                    >
                    <g class='axis' stroke-width='5'>
                        <g class='x-axis' stroke='${self.style.color.x}'> <line x1='0' y1='1000' x2='1000' y2='1000'></line> </g>
                        <g class='y-axis' stroke='${self.style.color.y}'> <line x1='0' y1='0000' x2='0000' y2='1000'></line> </g>
                    </g>
                    <g class='chart-points' stroke='${self.style.color.l}' stroke-width='3'>
                    </g>
                </svg>`;
        })();

       (() => {
        let pre = { x: 0, y: 1000, id: '' };
        self.data.forEach(entry => {
                let cur = { x: self.step.x(entry.x), y: self.inv(self.step.y(entry.y)), v: entry.v, id: entry.id };
                (cur.x !== 0 && cur.y !== 1000) && points.push(self.NSg(pre, cur));
                pre = cur;
            });
        })();

        (() => { points.forEach(p => { container.querySelector('.chart-points').appendChild(p); });})();

        return container;
    }

    NSg(pre, cur) {
        let g = document.createElementNS(this.ns, 'g');
        g.appendChild(this.NSpath(pre, cur));
        g.appendChild(this.NSlineX(cur));
        g.appendChild(this.NSlineY(cur));
        g.innerHTML += '<g></g>';
        return g;
    }

    NSpolylines(pre, cur) {
        let polyline = document.createElementNS(this.ns, 'polyline');
        polyline.setAttributeNS(this.ns, 'id', cur.id);
        polyline.setAttributeNS(this.ns, 'data-cid', cur.id);
        polyline.setAttributeNS(this.ns, 'data-pid', pre.id);
        polyline.setAttributeNS(this.ns, 'points', `${pre.x},${pre.y} ${cur.x},${cur.y}`);
        return polyline;
    }

    NSlineX(p) {
        let line = document.createElementNS(this.ns, 'line');
        line.setAttributeNS(this.ns, 'x1', '0');
        line.setAttributeNS(this.ns, 'y1', p.y);
        line.setAttributeNS(this.ns, 'x2', this.viewBox.width);
        line.setAttributeNS(this.ns, 'y2', p.y);
        line.setAttributeNS(this.ns, 'stroke', '#6a737b');
        line.setAttributeNS(this.ns, 'stroke-width', '1');
        return line;
    }

    NSlineY(p) {
        let line = document.createElementNS(this.ns, 'line');
        line.setAttributeNS(this.ns, 'x1', p.x);
        line.setAttributeNS(this.ns, 'y1', '0');
        line.setAttributeNS(this.ns, 'x2', p.x);
        line.setAttributeNS(this.ns, 'y2', this.viewBox.height);
        line.setAttributeNS(this.ns, 'stroke', '#6a737b');
        line.setAttributeNS(this.ns, 'stroke-width', '1');
        return line;
    }

    NStext(p) {
        let text = document.createElementNS(this.ns, 'text');
        text.setAttributeNS(this.ns, 'x', (p.x - 30));
        text.setAttributeNS(this.ns, 'y', this.viewBox.height);
        text.setAttributeNS(this.ns, 'stroke', this.style.color.v);
        text.setAttributeNS(this.ns, 'stroke-width', '1');
        text.setAttributeNS(this.ns, 'font-size', '25');
        return text;
    }

    NScircle(p) {
        let circle = document.createElementNS(this.ns, 'circle');
        circle.setAttributeNS(this.ns, 'cx', p.x);
        circle.setAttributeNS(this.ns, 'cy', p.y);
        circle.setAttributeNS(this.ns, 'r', '5');
        circle.setAttributeNS(this.ns, 'fill', this.style.color.d);
        circle.setAttributeNS(this.ns, 'stroke', this.style.color.d);
        return circle;
    }

    NSpath(pre, cur) {
        let path = document.createElementNS(this.ns, 'path');
        path.setAttributeNS(this.ns, 'd', `M ${pre.x},${pre.y} L ${cur.x},${cur.y}`);
        path.setAttributeNS(this.ns, 'fill', 'transparent');
        path.setAttributeNS(this.ns, 'stroke', this.style.color.l);
        return path;
    }

    inv(y) { return this.viewBox.height - y; }
    add() {}
    upd() {}
    del() {}
}
    role='img'
    width=${self.style.size.width}
    height=${self.style.size.height}
    vector-effect='non-scaling-stroke'
    y-axis
    <line x1='0' y1='250' x2='10' y2='250'></line>
    <line x1='0' y1='500' x2='15' y2='500'></line>
    <line x1='0' y1='750' x2='10' y2='750'></line>
    <polyline id='1' data-cid='1' data-pid=' ' points='0000,0000 0000,0100 0000,0100 0100,0100'/>
*/