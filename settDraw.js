var width = 800;
var height = width;

var n = 10; //default value for number of rows/columns to be input
var nsq; 	//used often, equivalent to T, total number of setts
var margin; //space between setts
var boxSize;
var N;		//years
var mu = 0.05;
setts1 = new Array();
//note: all of the above are given values in 'initialise()'

var run = 0;		//determines whether to update or not
var p = 0.25, lambda = 0.25, nu = 0.5;	//default values
var kappa = 0.1452, sigma = 0.1581;	//fixed values
var num = 0;		//random number check
var U = 0, P = 0, S = 0;//initial sett counters
var URat = 1, PRat = 1, SRat = 1;


var maxYear = 200;
settValues = new Array(maxYear+1);


color white = color(255, 255, 255);
color grey  = color(200, 200, 200);
color black = color(  0,   0,   0);

var initialise = function() {
	run = 0, N = 0, frameCount = 0;
	nsq = n * n, margin = 100/n;
	boxSize = (width - (n+1)*margin)/n;
	for (var i = 0; i < nsq; i++) {
		setts1[i] = new Sett(i);
	}
	setts1 = randomSetts(setts1);
	for (var i=0; i<maxYear+1; i++) {
		settValues[i]=[0,0,0];
	}
	settValues[0]=[U,P,S];
};

//when given the ID number, determines the row value
var indexI = function(settID) {
	var temp = settID % n;
	if (temp === 0) {temp = n;}
	return temp;
};

