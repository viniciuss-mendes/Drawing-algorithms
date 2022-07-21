/* click the canvas */

var element,
  canvas,
  width,
  height,
  boolBresenhamLin = false,
  boolDDA = false,
  boolBresenhamCirc = false,
	boolCohen_Sutherland = false,
	boolLiang_Barsky  = false,
  boolBlockAction = true,
	boolDDAG = false,
	boolBresG = false,
	boolCircG = false,
  cont = 0,
	min_x,
	min_y,
	max_x,
	max_y,
  a0,
  a1,
  b0,
  b1,
	cont1 = 0,
	aux;

black = {
  r: 0,
  g: 0,
  b: 0,
  a: 255
};

white = {
	r: 255,
	g: 255,
	b: 255,
	a: 255
};

color = {
	r: 85,
	g: 200,
	b: 25,
	a: 75
};

// init canvas
element = $('#canvas').get(0);
canvas = element.getContext('2d');
width = element.width;
height = element.height;
canvas.fillStyle = '#eeeeee';
canvas.fillRect(0, 0, width, height);

// setpixel
var setPixel = function(x, y, c) {
  var p = canvas.createImageData(1, 1);
  p.data[0] = c.r;
  p.data[1] = c.g;
  p.data[2] = c.b;
  p.data[3] = c.a;
  canvas.putImageData(p, x, y);
}

var setPixelReset = function(x, y, c) {
  var p = canvas.createImageData(1, 1);
  p.data[0] = c.r;
  p.data[1] = c.g;
  p.data[2] = c.b;
  p.data[3] = c.a;
  canvas.putImageData(p, x, y);
}

//***************************** SEÇÃO DE FUNÇÕES QUE ATRIBUEM AÇÃO AOS BOTÕES DOS ALGORITMOS DE DESENHO***********************************
// Ação do botão do Algoritmo DDA
function acionarDDA() {
  boolBresenhamCirc = false;
  boolBresenhamLin = false;
  boolBlockAction = false;
	boolCohen_Sutherland = false;
	boolLiang_Barsky  = false;
  boolDDA = true;
}
const buttonDDA = document.getElementById("btn0");
buttonDDA.addEventListener("click", acionarDDA);

// Ação do botão do Algoritmo de Bresenham - linear
function acionarBresenhamLinear() {
  boolBresenhamCirc = false;
  boolBresenhamLin = true;
  boolBlockAction = false;
	boolCohen_Sutherland = false;
	boolLiang_Barsky  = false;
  boolDDA = false;
}
const buttonBresenhamL = document.getElementById("btn1");
buttonBresenhamL.addEventListener("click", acionarBresenhamLinear);

// Ação do botão do Algoritmo de Bresenham - círculo
function acionarBresenhamCirc() {
	boolBresenhamCirc = true;
  boolBresenhamLin = false;
  boolBlockAction = false;
	boolCohen_Sutherland = false;
	boolLiang_Barsky  = false;
  boolDDA = false;
}
const buttonBresenhamCirc = document.getElementById("btn2");
buttonBresenhamCirc.addEventListener("click", acionarBresenhamCirc);

// Ação do botão do Algoritmo de Cohen_Sutherland - recorte
function acionarCohenSutherland() {
	boolCohen_Sutherland = true;
	boolLiang_Barsky  = false;
}
const buttonCohenSutherland = document.getElementById("btn3");
buttonCohenSutherland.addEventListener("click", acionarCohenSutherland);

// Ação do botão do Algoritmo de Liang Barsky - recorte
function acionarLiangBarsky() {
	boolCohen_Sutherland = false;
	boolLiang_Barsky  = true;
}
const buttonLiangBarsky = document.getElementById("btn4");
buttonLiangBarsky.addEventListener("click", acionarLiangBarsky);

//Ação do botão de limpar a tabela
function clearTable() {
	rot.style.display = "none";
	sca.style.display = "none";
	transl.style.display = "none";
  boolBlockAction = true;
  cont = 0;
	cont1 = 0;
  canvas.fillStyle = '#eeeeee';
  canvas.fillRect(0, 0, width, height);
}
const buttonClear = document.getElementById("clear");
buttonClear.addEventListener("click", clearTable);
//***************************************************FIM**********************************************************

