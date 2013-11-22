var editor;
var atrTit  =   { "font-size": 12, "font-family": "Verdana"};
var atrRect =   { "stroke": "#aaa", fill: "#fff"};
var atrCont =   { "stroke": "#555", 'stroke-width': 2.5};
var atrAct  =   { "stroke": "#555", 'stroke-width': 2.5, fill: "#fff"};
var atrTab  =   { "stroke": "#555", 'stroke-width': 2.5, fill: "#ccc"};
var atrCurva =  { color: "#555", stroke_width: 2.5};
var atrLineas = { stroke: "#008ec7", "stroke-dasharray": ". "};
var atrPunCon = { fill: "#fff", stroke: "#008ec7"};


function figura(r, tipo, p, padre, titulo){
	var bb, po, ancho, alto, medio_x, tamEl;
	var fig = r.set();
	
	fig.p = {x: p.x, y: p.y};
	
	fig.push(
		r.text(fig.p.x, fig.p.y, titulo).attr(atrTit)
	);
	
	bb = fig[0].getBBox();
	po = {x: bb.x - 2, y: bb.y -1};
	ancho = bb.width + 4;
	alto = bb.height + 2;
	medio_x = po.x + ancho/2;
	tamEl = 50;
	
	fig.sup = {x: medio_x, y: po.y - tamEl};
	fig.inf = {x: medio_x, y: po.y + alto};
	
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect),
		r.image('img/'+tipo+'.png', medio_x - tamEl/2 , po.y - tamEl, tamEl, tamEl),
		r.image('img/cerrar.png', medio_x + tamEl/2 - 12, po.y - tamEl - 12, 24, 24)
	);
	fig[0].toFront();
	fig[3].hide();
	for(var i=0; i<3; i++){
		fig[i].attr({ cursor: "move"});
	}
	
	fig.move = function(p){
		var dx = p.x - this.p.x;
		var dy = p.y - this.p.y;
		this.transform("T" + dx + "," + dy);
	};
	fig.camTit = function(titulo){
		var bb, po, ancho, alto, medio_x, tamEl;
		
		this[0].attr('text', titulo);
		
		bb = this[0].getBBox();		
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		medio_x = po.x + ancho/2;
		tamEl = 50;
		
		this.sup = {x: medio_x, y: po.y - tamEl};
		this.inf = {x: medio_x, y: po.y + alto};
		
		this[1].attr('x', po.x);
		this[1].attr('y', po.y);
		this[1].attr('width', ancho);
		this[1].attr('height', alto);
		this[1].transform('');
		
		this[2].attr('x', medio_x - tamEl/2);
		this[2].attr('y', po.y - tamEl);
		this[2].transform('');
		
		this[3].attr('x', medio_x + tamEl/2 - 12);
		this[3].attr('y', po.y - tamEl - 12);
		this[3].transform('');
	};
	fig.obtBorde = function(){
		var bb, po, ancho, alto, medio_x, tamEl;
		
		bb = this[0].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		medio_x = po.x + ancho/2;
		tamEl = 50;
		
		this.sup = {x: medio_x, y: po.y - tamEl};
		this.inf = {x: medio_x, y: po.y + alto};
		
		this.pathBorde = [["M", po.x, po.y], 
						 ["H", medio_x - tamEl/2],
						 ["V", po.y - tamEl],
						 ["H", medio_x + tamEl/2],
						 ["V", po.y ],
						 ["H", po.x + ancho],
						 ["V", po.y + alto], 
						 ["H", po.x], 
						 ["V", po.y]];
		return this.pathBorde;
	}
	fig.hover(
		function(){
			fig[3].show();
		},
		function(){
			fig[3].hide();
		}
	);
	refFigPadre(fig, padre);
	return fig;
};

function figEdi(r, img, p, padre, titulo, tamEl){
	var bb, po, ancho, alto, medio_x, medio_y, tamEl, pc;
	var fig = r.set();
	
	fig.p = {x: p.x, y: p.y};
	
	fig.push(
		r.text(fig.p.x, fig.p.y, titulo).attr(atrTit)
	);
	
	bb = fig[0].getBBox();
	po = {x: bb.x - 2, y: bb.y -1};
	ancho = bb.width + 4;
	alto = bb.height + 2;
	medio_x = po.x + ancho/2;
	medio_y = po.y + alto/2;
	tamEl = tamEl || {w: 75, h: 60};
	
	fig.sup = {x: medio_x, y: medio_y - tamEl.h/2};
	fig.inf = {x: medio_x, y: medio_y + tamEl.h/2};
	
	pc = {	p0x: medio_x - tamEl.w/2, p0y: medio_y - tamEl.h/2,
			p1x: medio_x + tamEl.w/2, p1y: medio_y - tamEl.h/2, 
			p2x: medio_x + tamEl.w/2, p2y: medio_y + tamEl.h/2, 
			p3x: medio_x - tamEl.w/2, p3y: medio_y + tamEl.h/2};
	
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect),
		r.image('img/'+img+'.png', medio_x - tamEl.w/2 , medio_y - tamEl.h/2, tamEl.w, tamEl.h),
		r.circle(pc.p0x, pc.p0y, 4).attr(atrPunCon),
		r.circle(pc.p1x, pc.p1y, 4).attr(atrPunCon),
		r.circle(pc.p2x, pc.p2y, 4).attr(atrPunCon),
		r.circle(pc.p3x, pc.p3y, 4).attr(atrPunCon),
		r.image('img/cerrar.png', medio_x + ancho/2 - 12, po.y - 12, 24, 24)
	);
	fig[1].toFront();
	fig[0].toFront();
	fig[7].toFront();
	fig[7].hide();
	for(var i=0; i<3; i++){
		fig[i].attr({ cursor: "move"});
	}
	fig[3].attr({ cursor: "nw-resize"});
	fig[4].attr({ cursor: "ne-resize"});
	fig[5].attr({ cursor: "se-resize"});
	fig[6].attr({ cursor: "sw-resize"});
	
	fig.move = function(p){
		var dx = p.x - this.p.x;
		var dy = p.y - this.p.y;
		this.transform("T" + dx + "," + dy);
	};
	fig.camTit = function(titulo){	
		var bb, po, ancho, alto, medio_x, medio_y, tamEl;
		
		this[0].attr('text', titulo);
		
		bb = this[0].getBBox();	
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		bb = this[2].getBBox();
		tamEl = {w: bb.width, h: bb.height};
		
		this.sup = {x: medio_x, y: medio_y - tamEl.h/2};
		this.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		
		this[1].attr('x', po.x);
		this[1].attr('y', po.y);
		this[1].attr('width', ancho);
		this[1].attr('height', alto);
		this[1].transform('');
		
		this[2].attr('x', medio_x - tamEl.w/2);
		this[2].attr('y', medio_y - tamEl.h/2);
		this[2].transform('');
		
		this[7].attr('x', medio_x + ancho/2 - 12);
		this[7].attr('y', po.y - 12);
		this[7].transform('');
	};
	fig.obtTamCont = function(){
		return {'width': 	this[2].attr('width'),
				'height': 	this[2].attr('height')};
	};
	fig.camTamCont = function(width, height){
		this[2].attr('width',  ancho - dx);
		this[2].attr('height', alto  - dy);
	};
	fig.obtBorde = function(){
		var bb, po, ancho, alto, medio_x, medio_y, tamEl;
		
		bb = fig[0].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		bb = fig[2].getBBox();
		tamEl = {w: bb.width, h: bb.height};
		
		this.sup = {x: medio_x, y: medio_y - tamEl.h/2};
		this.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		
		this.pathBorde = [["M", medio_x - tamEl.w/2, medio_y - tamEl.h/2], 
						  ["H", medio_x + tamEl.w/2],
						  ["V", medio_y + tamEl.h/2],
						  ["H", medio_x - tamEl.w/2],
						  ["V", medio_y - tamEl.h/2]];
		return this.pathBorde;
	}
	fig.mosCont = function(){
		fig[3].show();
		fig[4].show();
		fig[5].show();
		fig[6].show();
	};
	fig.ocuCont = function(){
		fig[3].hide();
		fig[4].hide();
		fig[5].hide();
		fig[6].hide();
	};
	fig.hover(
		function(){
			fig[7].show();
		},
		function(){
			fig[7].hide();
		}
	);
	fig[3].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, dy_tit, po, ancho, alto, medio_x, medio_y;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		this.padre.fig.sup = {x: medio_x, y: medio_y - tamEl.h/2};
		this.padre.fig.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		dy_tit = medio_y - (bb_tit.y + (bb_tit.height/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){
			fig[0].transform("...T" + dx_tit + "," + dy_tit);
			fig[1].transform("...T" + dx_tit + "," + dy_tit);
			
			fig[2].attr('width',  ancho - dx);
			fig[2].attr('height', alto  - dy);
			fig[2].transform("...T" + dx + "," + dy);
			fig[3].transform("...T" + dx + "," + dy);
			fig[4].transform("...T" + 0  + "," + dy);
			fig[6].transform("...T" + dx + "," + 0);
			
			fig[7].transform("...T" + dx_tit + "," + dy_tit);
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	fig[4].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, dy_tit, po, ancho, alto, medio_x, medio_y;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		this.padre.fig.sup = {x: medio_x, y: medio_y - tamEl.h/2};
		this.padre.fig.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		dy_tit = medio_y - (bb_tit.y + (bb_tit.height/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			fig[0].transform("...T" + dx_tit + "," + dy_tit);
			fig[1].transform("...T" + dx_tit + "," + dy_tit);
			
			fig[2].attr('width',  ancho + dx);
			fig[2].attr('height', alto  - dy);
			fig[2].transform("...T" + 0  + "," + dy);
			fig[3].transform("...T" + 0 + "," + dy);
			fig[4].transform("...T" + dx  + "," + dy);
			fig[5].transform("...T" + dx + "," + 0);
			
			fig[7].transform("...T" + dx_tit + "," + dy_tit);
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	fig[5].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, dy_tit, po, ancho, alto, medio_x, medio_y;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		this.padre.fig.sup = {x: medio_x, y: medio_y - tamEl.h/2};
		this.padre.fig.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		dy_tit = medio_y - (bb_tit.y + (bb_tit.height/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			fig[0].transform("...T" + dx_tit + "," + dy_tit);
			fig[1].transform("...T" + dx_tit + "," + dy_tit);
			
			fig[2].attr('width',  ancho + dx);
			fig[2].attr('height', alto  + dy);
			fig[2].transform("...T" + 0  + "," + 0);
			fig[4].transform("...T" + dx + "," + 0);
			fig[5].transform("...T" + dx + "," + dy);
			fig[6].transform("...T" + 0  + "," + dy);
			
			fig[7].transform("...T" + dx_tit + "," + dy_tit);
			
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	fig[6].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, dy_tit, po, ancho, alto, medio_x, medio_y;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		this.padre.fig.sup = {x: medio_x, y: medio_y - tamEl.h/2};
		this.padre.fig.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		dy_tit = medio_y - (bb_tit.y + (bb_tit.height/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			fig[0].transform("...T" + dx_tit + "," + dy_tit);
			fig[1].transform("...T" + dx_tit + "," + dy_tit);
			
			fig[2].attr('width',  ancho - dx);
			fig[2].attr('height', alto  + dy);
			fig[2].transform("...T" + dx + "," + 0);
			fig[3].transform("...T" + dx + "," + 0);
			fig[5].transform("...T" + 0  + "," + dy);
			fig[6].transform("...T" + dx + "," + dy);
			
			fig[7].transform("...T" + dx_tit + "," + dy_tit);
			
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	
	function start() {
		this.dx = this.dy = 0;
	};
	function moveCont(dx, dy) {
		this.update(dx - (this.dx || 0), dy - (this.dy || 0));
		this.dx = dx;
		this.dy = dy;
	};
	fig[3].drag(moveCont, start);
	fig[4].drag(moveCont, start);
	fig[5].drag(moveCont, start);
	fig[6].drag(moveCont, start);

	refFigPadre(fig, padre);
	return fig;
};

function figUnion(r, p, padre, tie_ini, tie_fin){
	//Eliminar elemento s[i].remove(), s.exclude(s[i])
	var fig = r.set();
	fig.p = [];
	fig.from = undefined;
	fig.to = undefined;

	if(!$.isArray(p)){
		fig.p[0] = p;
		fig.push(
			r.circle(fig.p[0].x, fig.p[0].y, 4).attr(atrPunCon)
		);
		fig.move = function(p){
			if(this.p.length == 1){
				this[0].attr({'cx': p.x, 'cy': p.y});
			}
			else if(this.p.length == 4){
				var pi = {x: this.p[0].x, y: this.p[0].y};
				this.p[2] = {x: (p.x + pi.x)/2, y: (p.y + pi.y)/2};
				this.p[3] = {x: p.x, y: p.y};
				
				this[1].modPm(this.p);
				this[2].attr({'cx': p.x, 'cy': p.y});
			}
		};
		fig.actSegPun = function(r, pt, alpha){
			this[0].animate({'stroke': '#fff'}, 500, function(){ this.remove()});
			
			var dAx = 75*Math.cos(alpha), dAy = -75*Math.sin(alpha);
			this.p[0]={x: pt.x, y: pt.y };
			this.p[1]={x: pt.x + dAx, y: pt.y + dAy};
			this.p[2]={x: pt.x, y: pt.y};
			this.p[3]={x: pt.x, y: pt.y};
			
			var pm = {	x:  this.p[0].x, y:  this.p[0].y, 
						ax: this.p[1].x ,ay: this.p[1].y, 
						bx: this.p[2].x, by: this.p[2].y, 
						zx: this.p[3].x, zy: this.p[3].y};
			this.push(
				Curva(r, pm, atrCurva),
				r.circle(this.p[0].x, this.p[0].y, 4).attr(atrPunCon)
			);
		};
	}
	else{
		fig.p = p;
		var pt, bb, po, ancho, alto, medio_x, tamEl;
		
		var pm = {  x:  fig.p[0].x, y:  fig.p[0].y, 
					ax: fig.p[1].x, ay: fig.p[1].y, 
					bx: fig.p[2].x, by: fig.p[2].y, 
					zx: fig.p[3].x, zy: fig.p[3].y};
		fig.push(
			Curva(r, pm, atrCurva),
			LinCurve(r, pm, atrLineas),
			r.circle(pm.x,  pm.y,  4).attr(atrPunCon),
			r.circle(pm.ax, pm.ay, 4).attr(atrPunCon),
			r.circle(pm.bx, pm.by, 4).attr(atrPunCon),
			r.circle(pm.zx, pm.zy, 4).attr(atrPunCon)
		);
		
		pt = padre.from.fig.inf;
		
		fig.push(
			r.text(pt.x, pt.y + 16, tie_ini).attr(atrTit)
		);
		bb = fig[6].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		fig.push(
			r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect)
		);
		
		pt = padre.to.fig.sup;
		
		fig.push(
			r.text(pt.x, pt.y - 16, tie_fin).attr(atrTit)
		);
		bb = fig[8].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		fig.push(
			r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect)
		);
		
		pt = editor.detPorEnPath(fig[0].pathCurve, 0.5);
		fig.push(
			r.image('img/cerrar.png', pt.x-12, pt.y-12, 24, 24)
		);
		
		fig[6].toFront();
		fig[8].toFront();
		for(var i=1; i<6; i++){
			fig[i].toFront();
		}
		fig[10].hide();
		
		fig.ocuCont =  function(){
			fig[1].hide();
			fig[2].hide();
			fig[3].hide();
			fig[4].hide();
			fig[5].hide();
		};
		fig.mosCont = function(){
			fig[1].show();
			fig[2].show();
			fig[3].show();
			fig[4].show();
			fig[5].show();
		};
		fig.camTieIni = function(tiempo){
			var bb, po, ancho, alto;
			
			this[6].attr('text', tiempo);
			
			bb = this[6].getBBox();		
			po = {x: bb.x - 2, y: bb.y -1};
			ancho = bb.width + 4;
			alto = bb.height + 2;	
			
			this[7].attr('x', po.x);
			this[7].attr('y', po.y);
			this[7].attr('width', ancho);
			this[7].attr('height', alto);
			this[7].transform('');
			this.act();
		};
		fig.camTieFin = function(tiempo){
			var bb, po, ancho, alto;
			
			this[8].attr('text', tiempo);
			
			bb = this[8].getBBox();		
			po = {x: bb.x - 2, y: bb.y -1};
			ancho = bb.width + 4;
			alto = bb.height + 2;	
			
			this[9].attr('x', po.x);
			this[9].attr('y', po.y);
			this[9].attr('width', ancho);
			this[9].attr('height', alto);
			this[9].transform('');
			this.act();
		};
		fig.act = function(){			
			var pt = this.padre.from.fig.inf;
			
			fig[6].attr('x', pt.x);
			fig[6].attr('y', pt.y + 16);
			fig[6].transform('');
			fig[7].attr('x', pt.x - fig[7].attr('width')/2);
			fig[7].attr('y', pt.y - fig[7].attr('height')/2 + 16);
			fig[7].transform('');
			
			var pt = this.padre.to.fig.sup;
			
			fig[8].attr('x', pt.x);
			fig[8].attr('y', pt.y - 16);
			fig[8].transform('');
			fig[9].attr('x', pt.x - fig[9].attr('width')/2);
			fig[9].attr('y', pt.y - fig[9].attr('height')/2 - 16);
			fig[9].transform('');
			
			var pt = editor.detPorEnPath(fig[0].pathCurve, 0.5);
			fig[10].attr('x', pt.x - 12);
			fig[10].attr('y', pt.y - 12);
			fig[10].transform('');
		};
		fig[2].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			bb = this.getBBox();
			fig.p[0] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			pt = editor.detPunEnPath(this.padre.from.borde, fig.p[0]);
						
			this.transform("...T" + (pt.x - fig.p[0].x) + "," + (pt.y - fig.p[0].y));
						
			bb = this.getBBox();
			fig.p[0] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[3].update(dx, dy);
		};
		fig[3].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			var bb = this.getBBox();
			fig.p[1] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[0].modPm(fig.p);
			fig[1].modPm(fig.p);
			fig.act();
		};
		fig[4].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			var bb = this.getBBox();
			fig.p[2] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[0].modPm(fig.p);
			fig[1].modPm(fig.p);
			fig.act();
		};
		fig[5].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			bb = this.getBBox();
			fig.p[3] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			pt = editor.detPunEnPath(this.padre.to.borde, fig.p[3]);
						
			this.transform("...T" + (pt.x - fig.p[3].x) + "," + (pt.y - fig.p[3].y));
						
			bb = this.getBBox();
			fig.p[3] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[4].update(dx, dy);
		};
		function moveCurve(dx, dy) {
			this.update(dx - (this.dx || 0), dy - (this.dy || 0));
			this.dx = dx;
			this.dy = dy;
		};
		function start() {
			this.dx = this.dy = 0;
		};
		fig[2].drag(moveCurve, start);
		fig[3].drag(moveCurve, start);
		fig[4].drag(moveCurve, start);
		fig[5].drag(moveCurve, start);
		fig.hover(
			function(){
				fig[10].show();
			},
			function(){
				fig[10].hide();
			}
		);
	}
	refFigPadre(fig, padre);
	return fig;
};

function figUnDob(r, p, padre){
	//Eliminar elemento s[i].remove(), s.exclude(s[i])
	var fig = r.set();
	fig.p = [];
	fig.from = undefined;
	fig.to = undefined;

	if(!$.isArray(p)){
		fig.p[0] = p;
		fig.push(
			r.circle(fig.p[0].x, fig.p[0].y, 4).attr(atrPunCon)
		);
		fig.move = function(p){
			if(this.p.length == 1){
				this[0].attr({'cx': p.x, 'cy': p.y});
			}
			else if(this.p.length == 4){
				var pi = {x: this.p[0].x, y: this.p[0].y};
				this.p[2] = {x: (p.x + pi.x)/2, y: (p.y + pi.y)/2};
				this.p[3] = {x: p.x, y: p.y};
				
				this[1].modPm(this.p);
				this[2].attr({'cx': p.x, 'cy': p.y});
			}
		};
		fig.actSegPun = function(r, pt, alpha){
			this[0].animate({'stroke': '#fff'}, 500, function(){ this.remove()});
			
			var dAx = 75*Math.cos(alpha), dAy = -75*Math.sin(alpha);
			this.p[0]={x: pt.x, y: pt.y };
			this.p[1]={x: pt.x + dAx, y: pt.y + dAy};
			this.p[2]={x: pt.x, y: pt.y};
			this.p[3]={x: pt.x, y: pt.y};
			
			var pm = {	x:  this.p[0].x, y:  this.p[0].y, 
						ax: this.p[1].x ,ay: this.p[1].y, 
						bx: this.p[2].x, by: this.p[2].y, 
						zx: this.p[3].x, zy: this.p[3].y};
			this.push(
				CurvaDob(r, pm, atrCurva),
				r.circle(this.p[0].x, this.p[0].y, 4).attr(atrPunCon)
			);
		};
	}
	else{
		fig.p = p;
		var pt, bb, po, ancho, alto, medio_x, tamEl;
		
		var pm = {  x:  fig.p[0].x, y:  fig.p[0].y, 
					ax: fig.p[1].x, ay: fig.p[1].y, 
					bx: fig.p[2].x, by: fig.p[2].y, 
					zx: fig.p[3].x, zy: fig.p[3].y};
		fig.push(
			CurvaDob(r, pm, atrCurva),
			LinCurve(r, pm, atrLineas),
			r.circle(pm.x,  pm.y,  4).attr(atrPunCon),
			r.circle(pm.ax, pm.ay, 4).attr(atrPunCon),
			r.circle(pm.bx, pm.by, 4).attr(atrPunCon),
			r.circle(pm.zx, pm.zy, 4).attr(atrPunCon)
		);
					
		pt = editor.detPorEnPath(fig[0].pathCurve, 0.5);
		fig.push(
			r.image('img/cerrar.png', pt.x-12, pt.y-12, 24, 24)
		);
		
		fig[6].toFront();
		fig[6].hide();
		for(var i=1; i<6; i++){
			fig[i].toFront();
		}
		
		fig.ocuCont =  function(){
			fig[1].hide();
			fig[2].hide();
			fig[3].hide();
			fig[4].hide();
			fig[5].hide();
		};
		fig.mosCont = function(){
			fig[1].show();
			fig[2].show();
			fig[3].show();
			fig[4].show();
			fig[5].show();
		};
		fig.act = function(){
			var pt = editor.detPorEnPath(fig[0].pathCurve, 0.5);
			fig[6].attr('x', pt.x - 12);
			fig[6].attr('y', pt.y - 12);
			fig[6].transform('');
		};
		fig[2].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			bb = this.getBBox();
			fig.p[0] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			pt = editor.detPunEnPath(this.padre.from.borde, fig.p[0]);
						
			this.transform("...T" + (pt.x - fig.p[0].x) + "," + (pt.y - fig.p[0].y));
						
			bb = this.getBBox();
			fig.p[0] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[3].update(dx, dy);
		};
		fig[3].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			var bb = this.getBBox();
			fig.p[1] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[0].modPm(fig.p);
			fig[1].modPm(fig.p);
			fig.act();
		};
		fig[4].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			var bb = this.getBBox();
			fig.p[2] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[0].modPm(fig.p);
			fig[1].modPm(fig.p);
			fig.act();
		};
		fig[5].update = function (dx, dy) {
			this.transform("...T" + dx + "," + dy);
			
			bb = this.getBBox();
			fig.p[3] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			pt = editor.detPunEnPath(this.padre.to.borde, fig.p[3]);
						
			this.transform("...T" + (pt.x - fig.p[3].x) + "," + (pt.y - fig.p[3].y));
						
			bb = this.getBBox();
			fig.p[3] = {x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
			fig[4].update(dx, dy);
		};
		function moveCurve(dx, dy) {
			this.update(dx - (this.dx || 0), dy - (this.dy || 0));
			this.dx = dx;
			this.dy = dy;
		};
		function start() {
			this.dx = this.dy = 0;
		};
		fig[2].drag(moveCurve, start);
		fig[3].drag(moveCurve, start);
		fig[4].drag(moveCurve, start);
		fig[5].drag(moveCurve, start);
		fig.hover(
			function(){
				fig[6].show();
			},
			function(){
				fig[6].hide();
			}
		);
	}
	refFigPadre(fig, padre);
	return fig;
};

