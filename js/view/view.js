'use strict'
//hier komen de view functies, hieronder staat voorbeeld code
const buttons = document.querySelectorAll('.letters button');

function bindButtons(){
    for(let b=0;b<buttons.length;b++)
    {
        buttons[b].addEventListener('click', handleLetterClick);
    }
}

