class RCMenu {

    constructor(opts) {
        this.Opts = opts;
        this.Doc = opts.source;
        this.X = opts.x;
        this.Y = opts.y;
    }

    bind() {
        var rcmlist = '<ul id = "rcmenu-list">';
        if (this.Opts.btn.upd) {
            rcmlist += '<li id="editGuest" class="rcmenu-item">Изменить</li>';
        }
        if (this.Opts.btn.del) {
            rcmlist += '<li id="delGuest" class="rcmenu-item">Удалить</li>';
        }
        if (this.Opts.btn.add) {
            rcmlist += '<li id="addGuest" class="rcmenu-item">Добавить</li>';
        }
        rcmlist += '</ul>';

        var rcmenu = this.Doc.createElement('div');
        rcmenu.id = 'rcmenu';
        rcmenu.innerHTML = rcmlist;
        this.Doc.body.appendChild(rcmenu);

        var el = rcmenu.children[0].children;
        for(let i = 0; i < el.length; i++) {
            switch (el[i].id) {
                case 'editGuest':
                    el[i].addEventListener('click', editGuest.bind( { id: this.Opts.id } ));
                break;

                case 'delGuest': 
                    el[i].addEventListener('click', delGuest.bind( { id: this.Opts.id } ));
                break;

                case 'addGuest':
                    el[i].addEventListener('click', addguest.bind( { room: this.Opts.room, dayin: this.Opts.begda, dayout: this.Opts.endda } ));
                break;
            
                default:
                    break;
            }
        }
    }

    show() {
        var rcmenu = this.Doc.getElementById('rcmenu');
        if (rcmenu != undefined) {
            rcmenu.style.left = this.X + 'px';
            rcmenu.style.top = this.Y + 'px';
            rcmenu.style.display = 'block';
        }
    }

    unbind() {
        var rcmenu = this.Doc.getElementById('rcmenu');
        if (rcmenu != undefined) {
            rcmenu.style.display = 'none';
            rcmenu.parentNode.removeChild(rcmenu);
        }
    }
}