var rozmiar;
var snejk = [];
var japko = [];//{x,y,s}s- status{n-niezjedzone,z-zjedzone}
var kierunek; //1=+x, -1 = -x, 2=+y, -2=-y
var predkosc = 100;
//interwal poruszania sie
var krokInterval = undefined;
//input do zmiany kierunku
var eventklawy = undefined;
// ostatnia pozycja ogonu
var stary=undefined;
var moznazmienic = false;

//przygotowanie ekranu gry
var prepare = function prepare(){
	rozmiar = $('#game').css("height");
	rozmiar = rozmiar.slice(0,-2);
	$('#game').css("width",rozmiar);
	var i1,i2;
	var tmp;
	var x,y;
	for(i1=19;i1>=0;i1--){
		if(i1 <10){
			y = "0"+i1;
		}else{
			y = i1;
		}
		for(i2=0;i2<20;i2++){
			if(i2<10){
				x = "0"+i2
			}else{
				x = i2;
			}
			tmp = document.createElement("div");
			tmp.id = "p"+x+y;
			tmp.style.width = rozmiar/25+"px";
			tmp.style.boxSizing = "content-box";
			tmp.style.margin = rozmiar/201+"px";
			tmp.style.height = rozmiar/25+"px";
			tmp.style.display = "inline-block";
			document.getElementById("game").appendChild(tmp);
		}
	}
};

//narysowanie poczatkowej wersji weza
function start(){
	var x1 = Math.floor(Math.random()*1000)%10 + 6;
	var y1 = Math.floor(Math.random()*1000)%10 + 6;
	snejk[0] = {x:x1,y:y1};
	if(x1 < 10){
		if(y1 < 10){
			if(Math.floor(Math.random()*1000)%2 == 0){
				snejk[1] = {x:x1+1,y:y1};
				kierunek = -1;
			}else{
				snejk[1] = {x:x1,y:y1+1};
				kierunek = -2;
			}
		}else{
			if(Math.floor(Math.random()*1000)%2 == 0){
				snejk[1] = {x:x1+1,y:y1};
				kierunek = -1;
			}else{
				snejk[1] = {x:x1,y:y1-1};
				kierunek = 2;
			}
		}
	}else{
		if(y1 < 10){
			if(Math.floor(Math.random()*1000)%2 == 0){
				snejk[1] = {x:x1-1,y:y1};
				kierunek = 1;
			}else{
				snejk[1] = {x:x1,y:y1+1};
				kierunek = -2;
			}
		}else{
			if(Math.floor(Math.random()*1000)%2 == 0){
				snejk[1] = {x:x1-1,y:y1};
				kierunek = 1;
			}else{
				snejk[1] = {x:x1,y:y1-1};
				kierunek = 2;
			}
		}
	}
	if(snejk[1].y==snejk[0].y){
		var dodaj = snejk[1].x-snejk[0].x;
		snejk[2] = {x:x1+(dodaj*2),y:y1};
		snejk[3] = {x:x1+(dodaj*3),y:y1};
		snejk[4] = {x:x1+(dodaj*4),y:y1};
		snejk[5] = {x:x1+(dodaj*5),y:y1};
	}else{
		var dodaj = snejk[1].y-snejk[0].y;
		snejk[2] = {x:x1,y:y1+(dodaj*2)};
		snejk[3] = {x:x1,y:y1+(dodaj*3)};
		snejk[4] = {x:x1,y:y1+(dodaj*4)};
		snejk[5] = {x:x1,y:y1+(dodaj*5)};
	}
	rysuj(0);
	//ustawienie interwału!!
	krokInterval = setInterval(krok,predkosc);
	eventklawy = addEventListener("keydown",zmien);
	setTimeout(spawn,3000);
}

//interwalowa funkcja poruszania
var krok = function(){
	if(sprawdzkolizje(kierunek)){
		moznazmienic = true;
		//stary tyl weza
		var index = snejk.length-1;
		stary = "p";
		if(snejk[index].x < 10){
			stary += "0" + snejk[index].x;
		}else{
			stary += snejk[index].x;
		}
		if(snejk[index].y < 10){
			stary += "0" + snejk[index].y;
		}else{
			stary += snejk[index].y;
		}
		//przejscie
		var i;
		for(i = index; i>0 ;i--){
			snejk[i].x = snejk[i-1].x;
			snejk[i].y = snejk[i-1].y;
		}
		//przesuniecie glowy
		if(Math.abs(kierunek)==1){
			snejk[0].x += kierunek;
			if(snejk[0].x>19){
				snejk[0].x = 0;
			}
			if(snejk[0].x<0){
				snejk[0].x = 19;
			}
		}else if(Math.abs(kierunek)==2){
			snejk[0].y += (kierunek/2);
			if(snejk[0].y>19){
				snejk[0].y = 0;
			}
			if(snejk[0].y<0){
				snejk[0].y = 19;
			}
		}
		rysuj(1);
		//czy zjadl jablko?
		var i;
		for(i=0;i<=japko.length-1;i++){
			if(japko[i].x == snejk[0].x&& japko[i].y==snejk[0].y){
				japko[i].s = "z";
				console.log("zjad");
				var id2 = "p";
				if(japko[i].x < 10){
					id2 += "0"+ japko[i].x;
				}else{
					id2 += japko[i].x;
				}
				if(japko[i].y < 10){
					id2 += "0"+ japko[i].y;
				}else{
					id2 += japko[i].y;
				}
				document.getElementById(id2).style.backgroundColor = "#8400FF";
				spawn();
			}
		}
		//trawi
		var i;
		for(i=0;i<=japko.length-1;i++){
			if(japko[i].s == "z"){
				var id2 = "p";
				if(japko[i].x < 10){
					id2 += "0"+ japko[i].x;
				}else{
					id2 += japko[i].x;
				}
				if(japko[i].y < 10){
					id2 += "0"+ japko[i].y;
				}else{
					id2 += japko[i].y;
				}
				document.getElementById(id2).style.backgroundColor = "#9666FF";
			}
			var tmp1 = stary.slice(1,5);
			tmp1 = {x:parseInt(tmp1.slice(0,2)),y:parseInt(tmp1.slice(2,4))};
			if(japko[i].x == tmp1.x && japko[i].y == tmp1.y){
				snejk.push({x:tmp1.x,y:tmp1.y});
				japko.splice(i,1);
				document.getElementById(stary).backgroundColor = "black";
			}
		}
	}else{
		koniec();
	}
};

