This module extends the grunt API slightly to allow organizing your Gruntfile by target rather than by task.  It also makes your Gruntfile more DRY by making it easier to register tasks that execute a collection of other tasks.

#Example Gruntfile.js

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

The above organized Gruntfile is equivalent to:

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

grunt-organized takes care of merging multiple targets into the `copy` configuration and calling `grunt.registerTask` to create the alias tasks.

grunt-organized also lets you mix custom task functions, target configurations, and task names in a single call to `registerTask`:

```
    // Register a task called 'cleanup' that will use grunt-contrib-clean, then run the 'stop-server' task, and then run
    // a custom task.
    grunt.registerTask('cleanup',
        {
            clean: { src: ['temp/**/*'] }
        },
        'stop-server',
        function(grunt) {
            console.log('All done!');
        }
    );
```

#Usage:

In your Gruntfile, load the module and pass it the `grunt` object.  This will return an object that mimics the grunt API such that you can use it instead of `grunt`.

```
module.exports = function(grunt) {
    var gruntOrganized = require('grunt-organized')(grunt, {
        pkg: grunt.file.readJSON('package.json')
    });
}
```

Alternatively, install the extended API onto `grunt` itself by calling `.mixin` instead.

```
module.exports = function(grunt) {
    grunt = require('grunt-organized').mixin(grunt, {
        pkg: grunt.file.readJSON('package.json')
    });
```

#API Enhancements:

##registerTask

In addition to grunt's normal `registerTask interface, grunt-organized also supports:

`grunt.registerTask(taskName: string, description?: string, ...tasks: (function|string|object)[])`
`grunt.registerTask(taskName: string, description?: string, tasks: (function|string|object)[])`

##addConfig

`grunt.addConfig(configObject: object)`

Adds more configuration into the existing grunt configuration, merging task targets into the existing configuration
for that task.

Example:
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

#TypeScript definitions:

If you're using TypeScript, `grunt-organized` includes a type definition: `grunt-organized.d.ts`.

```
/// <reference path="node_modules/grunt-organized/grunt-organized.d.ts" />
```

#License:

`grunt-organized` uses the MIT License.