function figActiv(r, p, padre, rol, descri, tiempo){
	var fig = r.set();
	var bb = [];
	var dim, po, ancho, alto, medio_x, pc;
		
	fig.p = {x: p.x, y: p.y};
	
	fig.push(
		r.text(fig.p.x, fig.p.y, rol).attr(atrTit)
	);
	bb[0] = fig[0].getBBox();
	po = {x: bb[0].x - 2, y: bb[0].y -1};
	ancho = bb[0].width + 4;
	alto = bb[0].height + 2;
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect)
	);
	fig[0].toFront();
	
	fig.push(
		r.text(fig.p.x, fig.p.y, descri).attr(atrTit)
	);
	bb[1] = fig[2].getBBox();
	fig[2].attr('y', po.y + alto + (bb[1].height/2) + 10);
	fig[2].transform('');
	
	bb[1] = fig[2].getBBox();
	po = {x: bb[1].x - 2, y: bb[1].y -1};
	ancho = bb[1].width + 4;
	alto = bb[1].height + 2;
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect)
	);
	fig[2].toFront();
	
	fig.push(
		r.text(fig.p.x, fig.p.y, tiempo).attr(atrTit)
	);
	bb[2] = fig[4].getBBox();
	fig[4].attr('y', po.y + alto + (bb[2].height/2) + 5);
	fig[4].transform('');
	
	bb[2] = fig[4].getBBox();
	po = {x: bb[2].x - 2, y: bb[2].y -1};
	ancho = bb[2].width + 4;
	alto = bb[2].height + 2;
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect)
	);
	fig[4].toFront();
	
	
	fig.obtBB = function(bb){
		var po, ind, ancho = 0, alto = 0;		
		for(i in bb){
			if(bb[i].width > ancho){
				ancho = bb[i].width;
				ind = i;
			}
			alto += bb[i].height + 2;
		};
		ancho += 4;
		alto += 15;
		
		return {x: bb[ind].x - 2 - 5, y: bb[0].y - 1 - 5, width: ancho+ 10, height: alto + 10};
	};
	
	dim = fig.obtBB(bb);
	po = {x: bb[0].x - 2, y: bb[0].y -1};
	alto = bb[0].height + 2;
	pc = {	p0x: dim.x, 			p0y: dim.y,
			p1x: dim.x + dim.width, p1y: dim.y, 
			p2x: dim.x + dim.width, p2y: dim.y + dim.height, 
			p3x: dim.x, 			p3y: dim.y + dim.height};
	
	medio_x = dim.x+ dim.width/2;
	
	fig.sup = {x: medio_x, y: dim.y};
	fig.inf = {x: medio_x, y: dim.y + dim.height};
	
	fig.push(
		r.rect(dim.x, dim.y, dim.width, dim.height).attr(atrAct),
		r.rect(dim.x, po.y + alto + 5, dim.width, dim.height - alto - 10).attr(atrAct),
		r.circle(pc.p0x, pc.p0y, 4).attr(atrPunCon),
		r.circle(pc.p1x, pc.p1y, 4).attr(atrPunCon),
		r.circle(pc.p2x, pc.p2y, 4).attr(atrPunCon),
		r.circle(pc.p3x, pc.p3y, 4).attr(atrPunCon),
		r.image('img/cerrar.png', bb[0].x + bb[0].width - 10, bb[0].y - 14, 24, 24)
	);
	
	fig[7].toBack();
	fig[6].toBack();
	fig[8].attr({ cursor: "nw-resize"});
	fig[9].attr({ cursor: "ne-resize"});
	fig[10].attr({ cursor: "se-resize"});
	fig[11].attr({ cursor: "sw-resize"});
	fig[12].toFront();
	fig[12].hide();
	
	for(var i=0; i<8; i++){
		fig[i].attr({ cursor: "move"});
	}
	fig.move = function(p){
		var dx = p.x - this.p.x;
		var dy = p.y - this.p.y;
		this.transform("T" + dx + "," + dy);
	};
	fig.camTit = function(rol){
		this[0].attr('text', rol);		
		this.actMarco();
	};
	fig.camDes = function(desc){
		this[2].attr('text', desc);
		this.actMarco();
	};
	fig.camTie = function(tiem){
		this[4].attr('text', tiem);		
		this.actMarco();
	};
	fig.obtBorde = function(){		
		/*var dim, bb = [];
		bb[0] = this[0].getBBox();
		bb[1] = this[2].getBBox();
		bb[2] = this[4].getBBox();
		
		dim = this.obtBB(bb);*/
		
		var bb = this.getBBox();
		
		this.pathBorde = [
						 ["M", bb.x, bb.y], 
						 ["H", bb.x + bb.width],
						 ["V", bb.y + bb.height], 
						 ["H", bb.x], 
						 ["V", bb.y]];
		return this.pathBorde;
	};
	fig.actMarco = function(){
		var bb = [];
		var po, ancho, alto, medio_x, pc;
		
		bb[0] = this[0].getBBox();
		po = {x: bb[0].x - 2, y: bb[0].y -1};
		ancho = bb[0].width + 4;
		alto = bb[0].height + 2;
		
		this[1].attr('x', po.x);
		this[1].attr('y', po.y);
		this[1].attr('width', ancho);
		this[1].attr('height', alto);
		this[1].transform('');
		
		bb[1] = this[2].getBBox();
		this[2].attr('x', po.x + ancho/2);
		this[2].attr('y', po.y + alto + bb[1].height/2 + 10);	
		this[2].transform('');
		
		bb[1] = this[2].getBBox();
		po = {x: bb[1].x - 2, y: bb[1].y -1};
		ancho = bb[1].width + 4;
		alto = bb[1].height + 2;
		
		this[3].attr('x', po.x);
		this[3].attr('y', po.y);
		this[3].attr('width', ancho);
		this[3].attr('height', alto);
		this[3].transform('');
		
		bb[2] = this[4].getBBox();
		this[4].attr('x', po.x + ancho/2);
		this[4].attr('y', po.y + alto + bb[2].height/2 + 5);
		this[4].transform('');
		
		bb[2] = this[4].getBBox();
		po = {x: bb[2].x - 2, y: bb[2].y -1};
		ancho = bb[2].width + 4;
		alto = bb[2].height + 2;
		
		this[5].attr('x', po.x);
		this[5].attr('y', po.y);
		this[5].attr('width', ancho);
		this[5].attr('height', alto);
		this[5].transform('');
		
		dim = this.obtBB(bb);
		po = {x: bb[0].x - 2, y: bb[0].y -1};
		alto = bb[0].height + 2;
		
		medio_x = dim.x+ dim.width/2;
		
		fig.sup = {x: medio_x, y: dim.y};
		fig.inf = {x: medio_x, y: dim.y + dim.height};
		
		pc = {	p0x: dim.x, 			p0y: dim.y,
				p1x: dim.x + dim.width, p1y: dim.y, 
				p2x: dim.x + dim.width, p2y: dim.y + dim.height, 
				p3x: dim.x, 			p3y: dim.y + dim.height};
		
		this[6].attr('x', dim.x);
		this[6].attr('y', dim.y);
		this[6].attr('width', dim.width);
		this[6].attr('height', dim.height);
		this[6].transform('');
		
		this[7].attr('x', dim.x);
		this[7].attr('y', po.y + alto + 5);
		this[7].attr('width', dim.width);
		this[7].attr('height', dim.height - alto - 10);
		this[7].transform('');
		
		this[8].attr('cx', pc.p0x);
		this[8].attr('cy', pc.p0y);
		this[8].transform('');
		
		this[9].attr('cx', pc.p1x);
		this[9].attr('cy', pc.p1y);
		this[9].transform('');
		
		this[10].attr('cx', pc.p2x);
		this[10].attr('cy', pc.p2y);
		this[10].transform('');
		
		this[11].attr('cx', pc.p3x);
		this[11].attr('cy', pc.p3y);
		this[11].transform('');
		
		this[12].attr('x', bb[0].x + bb[0].width - 10);
		this[12].attr('y', bb[0].y - 14);
		this[12].transform('');
	};
	fig.mosCont = function(){
		fig[8].show();
		fig[9].show();
		fig[10].show();
		fig[11].show();
	};
	fig.ocuCont = function(){
		fig[8].hide();
		fig[9].hide();
		fig[10].hide();
		fig[11].hide();
	};
	fig.hover(
		function(){
			fig[12].show();
		},
		function(){
			fig[12].hide();
		}
	);
	fig[8].update = function (dx, dy) {
		var bbRect, bb_tit, dx_tit, dy_tit, po, ancho, alto, medio_x, medio_x_dim, dim, altRecInt;
		
		bbRect = fig[6].getBBox();
		po = {x: bbRect.x, y: bbRect.y};
		ancho = bbRect.width;
		alto  = bbRect.height;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		this.padre.fig.sup = {x: medio_x, y: po.y};
		this.padre.fig.inf = {x: medio_x, y: po.y + alto};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		dy_tit = po.y - bb_tit.y + 5;
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			
			fig[0].transform("...T" + dx_tit + "," + dy_tit);
			fig[1].transform("...T" + dx_tit + "," + dy_tit);
			fig[2].transform("...T" + dx_tit + "," + dy_tit);
			fig[3].transform("...T" + dx_tit + "," + dy_tit);
			fig[4].transform("...T" + dx_tit + "," + dy_tit);
			fig[5].transform("...T" + dx_tit + "," + dy_tit);
			
			fig[6].attr('width',  ancho - dx);
			fig[6].attr('height', alto  - dy);
			fig[6].transform("...T" + dx + "," + dy);
			
			fig[7].attr('width',  ancho - dx);
			var altRecInt = alto - bb_tit.height - 10;
			if(altRecInt>=0){
				fig[7].attr('height', altRecInt - dy);
			}
			fig[7].transform("...T" + dx + "," + dy);
			
			fig[8].transform("...T" + dx + "," + dy);
			fig[9].transform("...T" + 0  + "," + dy);
			fig[11].transform("...T" + dx + "," + 0);
			fig[12].transform("...T" + dx_tit + "," + dy_tit);
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	fig[9].update = function (dx, dy) {
		var bbRect, bb_tit, dx_tit, dy_tit, po, ancho, alto, medio_x, medio_x_dim, dim, altRecInt;
		
		bbRect = fig[6].getBBox();
		po = {x: bbRect.x, y: bbRect.y};
		ancho = bbRect.width;
		alto  = bbRect.height;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		this.padre.fig.sup = {x: medio_x, y: po.y};
		this.padre.fig.inf = {x: medio_x, y: po.y + alto};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		dy_tit = po.y - bb_tit.y + 5;
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			
			fig[0].transform("...T" + dx_tit + "," + dy_tit);
			fig[1].transform("...T" + dx_tit + "," + dy_tit);
			fig[2].transform("...T" + dx_tit + "," + dy_tit);
			fig[3].transform("...T" + dx_tit + "," + dy_tit);
			fig[4].transform("...T" + dx_tit + "," + dy_tit);
			fig[5].transform("...T" + dx_tit + "," + dy_tit);
			
			fig[6].attr('width',  ancho + dx);
			fig[6].attr('height', alto  - dy);
			fig[6].transform("...T" + 0 + "," + dy);
			
			fig[7].attr('width',  ancho + dx);
			var altRecInt = alto - bb_tit.height - 10;
			if(altRecInt>=0){
				fig[7].attr('height', altRecInt - dy);
			}
			fig[7].transform("...T" + 0 + "," + dy);
			
			fig[8].transform("...T" + 0 + "," + dy);
			fig[9].transform("...T" + dx  + "," + dy);
			fig[10].transform("...T" + dx + "," + 0);
			fig[12].transform("...T" + dx_tit + "," + dy_tit);
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	fig[10].update = function (dx, dy) {
		var bbRect, bb_tit, dx_tit, po, ancho, alto, medio_x, medio_x_dim, dim, altRecInt;
		
		bbRect = fig[6].getBBox();
		po = {x: bbRect.x, y: bbRect.y};
		ancho = bbRect.width;
		alto  = bbRect.height;
		medio_x = po.x + ancho/2;

		this.padre.fig.sup = {x: medio_x, y: po.y};
		this.padre.fig.inf = {x: medio_x, y: po.y + alto};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			
			fig[0].transform("...T" + dx_tit + ",0");
			fig[1].transform("...T" + dx_tit + ",0");
			fig[2].transform("...T" + dx_tit + ",0");
			fig[3].transform("...T" + dx_tit + ",0");
			fig[4].transform("...T" + dx_tit + ",0");
			fig[5].transform("...T" + dx_tit + ",0");
			
			fig[6].attr('width',  ancho + dx);
			fig[6].attr('height', alto  + dy);
			
			fig[7].attr('width',  ancho + dx);
			var altRecInt = alto - bb_tit.height - 10;
			if(altRecInt>=0){
				fig[7].attr('height', alto - bb_tit.height - 10 + dy);
			}
			
			fig[9].transform("...T" + dx + "," + 0);
			fig[10].transform("...T" + dx  + "," + dy);
			fig[11].transform("...T" + 0 + "," + dy);
			fig[12].transform("...T" + dx_tit + "," + 0);
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	fig[11].update = function (dx, dy) {
		var bbRect, bb_tit, dx_tit, po, ancho, alto, medio_x, medio_x_dim, dim, altRecInt;
		
		bbRect = fig[6].getBBox();
		po = {x: bbRect.x, y: bbRect.y};
		ancho = bbRect.width;
		alto  = bbRect.height;
		medio_x = po.x + ancho/2;

		this.padre.fig.sup = {x: medio_x, y: po.y};
		this.padre.fig.inf = {x: medio_x, y: po.y + alto};
		
		bb_tit = fig[1].getBBox();
		dx_tit = medio_x - (bb_tit.x + (bb_tit.width/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){			
			
			fig[0].transform("...T" + dx_tit + ",0");
			fig[1].transform("...T" + dx_tit + ",0");
			fig[2].transform("...T" + dx_tit + ",0");
			fig[3].transform("...T" + dx_tit + ",0");
			fig[4].transform("...T" + dx_tit + ",0");
			fig[5].transform("...T" + dx_tit + ",0");
			
			fig[6].attr('width',  ancho - dx);
			fig[6].attr('height', alto  + dy);
			fig[6].transform("...T" + dx + "," + 0);
			
			fig[7].attr('width',  ancho - dx);
			var altRecInt = alto - bb_tit.height - 10;
			if(altRecInt>=0){
				fig[7].attr('height', alto - bb_tit.height - 10 + dy);
			}
			fig[7].transform("...T" + dx + "," + 0);
			
			fig[8].transform("...T" + dx + "," + 0);
			fig[10].transform("...T" + 0  + "," + dy);
			fig[11].transform("...T" + dx + "," + dy);
			fig[12].transform("...T" + dx_tit + "," + 0);
		}
		this.padre.borde = this.padre.fig.obtBorde();
		this.padre.restUbiEnl();
	};
	
	function start() {
		this.dx = this.dy = 0;
	};
	function moveCont(dx, dy) {
		this.update(dx - (this.dx || 0), dy - (this.dy || 0));
		this.dx = dx;
		this.dy = dy;
	};
	fig[8].drag(moveCont, start);
	fig[9].drag(moveCont, start);
	fig[10].drag(moveCont, start);
	fig[11].drag(moveCont, start);
	
	refFigPadre(fig, padre);
	return fig;
};

function figTabla(r, p, padre, titulo){
	var fig = r.set();
	var bb, dim, po, ancho, alto;
		
	fig.p = {x: p.x, y: p.y};
	
	fig.push(
		r.text(fig.p.x, fig.p.y, titulo).attr(atrTit)
	);
	bb	= fig[0].getBBox();
	po = {x: bb.x - 2, y: bb.y -1};
	ancho = bb.width + 4;
	alto = bb.height + 2;
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect)
	);
	fig[0].toFront();	
	
	dim = {	x: po.x - 5,
			y: po.y - 5,
			width: ancho + 10,
			height: alto + 60
	};

	fig.push(
		r.rect(dim.x, dim.y, dim.width, dim.height).attr(atrAct),
		r.rect(dim.x, po.y + alto + 5, dim.width, dim.height - alto - 10).attr(atrTab),
		r.image('img/cerrar.png', dim.x + dim.width - 12, dim.y - 12, 24, 24)
	);
	fig[3].toBack();
	fig[2].toBack();
	fig[4].toFront();
	fig[4].hide();
	
	for(var i=0; i<4; i++){
		fig[i].attr({ cursor: "move"});
	}
	fig.move = function(p){
		var dx = p.x - this.p.x;
		var dy = p.y - this.p.y;
		this.transform("T" + dx + "," + dy);
	};
	fig.camTit = function(titulo){
		var bb, po, ancho, alto;
		
		this[0].attr('text', titulo);		
		
		bb	= fig[0].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		
		this[1].attr('x', po.x);
		this[1].attr('y', po.y);
		this[1].attr('width', ancho);
		this[1].attr('height', alto);
		this[1].transform('');
		
		dim = {	x: po.x - 5,
				y: po.y - 5,
				width: ancho + 10,
				height: alto + 60
		};
		
		this[2].attr('x', dim.x);
		this[2].attr('y', dim.y);
		this[2].attr('width', dim.width);
		this[2].attr('height', dim.height);
		this[2].transform('');
		
		this[3].attr('x', dim.x);
		this[3].attr('y', po.y + alto + 5);
		this[3].attr('width', dim.width);
		this[3].attr('height', dim.height - alto - 10);
		this[3].transform('');
		
		this[4].attr('x', dim.x + dim.width - 12);
		this[4].attr('y', dim.y - 12);
		this[4].transform('');
	};
	fig.obtBorde = function(){		
		var dim, bb, po, ancho, alto;
		bb	= fig[0].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		
		dim = {	x: po.x - 5,
				y: po.y - 5,
				width: ancho + 10,
				height: alto + 60
		};
		
		this.pathBorde = [
						 ["M", dim.x, dim.y], 
						 ["H", dim.x + dim.width],
						 ["V", dim.y + dim.height], 
						 ["H", dim.x], 
						 ["V", dim.y]];
		return this.pathBorde;
	};
	fig.hover(
		function(){
			fig[4].show();
		},
		function(){
			fig[4].hide();
		}
	);
	refFigPadre(fig, padre);
	return fig;
};

function figDepen(r, p, tam, padre, titulo){
	var fig = r.set();
	var pc, bb, po, ancho, alto, medio_x, medio_y;
	var tam_dp = tam || {'ancho': 250, 'alto': 500};
		
	fig.p = {x: p.x, y: p.y};
	fig.push(
		r.text(fig.p.x, fig.p.y, titulo).attr(atrTit)
	);
	
	bb = fig[0].getBBox();
	po = {x: bb.x - 2, y: bb.y - 1};
	ancho = bb.width + 4;
	alto = bb.height + 2;
	medio_x = po.x + ancho/2;
	medio_y = po.y + alto;
	
	pc = {	p0x: medio_x - tam_dp.ancho/2, p0y: medio_y,
			p1x: medio_x + tam_dp.ancho/2, p1y: medio_y, 
			p2x: medio_x + tam_dp.ancho/2, p2y: medio_y + tam_dp.alto, 
			p3x: medio_x - tam_dp.ancho/2, p3y: medio_y + tam_dp.alto};
			
	fig.push(
		r.rect(po.x, po.y, ancho, alto, 4).attr(atrRect),
		r.rect(pc.p0x, pc.p0y, tam_dp.ancho, tam_dp.alto, 0).attr(atrCont),
		r.circle(pc.p0x, pc.p0y, 4).attr(atrPunCon),
		r.circle(pc.p1x, pc.p1y, 4).attr(atrPunCon),
		r.circle(pc.p2x, pc.p2y, 4).attr(atrPunCon),
		r.circle(pc.p3x, pc.p3y, 4).attr(atrPunCon),
		r.image('img/cerrar.png', po.x + ancho - 12, po.y - 12, 24, 24)
	);
	fig[0].toFront();
	fig[7].toFront();
	fig[7].hide();
	for(var i=0; i<3; i++){
		fig[i].attr({ cursor: "move"});
	}
	fig[3].attr({ cursor: "nw-resize"});
	fig[4].attr({ cursor: "ne-resize"});
	fig[5].attr({ cursor: "se-resize"});
	fig[6].attr({ cursor: "sw-resize"});
	
	fig.move = function(p){
		var dx = p.x - this.p.x;
		var dy = p.y - this.p.y;
		this.transform("T" + dx + "," + dy);
	};
	fig.camTit = function(titulo){
		var bb, pc, po, ancho, alto, medio_x, medio_y;
		
		this[0].attr('text', titulo);
		
		bb = this[0].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		medio_x = po.x + ancho/2;
		
		this[1].attr('x', po.x);
		this[1].attr('y', po.y);
		this[1].attr('width', ancho);
		this[1].attr('height', alto);
		this[1].transform('');
		
		this[2].attr('x', medio_x - (this[2].attr('width')/2));
		this[2].attr('y', po.y + alto);
		this[2].transform('');
		
		this[7].attr('x', po.x + ancho - 12);
		this[7].attr('y', po.y - 12);
		this[7].transform('');
		
		bb = this[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto = bb.height;
		
		pc = {	p0x: po.x, 			p0y: po.y,
				p1x: po.x + ancho,	p1y: po.y, 
				p2x: po.x + ancho, 	p2y: po.y + alto, 
				p3x: po.x, 	        p3y: po.y + alto};
						
		this[3].attr('cx', pc.p0x);
		this[3].attr('cy', pc.p0y);
		this[3].transform('');
		
		this[4].attr('cx', pc.p1x);
		this[4].attr('cy', pc.p1y);
		this[4].transform('');
		
		this[5].attr('cx', pc.p2x);
		this[5].attr('cy', pc.p2y);
		this[5].transform('');
		
		this[6].attr('cx', pc.p3x);
		this[6].attr('cy', pc.p3y);
		this[6].transform('');
	};
	fig.obtTamCont = function(){
		return {'width': 	this[2].attr('width'),
				'height': 	this[2].attr('height')};
	};
	fig.camTamCont = function(width, height){
		console.log('Cambiar tamaño de dependencia');
		this[2].attr('width',  ancho - dx);
		this[2].attr('height', alto  - dy);
	};
	fig.obtBorde = function(){
		var bb = this[1].getBBox();
		var borde = [["M", bb.x - 2, bb.y - 1], 
					["H", bb.x + bb.width + 2], 
					["V", bb.y + bb.height + 1],
					["H", bb.x - 2],
					["V", bb.y - 1]];
		return borde;
	};
	fig.mosCont = function(){
		fig[3].show();
		fig[4].show();
		fig[5].show();
		fig[6].show();
	};
	fig.ocuCont = function(){
		fig[3].hide();
		fig[4].hide();
		fig[5].hide();
		fig[6].hide();
	};
	fig[3].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, po, ancho, alto;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		
		bb_tit = fig[1].getBBox();
		dx_tit = (po.x + ancho/2) - (bb_tit.x + (bb_tit.width/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){
			fig[0].transform("...T" + dx_tit + "," + dy);
			fig[1].transform("...T" + dx_tit + "," + dy);
			
			fig[2].attr('width',  ancho - dx);
			fig[2].attr('height', alto  - dy);
			fig[2].transform("...T" + dx + "," + dy);
			fig[3].transform("...T" + dx + "," + dy);
			fig[4].transform("...T" + 0  + "," + dy);
			fig[6].transform("...T" + dx + "," + 0);
			
			fig[7].transform("...T" + dx_tit + "," + dy);
		}
	};
	fig[4].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, po, ancho, alto;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		
		bb_tit = fig[1].getBBox();
		dx_tit = (po.x + ancho/2) -
		(bb_tit.x + (bb_tit.width/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){
			fig[0].transform("...T" + dx_tit + "," + dy);
			fig[1].transform("...T" + dx_tit + "," + dy);
			
			fig[2].attr('width',  ancho + dx);
			fig[2].attr('height', alto  - dy);
			fig[2].transform("...T" + 0  + "," + dy);
			fig[3].transform("...T" + 0 + "," + dy);
			fig[4].transform("...T" + dx  + "," + dy);
			fig[5].transform("...T" + dx + "," + 0);
			
			fig[7].transform("...T" + dx_tit + "," + dy);
		}
	};
	fig[5].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, po, ancho, alto;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		
		bb_tit = fig[1].getBBox();
		dx_tit = (po.x + ancho/2) -
		(bb_tit.x + (bb_tit.width/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){
			fig[0].transform("...T" + dx_tit + "," + 0);
			fig[1].transform("...T" + dx_tit + "," + 0);
			
			fig[2].attr('width',  ancho + dx);
			fig[2].attr('height', alto  + dy);
			fig[2].transform("...T" + 0  + "," + 0);
			fig[4].transform("...T" + dx + "," + 0);
			fig[5].transform("...T" + dx + "," + dy);
			fig[6].transform("...T" + 0  + "," + dy);
			
			fig[7].transform("...T" + dx_tit + "," + 0);
		}
	};
	fig[6].update = function (dx, dy) {
		var bb, bb_tit, dx_tit, po, ancho, alto;
		
		bb = fig[2].getBBox();
		po = {x: bb.x, y: bb.y};
		ancho = bb.width;
		alto  = bb.height;
		
		bb_tit = fig[1].getBBox();
		dx_tit = (po.x + ancho/2) -
		(bb_tit.x + (bb_tit.width/2));
		
		if( ((ancho - dx) > 0) && ((alto - dy) > 0)){
			fig[0].transform("...T" + dx_tit + "," + 0);
			fig[1].transform("...T" + dx_tit + "," + 0);
			
			fig[2].attr('width',  ancho - dx);
			fig[2].attr('height', alto  + dy);
			fig[2].transform("...T" + dx + "," + 0);
			fig[3].transform("...T" + dx + "," + 0);
			fig[5].transform("...T" + 0  + "," + dy);
			fig[6].transform("...T" + dx + "," + dy);
			
			fig[7].transform("...T" + dx_tit + "," + 0);
		}
	};
	fig.hover(
		function(){
			fig[7].show();
		},
		function(){
			fig[7].hide();
		}
	);
	function start() {
		this.dx = this.dy = 0;
	};
	function moveCont(dx, dy) {
		this.update(dx - (this.dx || 0), dy - (this.dy || 0));
		this.dx = dx;
		this.dy = dy;
	};
	fig[3].drag(moveCont, start);
	fig[4].drag(moveCont, start);
	fig[5].drag(moveCont, start);
	fig[6].drag(moveCont, start);
	
	refFigPadre(fig, padre);
	return fig;
};


var Contenedor = Unidad.extend({
	init: function(){
		this._super();
		this.elementos = [];
		this.selec = false;
	},
	figura: function(r, p, tam){
		this.fig = figDepen(r, p, tam, this, this.titulo);
		this.borde = this.fig.obtBorde();
		this.fig[0].drag(this.moveSet, this.start, this.up);
		this.fig[1].drag(this.moveSet, this.start, this.up);
		this.fig[2].drag(this.moveSet, this.start, this.up);
		this.fig[2].click(this.click);
		this.fig[7].click(this.remove);
		this.fig[0].dblclick(this.editorTexto);
		this.visCont(this.selec);
	},
	pos: function(){
		var bb = this.fig[0].getBBox();
		return {x: bb.x + bb.width/2, y: bb.y + bb.height/2};
	},
	camTexto: function(ind, titulo){
		if(ind == 0){
			this.titulo = titulo;
			this.nombre = workflow.convTexVar(titulo);
			this.fig.camTit(this.titulo);
			this.borde = this.fig.obtBorde();
		}
	},
	visCont: function(vis){
		this.selec = vis;
		if(this.selec){
			this.fig.mosCont();
		}else{
			this.fig.ocuCont();
		}
	},
	
	click: function(e){
		this.padre.visCont(!this.padre.selec);
	},
	editorTexto: function(e){
		editor.addtexteditor(this.padre, 0, this.attr('text'));
	},
	start: function(){
		var el = this.padre;
		var elFig = el.fig;
		
		elFig.dx = 0;
		elFig.dy = 0;
				
		var borde = elFig.obtBorde();
		var pp = editor.r.path(borde).attr({'stroke': '#008ec7'});
		pp.animate({'stroke': '#fff'}, 100, function(){ this.remove()});
	},
	moveSet: function(dx, dy){
		var el = this.padre;
		var elFig = el.fig;		
		//var borde = elFig.obtBorde();
		var bb = elFig.getBBox();
		
		elFig.transform("...T" + (dx - elFig.dx) + "," + (dy - elFig.dy));
		elFig.dx = dx;
		elFig.dy = dy;
		
		var tamPan = editor.obtTamPan();		
		
		if((bb.x + bb.width) > (tamPan.w - editor.margen)){
			editor.modTamPan(bb.x + bb.width + editor.margen, tamPan.h);
		}
		else if(bb.x < editor.margen){
			editor.modTamPan(tamPan.w + editor.margen - bb.x , tamPan.h);
			editor.movObjs(editor.margen - bb.x, 0, {el: el});
		}
		if((bb.y + bb.height) > (tamPan.h - editor.margen)){
			editor.modTamPan(tamPan.w, bb.y + bb.height + editor.margen);
		}
		else if(bb.y < editor.margen){
			editor.modTamPan(tamPan.w, tamPan.h + editor.margen - bb.y);
			editor.movObjs(0, editor.margen - bb.y, {el: el});
		}
	},
	up: function(){
		var el = this.padre;
		var elFig = el.fig;		
		
		elFig.dx = 0;
		elFig.dy = 0;
		
		el.borde = elFig.obtBorde();
	},
	remove: function(){
		var obj;
		if(this.tipo == "depen"){
			obj = this;
		}else if(this.padre){
			obj = this.padre;
		}
		if(obj){
			var idEle = obj.id;
			var tipoItem = idEle.slice(0, -2);
			var el = editor.busEleID(tipoItem, idEle);
			var lista = editor.busLista(tipoItem);
			if(el){
				el.fig.remove();
				el.fig = undefined;
				el = undefined;
			}
			if(lista){
				for(var i=0; i<lista.length; i++){
					if(lista[i].id == idEle){
						lista.splice(i,1);
						i--;
					}
				}
			}
		}
	}
});

var Relacion = Unidad.extend({
	init: function(){
		this._super();
		this.from = undefined;
		this.to = undefined;
		this.selec = false;
	},
	camTexto: function(ind, text){
		if(ind == 6){
			if(tiempo.verificar(text)){
				this.tie_ini = text;
			}
			else{
				this.tie_ini = tiempo.acumulado();
			}
			this.fig.camTieIni(this.tie_ini);
		}
		else if(ind == 8){
			if(tiempo.verificar(text)){
				this.tie_fin = text;
			}
			else{
				this.tie_fin = tiempo.acumulado();
			}
			this.fig.camTieFin(this.tie_fin);
		}
	},
	camPt: function(pt){
		var bb;
		if(pt.po){
			this.fig[2].transform("...T" + (pt.po.x - this.fig.p[0].x) +
									 "," + (pt.po.y - this.fig.p[0].y));
			bb = this.fig[2].getBBox();
			this.fig.p[0] ={x: (bb.x + (bb.width)/2), 
							y: (bb.y + (bb.height)/2)};
			
			this.fig[0].modPm(this.fig.p);
			this.fig[1].modPm(this.fig.p);
		}
		else if(pt.pco){
			this.fig.p[1] = pt.pco;
		}
		else if(pt.pcd){
			this.fig.p[2] = pt.pcd;
		}
		else if(pt.pd){
			this.fig[5].transform("...T" + (pt.pd.x - this.fig.p[3].x) +
									 "," + (pt.pd.y - this.fig.p[3].y));
			bb = this.fig[5].getBBox();
			this.fig.p[3] ={x: (bb.x + (bb.width)/2), 
							y: (bb.y + (bb.height)/2)};
			
			this.fig[0].modPm(this.fig.p);
			this.fig[1].modPm(this.fig.p);
		}
	},
	obtPtsRel :function(){
		return {po: this.fig.p[0], pd: this.fig.p[3]};
	},
	mover: function(dx, dy){
		var bb;
		
		this.fig[2].transform("...T" + dx + "," + dy);
		bb = this.fig[2].getBBox();
		this.fig.p[0] ={x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
	
		this.fig[3].transform("...T" + dx + "," + dy);
		bb = this.fig[3].getBBox();
		this.fig.p[1] ={x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
		
		this.fig[4].transform("...T" + dx + "," + dy);
		bb = this.fig[4].getBBox();
		this.fig.p[2] ={x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
		
		this.fig[5].transform("...T" + dx + "," + dy);
		bb = this.fig[5].getBBox();
		this.fig.p[3] ={x: (bb.x + (bb.width)/2), 
						y: (bb.y + (bb.height)/2)};
		
		this.fig[1].modPm(this.fig.p);
		this.fig[0].modPm(this.fig.p);
		this.fig.act();
	},
	transUbiCont: function(cont){
		//cont po, pco, pd, pcd
		var pt, dx, dy;
		if(cont.po){
			dx = cont.po.dx;
			dy = cont.po.dy;
			
			pt = this.fig.p[0];
			this.fig.p[0] ={x: pt.x + dx - (this.fig.dx || 0), 
							y: pt.y + dy - (this.fig.dy || 0)};
			pt = this.fig.p[1];
			this.fig.p[1] ={x: pt.x + dx - (this.fig.dx || 0), 
							y: pt.y + dy - (this.fig.dy || 0)};
			
			this.fig[0].modPm(this.fig.p);
			this.fig[1].modPm(this.fig.p);
			
			this.fig[2].transform("...T" + (dx - (this.fig.dx || 0)) +
									 "," + (dy - (this.fig.dy || 0)));
			pt = this.fig[2].getBBox();
			this.fig.p[0] ={x: (pt.x + (pt.width)/2), 
							y: (pt.y + (pt.height)/2)};
								 
			this.fig[3].transform("...T" + (dx - (this.fig.dx || 0)) +
									 "," + (dy - (this.fig.dy || 0)));
			pt = this.fig[3].getBBox();
			this.fig.p[1] ={x: (pt.x + (pt.width)/2), 
							y: (pt.y + (pt.height)/2)};
		}
		else if(cont.pd){
			dx = cont.pd.dx;
			dy = cont.pd.dy;
			
			pt = this.fig.p[2];
			this.fig.p[2] ={x: pt.x + dx  - (this.fig.dx || 0), 
							y: pt.y + dy  - (this.fig.dy || 0)};
							
			pt = this.fig.p[3];
			this.fig.p[3] ={x: pt.x + dx  - (this.fig.dx || 0), 
							y: pt.y + dy  - (this.fig.dy || 0)};
							
			this.fig[0].modPm(this.fig.p);
			this.fig[1].modPm(this.fig.p);
			
			
			this.fig[4].transform("...T" + (dx - (this.fig.dx || 0)) +
									 "," + (dy - (this.fig.dy || 0)));
			pt = this.fig[4].getBBox();
			this.fig.p[2] ={x: (pt.x + (pt.width)/2), 
							y: (pt.y + (pt.height)/2)};
									 
			this.fig[5].transform("...T" + (dx - (this.fig.dx || 0)) +
									 "," + (dy - (this.fig.dy || 0)));
			pt = this.fig[5].getBBox();
			this.fig.p[3] ={x: (pt.x + (pt.width)/2), 
							y: (pt.y + (pt.height)/2)};
		}
		this.fig.act();
		this.fig.dx = dx;
		this.fig.dy = dy;
	},
	visCont: function(vis){
		this.selec = vis;
		if(this.selec){
			this.fig.mosCont();
		}else{
			this.fig.ocuCont();
		}
	},
	click: function(e){
		this.padre.visCont(!this.padre.selec);
	}
});

var Elemento = Unidad.extend({
	init: function(){
		this._super();
		this.borde = undefined;
		this.listUnionFrom = [];
		this.listUnionTo = [];
		this.listUnDobFrom = [];
		this.listUnDobTo = [];
	},
	figura: function(r, p){
		this.fig = figura(r, this.tipo, p, this, this.titulo);
		this.borde = this.fig.obtBorde();
		for(var i=0; i<3; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
			this.fig[i].dblclick(this.editorTexto);
		}
		this.fig[3].click(this.remove);
	},
	pos: function(){
		var bb = this.fig[0].getBBox();
		return {x: bb.x + bb.width/2, y: bb.y + bb.height/2};
	},
	camTexto: function(ind, titulo){
		if(ind==0){
			this.titulo = titulo;
			this.nombre = workflow.convTexVar(this.titulo);
			this.fig.camTit(this.titulo);
			this.borde = this.fig.obtBorde();
			this.restUbiEnl();
		}
	},
	restUbiEnl: function(){
		var pt;
		if(this.listUnionFrom){
			for( rel in this.listUnionFrom){
				if(this.listUnionFrom[rel]){
					pt = this.listUnionFrom[rel].obtPtsRel();
					pt = editor.detPunEnPath(this.borde, pt.po);
					this.listUnionFrom[rel].camPt({po: {x: pt.x, y: pt.y}});
					this.listUnionFrom[rel].fig.act();
				}
			}
		}
		if(this.listUnionTo){
			for( rel in this.listUnionTo){
				if(this.listUnionTo[rel]){
					pt = this.listUnionTo[rel].obtPtsRel();
					pt = editor.detPunEnPath(this.borde, pt.pd);
					this.listUnionTo[rel].camPt({pd: {x: pt.x, y: pt.y}});
					this.listUnionTo[rel].fig.act();
				}
			}
		}
		if(this.listUnDobFrom){
			for( rel in this.listUnDobFrom){
				if(this.listUnDobFrom[rel]){
					pt = this.listUnDobFrom[rel].obtPtsRel();
					pt = editor.detPunEnPath(this.borde, pt.po);
					this.listUnDobFrom[rel].camPt({po: {x: pt.x, y: pt.y}});
					this.listUnDobFrom[rel].fig.act();
				}
			}
		}
		if(this.listUnDobTo){
			for( rel in this.listUnDobTo){
				if(this.listUnDobTo[rel]){
					pt = this.listUnDobTo[rel].obtPtsRel();
					pt = editor.detPunEnPath(this.borde, pt.pd);
					this.listUnDobTo[rel].camPt({pd: {x: pt.x, y: pt.y}});
					this.listUnDobTo[rel].fig.act();
				}
			}
		}
	},
	
	start: function(){
		var el = this.padre;
		var elFig = el.fig;
		
		elFig.dx = 0;
		elFig.dy = 0;
		
		if(el.listUnionFrom){
			for( rel in el.listUnionFrom){
				if(el.listUnionFrom[rel]){
					el.listUnionFrom[rel].fig.dx = 0;
					el.listUnionFrom[rel].fig.dy = 0;
				}
			}
			
		}
		if(el.listUnionTo){
			for( rel in el.listUnionTo){
				if(el.listUnionTo[rel]){
					el.listUnionTo[rel].fig.dx = 0;
					el.listUnionTo[rel].fig.dy = 0;
				}
			}
		}
		if(el.listUnDobFrom){
			for( rel in el.listUnDobFrom){
				if(el.listUnDobFrom[rel]){
					el.listUnDobFrom[rel].fig.dx = 0;
					el.listUnDobFrom[rel].fig.dy = 0;
				}
			}
			
		}
		if(el.listUnDobTo){
			for( rel in el.listUnDobTo){
				if(el.listUnDobTo[rel]){
					el.listUnDobTo[rel].fig.dx = 0;
					el.listUnDobTo[rel].fig.dy = 0;
				}
			}
		}
		
		var borde = elFig.obtBorde();
		var pp = editor.r.path(borde).attr({'stroke': '#008ec7'});
		pp.animate({'stroke': '#fff'}, 100, function(){ this.remove()});
	},
	moveSet: function(dx, dy){
		var bb, po, ancho, alto, medio_x, medio_y, tamEl, dim, pc;
		var el = this.padre;
		var elFig = el.fig;		
		//var borde = elFig.obtBorde();
		var bb = elFig.getBBox();
		
		bb = elFig[0].getBBox();
		po = {x: bb.x - 2, y: bb.y -1};
		ancho = bb.width + 4;
		alto = bb.height + 2;
		medio_x = po.x + ancho/2;
		medio_y = po.y + alto/2;
		
		bb = elFig[2].getBBox();
		
		if(el.edita){
			tamEl = {w: bb.width, h: bb.height};
			elFig.sup = {x: medio_x, y: medio_y - tamEl.h/2};
			elFig.inf = {x: medio_x, y: medio_y + tamEl.h/2};
		}
		else if(el.tipo == 'activ'){
			bb = [];
			bb[0] = elFig[0].getBBox();
			bb[1] = elFig[2].getBBox();
			bb[2] = elFig[4].getBBox();
			
			dim = elFig.obtBB(bb);
			pc = {	p0x: dim.x, 			p0y: dim.y,
					p1x: dim.x + dim.width, p1y: dim.y, 
					p2x: dim.x + dim.width, p2y: dim.y + dim.height, 
					p3x: dim.x, 			p3y: dim.y + dim.height};
			
			medio_x = dim.x+ dim.width/2;
			
			elFig.sup = {x: medio_x, y: dim.y};
			elFig.inf = {x: medio_x, y: dim.y + dim.height};
			
		}
		else{
			tamEl = 50;
			elFig.sup = {x: medio_x, y: po.y - tamEl};
			elFig.inf = {x: medio_x, y: po.y + alto};
		}	
		
		elFig.transform("...T" + (dx - elFig.dx) + "," + (dy - elFig.dy));
		elFig.dx = dx;
		elFig.dy = dy;
		
		if(el.listUnionFrom){
			for( rel in el.listUnionFrom){
				if(el.listUnionFrom[rel]){
					el.listUnionFrom[rel].transUbiCont({po: {dx: dx, dy: dy}});
				}
			}
		}
		if(el.listUnionTo){
			for( rel in el.listUnionTo){
				if(el.listUnionTo[rel]){
					el.listUnionTo[rel].transUbiCont({pd: {dx: dx, dy: dy}});
				}
			}
		}
		if(el.listUnDobFrom){
			for( rel in el.listUnDobFrom){
				if(el.listUnDobFrom[rel]){
					el.listUnDobFrom[rel].transUbiCont({po: {dx: dx, dy: dy}});
				}
			}
		}
		if(el.listUnDobTo){
			for( rel in el.listUnDobTo){
				if(el.listUnDobTo[rel]){
					el.listUnDobTo[rel].transUbiCont({pd: {dx: dx, dy: dy}});
				}
			}
		}
		
		var tamPan = editor.obtTamPan();		
		bb = elFig.getBBox();
		
		if((bb.x + bb.width) > (tamPan.w - editor.margen)){
			editor.modTamPan(bb.x + bb.width + editor.margen, tamPan.h);
		}
		else if(bb.x < editor.margen){
			editor.modTamPan(tamPan.w + editor.margen - bb.x , tamPan.h);
			editor.movObjs(editor.margen - bb.x, 0, {el: el});
		}
		if((bb.y + bb.height) > (tamPan.h - editor.margen)){
			editor.modTamPan(tamPan.w, bb.y + bb.height + editor.margen);
		}
		else if(bb.y < editor.margen){
			editor.modTamPan(tamPan.w, tamPan.h + editor.margen - bb.y);
			editor.movObjs(0, editor.margen - bb.y, {el: el});
		}
	},
	up: function(){
		var el = this.padre;
		var elFig = el.fig;		
		
		elFig.dx = 0;
		elFig.dy = 0;
		
		if(el.listUnionFrom){
			for( rel in el.listUnionFrom){
				if(el.listUnionFrom[rel]){
					el.listUnionFrom[rel].fig.dx = 0;
					el.listUnionFrom[rel].fig.dy = 0;
				}
			}
		}
		if(el.listUnionTo){
			for( rel in el.listUnionTo){
				if(el.listUnionTo[rel]){
					el.listUnionTo[rel].fig.dx = 0;
					el.listUnionTo[rel].fig.dy = 0;
				}
			}
		}
		if(el.listUnDobFrom){
			for( rel in el.listUnDobFrom){
				if(el.listUnDobFrom[rel]){
					el.listUnDobFrom[rel].fig.dx = 0;
					el.listUnDobFrom[rel].fig.dy = 0;
				}
			}
		}
		if(el.listUnDobTo){
			for( rel in el.listUnDobTo){
				if(el.listUnDobTo[rel]){
					el.listUnDobTo[rel].fig.dx = 0;
					el.listUnDobTo[rel].fig.dy = 0;
				}
			}
		}
		el.borde = elFig.obtBorde();
	},
	editorTexto: function(e){
		editor.addtexteditor(this.padre, 0, this.padre.fig[0].attr('text'));
	},
	remove: function(){
		var obj;
		if(this.tipo){
			obj = this;
		}else if(this.padre){
			obj = this.padre;
		}
		if(obj){
			var idEle = obj.id;
			var tipoItem = idEle.slice(0, -2);
			var el = editor.busEleID(tipoItem, idEle);
			var lista = editor.busLista(tipoItem);
			if(el){
				for(var i=0; i<el.listUnionFrom.length; i++){
					el.listUnionFrom[i].remove();
					i--;
				}
				for(var i=0; i<el.listUnionTo.length; i++){
					el.listUnionTo[i].remove();
					i--;
				}
				for(var i=0; i<el.listUnDobFrom.length; i++){
					el.listUnDobFrom[i].remove();
					i--;
				}
				for(var i=0; i<el.listUnDobTo.length; i++){
					el.listUnDobTo[i].remove();
					i--;
				}
				el.fig.remove();
				el.fig = undefined;
				el = undefined;
			}
			if(lista){
				for(var i=0; i<lista.length; i++){
					if(lista[i].id == idEle){
						lista.splice(i,1);
						i--;
					}
				}
			}
		}
	}
});

var EleEdita = Elemento.extend({
	init: function(){
		this._super();
		
		this.edita = true;
		this.selec = false;
	},
	visCont: function(vis){
		this.selec = vis;
		if(this.selec){
			this.fig.mosCont();
		}else{
			this.fig.ocuCont();
		}
	},
	click: function(e){
		this.padre.visCont(!this.padre.selec);
	}
});


var Depen = Contenedor.extend({
	init: function(r, p, tam, titulo){
		this._super();
		
		var ind = editor.ind['depen'];
		editor.ind['depen']++;
		
		this.id = "depen_"+ind;
		this.titulo = titulo || "Dependencia "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "depen";
		this.figura(r, p, tam);
	}
});

var Union = Relacion.extend({
	init: function(r, p, from, to, tie_ini, tie_fin){
		// p = puntos relación
		this._super();
		var ind = editor.ind['union'];
		editor.ind['union']++;
		
		this.id = "union_"+ind;
		this.nombre = this.id;
		this.tie_ini = tie_ini || "HH:MM";
		this.tie_fin = tie_fin || "HH:MM";
		
		this.tipo = "union";
		this.from = from;
		this.to = to;
		
		this.from.listUnionFrom.push(this);
		this.to.listUnionTo.push(this);
		
		this.figura(r, p);
	},
	figura: function(r, p){
		this.fig = figUnion(r, p, this, this.tie_ini, this.tie_fin);
		this.fig[0].click(this.click);
		this.fig[1].click(this.click);
		this.fig[10].click(this.remove);
		this.fig[6].dblclick(this.dbClickTieIni);
		this.fig[8].dblclick(this.dbClickTieFin);
		this.visCont(this.selec);
	},
	dbClickTieIni: function(e){
		editor.addtexteditor(this.padre, 6, this.attr('text'));
	},
	dbClickTieFin: function(e){
		editor.addtexteditor(this.padre, 8, this.attr('text'));
	},
	remove: function(){
		var obj;
		if(this.tipo == "union"){
			obj = this;
		}else if(this.padre){
			obj = this.padre;
		}
		if(obj){
			var listaFrom = obj.from.listUnionFrom;
			var listaTo = obj.to.listUnionTo;
			var listaUnion = editor.listUnion;
			
			var indFrom, indTo;
			//console.log(obj.id);
			for(var i=0; i<listaFrom.length; i++){
				if(listaFrom[i].id == obj.id) {
					indFrom = i;
					i = listaFrom.length;
				}
			};
			for(var i=0; i<listaTo.length; i++){
				if(listaTo[i].id == obj.id) {
					indTo = i;
					i = listaTo.length;
				}
			}
			
			if((listaFrom[indFrom].id == obj.id) && (listaTo[indTo].id == obj.id)){				
				//console.log('listaFrom');
				//console.log(listaFrom[indFrom]);
				//console.log('listaTo');
				//console.log(listaTo[indTo]);
				listaFrom.splice(indFrom,1);
				listaTo.splice(indTo,1);
			}
			for(var i=0; i<listaUnion.length; i++){
				if(listaUnion[i].id == obj.id){
					listaUnion.splice(i,1);;
				}
			}
			
			obj.fig.remove();
			obj = undefined;
		}
	}
});

var UnDob = Relacion.extend({
	init: function(r, p, from, to){
		// p = puntos relación
		this._super();
		var ind = editor.ind['undob'];
		editor.ind['undob']++;
		
		this.id = "undob_"+ind;
		this.nombre = this.id;
		
		this.tipo = "undob";
		this.from = from;
		this.to = to;
		
		this.from.listUnDobFrom.push(this);
		this.to.listUnDobTo.push(this);
		
		this.figura(r, p);
	},
	figura: function(r, p){
		this.fig = figUnDob(r, p, this);
		this.fig[0].click(this.click);
		this.fig[1].click(this.click);
		this.fig[6].click(this.remove);
		this.visCont(this.selec);
	},
	remove: function(){
		var obj;
		if(this.tipo == "undob"){
			obj = this;
		}else if(this.padre){
			obj = this.padre;
		}
		if(obj){
			var listaFrom = obj.from.listUnDobFrom;
			var listaTo = obj.to.listUnDobTo;
			var listaUnDob = editor.listUnDob;
			
			var indFrom, indTo;
			//console.log(obj.id);
			for(var i=0; i<listaFrom.length; i++){
				if(listaFrom[i].id == obj.id) {
					indFrom = i;
					i = listaFrom.length;
				}
			};
			for(var i=0; i<listaTo.length; i++){
				if(listaTo[i].id == obj.id) {
					indTo = i;
					i = listaTo.length;
				}
			};
			
			if((listaFrom[indFrom].id == obj.id) && (listaTo[indTo].id == obj.id)){				
				//console.log('listaFrom');
				//console.log(listaFrom[indFrom]);
				//console.log('listaTo');
				//console.log(listaTo[indTo]);
				listaFrom.splice(indFrom,1);
				listaTo.splice(indTo,1);
			}
			for(var i=0; i<listaUnDob.length; i++){
				if(listaUnDob[i].id == obj.id){
					listaUnDob.splice(i,1);;
				}
			}
			
			obj.fig.remove();
			obj = undefined;
		}
	}
});

var UEntr = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['uentr'];
		editor.ind['uentr']++;
		
		this.id = "uentr_"+ind;
		this.titulo = titu || "Usuario entra "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "uentr";
		this.figura(r, p);
	}
});

var USale = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['usale'];
		editor.ind['usale']++;
		
		this.id = "usale_"+ind;
		this.titulo = titu || "Usuario sale "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "usale";
		this.figura(r, p);
	}
});

