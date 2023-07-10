
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio;

canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

let myImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
let myData = myImageData.data;

ctx.putImageData(myImageData, 0, 0);

function getColorValues(x,y) {
    let startingIndex = 4 * (y*width + x);
    return [myData[startingIndex],
    myData[startingIndex + 1],
    myData[startingIndex + 2],
    myData[startingIndex + 3]]
}

ctx.font = "48px monospace";
const measurements = ctx.measureText("a");
const letterWidth = measurements.width;
const heightAbove = measurements.fontBoundingBoxAscent;
const heightBelow = measurements.fontBoundingBoxDescent;

const letterHeight = heightAbove + heightBelow;
console.log(letterWidth);
console.log(letterHeight);

let mode = "insert";
let currentX = 0;
let currentY = 50;

ctx.fillStyle = "black";
// ctx.fillText("Hello", 0, 50);

let enterInsertModeKey = "i";
let enterNavModeKey = "CapsLock";

function handleKeydown(event) {
    if (mode == "insert") {
        if (event.key == enterNavModeKey) {
            mode == "navigation";
            return;
        }
        else {
            type(event.key);
        }

    }
    if (mode == "navigation") {
        navigate(event.key, currentSelection);
    }
}

function type(key) {
    if (key == "Backspace") {
        currentX = currentX - letterWidth;
        ctx.fillStyle = "white";
        ctx.fillRect(currentX, currentY - heightAbove, letterWidth, letterHeight);
        ctx.fillStyle = "black";
    }
    else {
        ctx.fillText(key, currentX, currentY);
        currentX = currentX + letterWidth;
    }

    
}



window.addEventListener("keydown", handleKeydown);

// text rendering


// starting with an expression selected (in navigation mode)
// options: go left/right to adjacent expressions
// delete the current expression, stay in navigation mode
// delete the current expression and enter a replacement
// select parent expression
// select first child expression