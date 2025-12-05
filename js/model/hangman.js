'use strict'
//hier komt de spelletjes data, hieronder staat een voorbeeld

const words=['rood', 'wit','blauw','geel','violet','groen','roze'];
let selectedWord;

function setSelectedWord() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
}

