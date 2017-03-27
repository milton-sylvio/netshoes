var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var dir = ''

var contentTypes = {
	'html' : 'text/html',
	'css'  : 'text/css',
	'ico'  : 'image/x-icon',
	'png'  : 'image/png',
	'svg'  : 'image/svg+xml',
	'js'   : 'application/javascript',
	'otf'  : 'application/x-font-otf',
	'ttf'  : 'application/x-font-ttf',
	'eot'  : 'application/vnd.ms-fontobject',
	'woff' : 'application/x-font-woff',
	'woff2': 'application/font-woff2',
	'zip'  : 'application/zip'
}

http.createServer( function ( pedido, resposta ) {

	var caminho = url.parse( pedido.url ).pathname;

	if ( caminho === '/' ) {
		dir = path.join( __dirname, '', caminho, 'index.html' );
   	} else {
     	dir = path.join( __dirname, '', caminho );
   	}

	console.log( 'path = ' + caminho );

	fs.readFile( dir, function ( erro, dados ) {
	  	if ( erro ) {
	    	resposta.writeHead(404);
	    	resposta.end();
	  	} else {
	    	var extensao = path.extname(dir).slice(1);
	    	resposta.setHeader( 'Content-Type', contentTypes[extensao] );
	    	resposta.end(dados);
	  	}
	});
}).listen( 3000, 'localhost', function () {
	console.info('--- O servidor Ok –--');
});