var Archi = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['archi'];
		editor.ind['archi']++;
		
		this.id = "archi_"+ind;
		this.titulo = titu || "Archivador "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "archi";
		this.figura(r, p);
	}
});

var Compu = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['compu'];
		editor.ind['compu']++;
		
		this.id = "compu_"+ind;
		this.titulo = titu || "Computador "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "compu";
		this.figura(r, p);
	}
});

var BaseD = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['based'];
		editor.ind['based']++;
		
		this.id = "based_"+ind;
		this.titulo = titu || "Base de Datos "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "based";
		this.figura(r, p);
	}
});

var ActDB = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['actbd'];
		editor.ind['actbd']++;
		
		this.id = "actbd_"+ind;
		this.titulo = titu || "Actualizar "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "actbd";
		this.figura(r, p);
	}
});

var Impre = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['impre'];
		editor.ind['impre']++;
		
		this.id = "impre_"+ind;
		this.titulo = titu || "Impresion "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "impre";
		this.figura(r, p);
	}
});

var Papel = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['papel'];
		editor.ind['papel']++;
		
		this.id = "papel_"+ind;
		this.titulo = titu || "Papelera "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "papel";
		this.figura(r, p);
	}
});

var Tabla = Elemento.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['tabla'];
		editor.ind['tabla']++;
		
		this.id = "tabla_"+ind;
		this.nombre = this.id;
		this.titulo = titu || "Tabla "+ind;
		
		this.tipo = "tabla";
		this.figura(r, p);
	},
	camTexto: function(ind, texto){
		if(ind==0){
			this.titulo = texto;
			this.fig.camTit(this.titulo);
		}
		this.restUbiEnl();
	},
	figura: function(r, p){
		this.fig = figTabla(r, p, this, this.titulo);
		this.borde = this.fig.obtBorde();
		for(var i=0; i<4; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
		}
		this.fig[4].click(
			function(){
				this.padre.remove();
			}
		);
		this.fig[0].dblclick(this.dbClickTitulo);
	},
	dbClickTitulo: function(e){
		editor.addtexteditor(this.padre, 0, this.attr('text'));
	}
});

