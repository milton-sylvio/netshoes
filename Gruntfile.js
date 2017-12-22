module.exports = function( grunt ) {
 	
 	// require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'), 
		
		babel: {
	        options: {
	        	// compact: true,
	            // minified: true,
	            sourceMap: true,
	            presets: ['env']
	        },
	        dist: {
	            files: {
	                'public/dist/js/util.js' : 	'public/src/js/util.jsx',
	                'public/dist/js/cart.js' : 'public/src/js/cart.jsx',
	                'public/dist/js/sidebar-cart.js' : 'public/src/js/sidebar-cart.jsx',
	            }
	        }
	    }, // babel

		less: { 			
			build: { 				
				options: { 					
					yuicompress: true,
					compress: true
				},  				
				files: { 					
					"public/dist/css/main.min.css" : "public/src/less/main.less",
				}
			} 		
		}, // less 

		uglify : { 			
			options : { 				
				mangle : false 			
			},  	

			build : { 				
				files : { 					
					'public/dist/js/main.min.js' : [
						'public/dist/js/util.js',
						'public/dist/js/sidebar-cart.js',
						'public/dist/js/cart.js',
					],
				} 			
			} 		
		}, // uglify

		watch : {
			less: { 				
				files: [ 'public/src/less/**/*' ], 				
				tasks: [ 'less' ] 			
			},  			

			babel: { 				
				files: [ 'public/src/js/**/*' ], 				
				tasks: [ 'babel' ] 			
			},

			uglify: { 				
				files: [ 'public/dist/js/**/*' ], 				
				tasks: [ 'uglify' ] 			
			}
		} // watch		  	
	});	  	

	// Plugins do Grunt  	
	grunt.loadNpmTasks( 'grunt-babel' ); 
	grunt.loadNpmTasks( 'grunt-contrib-less' ); 	
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Tarefas que serão executadas 	
	grunt.registerTask( 'build', [ 'less', 'babel', 'uglify' ] ); 	

	// Tarefa para Watch 	
	grunt.registerTask( 'w', [ 'watch' ] ); 
	
};