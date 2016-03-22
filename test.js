var width = 800;
var height = width;
var n = 10;
var margin = 100/n;
var boxSize = (width - (n+1)*margin)/n;

color white = color(255, 255, 255);
color grey  = color(100, 200, 200);
color black = color(  0,   0,   0);



void setup() {
	size(width+2,height+2);
}

void draw() {
	background(white);
	//fill(255,0,255);
	rectMode(CORNER);
	fill(white);
	rect(1,1,width,height);
	fill(grey);
	for (var i = 0; i<n; i++) {
		for (var j = 0; j<n; j++) {
			rect(1 + i * (boxSize + margin)+ margin,
				 1 + j * (boxSize + margin)+ margin,
				 boxSize, boxSize);
		}
	}
}