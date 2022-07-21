let flock;
let verticalDistance, horizontalDistance, pureDistance, curveDistance, curveDistance2;
let radiatingSquares = new Queue();
let radiatingColors = new Queue();
let wiggles = new Queue();
let wiggleAngles = new Queue();
let red, green, blue;
let timer = 60;
let c;
let strokeSize = 1;
let amp;
console.log('test');

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
    amp = new p5.Amplitude();
    console.log("test1");
    createP("Move the mouse to generate new patterns.");
}

function myFunction () {
    if (!mySound.isPlaying()) {
        mySound.play();
    }
    //or another function to use audio source
}

function draw() {
    strokeSize = amp.getLevel() * 10;
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
    strokeWeight(5 * strokeSize);
    square(-pureDistance / 2, -pureDistance / 2, pureDistance, 20);
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
    manageBackground();
    if (strokeSize > 2.0) {
        generateBackground();
    }
}

function manageBackground() {
    for (let i = 0; i < wiggles.length(); i++) {
        if (wiggles.getValue(i).length() == 50) {
            push();
            calculateTranslation(wiggleAngles.getValue(i));
            rotate(wiggleAngles.getValue(i));
            stroke(255, 0, 0);
            strokeWeight(strokeSize * 5);
            beginShape();
            for (let j = 0; j < 50; j++) {
                vertex(wiggles.getValue(i).getValue(j), 100 * sin(.100 * wiggles.getValue(i).getValue(j)));
            }
            endShape();
            pop();
            wiggles.getValue(i).dequeue();
            wiggles.getValue(i).enqueue(wiggles.getValue(i).getValue(wiggles.getValue(i).length() - 1) + 1);
        } else {
            push();
            calculateTranslation(wiggleAngles.getValue(i));
            rotate(wiggleAngles.getValue(i));
            stroke(255, 0, 0);
            strokeWeight(strokeSize * 5);
            beginShape();
            for (let j = 0; j < wiggles.getValue(i).length(); j++) {
                console.log(wiggles.getValue(i).getValue(j) + " " + 100 * sin(.100 * wiggles.getValue(i).getValue(j)));
                vertex(wiggles.getValue(i).getValue(j), 100 * sin(.100 * wiggles.getValue(i).getValue(j)));
            }
            endShape();
            pop();
            wiggles.getValue(i).enqueue(wiggles.getValue(i).getValue(wiggles.getValue(i).length() - 1) + 1);
        }
        if (wiggles.getValue(i).getValue(wiggles.getValue(i).length() - 1) > 2000) {
            wiggles.dequeue();
            wiggleAngles.dequeue();
        }
    }
}

function generateBackground() {
    console.log('weep');
    if (random(0, 10) > 9.2) {
        let xToDraw = new Queue();
        xToDraw.enqueue(0);
        wiggles.enqueue(xToDraw);
        let rotation = random(0, 360);
        wiggleAngles.enqueue(rotation);
    }
    push();
    strokeWeight(10);
    stroke(255, 0, 0);
    beginShape();
    vertex(width/2, height/2);
    endShape(CLOSE);
    pop();
}

function calculateTranslation(angle) {
    console.log('changed');
    if (angle < 90) {
        translate(random(-width / 2, width / 2), random(height / 2, height + height / 2));
    } else if (angle < 180) {
        //translate(random(width / 2, width + width / 2), random(height / 2, height + height / 2));
        translate(random(width / 2, width + width / 2), random(-height / 2, height / 2));
    } else if (angle < 270) {
        translate(width / 2, height / 2);
    } else {
        translate(random(-width / 2, width / 2), random(-height / 2, height / 2));
    }
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
    strokeWeight(5 * strokeSize);
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
