var guestList = new Array();

//
function refreshTable() {
  var table = document.getElementById('guests');
  var tbody = table.getElementsByTagName('tbody')[0];

  var tr = tbody.getElementsByTagName('tr');
  for (var i = tr.length; i > 0; i--) {
    tbody.removeChild(tr[0]);
  }

  for (var i = 0; i < guestList.length; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(i + 1));
    tr.appendChild(td);
    tr.addEventListener('click', guestSelect);

    for (var j = 0; j < guestList[i].length; j++) {
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(guestList[i][j]));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
//  $( "#guests" ).load( "index.html #guests" );
}



//
function guestSelect() {
    var attr = this.getAttribute('guestSelect');
    /*if (res[0]) {
        selectedDays.splice(res[1], 1);
        this.removeAttribute('class');
    } else {
        selectedDays.push([year, month, day, room]);
        this.setAttribute('class', 'selectedDays');
    }*/
}

//
function guestEdit() {
    
}

//
function guestDelete() {
    
}