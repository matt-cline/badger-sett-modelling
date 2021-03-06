var width = 800;
var height = width;

var n = 10; //default value for number of rows/columns to be input
var nsq; 	//used often, equivalent to T, total number of setts
var margin; //space between setts
var boxSize;
var N;		//years
setts1 = new Array();
//note: all of the above are given values in 'initialise()'

var frameUpdate = 5;
var run = 0;		//determines whether to update or not
var mu = 0.05;	//culling rate default
var p = 0.75, lambda = 1, nu = 0.5;	//default values
var kappa = 0.1452, sigma = 0.1581;	//fixed values
var num = 0;		//random number check

var U = 0, P = 0, S = 0;//initial sett counters
var B = 0;	//will be used for total number of badgers
var URat = 1, PRat = 1, SRat = 1;

var maxYear = 200;
var cullUntil = 50;
var cullMode = 0;
settValues = new Array(maxYear+1);


color white = color(255, 255, 255);
color grey  = color(200, 200, 200);
color black = color(  0,   0,   0);

//resets all variables and sett conditions
var initialise = function() {
	run = 0, N = 0, frameCount = 0;
	nsq = n * n, margin = 100/n;
	boxSize = (width - (n+1)*margin)/n;
	for (var i = 0; i < nsq; i++) {
		setts1[i] = new Sett(i);
	}
	setts1 = randomSetts(setts1);
	for (var i=0; i<maxYear+1; i++) {
		settValues[i]=[0,0,0,0];
	}
	settValues[0]=[U,P,S,B];
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

//function to calculate niehgbours at each iteration.
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

//sets the state of each of the setts independently based on ratios defined above
var randomSetts = function(setts) {
	for (var i = 0; i < nsq; i++) {
		num = random(0,1);
		var ratio = URat + PRat + SRat;
		if(num < URat/ratio) {
			setts[i].state = 'u';
		} else if (num < (URat+PRat)/ratio) {
			setts[i].state = 'p';
		} else {
			setts[i].state = 's';
		}
	}
	return setts;
};

//useful for drawing text-sized arrow, inverted is +1 for '^' and -1 for 'v'
var drawArrow = function(arrowLoc,arrowHeight,inverted) {
	line(arrowLoc,arrowHeight,arrowLoc+7,arrowHeight-8*inverted);
	line(arrowLoc+1,arrowHeight,arrowLoc+8,arrowHeight-8*inverted);
	line(arrowLoc+14,arrowHeight,arrowLoc+7,arrowHeight-8*inverted);
	line(arrowLoc+15,arrowHeight,arrowLoc+8,arrowHeight-8*inverted);
};

/* 
 * A sett has an ID number from 1 to n^2, corresponding to the 
 * numbered setts in the n^2 square of setts. 'Sett' converts that
 * number into an i,j location.
 * Sett also initialises a state for this numbered sett, namely 'u'.
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

//generates n*n setts with location, random(ish) state and 0 neighbours.
initialise();




void mousePressed() {
	if (isInside(mouseX,mouseY,width+14,height/2+43,84,34)) {
		//stop/go click
		run++;
		run%=2;
		//run takes value 1 or 0
	} else if (isInside(mouseX,mouseY,width+14,height/2+83,84,34)) {
		//reset click
		run = 0;
		N = 0;
		frameCount = 0;
		setts1 = randomSetts(setts1);
	} else if (isInside(mouseX,mouseY,width+14, height/2 + 263, 84, 34)) {
		//change cull mode
		cullMode++;
		cullMode%=2;
	} else if (isInside(mouseX,mouseY,width+12,height/2-140,20,20)) {
		//n-- click
		n -= 5;
		if (n<2) {n=2;}
		initialise();
	} else if (isInside(mouseX,mouseY,width+34,height/2-140,20,20)) {
		//n- click
		n--;
		if (n<2) {n=2;}
		initialise();
	} else if (isInside(mouseX,mouseY,width+56,height/2-140,20,20)) {
		//n+ click
		n++;
		if (n>40) {n=40;}
		initialise();
	} else if (isInside(mouseX,mouseY,width+78,height/2-140,20,20)) {
		//n++ click
		n += 5;
		if (n>40) {n=40;}
		initialise();
	} else if (isInside(mouseX,mouseY,width+74,height/2-190,20,16)) {
		//mu+ click
		mu += 0.05;
		if (mu>1) {mu=1;}
	} else if (isInside(mouseX,mouseY,width+18,height/2-190,20,16)) {
		//mu- click
		mu -= 0.05;
		if (mu<0) {mu=0;}
	} else if (isInside(mouseX,mouseY,width+24,height/2-256,22,12)) {
		//p upper
		p += 0.05;
		if (p>1) {p=1;}
	} else if (isInside(mouseX,mouseY,width+24,height/2-234,22,12)) {
		//p lower
		p -= 0.05;
		if (p<0) {p=0;}
	} else if (isInside(mouseX,mouseY,width+68,height/2-256,22,12)) {
		//nu upper
		nu += 0.05;
		if (nu>1) {nu=1;}
	} else if (isInside(mouseX,mouseY,width+68,height/2-234,22,12)) {
		//nu lower
		nu -= 0.05;
		if (nu<0) {nu=0;}
	} else if (isInside(mouseX,mouseY,width+13, height/2-290,26,20)) {
		//low resolution
		width = 600;
		height = width;
		initialise();
	} else if (isInside(mouseX,mouseY,width+43, height/2-290,26,20)) {
		//medium resolution
		width = 700;
		height = width;
		initialise();
	} else if (isInside(mouseX,mouseY,width+73, height/2-290,26,20)) {
		//high resolution
		width = 800;
		height = width;
		initialise();
	} else if (isInside(mouseX,mouseY,width+14,height/2+123,26,15)) {
		//U ratio +1
		URat++;
	} else if (isInside(mouseX,mouseY,width+43,height/2+123,26,15)) {
		//P ratio +1
		PRat++;
	} else if (isInside(mouseX,mouseY,width+72,height/2+123,26,15)) {
		//S ratio +1
		SRat++;
	} else if (isInside(mouseX,mouseY,width+14,height/2+142,26,15)) {
		//U ratio -1
		URat--;
		if(URat<0){URat=0;}
	} else if (isInside(mouseX,mouseY,width+43,height/2+142,26,15)) {
		//U ratio -1
		PRat--;
		if(PRat<0){PRat=0;}
	} else if (isInside(mouseX,mouseY,width+72,height/2+142,26,15)) {
		//U ratio -1
		SRat--;
		if(SRat<0){SRat=0;}
			rect(width+60,height/2+240,30,10);
	rect(width+60,height/2+220,30,10);
	rect(width+60,height/2+200,30,10);
	rect(width+60,height/2+180,30,10);
	} else if (isInside(mouseX,mouseY,width+60,height/2+180,30,10)) {
		//maxYear +
		maxYear += 100;
		if(maxYear===150){maxYear=100};
	} else if (isInside(mouseX,mouseY,width+60,height/2+200,30,10)) {
		//maxYear +
		maxYear -= 100;
		if(maxYear<100){maxYear=50;}
	} else if (isInside(mouseX,mouseY,width+60,height/2+220,30,10)) {
		//cull year +
		if(cullUntil<10){
			cullUntil+=1;
		} else if (cullUntil <20){
			cullUntil+=2;
		} else if (cullUntil <50){
			cullUntil+=5;
		} else {
			cullUntil+=10;
		}
	} else if (isInside(mouseX,mouseY,width+60,height/2+240,30,10)) {
		//cull year -
		if(cullUntil<=0) {
			cullUntil = 0;
		} else if(cullUntil<=10){
			cullUntil-=1;
		} else if (cullUntil <=20){
			cullUntil-=2;
		} else if (cullUntil <=50){
			cullUntil-=5;
		} else {
			cullUntil-=10;
		}
	} else {
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
	}
};

void setup() {
	size(width+width+113,height+2);
};

void draw() {
	
	background(white);
	rectMode(CORNER);
	fill(white);
	stroke(black);
	rect(1,1,width,height); //outer canvas
	rect(width+112,1,width,height); //right canvas
		
	//graphing parameters
	var mG = 44;
	var ymG = 54;
	var axisPoints = round(width/80);
	var yInterval = (width-(2*mG))/axisPoints;
	var xInterval = (width-(2*ymG))/axisPoints;
	var nInterval = nsq/axisPoints;
	var tInterval = round(maxYear/axisPoints);
	var maxBadg = nsq*8.8;
	var bInterval = maxBadg/axisPoints;
	
	//Graph drawing code
	strokeWeight(3);
	fill(black);	
	textAlign(CENTER);
	line(width+110+ymG,mG,width+110+ymG,height-mG); //y axis
	line(width+110+ymG,height-mG,2*width+110-ymG,height-mG); //x axis
	strokeWeight(2);
	line(2*width+110-ymG,mG,2*width+110-ymG,height-mG); //right hand y-axis
	
	
	//Axes Labels
	for (var i=0; i<axisPoints; i++) {
		//y-axis
		line(width+109+ymG,mG+(i*yInterval),width+102+ymG,mG+(i*yInterval));
		text(round(nsq -(i*nInterval)),width+95+ymG,mG+2+(i*yInterval));
		//x-axis
		line(width+110+ymG+(i*xInterval),height-mG,width+110+ymG+(i*xInterval),height-mG+7);
		text(0+(i+1)*tInterval,width+115+ymG+((i+1)*xInterval),height-mG+20);
		//y2-axis
		line(2*width+110-ymG,mG+(i*yInterval),2*width+117-ymG,mG+(i*yInterval));
		text(round(maxBadg-(i*bInterval)),2*width+140-ymG,mG+(i*yInterval));
	}
	line(width+110+ymG,height-mG,width+102+ymG,height-mG);
	text(0,width+100+ymG,mG+2+(i*yInterval)); //y0
	line(2*width+110-ymG,height-mG,2*width+110-ymG,height-mG+7);
	text(0,width+115+ymG,mG+20+(i*yInterval)); //x0
	line(2*width+110-ymG,mG+(i*yInterval),2*width+117-ymG,mG+(i*yInterval))
	text(0,2*width+140-ymG,height-mG); //y0 right
	
	textSize(16);
	text("Time - Years",width*1.5+110,height-10);
	
	pushMatrix();
	translate(width+127,height/2-30);
	rotate(3*(3.14159265/2));
	fill(255,255,255,200);
	rectMode(CENTER);
	noStroke();
	rect(0,-4,90,20);
	rect(0,width-26,210,20);
	fill(black);
	text("No. of Setts",0,0);
	rotate(3.14159265);
	text("Estimated Badger Population",0,-width+30);
	popMatrix();
	
	rectMode(CORNER);
	stroke(black);
	strokeWeight(1);	

	line(width+110+ymG,height-mG-((height-2*mG)*0.3),2*width+110-ymG,height-mG-((height-2*mG)*0.3));//30% level
	if (cullMode === 1) {
		stroke(255,0,255);
		line(width+110+ymG+(cullUntil/maxYear)*(width-(2*ymG)),mG,width+110+ymG+(cullUntil/maxYear)*(width-(2*ymG)),height-mG); //cullUntil point
	}
	stroke(white);
	for(var i=0; i<40;i++){
		line(width+112+ymG+i*20,height-mG-((height-2*mG)*0.3),width+115+ymG+i*20,height-mG-((height-2*mG)*0.3));
	}

	//code for control boxes & buttons
	
	fill(white);
	stroke(black);
	rect(width+11, height/2 - 110, 90, 140); //info box

	rect(width+11, height/2 + 40, 90, 130); //lower button box
	
	rect(width+11, height/2 + 180, 90, 70); //lower Time Control Box
	
	rect(width+11, height/2 + 260, 90, 40); //lower cull Mode Box
	
	rect(width+11, height/2 - 160, 90, 40); //upper n box
	
	rect(width+11, height/2 - 210, 90, 40); //upper mu box
	
	rect(width+11, height/2 - 260, 90, 40); //upper p & nu box
	
	//rect(width+11, height/2 - 299, 90, 30); //resolution Control box
	
	//resolution control buttons
	/*
	rect(width+13, height/2 - 290, 26, 20);
	rect(width+43, height/2 - 290, 26, 20);
	rect(width+73, height/2 - 290, 26, 20);
	*/
	
	//n control buttons
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
	
	//boxes for time buttons
	/*
	rect(width+60,height/2+240,30,10);
	rect(width+60,height/2+220,30,10);
	rect(width+60,height/2+200,30,10);
	rect(width+60,height/2+180,30,10);
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
	text("B = " + round(B), width+13, height/2 - 5);
	
	//resolution control text
	text("L",width+19,height/2-273);
	text("M",width+49,height/2-273);
	text("H",width+79,height/2-273);
	text("Resolution",width+12,height/2-288);
	
	strokeWeight(3);
	//key for graph
	stroke(255,0,0);
	line(width+70,height/2-55,width+95,height/2-55);
	stroke(0,255,0);
	line(width+70,height/2-40,width+95,height/2-40);
	stroke(0,0,255);
	line(width+70,height/2-25,width+95,height/2-25);
	stroke(black);
	strokeWeight(2);
	line(width+70,height/2-10,width+95,height/2-10);
	strokeWeight(1);
	//arrows for paramter control
	drawArrow(width+28,height/2-246,1);
	drawArrow(width+72,height/2-246,1);
	drawArrow(width+28,height/2-231,-1);
	drawArrow(width+72,height/2-231,-1);

	//these are capture boxes for the arrows above	
	/*
	rect(width+24,height/2-256,22,12);
	rect(width+68,height/2-256,22,12);
	rect(width+24,height/2-234,22,12);
	rect(width+68,height/2-234,22,12);
	*/
	
	if(N<maxYear+1) {
		settValues[N]=[U,P,S,B];
	}
	
	text("n is " + n, width + 13, height/2 - 145);
	text(round(mu*100) + "%", width + 43, height/2 - 177);
	textSize(13);
	text("Culling Level, \u03BC", width + 13, height/2 - 195); //character for mu
	textSize(12);
	text("p=" + round(p*100)/100, width+15, height/2-234);
	text("\u03BD=" + round(nu*100)/100, width+62, height/2-234);
	
	text("Initial U:P:S", width+14, height/2+168);
	text(URat, width+24, height/2+145);
	text(PRat, width+51, height/2+145);
	text(SRat, width+81, height/2+145);
	
	text("Max", width+17, height/2+193);
	text("Year:", width+17, height/2+207);
	text(maxYear, width+65, height/2+200);
	text("Cull", width+17, height/2+233);
	text("Point:", width+17, height/2+247);
	if(cullMode == 1){
		text(cullUntil, width+65, height/2+240);
	} else {
		text("n/a", width+65, height/2+240);
	}

	
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
	/*
	rect(width+14, height/2 + 123, 26, 15); //Initial Ratio Buttons
	rect(width+43, height/2 + 123, 26, 15); //Initial Ratio Buttons
	rect(width+72, height/2 + 123, 26, 15); //Initial Ratio Buttons
	rect(width+14, height/2 + 142, 26, 15); //Initial Ratio Buttons
	rect(width+43, height/2 + 142, 26, 15); //Initial Ratio Buttons
	rect(width+72, height/2 + 142, 26, 15); //Initial Ratio Buttons
	*/
	//arrows for Ratio Buttons
	drawArrow(width+20,height/2+133,1);
	drawArrow(width+49,height/2+133,1);
	drawArrow(width+78,height/2+133,1);
	drawArrow(width+20,height/2+149,-1);
	drawArrow(width+49,height/2+149,-1);
	drawArrow(width+78,height/2+149,-1);
	
	//arrows for time buttons
	drawArrow(width+68,height/2+190,1);
	drawArrow(width+68,height/2+202,-1);
	drawArrow(width+68,height/2+230,1);
	drawArrow(width+68,height/2+242,-1);
	
	if(run === 1){
		fill(black);
	} else {
		fill(grey);
	}
	rect(width+14, height/2 + 43, 84, 34); //stop/go button
	
	if(cullMode === 1){
		fill(black);
	} else {
		fill(grey);
	}
	rect(width+14, height/2 + 263, 84, 34); //cullMode button
	
	fill(white);
	textSize(17);
	text("STOP/GO", width + 18, height/2 + 67);
	text("RESET"  , width + 29, height/2 + 107);
	text("MODE"   , width + 31, height/2 + 287);
	
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
	
	B = S*8.8 + P*4.4;
	//if we are running the simulation, this is where the maths is
	if (run === 1 && (frameCount % frameUpdate) === 0) {
		N++;
		for (var i = 0; i < nsq; i++) {
			var num = random(0,1);
			if (N <= cullUntil || cullMode === 0) {
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
				if (setts1[i].state === 's' || setts1[i].state === 'p') {
					if(random(0,1) < mu/2 ) {
						setts1[i].state = 'u';
					}
				}
			} else {
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
		
	}
	//draw final
	for (var i = 0; i < nsq; i++) {
        setts1[i].drawSett();
    }
	
	//graph drawing plots
	for(var j=0;j<4;j++) {
		noFill();
		if(j==0){stroke(255,0,0);}
		else if(j==1){stroke(0,255,0);}
		else if(j==2){stroke(0,0,255);}
		else {stroke(0,0,0);}
		if(N<maxYear+1){
			for(var i=0;i<=N;i+=1){
				var tempX = width+110+ymG+i*((width-(2*ymG))/maxYear);
				if(j!==3){
					var tempY = width-mG-settValues[i][j]*(((width-(2*mG))/nsq));
					ellipse(tempX,tempY,3,3);
				} else {
					var tempY = width-mG-settValues[i][j]*(((width-(2*mG))/maxBadg));
					ellipse(tempX,tempY,1.5,1.5);
				}
				if (i>0) {
					line(tempX,tempY,oldX,oldY);
				}
				var oldX = tempX, oldY = tempY;
			}
		} else {
			for(var i= 0;i<maxYear+1;i+=1) {
				var tempX = width+110+ymG+i*((width-(2*ymG))/maxYear);
				if(j!==3){
					var tempY = width-mG-settValues[i][j]*(((width-(2*mG))/nsq));
					ellipse(tempX,tempY,3,3);
				} else {
					var tempY = width-mG-settValues[i][j]*(((width-(2*mG))/maxBadg));
					ellipse(tempX,tempY,1.5,1.5);
				}
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

