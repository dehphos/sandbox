

const ww = 600
const wh = 900
var mouseX_c
var mouseY_c
var current
var next


var grainSize = 10
var colm = wh/grainSize
var rows = ww/grainSize


function createGrid(colm,rows){
  var arr = new Array
    for(let i = -50; i < rows +50; i++){ 
      var arr2 = new Array
      for(let j = -50; j < colm +50; j++){

        arr2[j] = 0
      }
      arr[i] = arr2
    }
    return arr;

}


function recalculateMouseCoordinates(){
  cssscale = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--zoomscale'));
  document.documentElement.style.setProperty('--zoomscale', zoomslider.value());
  mouseX_c = mouseX / cssscale
  mouseY_c = mouseY / cssscale
}
function brush(){
  let mx = Math.floor(mouseX_c/grainSize)
  let my = Math.floor(mouseY_c/grainSize)
  let val = brushsize.value()
  for(let i = 0; i < val; i++){ 
    for(let j = 0; j < val; j++){
      if(Math.random() < (0.25*(4/val))){
      current[mx + i - val/2 - 0.5][my + j - val/2 - 0.5] = 1
    }
  }}

}
function calculateNextFrame(){
  let nextframe = createGrid(colm, rows)
  for(let i = 0; i < rows; i++){ 
    for(let j = 0; j < colm; j++){
      if(current[i][j] == 1){
        if(current[i][j + 1] == 0 && j != colm - 1){nextframe[i][j+1] = 1}
        else if(current[i][j + 1] == 1){
          let dir = Math.sign(Math.random()*2-1)
          if(i+dir >= 0 && i+dir <= rows-1 && current[i+dir][j+1] == 0){nextframe[i+dir][j+1] = 1}
          else if(i-dir >= 0 && i-dir <= rows-1 && current[i-dir][j+1] == 0){nextframe[i-dir][j+1] = 1}
          else{nextframe[i][j] = 1}
        }
        else if(j == colm - 1){nextframe[i][j] = current[i][j]}
      }
    }}
  return nextframe
}

function reset(){
  current = createGrid(colm,rows)
}

function setup() {
  createCanvas(ww, wh);
  cssscale = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--zoomscale'));
  zoomslider = createSlider(0.01,1,cssscale,0.01)
  brushsize = createSlider(1,20,1,2)
  current = createGrid(colm,rows)
  resetbutton = createButton("Reset")
  resetbutton.mouseClicked(reset)


}



function draw() {
  background(0);
  recalculateMouseCoordinates()
  strokeWeight(0)

  if(mouseIsPressed){
    if(mouseX_c > 0 && mouseX_c < ww && mouseY_c > 0 && mouseY_c < wh){
    brush()}
  }


  for(let i = 0; i < rows; i++){ 
    for(let j = 0; j < colm; j++){
      if(current[i][j] === 1){
        rect(i*grainSize,j*grainSize,grainSize-0.01)
      }
      // fill(current[i][j] * 255)
      // rect(i*grainSize,j*grainSize,grainSize-1)

    }}
  push()
  fill(255)
  text(Math.floor(frameRate()),ww/2,10)
  pop()
  next = calculateNextFrame()
  current = next
}
