'use strict';

/**
 * Scripts de listagem de produtos e carrinho.
 *
 * @Cart
 * @this {main}
 * @param {storage_name} s Nome do Storage.
 * @param {storage_value} s Valor do Storage.
 */
var Cart = {

	// Variáveis
	cart_bt_delete: '.delete',
	cart_list_produtcts: '.cart-list-produtcts',
	list_products: 'listProdutos',
	total_items: 'totalItems',
	total_amount: 'totalAmount',
	total_installment: 'totalInstallment',
	data_product_id: '[data-product-id]',
	total: 0,
	items: 0,

	init: function init() {

		this.showProducts();
	},

	/** 
  * Ao carregar a página, pegamos os produtos do Json
  */
	showProducts: function showProducts() {

		var fileJson = '/data/products.json',
		    xmlhttp = Util.verifyXmlHttp();

		// Verificamos os estados da requisição
		xmlhttp.onreadystatechange = function () {

			// Verifica se a página foi carregada corretamente
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				var dadosJSON = void 0;

				try {
					dadosJSON = JSON.parse(xmlhttp.responseText);

					var products = dadosJSON.products,
					    div = document.getElementById('listProdutos'),
					    id = void 0,
					    sku = void 0,
					    title = void 0,
					    description = void 0,
					    available_sizes = void 0,
					    style = void 0,
					    price = void 0,
					    installments = void 0,
					    price_installments = void 0,
					    currency_id = void 0,
					    currency_format = void 0,
					    shipping = void 0;

					products.sort(function (a, b) {
						if (a.id < b.id) return -1;
						if (a.id > b.id) return 1;

						return 0;
					});

					products.forEach(function (prod) {

						id = prod.id;
						sku = prod.sku;
						title = prod.title;
						description = prod.description;
						available_sizes = prod.availableSizes;
						style = prod.style;
						price = Util.formatCoin(prod.price);
						installments = prod.installments;
						currency_id = prod.currencyId;
						currency_format = prod.currencyFormat;
						shipping = prod.isFreeShipping;

						price_installments = prod.price / installments;
						price_installments = parseFloat(price_installments.toFixed(2));
						price_installments = Util.formatCoin(price_installments);

						var listing = '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">\n\t\t\t\t\t\t\t<div id="product_id_' + id + '" data-qtde="' + installments + '" class="products">\n\t\t\t\t\t\t\t\t<div class="products-header">\n\t\t\t\t\t\t\t\t\t<img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Corinthians&w=180&h=230" alt="' + title + '">\n\t\t\t\t\t\t\t\t\t<span>' + title + '</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="products-infos">\n\t\t\t\t\t\t\t\t\t<span class="products-infos_price">' + currency_format + ' ' + price + '</span>\n\t\t\t\t\t\t\t\t\t<span class="products-infos_installments">ou ' + installments + 'x ' + currency_format + ' ' + price_installments + '</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="products-add-cart">\n\t\t\t\t\t\t\t\t\t<button class="bt bt-yellow bt-add-cart" data-product-id="' + id + '" data-toggle="sidebar-cart">Adicionar ao carrinho</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>';

						div.innerHTML += listing;
					});

					localStorage.setItem('products', JSON.stringify(products));

					Cart.actionAddCart();
				} catch (e) {
					eval("dadosJSON = (" + xmlhttp.responseText + ");");
					console.error('Algo deu errado: ' + e);
				}
			}
		};

		// Abre a requisição com o método e url
		xmlhttp.open('GET', fileJson, true);

		// Modifica o MimeType da requisição
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Envia os valores
		xmlhttp.send(null);
	},

	/** 
  * Ação para ativar o botão de adicionar um produto ao carrinho
  */
	actionAddCart: function actionAddCart() {
		var _this = this;

		// Botão de add item ao carrinho
		var data_attr = document.querySelectorAll('.bt-add-cart');

		data_attr.forEach(function (da) {
			// data_attr.onclick = addToCart;
			da.addEventListener('click', _this.addCart);
		});
	},

	/** 
  * Adicionar um produto ao carrinho
  */
	addCart: function addCart() {

		console.log('Adicionado');

		var cart_empty = document.getElementById('msgCart');
		cart_empty.classList.toggle('hide');

		var product_id = this.getAttribute('data-product-id'),
		    products = JSON.parse(localStorage.getItem('products')),
		    len = products.length,
		    p_i = products.id,
		    qty = 1,
		    k = void 0;

		function getProductById(id) {
			return products.filter(function (data) {
				return data.id == id;
			});
		}

		var found = getProductById(product_id);

		if (found.length > 0) {

			if (qty > 0) {

				setTimeout(function () {
					Cart.setCart(found[0].id, parseInt(qty), found[0].title, found[0].price, found[0].availableSizes, found[0].style);
				}, 500);
			} else {
				alert('Adicione ao menos 1 item ao seu carrinho!');
			}
		} else {
			alert('Oops! Algo errado aconteceu, por favor, tente novamente mais tarde...');
		}
	},

	/** 
  * Adicionar um produto no Storage
  */
	setCart: function setCart(id, qty, title, price, size, style) {
		var _this2 = this;

		var cart = JSON.parse(localStorage.getItem('cart')) != null ? JSON.parse(localStorage.getItem('cart')) : { items: [] },
		    current_prod = cart.items;

		// if( cart == undefined  || cart == null || cart == '' || current_prod.length == 0 ){
		// 	let cart_empty = document.getElementById( 'msgCart' );
		// 	cart_empty.classList.toggle('hide');

		// 	const sidebar_cart_footer = document.querySelector('.sidebar-cart-footer');
		// 	sidebar_cart_footer.classList.add('hide');

		// 	const cart_total = document.querySelector('.cart-total');
		// 	cart_total.classList.add('hide');
		// } else {
		function getProductById(id) {
			return current_prod.filter(function (data) {
				return data.id == id;
			});
		}

		var found = getProductById(id);

		if (found.length > 0) {
			found[0].qty = parseInt(found[0].qty + qty);
		} else {

			var prod = {
				id: id,
				qty: qty,
				title: title,
				price: price,
				size: size[0],
				style: style
			};

			cart.items.push(prod);
		}

		localStorage.setItem('cart', JSON.stringify(cart));

		this.getCart();
		SidebarCart.open();

		// Botão de excluir item do carrinho
		var bt_del = document.querySelectorAll(this.cart_bt_delete),
		    bts = bt_del.length;

		bt_del.forEach(function (bt) {
			bt.onmouseover = _this2.bntDeleteMouseAction;
			bt.onmouseout = _this2.bntDeleteMouseAction;
			bt.onclick = _this2.deleteItemCart;
		});
		// }
	},

	/** 
  * Pegamos os itens do Storage
  */
	getCart: function getCart() {

		var msg = '',
		    cart = JSON.parse(localStorage.getItem('cart')) != null ? JSON.parse(localStorage.getItem('cart')) : { items: [] },
		    wrapper = document.querySelector(this.cart_list_produtcts),
		    total = 0,
		    format_price = void 0;

		wrapper.innerHTML = '';

		if (cart == undefined || cart == null || cart == '' || cart.items.length == 0) {
			var cart_empty = document.getElementById('msgCart');
			cart_empty.classList.toggle('hide');

			document.querySelector('.sidebar-cart-footer, .cart-total').classList.toggle('hide');
		} else {
			var item = '',
			    c_i = cart.items;

			c_i.forEach(function (cart_items) {
				total = total + cart_items.qty * cart_items.price;
				format_price = Util.formatCoin(cart_items.price);

				item += '<div class="produtcts-row">\n\t\t\t\t<a role="button" class="delete" data-id="' + cart_items.id + '" title="Deseja remover este produto do carrinho?">&times;</a>\n\t\t\t\t<div class="produtcts-grid">\n\t\t\t\t<div class="cart-list-produtcts_img"><img src="https://placeholdit.imgix.net/~text?txtsize=55x55&txt=Camisa+Corinthians&w=50&h=50"></div>\n\t\t\t\t<div class="cart-list-produtcts_infos">\n\t\t\t\t<h4 class="product-title">' + cart_items.title + '</h4>\n\t\t\t\t<div class="cart-list-produtcts_infos_details">\n\t\t\t\t<span class="product-size">' + cart_items.size + '</span>\n\t\t\t\t<span class="product-color">' + cart_items.style + '</span>\n\t\t\t\t<span class="product-amount">Quantidade: ' + cart_items.qty + '</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="cart-list-produtcts_infos_price">\n\t\t\t\t<span class="product-price">R$ ' + format_price + '</span>\n\t\t\t\t</div></div></div><div class="overlay-delete"></div></div>';
			});

			wrapper.classList.toggle('hide');
			wrapper.innerHTML = item;

			var installment = total / 10;
			installment = Util.formatCoin(parseFloat(installment.toFixed(2)));
			document.getElementById(this.total_installment).innerHTML = 'ou em at\xE9 10x de R$ ' + installment;

			total = parseFloat(total.toFixed(2));
			total = Util.formatCoin(total);

			document.getElementById(this.total_amount).innerHTML = ' R$ ' + total;

			document.getElementById(this.total_items).innerHTML = c_i.length;
		}
	},

	/** 
  * Deletemas os itens do Storage
  */
	deleteItemCart: function deleteItemCart() {

		var conf = confirm('Deseja excluir esse produto?');

		if (conf) {
			var getProductById = function getProductById(id) {
				return cart_items.filter(function (data) {
					return data.id == id;
				});
			};

			var cart = JSON.parse(localStorage.getItem('cart')) != null ? JSON.parse(localStorage.getItem('cart')) : { items: [] },
			    id = this.getAttribute('data-id'),
			    cart_items = cart.items,
			    k = void 0;

			var found = getProductById(id);

			if (found.length > 0) {
				var remove = function remove(property, num, arr) {
					for (var i in arr) {
						if (arr[i][property] == num) arr.splice(i, 1);
					}
				};

				remove('id', id, cart_items);

				this.parentElement.remove();
			}

			localStorage.setItem('cart', JSON.stringify(cart));

			Cart.updateCart();
		}
	},

	updateCart: function updateCart() {

		var cart = JSON.parse(localStorage.getItem('cart')) != null ? JSON.parse(localStorage.getItem('cart')) : { items: [] },
		    cart_items = cart.items,
		    total = 0;

		if (cart == undefined || cart == null || cart == '' || cart_items.length == 0) {
			var cart_empty = document.getElementById('msgCart');
			cart_empty.classList.toggle('hide');

			var sidebar_cart_footer = document.querySelector('.sidebar-cart-footer');
			sidebar_cart_footer.classList.add('hide');

			var cart_total = document.querySelector('.cart-total');
			cart_total.classList.add('hide');
		} else {
			cart_items.forEach(function (items) {
				total = total + items.qty * items.price;
			});

			console.log('total', total);

			var installment = total / 10;
			installment = Util.formatCoin(parseFloat(installment.toFixed(2)));
			document.getElementById(this.total_installment).innerHTML = 'ou em at\xE9 10x de R$ ' + installment;

			total = parseFloat(total.toFixed(2));
			total = Util.formatCoin(total);
			document.getElementById(this.total_amount).innerHTML = ' R$ ' + total;

			document.getElementById(this.total_items).innerHTML = cart_items.length;
		}
	},

	/** 
  * Excluir items do Carrinho
  */
	bntDeleteMouseAction: function bntDeleteMouseAction(e) {

		var parent = this.parentElement,
		    class_list = parent.classList,
		    overlay = this.parentElement.querySelector('.overlay-delete');

		if (e.type == 'mouseover') {
			overlay.style.display = 'block';
			class_list.add("strikethrough");
		} else {
			class_list.remove("strikethrough");
			overlay.style.display = 'none';
		}
	}
};

Cart.init();
//# sourceMappingURL=cart.js.map
