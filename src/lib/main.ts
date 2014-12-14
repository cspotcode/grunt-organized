/// <reference path="../../typings/all.d.ts" />
"use strict";

import gruntOrganized = require('./grunt-organized');
import grunt = require('grunt');

export interface GruntOrganizedModule {
    /**
     * Creates and returns an object that exposes grunt-organized's API.
     * @param grunt the grunt object passed to your Gruntfile.js
     * @param configObject a config object that you would normally pass to `grunt.initConfig`
     * @returns Object that wraps grunt, exposing our extended API.
     */
    (grunt: IGrunt, configObject?: grunt.config.IProjectConfig): gruntOrganized.IGruntOrganized;
    
    /**
     * Extends the original grunt object with out extended API.
     * @returns {IGruntOrganized} original grunt object with our extended API monkey-patched onto it.
     */
    mixin(grunt: IGrunt, configObject?: grunt.config.IProjectConfig): gruntOrganized.IGruntOrganized;
}

function wrap_(grunt: IGrunt, configObject?: grunt.config.IProjectConfig): gruntOrganized.IGruntOrganized {
    return <any>(new gruntOrganized.GruntOrganized(grunt, configObject));
}

export var wrap = <GruntOrganizedModule>wrap_;

wrap.mixin = function(grunt: IGrunt, configObject?: grunt.config.IProjectConfig): gruntOrganized.IGruntOrganized {
    var gruntOrganized = wrap_(grunt, configObject);
    var gruntCast = <gruntOrganized.IGruntOrganized>grunt;
    gruntCast.registerTask = gruntCast.task.registerTask = gruntOrganized.registerTask;
    gruntCast.addConfig = gruntOrganized.addConfig;
    return gruntCast;
};