//function to check if mouse is inside given rectangular parameters
var isInside = function(x, y, startX, startY, widthX, heightY) {
	return x >= startX && x <= startX + widthX &&
		   y >= startY && y <= startY + heightY;
}

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
		var ratio = URat + PRat + SRat;
		if(num < URat/ratio) {
			setts[i].state = 'u';
		} else if (num < (URat+Prat)/ratio) {
			setts[i].state = 'p';
		} else {
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

//generates n*n setts with location, random state and 0 neighbours.
initialise();


void setup() {
	size(width+width+113,height+2);
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
	if (isInside(mouseX,mouseY,width+14, height/2 + 43, 84, 34)) {
		//stop/go click
		run++;
		run %= 2;
		//run takes value 1 or 0
	} 
	if (isInside(mouseX,mouseY,width+14, height/2 + 83, 84, 34)) {
		//reset click
		run = 0;
		N = 0;
		frameCount = 0;
		setts1 = randomSetts(setts1);
	}
	if (isInside(mouseX,mouseY,width+14, height/2 + 123, 84, 34)) {
		//blank click
		run = 0;
		N = 0;
		frameCount = 0;
		for (var i = 0; i < nsq; i++) {
			setts1[i].state = 'u';
		}
	}
	if (isInside(mouseX,mouseY,width+12, height/2 - 140, 20, 20)) {
		//n-- click
		n -= 5;
		if (n<2) {n=2;}
		initialise();
	}
	if (isInside(mouseX,mouseY,width+34, height/2 - 140, 20, 20)) {
		//n- click
		n--;
		if (n<2) {n=2;}
		initialise();
	}
	if (isInside(mouseX,mouseY,width+56, height/2 - 140, 20, 20)) {
		//n+ click
		n++;
		if (n>40) {n=40;}
		initialise();
	}
	if (isInside(mouseX,mouseY,width+78, height/2 - 140, 20, 20)) {
		//n++ click
		n += 5;
		if (n>40) {n=40;}
		initialise();
	}
	if (isInside(mouseX,mouseY,width+74,height/2-190,20,16)) {
		//mu+ click
		mu += 0.1;
		if (mu>1) {mu=1;}
	}
	if (isInside(mouseX,mouseY,width+18,height/2-190,20,16)) {
		//mu- click
		mu -= 0.1;
		if (mu<0) {mu=0;}
	}
};



void draw() {
	
	background(white);
	rectMode(CORNER);
	fill(white);
	stroke(black);
	rect(1,1,width,height); //outer canvas
	rect(width+112,1,width,height); //right canvas
	
	//Graph drawing code
	strokeWeight(3);
	fill(black);	
	textAlign(CENTER);
	//graphing parameters
	var mG = 44;
	var axisPoints = round(width/80);
	var interval = (width-(2*mG))/axisPoints;
	var nInterval = nsq/axisPoints;
	var xInterval = round(maxYear/axisPoints);
	
	line(width+110+mG,mG,width+110+mG,height-mG); //y axis
	line(width+110+mG,height-mG,2*width+110-mG,height-mG); //x axis
	strokeWeight(2);
	//Axes Labels
	for (var i=0; i<axisPoints; i++) {
		line(width+109+mG,mG+(i*interval),width+102+mG,mG+(i*interval));
		text(round(nsq -(i*nInterval)),width+95+mG,mG+2+(i*interval));
		line(width+110+mG+(i*interval),height-mG,width+110+mG+(i*interval),height-mG+7);
		text(0+(i+1)*xInterval,width+115+mG+((i+1)*interval),height-mG+20);
	}
	line(width+110+mG,height-mG,width+102+mG,height-mG);
	text(0,width+100+mG,mG+2+(i*interval));
	line(2*width+110-mG,height-mG,2*width+110-mG,height-mG+7);
	text(0,width+115+mG,mG+20+(i*interval));
	
	textSize(16);
	text("Time - Years",width*1.5+110,height-10);
	
	pushMatrix();
	translate(width+127,height/2-30);
	rotate(3*(3.14159265/2));
	fill(255,255,255,200);
	rectMode(CENTER);
	noStroke();
	rect(0,-4,90,20);
	fill(black);
	text("No. of Setts",0,0);
	popMatrix();
	
	//correcting changes
	rectMode(CORNER);
	stroke(black);
	strokeWeight(1);	
	
	fill(white);
	rect(width+11, height/2 - 110, 90, 140); //info box

	rect(width+11, height/2 + 40, 90, 120); //lower button box
	
	rect(width+11, height/2 - 160, 90, 40); //upper n box
	
	rect(width+11, height/2 - 210, 90, 40); //upper mu box
	
	//upper control buttons
	/*
	rect(width+12, height/2 - 140, 20, 20);
	rect(width+34, height/2 - 140, 20, 20);
	rect(width+56, height/2 - 140, 20, 20);
	rect(width+78, height/2 - 140, 20, 20);
	*/
	
	//boxes for mu buttons
	/*
	rect(width+18,height/2-190,20,16);
	rect(width+74,height/2-190,20,16);
	*/
	
	//info box inner
	fill(black);
	textSize(14);
	textAlign(LEFT);
	text(frameCount, width+13, height/2 - 95);
	text(N + " years", width+13, height/2 - 80);
	text("T = " + nsq, width+13, height/2 - 65);
	text("U = " + U, width+13, height/2 - 50);
	text("P = " + P, width+13, height/2 - 35);
	text("S = " + S, width+13, height/2 - 20);
	
	strokeWeight(3);
	stroke(255,0,0);
	line(width+60,height/2-55,width+85,height/2-55);
	stroke(0,255,0);
	line(width+60,height/2-40,width+85,height/2-40);
	stroke(0,0,255);
	line(width+60,height/2-25,width+85,height/2-25);
	stroke(black);
	strokeWeight(1);
	
	if(N<maxYear+1) {
		settValues[N]=[U,P,S];
	}
	
	text("n is " + n, width + 13, height/2 - 145);
	text("Culling Level", width + 13, height/2 - 195);
	text(round(mu*100) + "%", width + 43, height/2 - 177);
	
	textSize(25);
	text("--", width+14, height/2 - 123);
	text("-", width+40, height/2 - 123);
	text("-", width+24, height/2 - 175);	//mu
	textSize(20);
	text("+", width+61, height/2 - 123);
	text("+", width+78, height/2 - 123);
	text("+", width+88, height/2 - 123);
	text("+", width+78, height/2 - 175);	//mu
	
	
	
	//lower button box inner	
	fill(grey);
	rect(width+14, height/2 + 83, 84, 34); //reset button
	rect(width+14, height/2 + 123, 84, 34); //blank button
	if(run === 1){
		fill(black);
	} else {
		fill(grey);
	}
	rect(width+14, height/2 + 43, 84, 34); //stop/go button
	
	fill(white);
	textSize(17);
	text("STOP/GO", width + 18, height/2 + 67);
	text("RESET", width + 29, height/2 + 107);
	text("BLANK", width + 29, height/2 + 147);
	
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
			} else if (setts1[i].state === 's') {
				if(num < mu) {
					setts1[i].state = 'u';
				}
			}
		}
		
	}
	//draw final
	for (var i = 0; i < nsq; i++) {
        setts1[i].drawSett();
    }
	
	//graph drawing plots
	for(var j=0;j<3;j++) {
		noFill();
		if(j==0){stroke(255,0,0);}
		else if(j==1){stroke(0,255,0);}
		else {stroke(0,0,255);}
		if(N<maxYear+1){
			for(var i=0;i<=N;i+=1){
				
				var tempX = width+110+mG+i*((width-(2*mG))/maxYear);
				var tempY = width-mG-settValues[i][j]*(((width-(2*mG))/nsq));
				ellipse(tempX,tempY,3,3);
				if (i>0) {
					line(tempX,tempY,oldX,oldY);
				}
				var oldX = tempX, oldY = tempY;
			}
		} else {
			for(var i= 0;i<maxYear+1;i+=1) {
				var tempX = width+110+mG+i*((width-(2*mG))/maxYear);
				var tempY = width-mG-settValues[i][j]*(((width-(2*mG))/nsq));
				ellipse(tempX,tempY,3,3);
				if (i>0) {
					line(tempX,tempY,oldX,oldY);
				}
				var oldX = tempX, oldY = tempY;
			}
		}
	}
	/*
	fill(255, 0, 0);
	textSize(30);
	text("+",mouseX-8,mouseY+10);
	*/
	//The above was a plus sign used in testing where the mouse was.
};

