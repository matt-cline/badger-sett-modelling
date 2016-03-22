var width = 800;
var height = width;
var n = 10; 	 	//default value for number of rows/columns
var nsq = n * n; 	//used often, equivalent to T, total number of setts
var margin = 100/n;	//space between setts
var boxSize = (width - (n+1)*margin)/n;
var run = 0;		//determines whether to update or not
var p = 0.25, lambda = 0.25, nu = 0.5;	//default values
var kappa = 0.1452, sigma = 0.1581;	//fixed values
var num = 0;		//random number check
var N; 			//years 
var U = 0, P = 0, S = 0;//initial sett counters

color white = color(255, 255, 255);
color grey  = color(200, 200, 200);
color black = color(  0,   0,   0);

//when given the ID number, determines the row value
var indexI = function(settID) {
	var temp = settID % n;
	if (temp === 0) {temp = n;}
	return temp;
};

//checks if over STOP/GO button
var isInsideButton1 = function(x, y) {
	return x >= width + 14 && x <= width + 98 &&
	       y >= height/2 + 43 && y <= height/2 + 77;
};

var isInsideButton2 = function(x,y) {
	return x >= width + 14 && x <= width + 98 &&
	       y >= height/2 + 83 && y <= height/2 + 117;
};

var updateNeighs = function(setts, i) {
    var tempSetts = setts;
	if (setts[i].state === 's') {
		if (setts[i].xloc !== n ) {tempSetts[i+1].neigh += 1;}
		if (setts[i].xloc !== 1 ) {tempSetts[i-1].neigh += 1;}
		if (setts[i].yloc !== n ) {tempSetts[i+n].neigh += 1;}
		if (setts[i].yloc !== 1 ) {tempSetts[i-n].neigh += 1;}
	}
	return tempSetts;
};

var randomSetts = function(setts) {
	for (var i = 0; i < nsq; i++) {
		num = random(0,1);
		if(num < 0.25) {
			setts[i].state = 'p';
		} else if (num < 0.5) {
			setts[i].state = 's';
		}
	}
	return setts;
};

/* A sett has an ID number from 1 to n^2, corresponding to the 
 * numbered setts in the n^2 square of setts. 'Sett' converts that
 * number into an i,j location.
 * Sett also initialises a state for this numbered sett.
 */
var Sett = function(settID) {
	this.xloc = indexI(settID+1);
	this.yloc = (((settID+1) - this.xloc) / n) + 1;
	this.state = 'u';
	this.neigh = 0;
};

Sett.prototype.drawSett = function() {
	if (this.state === 's') {
		fill(black);
	} else if (this.state === 'p') {
		fill(grey);
	} else {
		fill(white);
	}
	rect(this.xloc * margin + (this.xloc - 1) * boxSize,
		 this.yloc * margin + (this.yloc - 1) * boxSize,
		 boxSize, boxSize);
};

Sett.prototype.inputState = function() {
	if (this.state === 'u') {this.state = 'p';}
	if (this.state === 'p') {this.state = 's';}
	if (this.state === 's') {this.state = 'u';}
};

Sett.prototype.checkBox = function(x, y) {
	var xbox = this.xloc * margin + (this.xloc - 1) * boxSize;
	var ybox = this.yloc * margin + (this.yloc - 1) * boxSize;
	return x >= xbox && x <= xbox + boxSize &&
		   y >= ybox && y <= ybox + boxSize;
};

//generates n*n setts with location, 'u' state and 0 neighbours.
setts1 = new Array(nsq);
for (var i = 0; i < nsq; i++) {
    setts1[i] = new Sett(i);
}
setts1 = randomSetts(setts1);

void setup() {
	size(width+102,height+2);
};

void mousePressed() {
	for (var i = 0; i < nsq; i++) {
		if (setts1[i].checkBox(mouseX,mouseY)) {
			if (setts1[i].state === 'u') {
				setts1[i].state = 'p';
			} else if (setts1[i].state === 'p') {
				setts1[i].state = 's';
			} else {
				setts1[i].state = 'u';
			}
		}
	};
	if (isInsideButton1(mouseX,mouseY)) {
		run++;
		run %= 2;
		//run takes value 1 or 0
	} 
	if (isInsideButton2(mouseX,mouseY)) {
		run = 0;
		N = 0;
		frameCount = 0;
		setts1 = randomSetts(setts1);
	}
};

void draw() {
	background(white);
	rectMode(CORNER);
	fill(white);
	rect(1,1,width,height);
	rect(width+11, height/2 - 110, 90, 140); //info box
	rect(width+11, height/2 + 40, 90, 80); //button box
	fill(black);
	textSize(11);
	text(frameCount, width+12, height/2 - 100);
	text(N + " years", width+12, height/2 - 90);
	text("T = " + nsq, width+12, height/2 - 80);
	text("U = " + U, width+12, height/2 - 70);
	text("P = " + P, width+12, height/2 - 60);
	text("S = " + S, width+12, height/2 - 50);
	fill(grey);
	rect(width+14, height/2 + 83, 84, 34); //reset button
	if(run === 1){
		fill(black);
	} else {
		fill(grey);
	}
	rect(width+14, height/2 + 43, 84, 34); //stop/go button
	fill(white);
	textSize(17);
	text("STOP/GO", width + 17, height/2 + 67);
	text("RESET", width + 18, height/2 + 107);
	//reset neighbours
	for (var i = 0; i < nsq; i++) {
        setts1[i].neigh = 0;
		U = 0, P = 0, S = 0;
    	}
	//update neighbours based on saturated
    	for (var i = 0; i < nsq; i++) {
        	setts1 = updateNeighs(setts1, i);
		if (setts1[i].state === 'u') {
			U++;
		} else if(setts1[i].state === 'p') {
			P++;
		} else {
			S++;
		}
    	}
	//if we are running the simulation, this is where the maths is
	if (run === 1 && (frameCount % 10) === 0) {
		N++;
		for (var i = 0; i < nsq; i++) {
			var num = random(0,1);
			if (setts1[i].state === 'u') {
				var prob = p * nu * 0.25 * setts1[i].neigh;
				if(num < prob) {
					setts1[i].state = 'p';
				}
			} else if (setts1[i].state === 'p') {
				var prob = lambda * p * nu * 0.25 * sigma * (1 - kappa) * setts1[i].neigh + kappa;
				if(num < prob) {
					setts1[i].state = 's';
				}
			}
		}
	}
	//draw final
	for (var i = 0; i < nsq; i++) {
        	setts1[i].drawSett();
    	}
	fill(255, 0, 0);
	textSize(30);
	text("+",mouseX-8,mouseY+10);
};

