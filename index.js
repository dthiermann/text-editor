
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;

// Set the "actual" size of the canvas
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 10, 10);

let myImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
let myData = myImageData.data;

for (let i = 0; i < myData.length; i+=4) {
    myData[i] = 0;
    myData[i+1] = 0;
    myData[i+2] = 0;
    myData[i+3] = 255;

}

ctx.putImageData(myImageData, 0, 0);