var Carpe = EleEdita.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['carpe'];
		editor.ind['carpe']++;
		
		this.id = "carpe_"+ind;
		this.titulo = titu || "Carpeta "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "carpe";
		this.figura(r, p);
	},
	figura: function(r, p){
		this.fig = figEdi(r, 'carpeta', p, this, this.titulo, {w: 75, h: 60});
		this.borde = this.fig.obtBorde();
		for(var i=0; i<3; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
			this.fig[i].dblclick(this.editorTexto);
		};
		this.fig[2].click(this.click);
		this.fig[7].click(this.remove);
		this.visCont(this.selec);
	}
});

var Docum = EleEdita.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['docum'];
		editor.ind['docum']++;
		
		this.id = "docum_"+ind;
		this.titulo = titu || "Documento "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "docum";
		this.figura(r, p);
	},
	figura: function(r, p){
		this.fig = figEdi(r, 'documento', p, this, this.titulo, {w: 60, h: 75});
		this.borde = this.fig.obtBorde();
		for(var i=0; i<3; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
			this.fig[i].dblclick(this.editorTexto);
		};
		this.fig[2].click(this.click);
		this.fig[7].click(this.remove);
		this.visCont(this.selec);
	}
});

var Docms = EleEdita.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['docms'];
		editor.ind['docms']++;
		
		this.id = "docms_"+ind;
		this.titulo = titu || "Documentos "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "docms";
		this.figura(r, p);
	},
	figura: function(r, p){
		this.fig = figEdi(r, 'documentos', p, this, this.titulo, {w: 75, h: 60});
		this.borde = this.fig.obtBorde();
		for(var i=0; i<3; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
			this.fig[i].dblclick(this.editorTexto);
		};
		this.fig[2].click(this.click);
		this.fig[7].click(this.remove);
		this.visCont(this.selec);
	}
});

