let flock;
let verticalDistance, horizontalDistance, pureDistance, curveDistance, curveDistance2;
let radiatingSquares = new Queue();
let radiatingColors = new Queue();
let red, green, blue;
let timer = 60;
let c;

function Queue(array) {
    this.array = [];
    if (array) this.array = array;
}

// Add Get Buffer property to object
// constructor which slices the array
Queue.prototype.getBuffer = function () {
    return this.array.slice();
}

// Add isEmpty properties to object constructor
// which returns the length of the array
Queue.prototype.isEmpty = function () {
    return this.array.length == 0;
}

Queue.prototype.length = function () {
    return this.array.length;
}

Queue.prototype.getValue = function (i) {
    return this.array[i];
}

Queue.prototype.updateValue = function (i) {
    this.array[i] += 5;
    return this.array[i];
}

// Add Push property to object constructor
// which push elements to the array
Queue.prototype.enqueue = function (value) {
    this.array.push(value);
}

Queue.prototype.dequeue = function () {
    return this.array.shift();
}
let mySound;
function preload() {
    mySound = loadSound('./assets/crab.mp3');
}

function setup() {
    
    createCanvas(1080, 720);
    red = 120;
    blue = 120;
    green = 120;
    createP("Move the mouse to generate new patterns.");
    mySound.play();
}

function draw() {
    for (let i = 0; i < radiatingSquares.length(); i++) {
        radiatingSquares.updateValue(i);
    }
    red += random(-10, 10);
    green += random(-10, 10);
    blue += random(-10, 10);
    if (red < 0) {
        red = 255;
    } else if (red > 255) {
        red = 0;
    }
    if (green < 0) {
        green = 255;
    } else if (green > 255) {
        green = 0;
    }
    if (blue < 0) {
        blue = 255;
    } else if (blue > 255) {
        blue = 0;
    }
    c = color(red, green, blue);
    timer--;
    background(40, 40, 40);
    curveDistance = 2000;
    curveDistance2 = 2000;
    verticalDistance = mouseY - height / 2;
    horizontalDistance = mouseX - width / 2;
    pureDistance = sqrt(pow(mouseX - width / 2, 2) + pow(mouseY - height / 2, 2));
    angleMode(DEGREES);
    push();
    translate(width / 2, height / 2);
        rotate(verticalDistance);
        rotate(horizontalDistance);
    noFill();
    stroke(c);
    strokeWeight(5);
    square(-pureDistance / 2, -pureDistance / 2, pureDistance, 20);
    console.log(radiatingSquares);
    if (timer == 0) {
        radiatingSquares.enqueue(pureDistance);
        radiatingColors.enqueue(c);
        timer = 60;
    }
    generateRadiation();
    pop();
    calculateDistanceFromCurve();
    generateStar(-300, 200);
    generateStar(-300, -200);
    generateStar(300, 200);
    generateStar(300, -200);
}

function generateRadiation() {
    if (radiatingSquares.getValue(0) > 1000) {
        radiatingSquares.dequeue();
        radiatingColors.dequeue();
    }
    for (let i = 0; i < radiatingSquares.length(); i++) {
        stroke(radiatingColors.getValue(i));
        square(-radiatingSquares.getValue(i) / 2, -radiatingSquares.getValue(i) / 2, radiatingSquares.getValue(i), 20);
    }
}

function calculateDistanceFromCurve() {
    for (let i = 0; i < width; i++) {
        let distance = dist(mouseX, mouseY, i, curveFunction(i));
        push();
        beginShape();
        vertex(i, curveFunction(i));
        endShape(CLOSE);
        pop();
        if (distance < curveDistance) {
            curveDistance = distance;
        }
    }
    for (let i = 0; i < width; i++) {
        let distance = dist(mouseX, mouseY, i, height - curveFunction(i));
        push();
        beginShape();
        vertex(i, height - curveFunction(i));
        endShape(CLOSE);
        pop();
        if (distance < curveDistance2) {
            curveDistance2 = distance;
        }
    }
}

function curveFunction(x) {
    let y = x/width * height;
    return y;
}

function generateStar(x, y) {
    push();
    translate(width/2 + x, height/2 + y);
    rotate(curveDistance2);
    noFill();
    stroke(0, 255, 255);
    strokeWeight(5);
    beginShape();
    vertex(- (.3 * curveDistance), - (.5 * curveDistance));
    vertex(0, (-1.1 * curveDistance));
    vertex((.3 * curveDistance), - (.5 * curveDistance));
    vertex((1.0 * curveDistance), - (.5 * curveDistance));
    vertex((.5 * curveDistance), (0 * curveDistance));
    vertex((.7 * curveDistance), (.75 * curveDistance));
    vertex(0, (.25 * curveDistance));
    vertex(- (.7 * curveDistance), (.75 * curveDistance));
    vertex(- (.5 * curveDistance), (0 * curveDistance));
    vertex(- (1.0 * curveDistance), - (.5 * curveDistance));
    endShape(CLOSE);
    pop();
}