//***************************** SEÇÃO DE FUNÇÕES QUE ATRIBUEM AÇÃO AOS BOTÕES DE TRANSFORMAÇÕES GEOMÉTRICAS***********************************
var transl = document.getElementById("translation");
var rot = document.getElementById("rotation");
var sca = document.getElementById("scale");

//Mostra os inputs na tela
function showInputT(){
  if (transl.style.display === "block") {
    transl.style.display = "none";
  } else {
		rot.style.display = "none";
		sca.style.display = "none";
    transl.style.display = "block";
  }
}
//Ação do botão de traslação 
var doTranslation = function(){
		var t1X = parseInt($('#x').val());
		var t1Y = parseInt($('#y').val());
		t1Y *= -1;
		translation(a0, a1, b0, b1, t1X, t1Y);
}

//Mostra os inputs na tela
function showInputR(){
  if (rot.style.display === "block") {
    rot.style.display = "none";
  } else {
		transl.style.display = "none";
		sca.style.display = "none";
    rot.style.display = "block";
  }
}

//Ação do botão de rotação
var doRotation = function(){
	var rot = parseInt($('#grau').val());
	rotation(a0, a1, b0, b1, rot);
}

//Mostra os inputs na tela
function showInputS(){
  if (sca.style.display === "block") {
    sca.style.display = "none";
  } else {
		rot.style.display = "none";
		transl.style.display = "none";
    sca.style.display = "block";
  }
}