var Incon = EleEdita.extend({
	init: function(r, p, titu){
		this._super();
		
		var ind = editor.ind['incon'];
		editor.ind['incon']++;
		
		this.id = "incon_"+ind;
		this.titulo = titu || "Inconsistencia "+ind;
		this.nombre = workflow.convTexVar(this.titulo);
		
		this.tipo = "incon";
		this.figura(r, p);
	},
	figura: function(r, p){
		this.fig = figEdi(r, 'inconsistencia', p, this, this.titulo, {w: 75, h: 60});
		this.borde = this.fig.obtBorde();
		for(var i=0; i<3; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
			this.fig[i].dblclick(this.editorTexto);
		};
		this.fig[2].click(this.click);
		this.fig[7].click(this.remove);
		this.visCont(this.selec);
	}
});

var Activ = Elemento.extend({
	init: function(r, p, rol, desc, tiem){
		this._super();
		
		var ind = editor.ind['activ'];
		editor.ind['activ']++;
		
		this.id = "activ_"+ind;
		this.nombre = this.id;
		this.rol 	= rol || "Rol "+ind;
		this.descri = desc || "Descripción "+ind;
		this.tiempo = tiem || "HH:MM";
		
		roles.agregar(this.rol);
		
		this.tipo = "activ";
		this.selec = false;
		this.figura(r, p);
	},
	camTexto: function(ind, texto){
		if(ind==0){
			roles.eliminar(this.rol);
			this.rol = texto;
			this.fig.camTit(this.rol);
			roles.agregar(this.rol);
		}
		else if(ind==2){
			this.descri = texto;
			this.fig.camDes(this.descri);
		}
		else if(ind==4){
			if(tiempo.verificar(texto)){
				this.tiempo = texto;
			}
			else{
				this.tiempo = tiempo.acumulado();
			}
			this.fig.camTie(this.tiempo);
		}
		this.restUbiEnl();
	},
	figura: function(r, p){
		this.fig = figActiv(r, p, this, this.rol, this.descri, this.tiempo);
		this.borde = this.fig.obtBorde();
		for(var i=0; i<8; i++){
			this.fig[i].drag(this.moveSet, this.start, this.up);
		}
		this.fig[12].click(
			function(){
				roles.eliminar(this.padre.rol);
				this.padre.remove();
			}
		);
		this.fig[0].dblclick(this.dbClickTitulo);
		this.fig[2].dblclick(this.dbClickDescri);
		this.fig[4].dblclick(this.dbClickTiempo);
		this.fig[6].click(this.click);
		this.fig[7].click(this.click);
		this.visCont(this.selec);
	},
	visCont: function(vis){
		this.selec = vis;
		if(this.selec){
			this.fig.mosCont();
		}else{
			this.fig.ocuCont();
		}
	},
	click: function(e){
		this.padre.visCont(!this.padre.selec);
	},
	dbClickTitulo: function(e){
		editor.addtexteditor(this.padre, 0, this.attr('text'));
	},
	dbClickDescri: function(e){
		editor.addtexteditor(this.padre, 2, this.attr('text'));
	},
	dbClickTiempo: function(e){
		editor.addtexteditor(this.padre, 4, this.attr('text'));
	}
});


