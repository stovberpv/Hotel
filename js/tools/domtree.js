/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W083 */
'use strict';

class DOMTree {
    constructor(tree) {
        this.tree = tree;
    }

    cultivate() {

        function look(tree) {

            var getProperty = function (twig) {
                let el;
                for (let key in twig) {
                    if (!twig.hasOwnProperty(key)) continue;
                    let val = twig[key];
                    switch (key) {
                        case 'tag':
                            el = document.createElement(val);
                            break;

                        case 'id':
                        case 'type':
                        case 'rowspan':
                        case 'colspan':
                            el.setAttribute(key, val);
                            break;

                        case 'required':
                        case 'readonly':
                            val && el.setAttribute(key, '');
                            break;

                        case 'class':
                            val.split(' ').forEach(className => {
                                el.classList.add(className);
                            });
                            break;

                        case 'events':
                            for (let ev of twig[key]) {
                                let callback = (ev.bind) ? ev.fn.bind(ev.bind) : ev.fn;
                                el.addEventListener(ev.name, callback);
                            }
                            break;

                        case 'textNode':
                            el.appendChild(document.createTextNode(val));
                            break;

                        case 'style':
                            for (let attr in val) {
                                const attrVal = val[attr];
                                el.setAttribute('style', `${attr}:${attrVal}`);
                            }
                            break;
                        case 'attr':
                            for (let attr in val) {
                                const attrVal = val[attr];
                                el.setAttribute(attr, attrVal);
                            }
                            break;

                        case 'prop':
                            for (let prop in val) {
                                const propVal = val[prop];
                                el[prop] = propVal;
                            }
                            break;

                        default:
                            break;
                    }
                }
                return el;
            };

            let DOMelement;
            for (let i = 0; i < tree.length; i++) {
                const twig = tree[i];
                let el;
                switch (Object.prototype.toString.call(twig)) {
                    case '[object Array]': el = look(twig); break;
                    case '[object Object]': el = getProperty(twig); break;
                    default: continue;
                }
                DOMelement ? DOMelement.appendChild(el) : (DOMelement = el);
            }
            return DOMelement;
        }

        return look(this.tree);
    }
}