//Ação do botão de escala
var doScale = function(){
	var sc = $('#sca').val();
	var sc1 = $('#sca1').val();
		
	scale(a0, a1, b0, b1, sc, sc1);
}
//***************************************************FIM**********************************************************
//**********************************SEÇÃO DE IMPLEMENTAÇÃO DOS ALGORITMOS DE DESENHO*******************
//BRESENHAM´S ALGORITHM - LINE
var bresenham = function line(x0, y0, x1, y1) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = (x0 < x1) ? 1 : -1;
  var sy = (y0 < y1) ? 1 : -1;
  var err = dx - dy;

  while (true) {
    setPixel(x0, y0, black); 

    if ((x0 === x1) && (y0 === y1)) break;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

//DDA´S ALGORITHM - LINE
function dda(pxi, pyi, pxf, pyf) {
  dx = pxf - pxi;
  dy = pyf - pyi;

  if (Math.abs(dx) >= Math.abs(dy)) {
    passos = Math.abs(dx);
  } else {
    passos = Math.abs(dy);
  }
  incrementoemx = dx / passos;
  incrementoemy = dy / passos;
  m = dy / dx
  x = a0;
  y = a1;
  for (i = 0; i <= passos; i++) {
    x += incrementoemx;
    y += incrementoemy;
    setPixel(Math.round(x), Math.round(y), black);
  }
}

//BRESENHAM´S ALGORITHM - CIRCLE
function plotaSimetricos(x, y, xc,yc){
		setPixel(xc+x, yc+y, black);
		setPixel(xc-x, yc+y, black);
		setPixel(xc+x, yc-y, black);
		setPixel(xc-x, yc-y, black);
		setPixel(xc+y, yc+x, black);
		setPixel(xc-y, yc+x, black);
		setPixel(xc+y, yc-x, black);
		setPixel(xc-y, yc-x, black);
}

function bresenhamCircle(x0, y0, x1, y1){
		
		var x = 0,
				r = Math.sqrt(((x1-x0)*(x1-x0)) + ((y1-y0)*(y1-y0))),
				y = r,
				p = 3-2*r;
		plotaSimetricos(x, y, x0, y0);
		while(y>=x){
				x++;
				if(p > 0){
					y--;
					p=p+4*(x-y)+10;
				}else{
					p=p+4*x+10;
				}
				plotaSimetricos(x, y , x0, y0);
		}
		
	 setPixelReset(x0, y0, white);
}
//************************************************FIM**********************************************************
//função que redesenha as figuras
var redrawing = function(){

		if(aux == 0){
			clearTable();
			dda(a0, a1, b0, b1);
		}else if(aux == 1){
				clearTable();
				bresenham(a0, a1, b0, b1);
		}else if(aux == 2){
			clearTable();
			bresenhamCircle(a0, a1, b0, b1);
		}else{
			alert("You must draw some figure on 'Drawing Algorithms section'!");
		}
}
//*************************SEÇÃO DE IMPLEMENTAÇÃO DE ALGORITMOS DE TRANSFORMAÇÕES GEOMÉTRICAS*******************
//TRANSLATION ALGORITHM
var translation = function (x1, y1, x2, y2,tx, ty){
	a0 = tx+x1;
	a1 = ty+y1;
	b0 = tx+x2;
	b1 = ty+y2;	
	
	redrawing();
}
//ROTATION ALGORITHM
var rotation = function (x0, y0, x1, y1, rot){
	var dfx = x1 - x0;
	var dfy = y1 - y0;
	
	var ang = (rot * Math.PI) / 180; 
	let xAngF = dfx*Math.cos(ang) - dfy*Math.sin(ang); 
	let yAngF = dfx*Math.sin(ang) + dfy*Math.cos(ang); 
	
	b0 = x0 + Math.round(xAngF);
	b1 = y0 + Math.round(yAngF);
	
	redrawing();
}
//SCALE ALGORITHM
var scale = function (x1, y1, x2, y2, sc1, sc2){
	var dfx = x2 - x1;
	var dfy = y2 - y1;
	
	if(sc1 < sc2){
		b1 = Math.round(y1 + (dfy*sc2));
	}else{
		b0 = Math.round(x1 + (dfx*sc1));
	}
		
	redrawing();
	
}

//REFLECTION ALGORITHM - X
var reflectionX = function (){
	if(b1 < 200){
		var dfy = b1 - 200; 
		var dfy1 = a1 - 200;

		if(dfy < 0){
			dfy *= -2;
			dfy1 *= -2;
		}

		a1 = dfy1 + a1;
		b1 = dfy + b1;
	}else{
		var dfy = b1 - 200; 
		var dfy1 = a1 - 200;
		dfy *= -2;
		dfy1 *= -2;

		a1 = a1 + dfy1;
		b1 = b1 + dfy;
	}
	
	redrawing();
}
const buttonRefX = document.getElementById("bt4");
buttonRefX.addEventListener("click", reflectionX);

//REFLECTION ALGORITHM - Y
var reflectionY = function (){
	var dfy = b0 - 200; 
	var dfy1 = a0 - 200;

	dfy *= -2;
	dfy1 *= -2;

	a0 = dfy1 + a0;
	b0 = dfy + b0;
	
	redrawing();
	
}
const buttonRefY = document.getElementById("bt5");
buttonRefY.addEventListener("click", reflectionY);

//REFLECTION ALGORITHM - XY
var reflectionXY = function (x1, y1, x2, y2){
	
	reflectionX();
	reflectionY();
	
	redrawing();
}
const buttonRefXY = document.getElementById("bt6");
buttonRefXY.addEventListener("click", reflectionXY);
//************************************************FIM**********************************************************
//*************************SEÇÃO DE IMPLEMENTAÇÃO DE ALGORITMOS DE RECORTE*******************
//COHEN_SUTHERLAND ALGORITHM
var cohenSutherland = function(){
		var valid= false,
				made = false;

    while (!made) {
      var c1 = this.region(min_x, min_y, max_x, max_y, a0, a1);
      var c2 = this.region(min_x, min_y, max_x, max_y, b0, b1);

      if (c1 == 0 && c2 == 0) {
        valid = true;
        made = true;

      } else if ((c1 & c2) != 0) {
        made = true;

      } else {

        var out, x, y;

        if (c1 != 0) out = c1;
        else out = c2;

        if (out & 8) {
          // ponto está em cima da janela
          x = a0 + ((b0 - a0) * (max_y - a1)) / (b1 - a1);
          y = max_y;
        } else if (out & 4) {
          // ponto está abaixo da janela
          x = a0 + ((b0 - a0) * (min_y - a1)) / (b1 - a1);
          y = min_y;
        } else if (out & 2) {
          // ponto está a direita da janela
          y = a1 + ((b1 - a1) * (max_x - a0)) / (b0 - a0);
          x = max_x;
        } else if (out & 1) {
          // ponto está a esquerda da janela
          y = a1 + ((b1 - a1) * (min_x - a0)) / (b0 - a0);
          x = min_x;
        }
				
        if (out == c1) {
          a0 = Math.round(x);
          a1 = Math.round(y);
          c1 = this.region(min_x, min_y, max_x, max_y, a0, a1);

        } else {
          b0 = Math.round(x);
          b1 = Math.round(y);
          c2 = this.region(min_x, min_y, max_x, max_y, b0, b1);
        }
      }

      // Se está na área de código 0000
      if (valid) {
        // redesenha o objeto na área de janela
        redrawing();
      }
    }
}

var region = function(min_x, min_y,max_x, max_y, x, y){
		
		var cd = 0;

    if (x < min_x) cd += 1; // esquerda - set bit 0
    if (x > max_x) cd += 2; // direita - set bi 1
    if (y < min_y) cd += 4; // inferior - set bit 2
    if (y > max_y) cd += 8; // superior - set bit 4

    return cd;
}

//LIANG_BARSKY ALGORITHM
var liangBarsky = function(){
	
		let dx = b0 - a0;
    let dy = b1 - a1;
    let p = [-dx, dx, -dy, dy];
    let q = [a0 - min_x, max_x - a0, a1 - min_y, max_y - a1];
    let t1 = 0.0;
    let t2 = 1.0;
    let temp, xx1, yy1, xx2, yy2;

    for (let i = 0; i < 4; i++) {
      if (p[i] == 0) {
        if (q[i] >= 0) {
          if (i < 2) {
            if (a1 < min_y) a1 = min_y;
            if (b1 > max_y) b1 = max_y;
          }
          if (i > 1) {
            if (a0 < min_x) a0 = min_x;
            if (b0 > max_x) b0 = max_x;
          }
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      temp = q[i] / p[i];
      if (p[i] < 0) {
        if (t1 <= temp) t1 = temp;
      } else {
        if (t2 > temp) t2 = temp;
      }
    }
    if (t1 < t2) {
      xx1 = a0 + t1 * p[1];
      xx2 = a0 + t2 * p[1];
      yy1 = a1 + t1 * p[3];
      yy2 = a1 + t2 * p[3];
    }
		a0 = Math.round(xx1);
		a1 = Math.round(yy1);
		b0 = Math.round(xx2);
		b1 = Math.round(yy2);
		
    redrawing();
	
}
//************************************************FIM*********************************************************

//TRECHO PRINCIPAL DO CÓDIGO(DISTRIBUI FUNÇÕES)
$('#canvas').on('click',
  function(e) {
		//Este trecho de código vai designar qual algoritmo o usuário quer utilizar para fazer uma simulação
    if (!boolBlockAction) {
      cont++;
      if (cont == 1) {
        a0 = e.offsetX;
        a1 = e.offsetY;
        setPixel(e.offsetX, e.offsetY, black); //Ponto inicial
      }
      if (cont == 2) {
        b0 = e.offsetX;
        b1 = e.offsetY;
        setPixel(e.offsetX, e.offsetY, black); //Ponto final
					if (boolDDA) {
							dda(a0, a1, b0, b1);
							boolDDA = false;
							boolDDAG = true;
							boolBlockAction = true;
							aux = 0;
					} else if (boolBresenhamLin) {
							bresenham(a0, a1, b0, b1);
							boolBresenhamLin = false;
							boolBresG = true;
							boolBlockAction = true;
							aux = 1;
					} else if (boolBresenhamCirc) {
							bresenhamCircle(a0, a1, b0, b1);
							boolCircG = true;
							boolBresenhamCirc = false;
							boolBlockAction = true;
							aux = 2;
					}
      }
    }else if(boolCohen_Sutherland || boolLiang_Barsky){
			cont1++;
			if(cont1 == 1){
				min_x = e.offsetX;
				min_y = e.offsetY;
				setPixel(e.offsetX, e.offsetY, black); //Ponto inicial
			}
			if (cont1 == 2) {
				max_x = e.offsetX;
				max_y = e.offsetY;
				setPixel(e.offsetX, e.offsetY, black); //Ponto final
				if(boolCohen_Sutherland){
					cohenSutherland();
				}else{
					liangBarsky();
				}
			}
    }else{
			alert("You should select some function and/or clear the table!");
		}
  });
	