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
                        case 'style':
                        case 'required':
                        case 'readonly':
                            el.setAttribute(key, val);
                            break;

                        case 'class':
                            val.split(' ').forEach(className => {
                                el.classList.add(className);
                            });
                            break;

                        case 'event':
                            let ev = twig[key];
                            if (ev.bind) ev.fn.bind(ev.bind);
                            el.addEventListener(ev.name, ev.callback);
                            break;

                        case 'textNode':
                            el.appendChild(document.createTextNode(val));
                            break;

                        default:
                            break;
                    }
                }
                return el;
            }

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