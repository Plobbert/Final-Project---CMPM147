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
    createP("Move the mouse to generate new patterns.");
}

function myFunction () {
    if (!mySound.isPlaying()) {
        mySound.play();
    }
    //or another function to use audio source
}

function draw() {
    if (curveDistance < .2) {
        if (currentShape == true) {
            currentShape = false;
        } else {
            currentShape = true;
        }
    }
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
    manageBackground();
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
    if (currentShape == true) {
        generateStar(-300, 200);
        generateStar(-300, -200);
        generateStar(300, 200);
        generateStar(300, -200);
    } else {
        generateCrab(-300, 200);
        generateCrab(-300, -200);
        generateCrab(300, 200);
        generateCrab(300, -200);
    }
    if (strokeSize > 2.0) {
        generateBackground();
    }
}

function manageBackground() {
    for (let i = 0; i < wiggles.length(); i++) {
        if (wiggles.getValue(i).length() == 100) {
            push();
            calculateTranslation(wiggleAngles.getValue(i));
            rotate(wiggleAngles.getValue(i));
            stroke(177, 156, 217, 70);
            strokeWeight(strokeSize * 5);
            noFill();
            beginShape();
            for (let j = 0; j < 100; j++) {
                vertex(wiggles.getValue(i).getValue(j), 200 * sin(.500 * wiggles.getValue(i).getValue(j)));
            }
            endShape();
            pop();
            wiggles.getValue(i).dequeue();
            wiggles.getValue(i).enqueue(wiggles.getValue(i).getValue(wiggles.getValue(i).length() - 1) + 5);
        } else {
            push();
            calculateTranslation(wiggleAngles.getValue(i));
            rotate(wiggleAngles.getValue(i));
            stroke(177, 156, 217, 70);
            strokeWeight(strokeSize * 5);
            noFill();
            beginShape();
            for (let j = 0; j < wiggles.getValue(i).length(); j++) {
                vertex(wiggles.getValue(i).getValue(j), 200 * sin(.5 * wiggles.getValue(i).getValue(j)));
            }
            endShape();
            pop();
            wiggles.getValue(i).enqueue(wiggles.getValue(i).getValue(wiggles.getValue(i).length() - 1) + 5);
        }
        if (wiggles.getValue(i).getValue(wiggles.getValue(i).length() - 1) > 2000) {
            wiggles.dequeue();
            wiggleAngles.dequeue();
        }
    }
}

function generateBackground() {
    console.log('weep');
    if (random(0, 10) > 9.4) {
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
    if (angle < 90) {
        translate(0, 0);
    } else if (angle < 180) {
        translate(width, 0);
    } else if (angle < 270) {
        translate(width, height);
    } else {
        translate(0, height);
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

function generateCrab(x, y) {
    push();
    translate(width / 2 + x, height / 2 + y);
    rotate(curveDistance2);
    noFill();
    stroke(255, 0, 0);
    strokeWeight(5 * strokeSize);
    beginShape();
    vertexOfCrab(-1);
    endShape(CLOSE);
    beginShape();
    vertexOfCrab(1);
    endShape(CLOSE);
    pop();
}

function vertexOfCrab(leftRight) {
    let multiple = leftRight * curveDistance;
    vertex(0 * multiple, -4.75 * multiple);
    vertex(-1.5 * multiple, -4.75 * multiple);
    vertex(-3.5 * multiple, -4.5 * multiple);
    vertex(-5 * multiple, -6.75 * multiple);
    vertex(-4.75 * multiple, -4.25 * multiple);
    vertex(-6 * multiple, -4 * multiple);
    vertex(-7.5 * multiple, -6 * multiple);
    vertex(-7.25 * multiple, -3.75 * multiple);
    vertex(-8 * multiple, -3.5 * multiple);
    vertex(-9.5 * multiple, -5.5 * multiple);
    vertex(-9 * multiple, -3.25 * multiple);
    vertex(-9.75 * multiple, -2.5 * multiple);
    vertex(-10 * multiple, -1 * multiple);
    vertex(-9.5 * multiple, 1 * multiple);
    vertex(-8 * multiple, 3 * multiple);
    vertex(-7 * multiple, 4 * multiple);
    vertex(-9 * multiple, 6 * multiple);
    vertex(-10 * multiple, 6 * multiple);
    vertex(-10.5 * multiple, 6.5 * multiple);
    vertex(-10.25 * multiple, 8 * multiple);
    vertex(-9.25 * multiple, 7.25 * multiple);
    vertex(-9.5 * multiple, 8.75 * multiple);
    vertex(-8 * multiple, 8.5 * multiple);
    vertex(-7.5 * multiple, 8 * multiple);
    vertex(-7.5 * multiple, 7 * multiple);
    vertex(-6 * multiple, 4.5 * multiple);
    vertex(-4 * multiple, 5 * multiple);
    vertex(-4.25 * multiple, 7 * multiple);
    vertex(-5 * multiple, 7.25 * multiple);
    vertex(-5 * multiple, 8.25 * multiple);
    vertex(-4.25 * multiple, 8.75 * multiple);
    vertex(-3.25 * multiple, 8.25 * multiple);
    vertex(-3.5 * multiple, 7.25 * multiple);
    vertex(-3 * multiple, 5.25 * multiple);
    vertex(-1.5 * multiple, 5.5 * multiple);
    vertex(0 * multiple, 5.75 * multiple);
}
