/**
 * Script que exibe conteúdos em "sidebar's"
 */
var SidebarCart = function (){

	"use strict";

	// Varíaveis globais
	var s = {
		activator: '[data-toggle="sidebar-cart"]',
		sidebar: '.sidebar-cart',
		sidebar_cart_side: "sidebar-left",
		// sidebar_cart_position_default: 'left',
		// sidebar_cart_position_right: 'right',
		sidebar_cart_backdrop: ".sidebar-cart-backdrop",
		bt_fechar_sidebar_cart: ".sidebar-cart-close",
	},
	ani,
	elem = document.querySelector( s.sidebar ),
	is_open = false,
	backdrop = document.querySelector( s.sidebar_cart_backdrop );

	/** 
	 * Inicialização do plugin 
	 */
	var init = function() {

		document.querySelector( s.sidebar_cart_backdrop ).onclick = close;
	};

	/** 
	 * Ao clicar no botao/link, se nao 
	 * estiver visivel, aparece o sidebar 
	 */
	var open = function(){

		console.info( 'Entrou no open' );

		// target = this.getAttribute( 'data-target' );
		// side = this.getAttribute( 'data-side' );

		// if( is( elem, ":hidden" ) === true ){
		if( elem.classList.contains( 'active' ) ) {
			elem.classList.remove( 'active' );
		}
			//side = setSide( elem );

		elem.classList.add( 'active' ); 

		window.setTimeout(function(){
			elem.style.display = 'block';
			elem.style.right = 0;
		}, 700);

		// if( side === 'left' ) {
		// 	ani.style.left = 0;
		// } else {
		// 	ani.style.right = 0;
		// }

		window.setTimeout(function(){
			is_open = true;
			backdrop.classList.add('in'); 
		}, 350);
	};

	/** 
	 * Ao clicar no botao do voltar, se 
	 * estiver visivel, esconde o menu 
	 */
	var close = function() {

		if( elem.classList.contains( 'active' ) ){

			window.setTimeout(function(){
				elem.style.right = '-100%';
				elem.style.display = 'none';
			}, 350);

			// if( side === 'left' ) {
			// 	el.animate({ left: size }, speed);
			// } else {
			// 	ani = el.animate({ right: size }, speed);
			// }

			window.setTimeout(function(){
				is_open = false;
				backdrop.classList.remove("in");
			}, 700);
		}
	};

	/**
	 * Identificar de qual lado deve vir o conteúdo
	 * @param {string} elem - Elemento alvo.
	 */
	/*var setSide = function(elem) {

		return ( elem.hasClass( s.sidebar_nav_side ) ) ? s.sidebar_nav_position_default : s.sidebar_nav_position_right;
	};*/

	return {
		init: init,
		s: s,
		open: open,
	}
}();

SidebarCart.init();
