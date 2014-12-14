Grunt-organized enables you to write more organized Gruntfiles.  It enhances the Grunt API to allow organizing your Gruntfile by target rather than by task.  It also makes your Gruntfile more DRY by offering a clean, simple way to register a group of tasks under an alias.

##Example Gruntfile.js

Here is a sample Gruntfile.js using grunt-organized.

```
module.exports = function(grunt) {
    // Load grunt-organized and initialize our grunt config.
    grunt = require('grunt-organized')(grunt, {
        pkg: grunt.file.readJSON('package.json'
    });
    
    // Add several tasks used to build our project
    grunt.registerTask('build', 'Build site', {
        // minify JS code
        uglify: {
            files: [{
                expand: true,
                src: ['src/js/**/*.js'],
                dest: 'out/js'
            }]
        },
        // Copy static resources
        copy: {
            files: [{
                expand: true,
                cwd: 'src/resources',
                src: ['**/*'],
                dest: 'out/resources'
            }]
        }
    });
    
    // Add several tasks used to generate our API documentation from markdown files
    grunt.registerTask('docs', 'Generate API documentation', {
        // Copy images used in documentation
        copy: {
            files: [{
                expand: true,
                cwd: 'docs-src/img',
                src: ['**/*'],
                dest: 'docs/img'
            }]
        },
        // Render markdown
        markdown: {
            files: [{
                expand: true,
                cwd: 'docs-src',
                src: ['/**/*.md'],
                dest: 'docs'
            }]
        }
    });
};
```

The above Gruntfile is equivalent to:

```
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                // minify JS code
                files: [{
                    expand: true,
                    src: ['src/js/**/*.js'],
                    dest: 'out/js'
                }]
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/resources',
                    src: ['**/*'],
                    dest: 'out/resources'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs-src/img',
                    src: ['**/*'],
                    dest: 'docs/img'
                }]
            }
        },
        markdown: {
            docs: {
                files: [{
                    expand: true,
                    cwd: 'docs-src',
                    src: ['/**/*.md'],
                    dest: 'docs'
                }]
            }
        }
    });
    
    grunt.registerTask('build', 'Build site', ['uglify:build', 'copy:build']);
    grunt.registerTask('docs', 'Generate API documentation', ['copy:docs', 'markdown:docs']);
```

Grunt-organized takes care of merging multiple targets into a single grunt-contrib-copy configuration and calls `grunt.registerTask` to create the alias tasks.

Grunt-organized also lets you mix custom task functions, target configurations, and task names in a single call to `registerTask`:

```
    /*
     * Register a task called 'cleanup' that will use grunt-contrib-clean, then
     * run the 'stop-server' task, and finally run a custom task.
     */
    grunt.registerTask('cleanup', [
        {
            clean: { src: ['temp/**/*'] }
        },
        'stop-server',
        function(grunt) {
            console.log('All done!');
        }
    ]);
```

##Usage:

`npm install --save-dev grunt-organized`

In your Gruntfile, load and invoke the module, passing it your `grunt` object and some initial grunt configuration.  This will return an object that mimics
the grunt API such that it's a drop-in replacement for your original `grunt` object.  It will also call `grunt.initConfig`.

```
module.exports = function(grunt) {
    grunt = require('grunt-organized')(grunt, {
        pkg: grunt.file.readJSON('package.json')
    });
}
```

Alternatively, you can install the API onto your `grunt` object itself by calling `mixin`.

```
module.exports = function(grunt) {
    require('grunt-organized').mixin(grunt, {
        pkg: grunt.file.readJSON('package.json')
    });
    grunt.registerTask(/* ... */);
```

Then configure plugins and register tasks using the enhanced APIs, original grunt APIs, or any mix of the two.

##Grunt API Enhancements:

###registerTask

In addition to grunt's normal `registerTask interface, grunt-organized also supports:

`grunt.registerTask(taskName: string, description?: string, ...tasks: (function|string|object)[])`
`grunt.registerTask(taskName: string, description?: string, tasks: (function|string|object)[])`

###addConfig

`grunt.addConfig(configObject: object)`

Adds more configuration into the existing grunt configuration, merging additional task targets into any existing configuration
for that task.

*Example:*
```
grunt.addConfig({
    clean: {
        demo: { src: ['temp/demo'] }
    }
});
grunt.addConfig({
    clean: {
        docs: { src: ['temp/docs'] } // add new `docs` target to existing `clean` configuration
    },
    stylus: {
        // ... more config ...
    }
});
```

##TypeScript definitions:

If you're using TypeScript, `grunt-organized` includes a type definition: `grunt-organized.d.ts`.

```
/// <reference path="node_modules/grunt-organized/grunt-organized.d.ts" />
```

##License:

`grunt-organized` uses the MIT License.
