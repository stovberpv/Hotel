<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" display='none'>
    <defs>
        <g id="icon-left" fill="transparent" stroke="#d1d2dd" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1">
            <path d="M21,34.397L2,20L21,5.604V15  c29,0,28,29,28,29s-1.373-19-28-19L21,34.397z"/>     
        </g>
        <g id="icon-right" fill="transparent" stroke="#d1d2dd" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1">
            <path d="M29,34.397L48,20L29,5.604  V15C0,15,1,44,1,44s1.373-19,28-19V34.397z"/>           
        </g>
        <g id="icon-calendar" fill="#d1d2dd" stroke="transparent" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </g>
        <animate xlink:href="#icon-left" begin="mouseover" end="mouseleave" attributeName="fill" values="#42b3f4;#9dea20;#42b3f4" dur="5s" repeatCount="indefinite"/>
        <animate xlink:href="#icon-right" begin="mouseover" end="mouseleave" attributeName="fill" values="#42b3f4;#9dea20;#42b3f4" dur="5s" repeatCount="indefinite"/>
        <animate xlink:href="#icon-calendar" begin="mouseover" end="mouseleave" attributeName="fill" values="#42b3f4;#9dea20;#42b3f4" dur="5s" repeatCount="indefinite"/>
    </defs>
</svg>

<div id="calendar-block">

        <button id="month-left" type="button" class="btn neutral calendar-block button-left">
            <svg viewBox="0 0 50 50" ><use xlink:href="#icon-left"/></svg>
        </button>

        <table id="calendar" class="calendar-block my-table">
            <thead>
                <tr>
                    <th>
                        <button id="pick-calendar" type="button">
                            <label id="month"></label>
                            <label id="year"></label>
                        </button></th>
                </tr>
                <tr>
                    <th class="blank-cell">
                        <!-- <button id="year" type="button">
                            <svg viewBox="0 0 24 24" ><use xlink:href="#icon-calendar"/></svg>
                            <span>1900</span>
                        </button> -->
                    </th>
                </tr>
            </thead>
            <tbody> </tbody>
        </table>

        <button id="month-right" type="button" class="btn neutral calendar-block button-right">
            <svg viewBox="0 0 50 50" ><use xlink:href="#icon-right"/></svg>
        </button>

    </div>