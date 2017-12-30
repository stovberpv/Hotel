class Contacts extends DataWrapper {

    bind(target) {

        var tr = document.createElement('tr'),
            td;

        td = document.createElement('td');
        td.classList.add('dw-contacts-person');
        td.classList.add('dw-contacts-person-name');
        td.innerHTML = 'name';
        tr.appendChild(td);

        td = document.createElement('td');
        td.classList.add('dw-contacts-person');
        td.classList.add('dw-contacts-person-tel');
        td.innerHTML = 'tel';
        tr.appendChild(td);

        td = document.createElement('td');
        td.classList.add('dw-contacts-person');
        td.classList.add('dw-contacts-person-city');
        td.innerHTML = 'city';
        tr.appendChild(td);

        td = document.createElement('td');
        td.classList.add('dw-contacts-person');
        td.classList.add('dw-contacts-person-info');
        td.innerHTML = 'info';
        tr.appendChild(td);

        var thead = document.createElement('thead');
        thead.setAttribute('id', 'dw-contacts-thead');
        thead.appendChild(tr);

        var tbody = document.createElement('tbody');
        tbody.setAttribute('id', 'dw-contacts-tbody');

        var table = document.createElement('table');
        table.setAttribute('id', 'dw-contacts-table');
        table.appendChild(thead);
        table.appendChild(tbody);

        target.appendChild(table);
    }

    init() {

        var success = function (data) {
            if (!data.status) {
                console.log(data.msg);
                var redirectDialog = new RedirectDialog();
                redirectDialog.bind();
                redirectDialog.show();
            } else {
                data.data.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    } else if (a.id < b.id) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                this.that.setData(data.data);
            }
        }

        var error = function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }

        $.ajax({
            url: '../db/pb001/select.php',
            dataType: 'json',
            success: success.bind({ that: this }),
            error: error
        });
    }

    setData(data) {

        var tbody = document.getElementById('dw-contacts-tbody');

        for (let i = 0; i < data.length; i++) {
            const wa = data[i];

            var tr = document.createElement('tr'),
                td;

            td = document.createElement('td');
            td.classList.add('dw-contacts-person');
            td.classList.add('dw-contacts-person-name');
            td.appendChild(document.createTextNode(wa.name));
            tr.appendChild(td);

            td = document.createElement('td');
            td.classList.add('dw-contacts-person');
            td.classList.add('dw-contacts-person-tel');
            td.appendChild(document.createTextNode(wa.tel));
            tr.appendChild(td);

            td = document.createElement('td');
            td.classList.add('dw-contacts-person');
            td.classList.add('dw-contacts-person-city');
            td.appendChild(document.createTextNode(wa.city));
            tr.appendChild(td);

            td = document.createElement('td');
            td.classList.add('dw-contacts-person');
            td.classList.add('dw-contacts-person-info');
            td.appendChild(document.createTextNode(wa.info));
            tr.appendChild(td);

            tbody.appendChild(tr);
        }
    }

    reset() {
        var tbody = document.getElementById('dw-contacts-tbody');
        if (!tbody.firstChild) return;
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }
}