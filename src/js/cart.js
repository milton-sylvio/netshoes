/**
 * Scripts de uso geral.
 *
 * @Cart
 * @this {main}
 * @param {storage_name} s Nome do Storage.
 * @param {storage_value} s Valor do Storage.
 */
var Cart = (function () {

	"use strict";

	// Variáveis de CSS
	var s = {
		class: {
			cart_bt_delete: '.delete',
			cart_overlay_delete: '.overlay-delete',
			bt_add_cart: '.bt-add-cart',
			cart_list_produtcts: '.cart-list-produtcts'
		},
		ids: {
			list_products: 'listProdutos',
			total_items: 'totalItems',
			total_amount: 'totalAmount',
			total_installment: 'totalInstallment',
		},
		data_attr: {
			data_product_id: '[data-product-id]',
		}
	},
	// cart = ( JSON.parse( localStorage.getItem('cart') ) != null ) ? JSON.parse( localStorage.getItem('cart') ) : { items: [] },
	url_file_json = '/dist/js/data/products.json', 
	total = 0, 
	items = 0;

	var init = function(){

		listProducts();
		actions();
		
		// var cart = ( JSON.parse( localStorage.getItem('cart') ) != null ) ? JSON.parse( localStorage.getItem('cart') ) : { items: [] };

		// if( cart.items != undefined && cart.items != null && cart.items != '' && cart.items.length > 0 ){
		// 	var n;
		// 	for( n in cart.items) {
		// 	   items = ( items + n.qty )
		// 	   total = total  + ( n.qty * n.price )
		// 	};
		// }

		// document.getElementById( s.ids.total_items ).innerHTML = items;
		// document.getElementById( s.ids.total_amount ).innerHTML = 'R$ ' + total;

		// var installment = total / 10;
		// document.getElementById( s.ids.total_installment ).innerHTML = 'ou em até 10 X R$ ' + installment;
	};

	window.onload = function () {

		// Botão de add item ao carrinho
		var data_attr = document.querySelectorAll( s.class.bt_add_cart ), i;

		for (i = 0; i < data_attr.length; ++i) {
			// data_attr.onclick = addToCart;
			data_attr[i].addEventListener( 'click', addCart );
		}
	};

	var actions = function(){

	};

	/** 
	 * Ao carregar a página, pegamos os produtos do Json
	 */
	var listProducts = function(){

		readJson( url_file_json, function( err, data ) {

			if ( err != null ) {
				console.error( 'Algo deu errado: ' + err );
			} else {
				var products = data.products, 
					key, id, sku, title, description, available_sizes, style, price, installments, price_installments, currency_id, currency_format, shipping, listing;

				products.sort(function(a, b){
				    if(a.id < b.id) return -1;
				    if(a.id > b.id) return 1;

				    return 0;
				});

				for ( key in products ) {

					id = products[key].id;
					sku = products[key].sku;
					title = products[key].title;
					description = products[key].description;
					available_sizes = products[key].availableSizes;
					style = products[key].style;
					price = formatCoin( products[key].price );
					installments = products[key].installments;
					currency_id = products[key].currencyId;
					currency_format = products[key].currencyFormat;
					shipping = products[key].isFreeShipping;

					price_installments = products[key].price / installments;
					price_installments = parseFloat( price_installments.toFixed(2) );
					price_installments = formatCoin( price_installments );

					listing = '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">';
						listing += '<div id="product_id_'+ id +'" data-qtde="'+ installments +'" class="products">';
							listing += '<div class="products-header">';
								listing += '<img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Curica&w=180&h=230" alt="' + title + '">';
								listing += '<span>' +  title + '</span>';
							listing += '</div>';
							// listing += '<div class="products-description">'+  description +'</div>';
							listing += '<div class="products-infos">';
								listing += '<span class="products-infos_price">'+ currency_format + ' ' + price + '</span>';
								listing += '<span class="products-infos_installments">ou ' + installments + 'x ' + currency_format + ' ' + price_installments + '</span>';
								// if( shipping == true ) {
								// 	listing += '<span class="products-infos_install">Frete Grátis</span>';
								// }
							listing += '</div>';
							listing += '<div class="products-add-cart">';
								listing += '<button class="bt bt-yellow bt-add-cart" data-product-id="'+ id +'" data-toggle="sidebar-cart">Adicionar ao carrinho</button>';
							listing += '</div>';
						listing += '</div>';
					listing += '</div>';

					document.getElementById( s.ids.list_products ).innerHTML += listing;
				}

				localStorage.setItem( 'products', JSON.stringify( products ) );
			}
		});
	};

	/** 
	 * Adicionar um produto ao carrinho
	 */
	var addCart = function () {

		var product_id = this.getAttribute( 'data-product-id' ),
			products = JSON.parse( localStorage.getItem( 'products' ) ), 
			len = products.length,
			p_i = products.id,
			qty = 1,
			k;
		
		function getProductById(id) {
			return products.filter(
				function(data) {
					return data.id == id
				}
			);
		}

		var found = getProductById( product_id );

		if( found.length > 0 ) {

			if (qty > 0) {
				setTimeout(function(){
					setCart( found[0].id, parseInt(qty), found[0].title, found[0].price, found[0].availableSizes, found[0].style );
				}, 2000);
			} else {
				alert( 'Adicione ao menos 1 item ao seu carrinho!' );
			}

				// return;
			} else{
				alert( 'Oops! Algo errado aconteceu, por favor, tente novamente mais tarde...' );
			}		
	};

	/** 
	 * Adicionar um produto no Storage
	 */
	var setCart = function ( id, qty, title, price, size, style ) {

		var cart = ( JSON.parse( localStorage.getItem('cart') ) != null ) ? JSON.parse( localStorage.getItem('cart') ) : { items: [] },
			current_prod = cart.items, 
			k;

		function getProductById(id) {
			return current_prod.filter(
				function(data) {
					return data.id == id
				}
			);
		}

		var found = getProductById( id );

		if( found.length > 0 ) {
			console.log( 'current_prod.qty: ' + found[0].qty, 'qty: ' + qty );
			found[0].qty = parseInt( found[0].qty + qty );
			console.log( 'found[0].qty: ' + found[0].qty );

		} else {

			var prod = {
				id: id,
				qty: qty,
				title: title,
				price: price,
				size: size[0],
				style: style
			};

			cart.items.push( prod );
		}

		localStorage.setItem( 'cart', JSON.stringify( cart ) );

		getCart();
		SidebarCart.open();

		// Botão de excluir item do carrinho
		var bt_del = document.querySelectorAll( s.class.cart_bt_delete ), j;

		for (j = 0; j < bt_del.length; ++j) {
			bt_del[j].onmouseover = bntDeleteMouseAction;
			bt_del[j].onmouseout = bntDeleteMouseAction;
			bt_del[j].onclick = deleteItemCart;
		}
	};

	/** 
	 * Pegamos os itens do Storage
	 */
	var getCart = function () {

		var msg = '', 
			cart = ( JSON.parse( localStorage.getItem('cart') ) != null ) ? JSON.parse( localStorage.getItem('cart') ) : { items: [] },
			wrapper = document.querySelector( s.class.cart_list_produtcts ), 
			total = 0;

			wrapper.innerHTML = '';

		if( cart == undefined  || cart == null || cart == '' || cart.items.length == 0 ){
			var cart_empty = document.getElementById( 'msgCart' );
			cart_empty.innerHTML = 'Seu carrinho está vazio';
			cart_empty.classList.toggle('hide');
		} else {
			var item = '', 
				c_i = cart.items,
				n;

			//for( n in cart.items ) {
			for( n = 0; n < c_i.length; n++ ) {
	
			   	total = total + ( c_i[n].qty * c_i[n].price );

				item += '<div class="produtcts-row">';
				item += '<a role="button" class="delete" data-id="' + c_i[n].id + '" title="Deseja remover este produto do carrinho?">&times;</a>';
				item += '<div class="produtcts-grid">';
				item += '<div class="cart-list-produtcts_img"><img src="https://placeholdit.imgix.net/~text?txtsize=55x55&txt=Curica&w=50&h=50"></div>';
				item += '<div class="cart-list-produtcts_infos">';
				item += '<h4 class="product-title">' + c_i[n].title + '</h4>';
				item += '<div class="cart-list-produtcts_infos_details">';
				item += '<span class="product-size">' + c_i[n].size + '</span>';
				item += '<span class="product-color">' + c_i[n].style + '</span>';
				item += '<span class="product-amount">Quantidade: ' + c_i[n].qty + '</span>';
				item += '</div>';
				item += '<div class="cart-list-produtcts_infos_price">';
				item += '<span class="product-price">' + formatCoin( c_i[n].price ) + '</span>';
				item += '</div></div></div><div class="overlay-delete"></div></div><!-- /.produtcts-row -->';

				console.log( 'total:', total);
			};

			wrapper.classList.toggle('hide');
			wrapper.innerHTML = item;

			var installment = total / 10;
			installment = parseFloat( installment.toFixed(2) );
			installment = formatCoin( installment );
			document.getElementById( s.ids.total_installment ).innerHTML = 'ou em até 10x de R$ ' + installment;

			total = parseFloat( total.toFixed(2) );
			total = formatCoin( total );

			document.getElementById( s.ids.total_amount ).innerHTML = ' R$ ' + total;

			document.getElementById( s.ids.total_items ).innerHTML = cart.items.length;
		}
	};

	var deleteItemCart = function(){

		console.log( 'Entrou' );

		var conf = confirm('Deseja excluir esse produto?')
		if( conf ){
			var cart = ( JSON.parse( localStorage.getItem('cart') ) != null ) ? JSON.parse( localStorage.getItem('cart') ) : { items: [] },
				id = this.getAttribute( 'data-id' ),
				cart_items = cart.items,
				k;

			function getProductById(id) {
				return cart_items.filter(
					function(data) {
						return data.id == id;
					}
				);
			}

			var found = getProductById( id );

			if( found.length > 0 ) {

				function remove(property, num, arr) {
				    for (var i in arr) {
				        if (arr[i][property] == num)
				            arr.splice(i, 1);
				    }
				}

				remove('id', id, cart_items);

				this.parentElement.remove();

			// 			cart_items.splice(k, 1); 
			}

			localStorage.setItem( 'cart', JSON.stringify(cart) );
		}
	};

	/** 
	 * Leitura do arquivo de produtos em Json
	 */
	var readJson = function( url, callback ) {

		var xhr = new XMLHttpRequest();

		xhr.open( 'GET', url, true );
		xhr.responseType = 'json';

		xhr.onload = function() {

			var status = xhr.status;

			if ( status == 200 ) {
				callback( null, xhr.response );
			} else {
				callback( status );
			} 
		};

		xhr.send();
	};

	/** 
	 * Excluir items do Carrinho
	 */
	var bntDeleteMouseAction = function (e) {

		var parent = this.parentElement,
			class_list = parent.classList,
			overlay = this.parentElement.querySelector( s.class.cart_overlay_delete );

		if( e.type == 'mouseover' ) {
			overlay.style.display = 'block';
			class_list.add("strikethrough");
		} else {
			class_list.remove("strikethrough");
			overlay.style.display = 'none';
		}
	};

	/** 
	 * Formatação de valores para reais
	 */
	var formatCoin = function( valor ) {

		var inteiro = null, decimal = null, c = null, j = null;
		var aux = new Array();
		valor = "" + valor;

		c = valor.indexOf( ".", 0 );

		//encontrou o ponto na string
		if(c > 0){
			//separa as partes em inteiro e decimal
			inteiro = valor.substring( 0, c );
			decimal = valor.substring(c + 1, valor.length );
			if( decimal.length === 1 ) {
				decimal += "0";
			}
		} else {
			inteiro = valor;
		}

		//pega a parte inteiro de 3 em 3 partes
		for (j = inteiro.length, c = 0; j > 0; j-=3, c++){
			aux[c] = inteiro.substring( j-3, j );
		}

		//percorre a string acrescentando os pontos
		inteiro = "";
		for(c = aux.length-1; c >= 0; c--){
			inteiro += aux[c] + '.';
		}
		//retirando o ultimo ponto e finalizando a parte inteiro

		inteiro = inteiro.substring(0,inteiro.length-1);

		decimal = parseInt(decimal);

		if(isNaN(decimal)){
			decimal = "00";
		} else {
			decimal = "" + decimal;

			if(decimal.length === 1){
				decimal = "0" + decimal;
			}
		}

		valor =  '<strong>' + inteiro + "</strong>," + decimal;
		
		return valor;
	};

	return {
		init: init
	}
})();

Cart.init();