
// canvas-related stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio;
console.log(dpr);

canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";


function getColorValues(x,y) {
    let startingIndex = 4 * (y*width + x);
    return [myData[startingIndex],
    myData[startingIndex + 1],
    myData[startingIndex + 2],
    myData[startingIndex + 3]]
}

let myImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
let myData = myImageData.data;
ctx.putImageData(myImageData, 0, 0);

ctx.font = "48px monospace";
const measurements = ctx.measureText("a");
const letterWidth = measurements.width;
const heightAbove = measurements.fontBoundingBoxAscent;
const heightBelow = measurements.fontBoundingBoxDescent;

const letterHeight = heightAbove + heightBelow;
console.log(letterWidth);
console.log(letterHeight);

// text editing logic:

let rowWidth = 80;

let rows = [[""]];
let cursor = new Point(0,0);

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    advance() {
        this.x ++;
    }
    retreat() {
        if (this.x > 0) {
            this.x --;
        }
        if (this.x == 0 && this.y > 0) {
            this.y --;
            this.x = rows[y].length;
        }
    }
}

let mode = "insert";
let backgroundColor = "white";
let letterColor = "black";

let currentX = 0;
let currentY = 50;

ctx.fillStyle = "black";

let enterInsertModeKey = "i";
let enterNavModeKey = "CapsLock";

function handleKeydown(cursor, event) {
    if (mode == "insert") {
        if (event.key == enterNavModeKey) {
            mode == "navigation";
            return;
        }
        else {
            insert(cursor, event.key);
        }

    }
    if (mode == "navigation") {
        navigate(event.key, currentSelection);
    }
}

function insert(point, key) {
    if (key == "Backspace") {
        point.retreat;
        
    }
    else {
        type(point, key);
    }
}

function type(point, key) {
    rows[point.x].splice(point.y, 0, key);
}


class Node {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}









function retreat(place) {
    if (place.x == 0 && place.y > 0) {
        let y = place.y - 1;
        let x = rowWidth * letterWidth;
    }
    if (place.x > 0) {
        let x = place.x - 1;
        let y = place.y;
    }
    else {
        let x = place.x;
        let y = place.y;
    }

    return new Point(x,y);
}

function clear(place) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(place.x, place.y - heightAbove, letterWidth, letterHeight);
    ctx.fillStyle = letterColor;
}



window.addEventListener("keydown", handleKeydown);

// text rendering


// starting with an expression selected (in navigation mode)
// options: go left/right to adjacent expressions
// delete the current expression, stay in navigation mode
// delete the current expression and enter a replacement
// select parent expression
// select first child expression