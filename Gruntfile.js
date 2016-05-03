


module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-aws-lambda');



	grunt.initConfig({

	    lambda_invoke: {
	        default: {
	            options: {
	                // Task-specific options go here.
	                file_name:"index.js"
	            }
	        }
	    },



	});



	grunt.registerTask('run',['lambda_invoke']);


}