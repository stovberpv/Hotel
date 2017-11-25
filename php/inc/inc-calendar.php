<div id="calendar-block">

        <button id="year" type="button" data-toggle="modal" class="btn neutral">1900</button>

        <br/>
        <br/>
        
        <button id="month-left" type="button" class="btn neutral calendar-block button-left">
        <svg version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px"
            viewBox="0 0 50 50" 
            enable-background="new 0 0 50 50" 
            xml:space="preserve">
            <path id="icon-left" fill="#ffffff" d="M21,34.397L2,20L21,5.604V15  c29,0,28,29,28,29s-1.373-19-28-19L21,34.397z" 
                 stroke="#6a737b" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1"/>
                 <animate xlink:href="#icon-left" begin="mouseover" end="mouseleave" attributeName="fill" values="#42b3f4;#9dea20;#42b3f4" dur="5s" repeatCount="indefinite"/>
        </svg>
        </button> <!-- &#8636; -->

        <table id="calendar" class="calendar-block my-table">
            <thead> </thead>
            <tbody> </tbody>
        </table>

        <button id="month-right" type="button" class="btn neutral calendar-block button-right">
        <svg version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px"
            viewBox="0 0 50 50" 
            enable-background="new 0 0 50 50" 
            xml:space="preserve" >
            <path id="icon-right" fill="#ffffff" d="M29,34.397L48,20L29,5.604  V15C0,15,1,44,1,44s1.373-19,28-19V34.397z" 
                stroke="#6a737b" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1"/>
                <animate xlink:href="#icon-right" begin="mouseover" end="mouseleave" attributeName="fill" values="#42b3f4;#9dea20;#42b3f4" dur="5s" repeatCount="indefinite"/>
        </svg>  
        </button> <!-- &#8640; -->

    </div>