var workflow;
var tiempo;
var roles;

var WorkFlow = Class.extend({
	init: function(){
	
		// Vista de WorkFlow //
		$(window).resize(function() {
			workflow.ajustar();
		});
		$(document).mousedown(function(e){
			if(e.which==2){
				return false;
			}
		});
		$('#panel').hover(
			function(){
				$(this).css('background-color', '#FFF');
			},
			function(){
				$(this).css('background-color', '#EEE');
			}
		);
		$('#servicios').tabs();
		$('#servicios').css('padding', '0em');
		$('#editor').css('padding', '0em');
		$('#abrir').button();
		$('#guardar').button();
		$('#calcular').button();
		// Fin de la Vista de WorkFlow //
	},
	// Vista de WorkFlow //
	ajustar: function(){
		var anchoWin = $(window).width();
		var altoWin = $(window).height();
		
		$('#contenedor').width(anchoWin);
		$('#contenedor').height(altoWin - 92);
		$('#calculos').height(altoWin - 92);
		$('#ayuda').height(altoWin - 92);
		
		$('#elementos').height(altoWin - 92);
		$('#panel').width(anchoWin - 160);
		$('#panel').height(altoWin - 92);
		
		var anchoSvgInf = $('#svg').width();
			if((anchoWin - 158) > anchoSvgInf){
				$('#svg-div').width(anchoWin - 158);
				$('#svg').width(anchoWin - 158);
			}
		var altoSvgInf = $('#svg').height();
			if((altoWin - 92) > altoSvgInf){
				$('#svg-div').height(altoWin - 92);
				$('#svg').height(altoWin - 92);
			}
	},
	vIE: function(){
		var IE = (navigator.appName=='Microsoft Internet Explorer')?parseFloat((new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})")).exec(navigator.userAgent)[1]):-1;
		if(IE == -1 || IE == 9){
			$('#alerta').css('display', 'none');
		}
	},
	// Fin de la Vista de WorkFlow //
	convTexVar: function(text){
		return text
			.toLowerCase()
			.replace(/[\u00F1]+/g,'nh')
			.replace(/[\u00E0-\u00E5]+/g,'a')
			.replace(/[\u00E8-\u00EB]+/g,'e')
			.replace(/[\u00EC-\u00EF]+/g,'i')
			.replace(/[\u00F2-\u00F6]+/g,'o')
			.replace(/[\u00F9-\u00FC]+/g,'u')
			.replace(/[^\w ]+/g,'')
			.replace(/ +/g,'_');
	}
});

var Unidad = Class.extend({
	init: function(){
		this.id = undefined;
		this.tipo = undefined;
		this.fig = undefined;
	},
	mover: function(dx, dy){
		this.fig.transform("...T" + dx + "," + dy);
		this.borde = this.fig.obtBorde();
	}
});

