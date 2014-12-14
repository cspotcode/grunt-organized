module.exports = function(grunt) {
    
    var _ = require('lodash');

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    
    // Dog-fooding
    var gruntOrganized = require('./built/lib/index.js')(grunt, {
        pkg: grunt.file.readJSON('package.json')
    });
    
    var tsOptions = {
        module: 'commonjs',
        noImplicitAny: true
    };
    
    var typedocOptions = {
        module: 'commonjs'
    };
    if(tsOptions.noImplicitAny) typedocOptions.noImplicitAny = '';
    
    grunt.task.renameTask('clean', 'clean_');
    
    gruntOrganized.registerTask('clean', 'Delete all generated files, including the compiled .js needed to use this module.', {
        clean_: {
            src: [
                'built/**/*',
                'built',
                'docs/**/*',
                'docs',
                '.tscache/**/*',
                '.tscache',
                'src/**/.baseDir.ts'
            ]
        }
    });
    
    gruntOrganized.registerTask('prepublish', 'Delete all intermediate generated files, excluding distributable artifacts, to prepare for publishing.', {
        clean_: {
            src: [
                'built/lib/.baseDir{.d.ts,.js,.js.map}',
                'built/test/**/*',
                'built/test',
                '.tscache/**/*',
                '.tscache',
                'src/**/.baseDir.ts'
            ]
        }
    });
    
    gruntOrganized.registerTask('build', 'Build the module.', {
        ts: {
            src: ['src/lib/**/*.ts'],
            outDir: 'built/lib',
            options: _.defaults({
                fast: 'always',
                declaration: true
            }, tsOptions)
        }
    });
    
    gruntOrganized.registerTask('test', 'Compile and run tests.', {
        ts: {
            src: ['src/test/**/*.ts'],
            outDir: 'built',
            options: _.defaults({
                fast: 'always'
            }, tsOptions)
        },
        mochaTest: {
            src: ['built/test/**/*.spec.js']
        }
    });
    
    gruntOrganized.registerTask('docs', 'Generate API documentation.', {
        typedoc: {
            src: '<%= ts.build.src %>',
            options: _.defaults({
                out: 'docs',
                name: '<%= pkg.name %>',
                theme: 'minimal'
            }, typedocOptions)
        }
    });
    
    grunt.registerTask('default', ['build']);
    grunt.registerTask('all', ['clean', 'build', 'test', 'docs', 'prepublish']);
    
};
