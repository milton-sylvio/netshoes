/**
 * Script que exibe conteúdos no "sidebar"
 */
const SidebarCart = {

	// Varíaveis globais
	activator: '[data-toggle="sidebar-cart"]',
	// bt_fechar_sidebar_cart: ".sidebar-cart-close",
	elem: document.querySelector( '.sidebar-cart' ),
	is_open: false,
	backdrop: document.querySelector( '.sidebar-cart-backdrop' ),
	timeout_max: 500,
	timeout_min: 200,

	/** 
	 * Inicialização do plugin 
	 */
	init: function() {

		this.backdrop.onclick = this.close;
	},

	/** 
	 * Ao clicar no botao/link, se nao 
	 * estiver visivel, aparece o sidebar 
	 */
	open: function(){

		let el = this.elem;

		// if( is( elem, ":hidden" ) === true ){
		if( el.classList.contains( 'active' ) ) {
			el.classList.remove( 'active-' );
		}

		el.classList.add( 'active' ); 

		window.setTimeout(function(){
			el.style.display = 'block';
			el.style.right = 0;
		}, this.timeout_max);

		window.setTimeout(function(){
			this.is_open = true;

			const bd = SidebarCart.backdrop;
			bd.classList.add('in'); 
		}, this.timeout_min);
	},

	/** 
	 * Ao clicar no botao do voltar, se 
	 * estiver visivel, esconde o menu 
	 */
	close: function() {

		let el = SidebarCart.elem;

		if( el.classList.contains( 'active' ) ){

			window.setTimeout(function(){
				el.style.right = '-100%';
				el.style.display = 'none';
			}, this.timeout_min);


			window.setTimeout(function(){
				this.is_open = false;

				const bd = SidebarCart.backdrop;
				bd.classList.remove("in");
			}, this.timeout_max);
		}
	}
};

SidebarCart.init();
