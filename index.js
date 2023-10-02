
// canvas-related stuff
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio;

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

const leftMargin = 50;
const topMargin = 50;

const letterHeight = heightAbove + heightBelow;

let numberOfLines = 100;

let charPerLine = 30;


let mode = "insert";
let backgroundColor = "white";
let letterColor = "black";
let selectionColor = "blue";
let cursorColor = "black";

let enterInsertModeKey = "i";
let enterNavModeKey = "CapsLock";

let rows = [];
for (let i = 0; i < numberOfLines; i++) {
    let row = [];
    for (let k = 0; k < charPerLine; k++) {
        row.push("");
    }
    rows.push(row);
}

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    getPixelX() {
        return leftMargin + this.x * letterWidth;
    }

    getPixelY() {
        return topMargin + this.y * letterHeight;
    }

    advance() {
        this.x ++;
        if (this.x > charPerLine) {
            this.x = 0;
            this.y ++;
        }
    }
    retreat() {
        if (this.x > charPerLine) {
            this.x --;
        }
        if (this.x == 0 && this.y > 0) {
            this.y --;
            this.x = charPerLine;
        }
    }
    nextLine() {
        this.x = 0;
        this.y ++;
    }
}

class Cursor {
    constructor(location, color) {
        this.location = location;
        this.color = color;
    }

    moveTo(newLocation) {
        render(location);

        this.location = newLocation;
        ctx.fillStyle = this.color;
    
        let x = newLocation.getPixelX();
        let y = newLocation.getPixelY();

        ctx.fillRect(x,y, 5, letterHeight);

    }

}

let cursor = new Point(0,0);

function next(point) {
    let nextX = point.x + 1;
    let nextY = point.y;
    if (point.x > charPerLine) {
        nextX = 0;
        nextY = point.y + 1;
    }
    return new Point(nextX, nextY);
}

// clears point and paints character at point
function render(point) {
    makeRect(point, backgroundColor);
    makeText(point, charAt(point), letterColor);
}


function handleKeydown(event) {
    if (mode == "insert") {
        if (event.key == enterNavModeKey) {
            mode == "navigation";
            return;
        }
        else {
            insertModeHandle(event.key);
        }

    }
    if (mode == "navigation") {
        navigate(event.key, currentSelection);
    }
}

function insertModeHandle(key) {
    if (key == "Backspace") {
        makeRect(cursor, backgroundColor);
        cursor.retreat();
        
    }
    else if (key == "Enter") {
        cursor.nextLine();
    }
    else {
        cursor = type(cursor, key);
    }
}

function makeRect(point, color) {
    let x = point.getPixelX();
    let y = point.getPixelY();

    ctx.fillStyle = color;
    ctx.fillRect(x, y, letterWidth, letterHeight);
}

function makeText(point, key, color) {
    let x = point.getPixelX();
    let y = point.getPixelY();

    ctx.fillStyle = color;
    console.log(y);
    ctx.fillText(key, x, y);

    rows[point.y][point.x] = key;
}

function type(point, key) {
    makeRect(point, backgroundColor);
    makeText(point, key, letterColor);

    let newPoint = next(point);

    makeCursor(newPoint, cursorColor);
    return newPoint;

}

function charAt(cursor) {
    return rows[cursor.x][cursor.y];
}


function clear(place) {
    makeRect(place, backgroundColor);
}

function makeCursor(point, color) {
    ctx.fillStyle = color;
    
    let x = point.getPixelX();
    let y = point.getPixelY();

    console.log(y);

    ctx.fillRect(x,y, 5, letterHeight);
}

window.addEventListener("keydown", handleKeydown);

// text rendering


// starting with an expression selected (in navigation mode)
// options: go left/right to adjacent expressions
// delete the current expression, stay in navigation mode
// delete the current expression and enter a replacement
// select parent expression
// select first child expression