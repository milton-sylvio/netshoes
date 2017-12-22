/**
 * Cache de Produtos adicionados ao carrinho.
 *
 * @StorageCart
 * @this {storage_review}
 * @param {storage_name} s Nome do Storage.
 * @param {storage_value} s Valor do Storage.
 */
var StorageCart = (function() {
	
	"use strict";
	
	// Varíaveis de configuração
	var s = {
		storage_name: 'cart',
		profile: "#myProfile",
	}, 
	total = 0,
	items = 0;

	var create = function( name, value ) {

		if (typeof(Storage) !== "undefined") {
			console.log( 'Code for localStorage/sessionStorage OK!!!' );

			var save_cart = true;

			/*if( UserProfile.isConnected() ){

				// console.log( 'User connected!' );
				var logged = $( s.profile ).attr( 'href' );

				$( s.box_reviews ).find("a").each(function(){ 
					if(this != undefined && this.href != undefined && this.href.match( logged )){
						save_cart = false;
						return;
					}
				});				
			}*/
			
			if( save_cart ) {
				var r = read( name );
				var sv = ( r === false ) ? value : update( name, r );

				save( name, sv );
			}
		} else {
		    console.log( 'Sorry! No Web Storage support..' );
		}
	};

	var save = function( name, value ) {

		localStorage.setItem( name, value );
	};

	var read = function( name ) {

	    var sa = localStorage.getItem( name ),
	    	s = ( sa === null || sa === undefined ) ? false : sa;

		return s;
	};

	var update = function( name, value ) {

	    var c = value.split(','),// pego os valores que estão ar
	    	cl = c.length,
	    	ads = storage_value.split( '|' ),
	    	local = ads[0], // pego os valores do anuncio que está sendo visitado
	    	infos;

		if( cl > 1 ) {
	    	for ( var i = 0; i < cl; i++ ) {
	    		if( c[i] !== undefined ) {
			    	infos = c[i].split( '|' );

			    	// Se o anuncio visitado já estiver no Storage, nos nao fazemos nada!
			    	if (infos[0] === local) {
			    		// console.log( 'Igual:', c[i] );
			    		return value;
			    	} 
	    		}
		    }

			if( cl === s.qtde_locais ) {
			    c.shift();
			}

    		c.push( storage_value );

    		return c;
		} else {
			infos = value.split( '|' );

			var new_val = ( infos[0] !== local ) ? value + "," + storage_value : value;

	    	return new_val;
		}
	};

	var erase = function( name, id_local ) {

		var c = read( name ),
			v = c.split(',');

		// console.log( 'Entrou no erase!', 'Valor do Storage: ' + c );

		// loop no storage para acharmos a empresa avaliada
		for (var i = 0; i < v.length; i++) {
			
			// apagamos ela do storage
			if (v[i].indexOf(id_local) === 0) {
				v.splice(i, 1); 
			}
		}
		
		if( c.length > 0 ) {
			// Se tivermos pelo menos um local no storage, apenas o atualizamos
			save( name, v );
		} else {
			// Senão, apagamos o storage
			localStorage.removeItem( name );
		}
	};

	var _dateFormat = function(){

	    var data = new Date();

	    var dia = data.getDate();
	    if (dia.toString().length == 1) {
	      dia = "0" + dia;
	    }

	    var mes = data.getMonth() + 1;
	    if (mes.toString().length == 1){
	      mes = "0" + mes;
	    }

	    var ano = data.getFullYear(); 

	    return dia + "/" + mes + "/" + ano;
	};

	return {
		create: create,
		read: read,
		save: save,
		update: update,
		erase: erase
	};
})();