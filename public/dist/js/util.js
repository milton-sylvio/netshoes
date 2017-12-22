'use strict';

/**
 * Scripts de uso geral.
 *
 * @Cart
 * @this {main}
 * @param {storage_name} s Nome do Storage.
 * @param {storage_value} s Valor do Storage.
 */
var Util = {

	// Ajax
	// ******************************************************
	verifyXmlHttp: function verifyXmlHttp() {

		console.log('Entrou no verifyXmlHttp');

		var xmlhttp = void 0;

		// Verifica se suporta XMLHttpRequest
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			// Adicionamos o ActiveXObject da Microsoft (para IE)
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}

		return xmlhttp;
	},

	// Formatação de valores para reais
	// ******************************************************
	formatCoin: function formatCoin(valor) {

		var inteiro = null,
		    decimal = null,
		    c = null,
		    j = null;
		var aux = new Array();
		valor = "" + valor;

		c = valor.indexOf(".", 0);

		//encontrou o ponto na string
		if (c > 0) {
			//separa as partes em inteiro e decimal
			inteiro = valor.substring(0, c);
			decimal = valor.substring(c + 1, valor.length);
			if (decimal.length === 1) {
				decimal += "0";
			}
		} else {
			inteiro = valor;
		}

		//pega a parte inteiro de 3 em 3 partes
		for (j = inteiro.length, c = 0; j > 0; j -= 3, c++) {
			aux[c] = inteiro.substring(j - 3, j);
		}

		//percorre a string acrescentando os pontos
		inteiro = "";
		for (c = aux.length - 1; c >= 0; c--) {
			inteiro += aux[c] + '.';
		}

		//retirando o ultimo ponto e finalizando a parte inteiro
		inteiro = inteiro.substring(0, inteiro.length - 1);

		decimal = parseInt(decimal);

		if (isNaN(decimal)) {
			decimal = "00";
		} else {
			decimal = "" + decimal;

			if (decimal.length === 1) {
				decimal = "0" + decimal;
			}
		}

		valor = '<strong>' + inteiro + "</strong>," + decimal;

		return valor;
	}
};
//# sourceMappingURL=util.js.map