var Tiempo = Class.extend({
	init: function(){
		this.hh = 0;
		this.mm = 0;
	},
	adicionar: function(hh, mm){
		if(esNum(hh) && esNum(mm)){
			this.hh += (hh + parseInt((this.mm + mm) / 60));
			this.mm = (this.mm + mm) % 60;
		}
	},
	adi_tie_texto: function(texto){
		if(this.verificar(texto)){
			var t = texto.split(':');
			this.adicionar(Number(t[0]), Number(t[1]));
		}
	},
	adi_dur_texto: function(tie_ini_text, tie_fin_text){
		if(this.verificar(tie_ini_text) && this.verificar(tie_fin_text)){
			var ti = tie_ini_text.split(':');
			var tf = tie_fin_text.split(':');
			this.adicionar(Number(tf[0]), Number(tf[1]));
			this.restar(Number(ti[0]), Number(ti[1]));
		}
	},
	restar: function(hh, mm){
		if(esNum(hh) && esNum(mm)){
			if((this.mm - mm)>=0){
				this.hh -= hh;
				this.mm -= mm;
			}
			else{
				this.hh -= (hh + 1);
				this.mm = 60 + ((this.mm - mm) % 60);
			}
		}
	},
	acumulado: function(){
		return 	(this.hh < 10 ? '0' : '') + this.hh + ':' +
				(this.mm < 10 ? '0' : '') + this.mm;
	},
	total_min: function(){
		return (this.hh * 60) + this.mm;
	},
	verificar: function(texto){
		var t = texto.split(':');
		if(t.length == 2){
			if(esNum(t[0]) && esNum(t[1])){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
});

var Roles = Class.extend({
	init: function(){
		this.ind = {};
		this.cantidad = 0;
	},
	agregar: function(nombre){
		if(!this.existe(nombre)){
			this.ind[nombre] = 1;
			this.cantidad++;
		}
		else{
			this.ind[nombre]++;
		}
		this.actTabla();
	},
	valor: function(nombre){
		return (this.existe(nombre)) ? this.ind[nombre] : undefined;
	},
	existe: function(nombre){
		return this.ind.hasOwnProperty(nombre);
	},
	eliminar: function(nombre){
		if(this.existe(nombre)){
			if (this.valor(nombre) > 0){
				this.ind[nombre]--;
				if (this.valor(nombre) == 0){
					delete this.ind[nombre];
					this.cantidad--;
					this.actTabla();
				}
			}
		}
	},
	actTabla: function(){
		var id;
		var tabla = $('#tabla_nomina');
		tabla.find("tr:gt(0)").remove();
		for( var i in this.ind){
			id = workflow.convTexVar(i);
			tabla.append(
			"<tr>"+
				"<td>"+i+"</td>"+
				"<td><input type='text' id='"+id+"' name='"+id+"'value='0'/></td>"+
			"</tr>"
			);
		}
	}
});


function Curva(r, pm , attr){
	//pm = Parametros x, y, ax, ay, bx, by, zx, zy
	
	var attrCurva = {stroke: attr.color || '#000', "stroke-width": attr.stroke_width || 1, "stroke-linecap": "round"};
	var attrFlecha = {stroke: attr.color || '#000', "stroke-width": attr.stroke_width || 1, "fill": attr.color || '#000'};
	
	var ang = Math.atan2( ( pm.by - pm.zy), (pm.bx - pm.zx) );
	var p1 = {x: pm.zx, y: pm.zy};
	var p2 = {x: p1.x + 10*Math.cos(ang + Math.PI/8), y: p1.y + 10*Math.sin(ang + Math.PI/8)};
	var p3 = {x: p1.x + 10*Math.cos(ang - Math.PI/8), y: p1.y + 10*Math.sin(ang - Math.PI/8)};
	
	var fig = r.set();
	fig.pathCurve = [["M", pm.x, pm.y], ["C", pm.ax, pm.ay, pm.bx, pm.by, pm.zx, pm.zy]];
	fig.pathArrow = [["M", p1.x, p1.y], ["L", p2.x, p2.y], ["L", p3.x, p3.y], ["Z"]];
	fig.push(
		r.path(fig.pathCurve).attr(attrCurva),
		r.path(fig.pathArrow).attr(attrFlecha)
	);
	fig.modPm = function(pm){
		
		this.pathCurve[0][1] = pm[0].x;
		this.pathCurve[0][2] = pm[0].y;
		this.pathCurve[1][1] = pm[1].x;
		this.pathCurve[1][2] = pm[1].y;
		this.pathCurve[1][3] = pm[2].x;
		this.pathCurve[1][4] = pm[2].y;
		this.pathCurve[1][5] = pm[3].x;
		this.pathCurve[1][6] = pm[3].y;
		this[0].attr({path: this.pathCurve});
		
		var ang = Math.atan2( ( pm[2].y - pm[3].y), (pm[2].x - pm[3].x) );
		var p1 = {x: pm[3].x, y: pm[3].y};
		var p2 = {x: p1.x + 10*Math.cos(ang + Math.PI/8), y: p1.y + 10*Math.sin(ang + Math.PI/8)};
		var p3 = {x: p1.x + 10*Math.cos(ang - Math.PI/8), y: p1.y + 10*Math.sin(ang - Math.PI/8)};
		
		this.pathArrow = [["M", p1.x, p1.y], ["L", p2.x, p2.y], ["L", p3.x, p3.y], ["Z"]];
		this[1].attr({path: this.pathArrow});
	}
	return fig;
};

function CurvaDob(r, pm , attr){
	//pm = Parametros x, y, ax, ay, bx, by, zx, zy
	var ang, p1, p2, p3;
	var fig = r.set();
	
	var attrCurva = {stroke: attr.color || '#000', "stroke-width": attr.stroke_width || 1, "stroke-linecap": "round"};
	var attrFlecha = {stroke: attr.color || '#000', "stroke-width": attr.stroke_width || 1, "fill": attr.color || '#000'};
	
	fig.pathCurve = [["M", pm.x, pm.y], ["C", pm.ax, pm.ay, pm.bx, pm.by, pm.zx, pm.zy]];
	
	ang = Math.atan2( ( pm.ay - pm.y), (pm.ax - pm.x) );
	p1 = {x: pm.x, y: pm.y};
	p2 = {x: p1.x + 10*Math.cos(ang + Math.PI/8), y: p1.y + 10*Math.sin(ang + Math.PI/8)};
	p3 = {x: p1.x + 10*Math.cos(ang - Math.PI/8), y: p1.y + 10*Math.sin(ang - Math.PI/8)};
	
	fig.pathFleIni = [["M", p1.x, p1.y], ["L", p2.x, p2.y], ["L", p3.x, p3.y], ["Z"]];
	
	ang = Math.atan2( ( pm.by - pm.zy), (pm.bx - pm.zx) );
	p1 = {x: pm.zx, y: pm.zy};
	p2 = {x: p1.x + 10*Math.cos(ang + Math.PI/8), y: p1.y + 10*Math.sin(ang + Math.PI/8)};
	p3 = {x: p1.x + 10*Math.cos(ang - Math.PI/8), y: p1.y + 10*Math.sin(ang - Math.PI/8)};
	
	fig.pathFleFin = [["M", p1.x, p1.y], ["L", p2.x, p2.y], ["L", p3.x, p3.y], ["Z"]];
	fig.push(
		r.path(fig.pathCurve).attr(attrCurva),
		r.path(fig.pathFleIni).attr(attrFlecha),
		r.path(fig.pathFleFin).attr(attrFlecha)
	);
	fig.modPm = function(pm){
		var ang, p1, p2, p3;
		
		this.pathCurve[0][1] = pm[0].x;
		this.pathCurve[0][2] = pm[0].y;
		this.pathCurve[1][1] = pm[1].x;
		this.pathCurve[1][2] = pm[1].y;
		this.pathCurve[1][3] = pm[2].x;
		this.pathCurve[1][4] = pm[2].y;
		this.pathCurve[1][5] = pm[3].x;
		this.pathCurve[1][6] = pm[3].y;
		this[0].attr({path: this.pathCurve});
		
		ang = Math.atan2( ( pm[1].y - pm[0].y), (pm[1].x - pm[0].x) );
		p1 = {x: pm[0].x, y: pm[0].y};
		p2 = {x: p1.x + 10*Math.cos(ang + Math.PI/8), y: p1.y + 10*Math.sin(ang + Math.PI/8)};
		p3 = {x: p1.x + 10*Math.cos(ang - Math.PI/8), y: p1.y + 10*Math.sin(ang - Math.PI/8)};
		
		this.pathFleIni = [["M", p1.x, p1.y], ["L", p2.x, p2.y], ["L", p3.x, p3.y], ["Z"]];
		this[1].attr({path: this.pathFleIni});
		
		ang = Math.atan2( ( pm[2].y - pm[3].y), (pm[2].x - pm[3].x) );
		p1 = {x: pm[3].x, y: pm[3].y};
		p2 = {x: p1.x + 10*Math.cos(ang + Math.PI/8), y: p1.y + 10*Math.sin(ang + Math.PI/8)};
		p3 = {x: p1.x + 10*Math.cos(ang - Math.PI/8), y: p1.y + 10*Math.sin(ang - Math.PI/8)};
		
		this.pathFleFin = [["M", p1.x, p1.y], ["L", p2.x, p2.y], ["L", p3.x, p3.y], ["Z"]];
		this[2].attr({path: this.pathFleFin});
	}
	return fig;
};

function LinCurve(r, pm , atrLineas){
	var lineas = r.path(
		[["M", pm.x, pm.y], 
		 ["L", pm.ax, pm.ay], 
		 ["M", pm.bx, pm.by], 
		 ["L", pm.zx, pm.zy]]).attr(atrLineas);
		 
	lineas.modPm = function(pm){
		this.attr({path:[["M", pm[0].x, pm[0].y], 
						 ["L", pm[1].x, pm[1].y], 
						 ["M", pm[2].x, pm[2].y], 
						 ["L", pm[3].x, pm[3].y]]});
	}
	return lineas;
};

function refFigPadre(fig, padre){
	if(fig.type == "set"){
		fig.forEach(function(el){
			if(el.type == "set"){
				refFigPadre(el, padre);
			}
			else{
				el.padre = padre;
			}
		});
		fig.padre = padre;
	}
};

function abrir(){
	$.ajaxFileUpload
	(
		{
			url:'fileupload.php',
			secureuri:false,
			fileElementId:'file',
			dataType: 'xml',
			success: function (data, status)
			{
				if(typeof(data.error) != 'undefined')
				{
					if(data.error != '')
					{
						alert(data.error);
					}else
					{
						alert(data.msg);
					}
				}
				if(status == 'success'){
					asigModelo(data);
				}
			},
			error: function (data, status, e)
			{
				alert(e);
			}
		}
	)
	return false;
};

function guardar(){
	var el, pos, tam, pc;
	var modelo =
		'<?xml version="1.0"?>\n'+
		"<modelo ancho_svg='"+$('#svg').css('width')+"' alto_svg='"+$('#svg').css('height')+"'>\n"+
			'\t<list_depen>\n';
			
			for(var i in editor.listDepen){
				dp = editor.listDepen[i];
				pos = dp.pos();
				tam = dp.fig.obtTamCont();
				modelo += "\t\t<depen nombre='"+dp.nombre+"' titulo='"+dp.titulo+"' x='"+pos.x+"' y='"+pos.y+"' ancho='"+tam.width+"' alto='"+tam.height+"'>\n"+
				'\t\t</depen>\n';
			}
			
			modelo +=
			'\t</list_depen>\n'+
			'\t<list_activ>\n';
			
			for(var i in editor.listActiv){
				el = editor.listActiv[i];
				pos = el.pos();
				modelo += "\t\t<activ nombre='"+el.nombre+"' rol='"+el.rol+"' descri='"+el.descri+"' tiempo='"+el.tiempo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</activ>\n';
			}
			
			modelo +=
			'\t</list_activ>\n'+
			'\t<list_u_entr>\n';
			
			for(var i in editor.listUEntr){
				el = editor.listUEntr[i];
				pos = el.pos();
				modelo += "\t\t<u_entr nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</u_entr>\n';
			}
			
			modelo +=
			'\t</list_u_entr>\n'+
			'\t<list_u_sale>\n';
			
			for(var i in editor.listUSale){
				el = editor.listUSale[i];
				pos = el.pos();
				modelo += "\t\t<u_sale nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</u_sale>\n';
			}
			
			modelo +=
			'\t</list_u_sale>\n'+
			'\t<list_archi>\n';
			
			for(var i in editor.listArchi){
				el = editor.listArchi[i];
				pos = el.pos();
				modelo += "\t\t<archi nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</archi>\n';
			}
			
			modelo +=
			'\t</list_archi>\n'+
			'\t<list_carpe>\n';
			
			for(var i in editor.listCarpe){
				el = editor.listCarpe[i];
				pos = el.pos();
				modelo += "\t\t<carpe nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</carpe>\n';
			}
			
			modelo +=
			'\t</list_carpe>\n'+
			'\t<list_compu>\n';
			
			for(var i in editor.listCompu){
				el = editor.listCompu[i];
				pos = el.pos();
				modelo += "\t\t<compu nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</compu>\n';
			}
			
			modelo +=
			'\t</list_compu>\n'+
			'\t<list_based>\n';
			
			for(var i in editor.listBaseD){
				el = editor.listBaseD[i];
				pos = el.pos();
				modelo += "\t\t<based nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</based>\n';
			}
			
			modelo +=
			'\t</list_based>\n'+
			'\t<list_actbd>\n';
			
			for(var i in editor.listActDB){
				el = editor.listActDB[i];
				pos = el.pos();
				modelo += "\t\t<actbd nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</actbd>\n';
			}
			
			modelo +=
			'\t</list_actbd>\n'+
			'\t<list_docum>\n';
			
			for(var i in editor.listDocum){
				el = editor.listDocum[i];
				pos = el.pos();
				modelo += "\t\t<docum nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</docum>\n';
			}
			
			modelo +=
			'\t</list_docum>\n'+
			'\t<list_docms>\n';
			
			for(var i in editor.listDocms){
				el = editor.listDocms[i];
				pos = el.pos();
				modelo += "\t\t<docms nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</docms>\n';
			}
						
			modelo +=
			'\t</list_docms>\n'+
			'\t<list_impre>\n';
			
			for(var i in editor.listImpre){
				el = editor.listImpre[i];
				pos = el.pos();
				modelo += "\t\t<impre nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</impre>\n';
			}
			
			modelo +=
			'\t</list_impre>\n'+
			'\t<list_papel>\n';
			
			for(var i in editor.listPapel){
				el = editor.listPapel[i];
				pos = el.pos();
				modelo += "\t\t<papel nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</papel>\n';
			}
			
			modelo +=
			'\t</list_papel>\n'+
			'\t<list_incon>\n';
			
			for(var i in editor.listIncon){
				el = editor.listIncon[i];
				pos = el.pos();
				modelo += "\t\t<incon nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</incon>\n';
			}
			
			modelo +=
			'\t</list_incon>\n'+
			'\t<list_tabla>\n';
			
			for(var i in editor.listTabla){
				el = editor.listTabla[i];
				pos = el.pos();
				modelo += "\t\t<tabla nombre='"+el.nombre+"' titulo='"+el.titulo+"' x='"+pos.x+"' y='"+pos.y+"'>\n"+
				'\t\t</tabla>\n';
			}
			
			modelo +=
			'\t</list_tabla>\n'+
			'\t<list_union>\n';
			
			for(var i in editor.listUnion){
				un = editor.listUnion[i];
				pos = un.fig.p;
				pc = '[{x: '+pos[0].x+', y: '+pos[0].y+'},'+
					  '{x: '+pos[1].x+', y: '+pos[1].y+'},'+
					  '{x: '+pos[2].x+', y: '+pos[2].y+'},'+ 
					  '{x: '+pos[3].x+', y: '+pos[3].y+'}]';
					  
				modelo += "\t\t<union desde='"+un.from.nombre+"' hasta='"+un.to.nombre+"' tie_ini='"+un.tie_ini+"' tie_fin='"+un.tie_fin+"' pc='"+pc+"'>\n"+
				'\t\t</union>\n';
			}
			
			modelo +=
			'\t</list_union>\n'+
			'\t<list_undob>\n';
			
			for(var i in editor.listUnDob){
				un = editor.listUnDob[i];
				pos = un.fig.p;
				pc = '[{x: '+pos[0].x+', y: '+pos[0].y+'},'+
					  '{x: '+pos[1].x+', y: '+pos[1].y+'},'+
					  '{x: '+pos[2].x+', y: '+pos[2].y+'},'+ 
					  '{x: '+pos[3].x+', y: '+pos[3].y+'}]';
					  
				modelo += "\t\t<undob desde='"+un.from.nombre+"' hasta='"+un.to.nombre+"' pc='"+pc+"'>\n"+
				'\t\t</undob>\n';
			}
			
			modelo +=
			'\t</list_undob>\n'+
		'</modelo>';
	
	$.generateFile({
		filename	: 'model.wfl',
		content		: modelo,
		script		: 'download.php'
	});
};

function asigModelo(modelo){
	editor.reiniciar();
	
	var ancho_svg, alto_svg;
	var nombre, titulo, p, pc, tam, desde, hasta;
	
	$(modelo).find('modelo:first').each(function(){
		ancho_svg = $(this).attr('ancho_svg').replace('px','');
		alto_svg  = $(this).attr('alto_svg').replace('px','');
		ancho_svg = Number(ancho_svg);
		alto_svg = Number(alto_svg);
		editor.modTamPan(ancho_svg, alto_svg);
		
		$(this).find('list_depen:first').each(function(){
			$(this).find('depen').each(function(){
				nombre = $(this).attr('nombre');
				titulo = $(this).attr('titulo');
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				tam	   = {'ancho': Number($(this).attr('ancho')), 
						  'alto':  Number($(this).attr('alto'))};
				
				var dp = new Depen(editor.r, p, tam, titulo);
				editor.listDepen.push(dp);
			});
		});
		
		$(this).find('list_activ:first').each(function(){
			$(this).find('activ').each(function(){
				nombre = $(this).attr('nombre');
				rol = $(this).attr('rol');
				desc = $(this).attr('descri');
				tiem = $(this).attr('tiempo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var ac = new Activ(editor.r, p, rol, desc, tiem);
				editor.listActiv.push(ac);
			});
		});
		
		$(this).find('list_tabla:first').each(function(){
			$(this).find('tabla').each(function(){
				nombre = $(this).attr('nombre');
				titulo = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var ta = new Tabla(editor.r, p, titulo);
				editor.listTabla.push(ta);
			});
		});
		
		$(this).find('list_u_entr:first').each(function(){
			$(this).find('u_entr').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var ue = new UEntr(editor.r, p, titu);
				editor.listUEntr.push(ue);
			});
		});
		
		$(this).find('list_u_sale:first').each(function(){
			$(this).find('u_sale').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var us = new USale(editor.r, p, titu);
				editor.listUSale.push(us);
			});
		});
		
		$(this).find('list_archi:first').each(function(){
			$(this).find('archi').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var ar = new Archi(editor.r, p, titu);
				editor.listArchi.push(ar);
			});
		});
		
		$(this).find('list_carpe:first').each(function(){
			$(this).find('carpe').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var ca = new Carpe(editor.r, p, titu);
				editor.listCarpe.push(ca);
			});
		});
		
		$(this).find('list_compu:first').each(function(){
			$(this).find('compu').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var co = new Compu(editor.r, p, titu);
				editor.listCompu.push(co);
			});
		});
		
		$(this).find('list_based:first').each(function(){
			$(this).find('based').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var bd = new BaseD(editor.r, p, titu);
				editor.listBaseD.push(bd);
			});
		});
		
		$(this).find('list_actbd:first').each(function(){
			$(this).find('actbd').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var abd = new ActDB(editor.r, p, titu);
				editor.listActDB.push(abd);
			});
		});
		
		$(this).find('list_docum:first').each(function(){
			$(this).find('docum').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var doc = new Docum(editor.r, p, titu);
				editor.listDocum.push(doc);
			});
		});
		
		$(this).find('list_docms:first').each(function(){
			$(this).find('docms').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var dcs = new Docms(editor.r, p, titu);
				editor.listDocms.push(dcs);
			});
		});
		
		$(this).find('list_impre:first').each(function(){
			$(this).find('impre').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var im = new Impre(editor.r, p, titu);
				editor.listImpre.push(im);
			});
		});
		
		$(this).find('list_papel:first').each(function(){
			$(this).find('papel').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var pp = new Papel(editor.r, p, titu);
				editor.listPapel.push(pp);
			});
		});
		
		$(this).find('list_incon:first').each(function(){
			$(this).find('incon').each(function(){
				nombre = $(this).attr('nombre');
				titu = $(this).attr('titulo');
				
				p      = {'x': Number($(this).attr('x')),
				          'y': Number($(this).attr('y'))};
				
				var inc = new Incon(editor.r, p, titu);
				editor.listIncon.push(inc);
			});
		});
		
		$(this).find('list_union:first').each(function(){
			$(this).find('union').each(function(){
				
				desde = $(this).attr('desde');
				hasta = $(this).attr('hasta');
				tie_ini = $(this).attr('tie_ini');
				tie_fin = $(this).attr('tie_fin');
				
				pc      = $(this).attr('pc');
				eval('var pc='+pc);
				
				var un = new Union(editor.r, pc, 
					editor.busEleNom(desde),
					editor.busEleNom(hasta),
					tie_ini, tie_fin);
				editor.listUnion.push(un);
			});
		});
		
		$(this).find('list_undob:first').each(function(){
			$(this).find('undob').each(function(){
				
				desde = $(this).attr('desde');
				hasta = $(this).attr('hasta');
				
				pc      = $(this).attr('pc');
				eval('var pc='+pc);
				
				var un = new UnDob(editor.r, pc, 
					editor.busEleNom(desde),
					editor.busEleNom(hasta));
				editor.listUnDob.push(un);
			});
		});
		
		
	});
}

