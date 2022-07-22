let verticalDistance, horizontalDistance, pureDistance, curveDistance, curveDistance2;
let radiatingSquares = new Queue();
let radiatingColors = new Queue();
let wiggles = new Queue();
let wiggleAngles = new Queue();
let recentAmp = new Queue();
let red, green, blue;
let timer = 60;
let c;
let strokeSize = 1;
let amp;
let ampAvg = 0;
let currentShape = true;

function Queue(array) {
    this.array = [];
    if (array) this.array = array;
}

Queue.prototype.getBuffer = function () {
    return this.array.slice();
}

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
    createP("Click 'Play Song', then move the mouse to interact with the rave.");
}

function myFunction () {
    if (!mySound.isPlaying()) {
        mySound.play();
    }
}

function draw() {
    strokeSize = amp.getLevel() * 10;
    recentAmp.enqueue(strokeSize);
    if (recentAmp.length() == 10) {
        recentAmp.dequeue();
    }
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
    ampAvg = 0;
    for (let i = 0; i < recentAmp.length(); i++) {
        ampAvg += recentAmp.getValue(i);
    }
    ampAvg = ampAvg / recentAmp.length();
    if (ampAvg > 2.1) {
        currentShape = false;
        generateBackground();
    }
    if (ampAvg < 1.2) {
        currentShape = true;
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
    if (random(0, 10) > 9.4) {
        let xToDraw = new Queue();
        xToDraw.enqueue(0);
        wiggles.enqueue(xToDraw);
        let rotation = random(0, 360);
        wiggleAngles.enqueue(rotation);
    }
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
        if (distance < curveDistance) {
            curveDistance = distance;
        }
    }
    for (let i = 0; i < width; i++) {
        let distance = dist(mouseX, mouseY, i, height - curveFunction(i));
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
    strokeWeight(3 * strokeSize);
    beginShape();
    vertexOfCrab(-1);
    endShape();
    beginShape();
    vertexOfCrab(1);
    endShape();
    pop();
}

function vertexOfCrab(leftRight) {
    let multiple = leftRight * curveDistance;
    vertex(0 * multiple, .475 * curveDistance);
    vertex(-.15 * multiple, .475 * curveDistance);
    vertex(-.35 * multiple, .45 * curveDistance);
    vertex(-.5 * multiple, .675 * curveDistance);
    vertex(-.475 * multiple, .425 * curveDistance);
    vertex(-.6 * multiple, .4 * curveDistance);
    vertex(-.75 * multiple, .6 * curveDistance);
    vertex(-.725 * multiple, .375 * curveDistance);
    vertex(-.8 * multiple, .35 * curveDistance);
    vertex(-.95 * multiple, .55 * curveDistance);
    vertex(-.9 * multiple, .325 * curveDistance);
    vertex(-.975 * multiple, .25 * curveDistance);
    vertex(-1.0 * multiple, .1 * curveDistance);
    vertex(-.95 * multiple, -.1 * curveDistance);
    vertex(-.8 * multiple, -.3 * curveDistance);
    vertex(-.7 * multiple, -.4 * curveDistance);
    vertex(-.9 * multiple, -.6 * curveDistance);
    vertex(-1.0 * multiple, -.6 * curveDistance);
    vertex(-1.05 * multiple, -.65 * curveDistance);
    vertex(-1.025 * multiple, -.8 * curveDistance);
    vertex(-.925 * multiple, -.725 * curveDistance);
    vertex(-.95 * multiple, -.875 * curveDistance);
    vertex(-.8 * multiple, -.85 * curveDistance);
    vertex(-.75 * multiple, -.8 * curveDistance);
    vertex(-.75 * multiple, -.7 * curveDistance);
    vertex(-.6 * multiple, -.45 * curveDistance);
    vertex(-.4 * multiple, -.5 * curveDistance);
    vertex(-.425 * multiple, -.7 * curveDistance);
    vertex(-.5 * multiple, -.725 * curveDistance);
    vertex(-.5 * multiple, -.825 * curveDistance);
    vertex(-.425 * multiple, -.875 * curveDistance);
    vertex(-.325 * multiple, -.825 * curveDistance);
    vertex(-.35 * multiple, -.725 * curveDistance);
    vertex(-.3 * multiple, -.525 * curveDistance);
    vertex(-.15 * multiple, -.55 * curveDistance);
    vertex(0 * multiple, -.575 * curveDistance);
}