//pobranie klawisza i zmiana kierunku
var zmien = function(klawisz){
	if(krokInterval != undefined){
		if(klawisz.key == "w" || klawisz.key == "W"){
			if(Math.abs(kierunek)==1&&moznazmienic){
				if(sprawdzkolizje(2)){
					kierunek = 2;
					moznazmienic = false;
				}
			}
		}
		if(klawisz.key == "d" || klawisz.key == "D"){
			if(Math.abs(kierunek)==2&&moznazmienic){
				if(sprawdzkolizje(1)){
					kierunek = 1;
					moznazmienic = false;
				}
			}
		}
		if(klawisz.key == "s" || klawisz.key == "S"){
			if(Math.abs(kierunek)==1&&moznazmienic){
				if(sprawdzkolizje(-2)){
					kierunek = -2;
					moznazmienic = false;
				}
			}
		}
		if(klawisz.key == "a" || klawisz.key == "A"){
			if(Math.abs(kierunek)==2&&moznazmienic){
				if(sprawdzkolizje(-1)){
					kierunek = -1;
					moznazmienic = false;
				}
			}
		}
	}
	//pauza
	if(klawisz.key == "p"|| klawisz.key=="P"){
		if(krokInterval != undefined){
			clearInterval(krokInterval);
			krokInterval = undefined;
		}else{
			krokInterval = setInterval(krok,predkosc);
		}
	}
}

//spawn jedzonka
var spawn = function(){
	var x,y;
	var nope = true;
	do{
		x = Math.floor(Math.random()*1000)%20;
		y = Math.floor(Math.random()*1000)%20;
		var i;
		for(i=0;i<snejk.length-1;i++){
			if(snejk[i].x == x && snejk[i].y == y){
				nope = true;
				console.log("zajete"+i);
				break;
			}else{
				nope = false;
			}
		}
	}while(nope);
	japko.push({x:x,y:y,s:"n"});
	var id1 = "p";
	if(x<10){
		id1 += "0"+x;
	}else{
		id1 += x;
	}
	if(y<10){
		id1 += "0"+y;
	}else{
		id1 += y;
	}
	document.getElementById(id1).style.backgroundColor = "red";
}
//sprawdzanie kolizji
var sprawdzkolizje = function(kierunek){
	var glowa = {x:snejk[0].x,y:snejk[0].y};
	if(Math.abs(kierunek)==1){
		if(glowa.x == 0 && kierunek == -1){
			glowa.x = 19;
		}else if(glowa.x == 19 && kierunek == 1){
			glowa.x = 0;
		}else{
			glowa.x += kierunek;
		}
	}else if(Math.abs(kierunek)==2){
		if(glowa.y == 0 && kierunek == -2){
			glowa.y = 19;
		}else if(glowa.y == 19 && kierunek == 2){
			glowa.y = 0;
		}else{
			glowa.y += (kierunek/2);
		}
	}
	var i;
	for(i = snejk.length-1;i>0;i--){
		if(snejk[i].x==glowa.x&&snejk[i].y==glowa.y){
			return false;
		}
	}
	return true;
};

//koniec gry
var koniec = function(){
	var i;
	var mig = 200;
	
	for(i=0;i<10;i++){
		setTimeout(czysc,mig*i);
		i++;
		setTimeout(rysuj,mig*i);
	}
	removeEventListener("keydown",eventklawy);
	clearInterval(krokInterval);
	i++;
	setTimeout(function(){
		snejk = undefined;
	},mig*i);
};


//rysowanie
var rysuj= function(a){
	if(a == 1){
		document.getElementById(stary).style.backgroundColor = "white";
	}
	for(x in snejk){
		var str = "p";
		if(snejk[x].x<10){
			str += "0"+snejk[x].x;
		}else{
			str += snejk[x].x;
		}
		if(snejk[x].y<10){
			str += "0"+snejk[x].y;
		}else{
			str += snejk[x].y;
		}
		if(x == 0){
			document.getElementById(str).style.backgroundColor = "gray";
		}else{
			document.getElementById(str).style.backgroundColor = "black";
		}
	}
};

var  czysc = function(){
	for(i1=19;i1>=0;i1--){
		if(i1 <10){
			y = "0"+i1;
		}else{
			y = i1;
		}
		for(i2=0;i2<20;i2++){
			if(i2<10){
				x = "0"+i2
			}else{
				x = i2;
			}
			var id = "p"+x+y;
			document.getElementById(id).style.backgroundColor = "white";
		}
	}
};