function calcular(){
	var nom, sueldo, val_min, tie_act, cos_act, tie_tra, cos_tra;
	var tie_tot_sal = 0, tie_tot_act = 0, cos_dia_sal = 0, cos_dia_act = 0;
	var activs, ruta;
	var tiempo_act, tiempo_tra, tiempo_tot;
	var tabla = $('#tabla_costeo');
	tabla.find("tr:gt(0)").remove();
	
	for( var el in roles.ind){
		tiempo_act = new Tiempo();
		tiempo_tra = new Tiempo();
		ruta = [];
		
		nom = workflow.convTexVar(el);
		sueldo = Number($('#'+nom).val());
		val_min = roundDec(sueldo/124800,2);
		activs = editor.busActiv(nom);
		for(var i in activs){
			tiempo_act.adi_tie_texto(activs[i].tiempo);
			ruta = editor.busRelAct(activs[i]);
			
			for(var j in ruta){
				tiempo_tra.adi_dur_texto(ruta[j].tie_ini, ruta[j].tie_fin);
			}
		}
		tie_act = tiempo_act.acumulado()
		tie_tot_act += tiempo_act.total_min();
		cos_act = roundDec(tiempo_act.total_min() * val_min, 2);
		cos_dia_act += cos_act;
		
		tie_tra = tiempo_tra.acumulado();
		tie_tot_sal += tiempo_tra.total_min();
		cos_tra = roundDec(tiempo_tra.total_min() * val_min, 2);
		cos_dia_sal += cos_tra;
				
		tabla.append(
			'<tr>'+
				'<td>'+ el +'</td>'+
				'<td>'+ sueldo +'</td>'+
				'<td>'+ val_min +'</td>'+
				'<td>'+ tie_act +'</td>'+
				'<td>'+ cos_act +'</td>'+
				'<td>'+ tie_tra +'</td>'+
				'<td>'+ cos_tra +'</td>'+
			'</tr>'
		);
	}
	
	var n_elementos;
	
	n_elementos = 	editor.listArchi.length+
					editor.listCarpe.length+
					editor.listCompu.length+
					editor.listBaseD.length+
					editor.listActDB.length+
					editor.listDocum.length+
					editor.listDocms.length+
					editor.listImpre.length+
					editor.listPapel.length+
					editor.listIncon.length;
	
	tiempo_act = new Tiempo();
	tiempo_tra = new Tiempo();
	tiempo_tot = new Tiempo();
	
	tiempo_act.adi_tie_texto('00:'+tie_tot_act);
	tiempo_tra.adi_tie_texto('00:'+tie_tot_sal);
	
	tiempo_tot.adi_tie_texto('00:'+editor.busRelTieTotal());
	
	$('#total_actis').find("td:eq(2)").html(editor.listActiv.length);
	$('#total_roles').find("td:eq(2)").html(roles.cantidad);
	$('#total_eleme').find("td:eq(2)").html(n_elementos);
	$('#total_t_sal').find("td:eq(2)").html(tiempo_tra.acumulado());
	$('#total_t_act').find("td:eq(2)").html(tiempo_act.acumulado());
	$('#total_t_pro').find("td:eq(2)").html(tiempo_tot.acumulado());
	$('#total_c_sal').find("td:eq(2)").html(roundDec(cos_dia_sal,2));
	$('#total_c_act').find("td:eq(2)").html(roundDec(cos_dia_act,2));
	$('#total_c_tra').find("td:eq(2)").html(roundDec(cos_dia_act + cos_dia_sal, 2));
};

function roundDec(num,dec){
    var fac=Math.pow(10,dec);
    return Math.round(num*fac)/fac;
}

function esNum(num){
	return !isNaN(num);
}


$(document).ready(function(){
	// Controlador de WorkFlow //	
	workflow = new WorkFlow();
	workflow.vIE();
	workflow.ajustar();
	
	tiempo = new Tiempo();
	roles = new Roles();
	
	$('#file').change(function(e){
		abrir();
		e.preventDefault();
	});
	
	$('#guardar').click(function(e){
		guardar();
		e.preventDefault();
	});
	
	// Fin de Controlador de WorkFlow //
});