var Editor = Class.extend({
	init: function(r){
		// Modelo de Editor //
		
		this.r = r;
		
		this.modo = "puntero";
		
		this.listUnion = [];
		this.listUEntr = [];
		this.listUSale = [];
		this.listActiv = [];
		this.listDepen = [];
		this.listArchi = [];
		this.listCarpe = [];
		this.listCompu = [];
		this.listBaseD = [];
		this.listActDB = [];
		this.listDocum = [];
		this.listDocms = [];
		this.listImpre = [];
		this.listPapel = [];
		this.listIncon = [];
		this.listTabla = [];
		this.listUnDob = [];
		
		this.ind = {};
		this.ind['union'] = 0;
		this.ind['uentr'] = 0;
		this.ind['usale'] = 0;
		this.ind['activ'] = 0;
		this.ind['depen'] = 0;
		this.ind['archi'] = 0;
		this.ind['carpe'] = 0;
		this.ind['compu'] = 0;
		this.ind['based'] = 0;
		this.ind['actbd'] = 0;
		this.ind['docum'] = 0;
		this.ind['docms'] = 0;
		this.ind['impre'] = 0;
		this.ind['papel'] = 0;
		this.ind['incon'] = 0;
		this.ind['tabla'] = 0;
		this.ind['undob'] = 0;
		
		this.UnionTmp;
		this.UEntrTmp;
		this.USaleTmp;
		this.ActivTmp;
		this.DepenTmp;
		this.ArchiTmp;
		this.CarpeTmp;
		this.CompuTmp;
		this.BaseDTmp;
		this.ActDBTmp;
		this.DocumTmp;
		this.DocmsTmp;
		this.ImpreTmp;
		this.PapelTmp;
		this.InconTmp;
		this.TablaTmp;
		this.UnDobTmp;
		
		this.margen = 15;
		// Fin del modelo Editor //
		
		// Vista de Editor //
		$('#icons li').hover(
			function(){
				$(this).addClass('ui-state-hover');
			},
			function() {
				if($(this).attr('id') != editor.modo){
					$(this).removeClass('ui-state-hover');
				}
			}
		);
		$('#icons li').click(function(){
			editor.activarModo($(this).attr('id'));
		});
		
		$('#svg-div').children().attr('id','svg')
		$('#svg-div').mouseenter(function(e){
			var p = editor.obtPosMouse(e);
			switch(editor.modo){
				case 'union': {
					if(editor.UnionTmp){
						editor.UnionTmp.remove();
						editor.UnionTmp = undefined;
					}
					editor.UnionTmp = new figUnion(editor.r, p, undefined);
					break;
				}
				case 'undob': {
					if(editor.UnDobTmp){
						editor.UnDobTmp.remove();
						editor.UnDobTmp = undefined;
					}
					editor.UnDobTmp = new figUnDob(editor.r, p, undefined);
					break;
				}
				case 'uentr': {
					if(editor.UEntrTmp){
						editor.UEntrTmp.remove();
						editor.UEntrTmp = undefined;
					}
					editor.UEntrTmp = figura(editor.r, 'uentr', p, undefined,"Usuario entra "+editor.ind['uentr']);
					break;
				}
				case 'usale': {
					if(editor.USaleTmp){
						editor.USaleTmp.remove();
						editor.USaleTmp = undefined;
					}
					editor.USaleTmp = figura(editor.r, 'usale', p, undefined,"Usuario sale "+editor.ind['usale']);
					break;
				}
				case 'activ': {
					if(editor.ActivTmp){
						editor.ActivTmp.remove();
						editor.ActivTmp = undefined;
					}
					editor.ActivTmp = figActiv(editor.r, p, undefined,"Rol "+editor.ind['activ'],"Descripción "+editor.ind['activ'],"HH:MM");
					break;
				}
				case 'depen': {
					if(editor.DepenTmp){
						editor.DepenTmp.remove();
						editor.DepenTmp = undefined;
					}
					editor.DepenTmp = figDepen(editor.r, p, undefined, undefined, "Dependencia "+editor.ind['depen']);
					break;
				}
				case 'archi': {
					if(editor.ArchiTmp){
						editor.ArchiTmp.remove();
						editor.ArchiTmp = undefined;
					}
					editor.ArchiTmp = figura(editor.r, 'archi', p, undefined, "Archivador "+editor.ind['archi']);
					break;
				}
				case 'carpe': {
					if(editor.CarpeTmp){
						editor.CarpeTmp.remove();
						editor.CarpeTmp = undefined;
					}
					editor.CarpeTmp = figEdi(editor.r, 'carpeta', p, undefined, "Carpeta "+editor.ind['carpe'], {w: 75, h: 60});
					break;
				}
				case 'compu': {
					if(editor.CompuTmp){
						editor.CompuTmp.remove();
						editor.CompuTmp = undefined;
					}
					editor.CompuTmp = figura(editor.r, 'compu', p, undefined, "Computador "+editor.ind['compu']);
					break;
				}
				case 'based': {
					if(editor.BaseDTmp){
						editor.BaseDTmp.remove();
						editor.BaseDTmp = undefined;
					}
					editor.BaseDTmp = figura(editor.r, 'based', p, undefined,"Base de Datos "+editor.ind['based']);
					break;
				}				
				case 'actbd': {
					if(editor.ActDBTmp){
						editor.ActDBTmp.remove();
						editor.ActDBTmp = undefined;
					}
					editor.ActDBTmp = figura(editor.r, 'actbd', p, undefined,"Actualizar "+editor.ind['actbd']);
					break;
				}
				case 'docum': {
					if(editor.DocumTmp){
						editor.DocumTmp.remove();
						editor.DocumTmp = undefined;
					}
					editor.DocumTmp = figEdi(editor.r, 'documento', p, undefined, "Documento "+editor.ind['docum'], {w: 60, h: 75});
					break;
				}
				case 'docms': {
					if(editor.DocmsTmp){
						editor.DocmsTmp.remove();
						editor.DocmsTmp = undefined;
					}
					editor.DocmsTmp = figEdi(editor.r, 'documentos', p, undefined,"Documentos "+editor.ind['docms'], {w: 75, h: 60});
					break;
				}
				case 'impre': {
					if(editor.ImpreTmp){
						editor.ImpreTmp.remove();
						editor.ImpreTmp = undefined;
					}
					editor.ImpreTmp = figura(editor.r, 'impre', p, undefined,"Impresion "+editor.ind['impre']);
					break;
				}
				case 'papel': {
					if(editor.PapelTmp){
						editor.PapelTmp.remove();
						editor.PapelTmp = undefined;
					}
					editor.PapelTmp = figura(editor.r, 'papel', p, undefined,"Papelera "+editor.ind['papel']);
					break;
				}
				case 'incon': {
					if(editor.InconTmp){
						editor.InconTmp.remove();
						editor.InconTmp = undefined;
					}
					editor.InconTmp = figEdi(editor.r, 'inconsistencia', p, undefined,"Inconsistencia "+editor.ind['incon'], {w: 75, h: 60});
					break;
				}
				case 'tabla': {
					if(editor.TablaTmp){
						editor.TablaTmp.remove();
						editor.TablaTmp = undefined;
					}
					editor.TablaTmp = figTabla(editor.r, p, undefined,"Tabla "+editor.ind['tabla']);
					break;
				}
			}
		});
		$('#svg-div').mouseleave(function(e){
			switch(editor.modo){
				case 'union': {
					if(editor.UnionTmp){
						editor.UnionTmp.remove();
						editor.UnionTmp = undefined;
					}
					break;
				}
				case 'undob': {
					if(editor.UnDobTmp){
						editor.UnDobTmp.remove();
						editor.UnDobTmp = undefined;
					}
					break;
				}
				case 'activ': {
					if(editor.ActivTmp){
						editor.ActivTmp.remove();
						editor.ActivTmp = undefined;
					}
					break;
				}
				case 'depen': {
					if(editor.DepenTmp){
						editor.DepenTmp.remove();
						editor.DepenTmp = undefined;
					}
					break;
				}
				case 'archi': {
					if(editor.ArchiTmp){
						editor.ArchiTmp.remove();
						editor.ArchiTmp = undefined;
					}
					break;
				}
				case 'carpe': {
					if(editor.CarpeTmp){
						editor.CarpeTmp.remove();
						editor.CarpeTmp = undefined;
					}
					break;
				}
				case 'compu': {
					if(editor.CompuTmp){
						editor.CompuTmp.remove();
						editor.CompuTmp = undefined;
					}
					break;
				}
				case 'based': {
					if(editor.BaseDTmp){
						editor.BaseDTmp.remove();
						editor.BaseDTmp = undefined;
					}
					break;
				}
				case 'actbd': {
					if(editor.ActDBTmp){
						editor.ActDBTmp.remove();
						editor.ActDBTmp = undefined;
					}
					break;
				}
				case 'docum': {
					if(editor.DocumTmp){
						editor.DocumTmp.remove();
						editor.DocumTmp = undefined;
					}
					break;
				}
				case 'docms': {
					if(editor.DocmsTmp){
						editor.DocmsTmp.remove();
						editor.DocmsTmp = undefined;
					}
					break;
				}
				case 'uentr': {
					if(editor.UEntrTmp){
						editor.UEntrTmp.remove();
						editor.UEntrTmp = undefined;
					}
					break;
				}
				case 'usale': {
					if(editor.USaleTmp){
						editor.USaleTmp.remove();
						editor.USaleTmp = undefined;
					}
					break;
				}
				case 'impre': {
					if(editor.ImpreTmp){
						editor.ImpreTmp.remove();
						editor.ImpreTmp = undefined;
					}
					break;
				}
				case 'papel': {
					if(editor.PapelTmp){
						editor.PapelTmp.remove();
						editor.PapelTmp = undefined;
					}
					break;
				}
				case 'incon': {
					if(editor.InconTmp){
						editor.InconTmp.remove();
						editor.InconTmp = undefined;
					}
					break;
				}
				case 'tabla': {
					if(editor.TablaTmp){
						editor.TablaTmp.remove();
						editor.TablaTmp = undefined;
					}
					break;
				}
			}
		});  
		$('#svg-div').mousemove(function(e){
			var p = editor.obtPosMouse(e);
			switch(editor.modo){
				case 'union': {
					if(editor.UnionTmp){
						editor.UnionTmp.move(p);
					}
					break;
				}
				case 'undob': {
					if(editor.UnDobTmp){
						editor.UnDobTmp.move(p);
					}
					break;
				}
				case 'activ': {
					if(editor.ActivTmp){
						editor.ActivTmp.move(p);			
					}
					break;
				}
				case 'depen': {
					if(editor.DepenTmp){
						editor.DepenTmp.move(p);					
					}
					break;
				}
				case 'archi': {
					if(editor.ArchiTmp){
						editor.ArchiTmp.move(p);					
					}
					break;
				}
				case 'carpe': {
					if(editor.CarpeTmp){
						editor.CarpeTmp.move(p);			
					}
					break;
				}
				case 'compu': {
					if(editor.CompuTmp){
						editor.CompuTmp.move(p);		
					}
					break;
				}
				case 'based': {
					if(editor.BaseDTmp){
						editor.BaseDTmp.move(p);	
					}
					break;
				}
				case 'actbd': {
					if(editor.ActDBTmp){
						editor.ActDBTmp.move(p);		
					}
					break;
				}
				case 'docum': {
					if(editor.DocumTmp){
						editor.DocumTmp.move(p);
					}
					break;
				}
				case 'docms': {
					if(editor.DocmsTmp){
						editor.DocmsTmp.move(p);
					}
					break;
				}
				case 'uentr': {
					if(editor.UEntrTmp){
						editor.UEntrTmp.move(p);
					}
					break;
				}
				case 'usale': {
					if(editor.USaleTmp){
						editor.USaleTmp.move(p);			
					}
					break;
				}
				case 'impre': {
					if(editor.ImpreTmp){
						editor.ImpreTmp.move(p);			
					}
					break;
				}
				case 'papel': {
					if(editor.PapelTmp){
						editor.PapelTmp.move(p);				
					}
					break;
				}
				case 'incon': {
					if(editor.InconTmp){
						editor.InconTmp.move(p);						
					}
					break;
				}
				case 'tabla': {
					if(editor.TablaTmp){
						editor.TablaTmp.move(p);					
					}
					break;
				}
			}
		});
		$('#svg-div').click(function(e){
			var p = editor.obtPosMouse(e);
			var alpha;
			switch(editor.modo){
				case 'union': {
					var el = editor.estaContElement(p);
					if(el){
						p = editor.detPunEnPath(el.borde, p);
						alpha = editor.detAngEnPath(el.borde, p);
						if(editor.UnionTmp.p.length == 1){
							editor.UnionTmp.from = el;
							editor.UnionTmp.actSegPun(editor.r, p, alpha);
						}
						else if(editor.UnionTmp.p.length == 4){
							if(editor.UnionTmp.from.id != el.id){
								if((editor.UnionTmp.from.tipo != 'activ') || (el.tipo != 'activ')){
									editor.UnionTmp.to = el;								
									editor.UnionTmp.p[3] = p;
									
									var u = new Union(editor.r, editor.UnionTmp.p, editor.UnionTmp.from, editor.UnionTmp.to);
									
									editor.listUnion.push(u);
									
									editor.activarModo('puntero');
									editor.UnionTmp.remove();
									editor.UnionTmp = undefined;
								}
								else{
									alert(	'Una actividad no puede \n'+
											'estar unida a otra actividad.');
								}
							}
						}
					}
					break;
				}
				case 'undob': {
					var el = editor.estaContElement(p);
					if(el){
						p = editor.detPunEnPath(el.borde, p);
						alpha = editor.detAngEnPath(el.borde, p);
						if(editor.UnDobTmp.p.length == 1){
							editor.UnDobTmp.from = el;
							editor.UnDobTmp.actSegPun(editor.r, p, alpha);
						}
						else if(editor.UnDobTmp.p.length == 4){
							if(editor.UnDobTmp.from.id != el.id){
								if((editor.UnDobTmp.from.tipo != 'activ') || (el.tipo != 'activ')){
									editor.UnDobTmp.to = el;								
									editor.UnDobTmp.p[3] = p;
									
									var un = new UnDob(editor.r, editor.UnDobTmp.p, editor.UnDobTmp.from, editor.UnDobTmp.to);
									
									editor.listUnDob.push(un);
									
									editor.activarModo('puntero');
									editor.UnDobTmp.remove();
									editor.UnDobTmp = undefined;
								}
								else{
									alert(	'Una actividad no puede \n'+
											'estar unida a otra actividad.');
								}
							}
						}
					}
					break;
				}
				case 'activ': {
					if(editor.ActivTmp){
						var ac = new Activ(editor.r, p);
						editor.listActiv.push(ac);
						
						editor.activarModo('puntero');
						editor.ActivTmp.remove();
						editor.ActivTmp = undefined;
						
					}
					break;					
				}
				case 'depen': {
					if(editor.DepenTmp){
						var dp = new Depen(editor.r, p);
						editor.listDepen.push(dp);
						
						editor.activarModo('puntero');
						editor.DepenTmp.remove();
						editor.DepenTmp = undefined;
					}
					break;					
				}
				case 'archi': {
					if(editor.ArchiTmp){
						var a = new Archi(editor.r, p);
						editor.listArchi.push(a);
						
						editor.activarModo('puntero');
						editor.ArchiTmp.remove();
						editor.ArchiTmp = undefined;
					}
					break;					
				}
				case 'carpe': {
					if(editor.CarpeTmp){
						var c = new Carpe(editor.r, p);
						editor.listCarpe.push(c);
						
						editor.activarModo('puntero');
						editor.CarpeTmp.remove();
						editor.CarpeTmp = undefined;
					}
					break;					
				}
				case 'compu': {
					if(editor.CompuTmp){
						var c = new Compu(editor.r, p);
						editor.listCompu.push(c);
						
						editor.activarModo('puntero');
						editor.CompuTmp.remove();
						editor.CompuTmp = undefined;
					}
					break;					
				}
				case 'based': {
					if(editor.BaseDTmp){
						var b = new BaseD(editor.r, p);
						editor.listBaseD.push(b);
						
						editor.activarModo('puntero');
						editor.BaseDTmp.remove();
						editor.BaseDTmp = undefined;
					}
					break;					
				}
				case 'actbd': {
					if(editor.ActDBTmp){
						var a = new ActDB(editor.r, p);
						editor.listActDB.push(a);
						
						editor.activarModo('puntero');
						editor.ActDBTmp.remove();
						editor.ActDBTmp = undefined;
					}
					break;					
				}
				case 'docum': {
					if(editor.DocumTmp){
						var d = new Docum(editor.r, p);
						editor.listDocum.push(d);
						
						editor.activarModo('puntero');
						editor.DocumTmp.remove();
						editor.DocumTmp = undefined;
					}
					break;					
				}
				case 'docms': {
					if(editor.DocmsTmp){
						var ds = new Docms(editor.r, p);
						editor.listDocms.push(ds);
						
						editor.activarModo('puntero');
						editor.DocmsTmp.remove();
						editor.DocmsTmp = undefined;
					}
					break;					
				}
				case 'uentr': {
					if(editor.UEntrTmp){
						var ue = new UEntr(editor.r, p);
						editor.listUEntr.push(ue);
						
						editor.activarModo('puntero');
						editor.UEntrTmp.remove();
						editor.UEntrTmp = undefined;
					}
					break;					
				}
				case 'usale': {
					if(editor.USaleTmp){
						var us = new USale(editor.r, p);
						editor.listUSale.push(us);
						
						editor.activarModo('puntero');
						editor.USaleTmp.remove();
						editor.USaleTmp = undefined;
					}
					break;					
				}
				case 'impre': {
					if(editor.ImpreTmp){
						var im = new Impre(editor.r, p);
						editor.listImpre.push(im);
						
						editor.activarModo('puntero');
						editor.ImpreTmp.remove();
						editor.ImpreTmp = undefined;
					}
					break;					
				}
				case 'papel': {
					if(editor.PapelTmp){
						var pp = new Papel(editor.r, p);
						editor.listPapel.push(pp);
						
						editor.activarModo('puntero');
						editor.PapelTmp.remove();
						editor.PapelTmp = undefined;
					}
					break;					
				}			
				case 'incon': {
					if(editor.InconTmp){
						var ic = new Incon(editor.r, p);
						editor.listIncon.push(ic);
						editor.activarModo('puntero');
						editor.InconTmp.remove();
						editor.InconTmp = undefined;
					}
					break;					
				}
				case 'tabla': {
					if(editor.TablaTmp){
						var ta = new Tabla(editor.r, p);
						editor.listTabla.push(ta);
						
						editor.activarModo('puntero');
						editor.TablaTmp.remove();
						editor.TablaTmp = undefined;
						
					}
					break;					
				}
			}
		});
	},
	activarModo: function(modo){
		$('#'+editor.modo).removeClass('ui-state-hover');
		$('#'+modo).addClass('ui-state-hover');
		editor.modo = modo;
	},
	obtTamPan: function(){
		return {w: $('#svg-div').width(), h: $('#svg-div').height()};
	},
	modTamPan: function(w, h){
		$('#svg-div').width(w);
		$('#svg-div').height(h);
		$('#svg').width(w);
		$('#svg').height(h);
	},
	movObjs: function(dx, dy, exc){
		for( i in this.listUnion){
			this.listUnion[i].mover(dx, dy);
		}
		for( i in this.listUnDob){
			this.listUnDob[i].mover(dx, dy);
		}
		for( i in this.listUEntr){
			this.listUEntr[i].mover(dx, dy);
		}
		for( i in this.listUSale){
			this.listUSale[i].mover(dx, dy);
		}
		for( i in this.listActiv){
			this.listActiv[i].mover(dx, dy);
		}
		for( i in this.listDepen){
			this.listDepen[i].mover(dx, dy);
		}
		for( i in this.listArchi){
			this.listArchi[i].mover(dx, dy);
		}
		for( i in this.listCarpe){
			this.listCarpe[i].mover(dx, dy);
		}
		for( i in this.listCompu){
			this.listCompu[i].mover(dx, dy);
		}
		for( i in this.listBaseD){
			this.listBaseD[i].mover(dx, dy);
		}
		for( i in this.listActDB){
			this.listActDB[i].mover(dx, dy);
		}
		for( i in this.listDocum){
			this.listDocum[i].mover(dx, dy);
		}
		for( i in this.listDocms){
			this.listDocms[i].mover(dx, dy);
		}
		for( i in this.listImpre){
			this.listImpre[i].mover(dx, dy);
		}
		for( i in this.listPapel){
			this.listPapel[i].mover(dx, dy);
		}
		for( i in this.listIncon){
			this.listIncon[i].mover(dx, dy);
		}
		for( i in this.listTabla){
			this.listTabla[i].mover(dx, dy);
		}
	},
	estaContElement: function(p){
		var isCont = false;
		for( lc in editor.listUEntr){
			isCont = Raphael.isPointInsidePath(editor.listUEntr[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listUEntr[lc];
			}
		}
		for( lc in editor.listUSale){
			isCont = Raphael.isPointInsidePath(editor.listUSale[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listUSale[lc];
			}
		}
		for( lc in editor.listActiv){
			isCont = Raphael.isPointInsidePath(editor.listActiv[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listActiv[lc];
			}
		}
		for( lc in editor.listDepen){
			isCont = Raphael.isPointInsidePath(editor.listDepen[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listDepen[lc];
			}
		}
		for( lc in editor.listArchi){
			isCont = Raphael.isPointInsidePath(editor.listArchi[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listArchi[lc];
			}
		}
		for( lc in editor.listCarpe){
			isCont = Raphael.isPointInsidePath(editor.listCarpe[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listCarpe[lc];
			}
		}
		for( lc in editor.listCompu){
			isCont = Raphael.isPointInsidePath(editor.listCompu[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listCompu[lc];
			}
		}
		for( lc in editor.listBaseD){
			isCont = Raphael.isPointInsidePath(editor.listBaseD[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listBaseD[lc];
			}
		}
		for( lc in editor.listActDB){
			isCont = Raphael.isPointInsidePath(editor.listActDB[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listActDB[lc];
			}
		}
		for( lc in editor.listDocum){
			isCont = Raphael.isPointInsidePath(editor.listDocum[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listDocum[lc];
			}
		}
		for( lc in editor.listDocms){
			isCont = Raphael.isPointInsidePath(editor.listDocms[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listDocms[lc];
			}
		}
		for( lc in editor.listImpre){
			isCont = Raphael.isPointInsidePath(editor.listImpre[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listImpre[lc];
			}
		}
		for( lc in editor.listPapel){
			isCont = Raphael.isPointInsidePath(editor.listPapel[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listPapel[lc];
			}
		}
		for( lc in editor.listIncon){
			isCont = Raphael.isPointInsidePath(editor.listIncon[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listIncon[lc];
			}
		}
		for( lc in editor.listTabla){
			isCont = Raphael.isPointInsidePath(editor.listTabla[lc].borde, p.x, p.y);			
			if(isCont){
				return editor.listTabla[lc];
			}
		}
		return undefined;
	},
	obtPosMouse: function(e){
		var offset = $('#svg-div').offset();
		
		return p = {x: e.clientX - offset.left, 
					y: e.clientY - offset.top };
	},
	addtexteditor: function(el, ind, text){		
		var bb = el.fig[ind].getBBox();
		$("#panel").append(
		"<div id='texteditcont' class='svginput' style='"+
		"left:"+bb.x+"px;"+
		"top:"+bb.y+"px;"+
		"width:"+(bb.width+2)+"px;"+
		"height:"+(bb.height+2)+"px;"+
		"'>"+
		"<textarea id='"+el.id+"_"+ind+"_textedit' rows='1' class='textedit' style='"+
		"width:"+(bb.width+2)+"px;"+
		"height:"+(bb.height+2)+"px;"+
		"'>"+
		"</textarea>"+
		"<input id='text_bckp' type='hidden' "+
		"value='"+text+"' />"+
		"</div>"
		);
		
		$("#"+el.id+"_"+ind+"_textedit").focus();
		$("#"+el.id+"_"+ind+"_textedit").focusout(function() {
			var b, ind, tipoItem;
			var idEle = $(this).attr('id');
			b = idEle.lastIndexOf('_');
			idEle = idEle.substring(0,b);
			b = idEle.lastIndexOf('_');
			ind = idEle.substring(b+1);
			idEle = idEle.substring(0,b);
			b = idEle.lastIndexOf('_');
			tipoItem = idEle.substring(0,b);
			if($(this).val() == ''){
				$(this).val($('#text_bckp:first').val());
			}
			editor.busEleID(tipoItem, idEle).camTexto(ind, $(this).val());
			$("#texteditcont").remove();
		});
	},
	// fin de la Vista de Editor //
	busActiv: function(rol){
		var activs = [], rol_act;
		
		for(var i=0; i < editor.listActiv.length; i++){
			rol_act = workflow.convTexVar(editor.listActiv[i].rol);
			if(rol == rol_act){
				activs.push(editor.listActiv[i]);
			}
		}
		return activs;
	},
	busEleNom: function(nom){
		for(var i=0; i < editor.listActiv.length; i++){
			if(nom == editor.listActiv[i].nombre){
				return editor.listActiv[i];
			}
		}
		for(var i=0; i < editor.listUEntr.length; i++){
			if(nom == editor.listUEntr[i].nombre){
				return editor.listUEntr[i];
			}
		}
		for(var i=0; i < editor.listUSale.length; i++){
			if(nom == editor.listUSale[i].nombre){
				return editor.listUSale[i];
			}
		}
		for(var i=0; i < editor.listArchi.length; i++){
			if(nom == editor.listArchi[i].nombre){
				return editor.listArchi[i];
			}
		}
		for(var i=0; i < editor.listCarpe.length; i++){
			if(nom == editor.listCarpe[i].nombre){
				return editor.listCarpe[i];
			}
		}
		for(var i=0; i < editor.listCompu.length; i++){
			if(nom == editor.listCompu[i].nombre){
				return editor.listCompu[i];
			}
		}
		for(var i=0; i < editor.listBaseD.length; i++){
			if(nom == editor.listBaseD[i].nombre){
				return editor.listBaseD[i];
			}
		}
		for(var i=0; i < editor.listActDB.length; i++){
			if(nom == editor.listActDB[i].nombre){
				return editor.listActDB[i];
			}
		}
		for(var i=0; i < editor.listDocum.length; i++){
			if(nom == editor.listDocum[i].nombre){
				return editor.listDocum[i];
			}
		}
		for(var i=0; i < editor.listDocms.length; i++){
			if(nom == editor.listDocms[i].nombre){
				return editor.listDocms[i];
			}
		}
		for(var i=0; i < editor.listImpre.length; i++){
			if(nom == editor.listImpre[i].nombre){
				return editor.listImpre[i];
			}
		}
		for(var i=0; i < editor.listPapel.length; i++){
			if(nom == editor.listPapel[i].nombre){
				return editor.listPapel[i];
			}
		}
		for(var i=0; i < editor.listIncon.length; i++){
			if(nom == editor.listIncon[i].nombre){
				return editor.listIncon[i];
			}
		}
		for(var i=0; i < editor.listTabla.length; i++){
			if(nom == editor.listTabla[i].nombre){
				return editor.listTabla[i];
			}
		}
	},
	busEleID: function(tipo, id){
		switch(tipo){
			case 'union': {
				for(var i=0; i < editor.listUnion.length; i++){
					if(id == editor.listUnion[i].id){
						return editor.listUnion[i];
					}
				}
				break;
			}
			case 'undob': {
				for(var i=0; i < editor.listUnDob.length; i++){
					if(id == editor.listUnDob[i].id){
						return editor.listUnDob[i];
					}
				}
				break;
			}
			case 'uentr': {
				for(var i=0; i < editor.listUEntr.length; i++){
					if(id == editor.listUEntr[i].id){
						return editor.listUEntr[i];
					}
				}
				break;
			}
			case 'usale': {
				for(var i=0; i < editor.listUSale.length; i++){
					if(id == editor.listUSale[i].id){
						return editor.listUSale[i];
					}
				}
				break;
			}
			case 'activ': {
				for(var i=0; i < editor.listActiv.length; i++){
					if(id == editor.listActiv[i].id){
						return editor.listActiv[i];
					}
				}
				break;
			}
			case 'depen': {
				for(var i=0; i < editor.listDepen.length; i++){
					if(id == editor.listDepen[i].id){
						return editor.listDepen[i];
					}
				}
				break;
			}
			case 'archi': {
				for(var i=0; i < editor.listArchi.length; i++){
					if(id == editor.listArchi[i].id){
						return editor.listArchi[i];
					}
				}
				break;
			}
			case 'carpe': {
				for(var i=0; i < editor.listCarpe.length; i++){
					if(id == editor.listCarpe[i].id){
						return editor.listCarpe[i];
					}
				}
				break;
			}
			case 'compu': {
				for(var i=0; i < editor.listCompu.length; i++){
					if(id == editor.listCompu[i].id){
						return editor.listCompu[i];
					}
				}
				break;
			}
			case 'based': {
				for(var i=0; i < editor.listBaseD.length; i++){
					if(id == editor.listBaseD[i].id){
						return editor.listBaseD[i];
					}
				}
				break;
			}
			case 'actbd': {
				for(var i=0; i < editor.listActDB.length; i++){
					if(id == editor.listActDB[i].id){
						return editor.listActDB[i];
					}
				}
				break;
			}
			case 'docum': {
				for(var i=0; i < editor.listDocum.length; i++){
					if(id == editor.listDocum[i].id){
						return editor.listDocum[i];
					}
				}
				break;
			}
			case 'docms': {
				for(var i=0; i < editor.listDocms.length; i++){
					if(id == editor.listDocms[i].id){
						return editor.listDocms[i];
					}
				}
				break;
			}
			case 'impre': {
				for(var i=0; i < editor.listImpre.length; i++){
					if(id == editor.listImpre[i].id){
						return editor.listImpre[i];
					}
				}
				break;
			}
			case 'papel': {
				for(var i=0; i < editor.listPapel.length; i++){
					if(id == editor.listPapel[i].id){
						return editor.listPapel[i];
					}
				}
				break;
			}
			case 'incon': {
				for(var i=0; i < editor.listIncon.length; i++){
					if(id == editor.listIncon[i].id){
						return editor.listIncon[i];
					}
				}
				break;
			}
			case 'tabla': {
				for(var i=0; i < editor.listTabla.length; i++){
					if(id == editor.listTabla[i].id){
						return editor.listTabla[i];
					}
				}
				break;
			}
		}
		return undefined;
	},
	busUniID: function(id){
		for(i in editor.listUnion){
			if(id == editor.listUnion[i].id){
				return editor.listUnion[i];
			}
		}
		return undefined;
	},
	busRelAct: function(activ){
		var uniones = [];
		var el_origen = [];
		var el_destino = [];
		
		var el, rel, tam;
		
		el_origen.push(activ);
		
		while(el_origen.length > 0){
			for(var i in el_origen){
				el = el_origen[i];
				for(var j in el.listUnionFrom){
					rel = el.listUnionFrom[j];
					if(rel.to.tipo != 'activ'){
						uniones.push(rel);
						el_destino.push(rel.to);
					}
				}
			}
			el_origen = [];
			tam = el_destino.length;
			
			for(var i=0; i<tam; i++){
				el_origen.push(el_destino.shift());
			}
		}
		
		/*console.log(activ.nombre);
		console.log(uniones);
		console.log(el_origen);
		console.log(el_destino);*/
		
		return uniones;
	},
	busRelTieTotal: function(){
		var tiempo_tmp, total = 0;
		
		for(var i in this.listUnion){
			tiempo_tmp = new Tiempo();
			
			tiempo_tmp.adi_tie_texto(this.listUnion[i].tie_fin);
			console.log(tiempo_tmp.total_min());
			if(tiempo_tmp.total_min() > total){
				total = tiempo_tmp.total_min();
			}
		}
		return total;
	},
	busLista: function(tipo){
		switch(tipo){
			case 'uentr': {
				return editor.listUEntr;
				break;
			}
			case 'usale': {
				return editor.listUSale;
				break;
			}
			case 'activ': {
				return editor.listActiv;
				break;
			}
			case 'depen': {
				return editor.listDepen;
				break;
			}
			case 'archi': {
				return editor.listArchi;
				break;
			}
			case 'carpe': {
				return editor.listCarpe;
				break;
			}
			case 'compu': {
				return editor.listCompu;
				break;
			}
			case 'based': {
				return editor.listBaseD;
				break;
			}
			case 'actbd': {
				return editor.listActDB;
				break;
			}
			case 'docum': {
				return editor.listDocum;
				break;
			}
			case 'docms': {
				return editor.listDocms;
				break;
			}
			case 'impre': {
				return editor.listImpre;
				break;
			}
			case 'papel': {
				return editor.listPapel;
				break;
			}
			case 'incon': {
				return editor.listIncon;
				break;
			}
			case 'tabla': {
				return editor.listTabla;
				break;
			}
		}
		return undefined;
	},
	detPunEnPath: function(path, pt){
		var pp = editor.r.path(path).attr({'stroke': '#008ec7'});
		var tl = pp.getTotalLength();
		var pe, dif, id, men;
		var pr = [];
		var r = [];
		
		pr[0]  = 0;
		pr[10] = tl;
		
		for(var i=1; i < 10; i++){
			pr[i] = tl*(i/10)
		}	
		
		dif = pr[10] - pr[0];
		
		while(dif > 2){
			for(var i=0; i<10; i++){
				pe = pp.getPointAtLength((pr[i]+pr[i+1])/2);
				r.push(Math.sqrt(Math.pow(pe.x - pt.x,2)+Math.pow(pe.y - pt.y,2)));
			}
			
			men = Math.min.apply(Math, r);
			
			for(var i=0; i<10; i++){
				if(r[i] == men){
					id = i;
					break;
				}
			}
			pr[0] = pr[id];
			pr[10] = pr[id+1];
			pr[1] = (pr[0] + (pr[10]-pr[0])*(1/10));
			pr[2] = (pr[0] + (pr[10]-pr[0])*(2/10));		
			pr[3] = (pr[0] + (pr[10]-pr[0])*(3/10));
			pr[4] = (pr[0] + (pr[10]-pr[0])*(4/10));
			pr[5] = (pr[0] + (pr[10]-pr[0])*(5/10));
			pr[6] = (pr[0] + (pr[10]-pr[0])*(6/10));
			pr[7] = (pr[0] + (pr[10]-pr[0])*(7/10));
			pr[8] = (pr[0] + (pr[10]-pr[0])*(8/10));
			pr[9] = (pr[0] + (pr[10]-pr[0])*(9/10));
			
			dif = pr[10] - pr[0];
			r = [];
		}
		pe = pp.getPointAtLength(pr[5]);
		pp.animate({'stroke': '#fff'}, 500, function(){ this.remove()});
		return {x: pe.x, y: pe.y};
	},
	detAngEnPath: function(path, pt){
		var pp = editor.r.path(path);
		var tl = pp.getTotalLength();
		var pr = [];
		var pc, ang, cx = 0, cy = 0;
		
		for(var i=0; i < 50; i++){
			pr[i] = tl*(i/50)
			pc = pp.getPointAtLength(pr[i]);
			cx += pc.x;
			cy += pc.y;
		}
		pc = ({x: cx/50, y: cy/50});
		ang = Math.atan2( ( pc.y - pt.y), (pt.x - pc.x) );
		pp.remove();
		return ang;
	},
	detPorEnPath: function(path, porc){
		var pp = editor.r.path(path);
		var pt = pp.getPointAtLength(porc * pp.getTotalLength())
		pp.remove();
		pp = undefined;
		return pt; 
	},
	reiniciar: function(){
		var tam;
		
		this.UnionTmp = undefined;
		this.UnDobTmp = undefined;
		this.UEntrTmp = undefined;
		this.USaleTmp = undefined;
		this.ActivTmp = undefined;
		this.DepenTmp = undefined;
		this.ArchiTmp = undefined;
		this.CarpeTmp = undefined;
		this.CompuTmp = undefined;
		this.BaseDTmp = undefined;
		this.ActDBTmp = undefined;
		this.DocumTmp = undefined;
		this.DocmsTmp = undefined;
		this.ImpreTmp = undefined;
		this.PapelTmp = undefined;
		this.InconTmp = undefined;
		this.TablaTmp = undefined;
		
		this.ind = {};
		this.ind['union'] = 0;
		this.ind['undob'] = 0;
		this.ind['uentr'] = 0;
		this.ind['usale'] = 0;
		this.ind['activ'] = 0;
		this.ind['depen'] = 0;
		this.ind['archi'] = 0;
		this.ind['carpe'] = 0;
		this.ind['compu'] = 0;
		this.ind['based'] = 0;
		this.ind['actbd'] = 0;
		this.ind['docum'] = 0;
		this.ind['docms'] = 0;
		this.ind['impre'] = 0;
		this.ind['papel'] = 0;
		this.ind['incon'] = 0;
		this.ind['tabla'] = 0;
		
		tam = this.listUnion.length;
		for(var i = tam-1; i >=0; i--){
			this.listUnion[i].remove();
		}
		tam = this.listUnDob.length;
		for(var i = tam-1; i >=0; i--){
			this.listUnDob[i].remove();
		}
		tam = this.listDepen.length;
		for(var i = tam-1; i >=0; i--){
			this.listDepen[i].remove();
		}
		tam = this.listActiv.length;
		for(var i = tam-1; i >=0; i--){
			this.listActiv[i].remove();
		}
		tam = this.listUEntr.length;
		for(var i = tam-1; i >=0; i--){
			this.listUEntr[i].remove();
		}
		tam = this.listUSale.length;
		for(var i = tam-1; i >=0; i--){
			this.listUSale[i].remove();
		}
		tam = this.listArchi.length;
		for(var i = tam-1; i >=0; i--){
			this.listArchi[i].remove();
		}
		tam = this.listCarpe.length;
		for(var i = tam-1; i >=0; i--){
			this.listCarpe[i].remove();
		}
		tam = this.listCompu.length;
		for(var i = tam-1; i >=0; i--){
			this.listCompu[i].remove();
		}
		tam = this.listBaseD.length;
		for(var i = tam-1; i >=0; i--){
			this.listBaseD[i].remove();
		}
		tam = this.listActDB.length;
		for(var i = tam-1; i >=0; i--){
			this.listActDB[i].remove();
		}
		tam = this.listDocum.length;
		for(var i = tam-1; i >=0; i--){
			this.listDocum[i].remove();
		}
		tam = this.listDocms.length;
		for(var i = tam-1; i >=0; i--){
			this.listDocms[i].remove();
		}
		tam = this.listImpre.length;
		for(var i = tam-1; i >=0; i--){
			this.listImpre[i].remove();
		}
		tam = this.listPapel.length;
		for(var i = tam-1; i >=0; i--){
			this.listPapel[i].remove();
		}
		tam = this.listIncon.length;
		for(var i = tam-1; i >=0; i--){
			this.listIncon[i].remove();
		}
		tam = this.listTabla.length;
		for(var i = tam-1; i >=0; i--){
			this.listTabla[i].remove();
		}
		
		this.listUnion = [];
		this.listUnDob = [];
		this.listDepen = [];
		this.listActiv = [];
		this.listUEntr = [];
		this.listUSale = [];
		this.listArchi = [];
		this.listCarpe = [];
		this.listCompu = [];
		this.listBaseD = [];
		this.listActDB = [];
		this.listDocum = [];
		this.listDocms = [];
		this.listImpre = [];
		this.listPapel = [];
		this.listIncon = [];
		this.listTabla = [];
	}
});

$(function() {
	// Controlador del modulo Workflow //
	var panel = document.getElementById("svg-div");
	var r = Raphael(panel, $("#svg-div").width(), $("#svg-div").height());
	editor = new Editor(r);
	editor.activarModo(editor.modo);
	// Fin del Controlador //
});