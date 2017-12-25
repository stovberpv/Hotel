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

        var tbody = document.getElementById('dw-contacts-tbody');
        const data = g_data.contacts;

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
}