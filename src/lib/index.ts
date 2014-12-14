/// <reference path="../../typings/all.d.ts" />
"use strict";

import gruntOrganized = require('./grunt-organized');
import grunt = require('grunt');

/**
 * Creates an object that exposes grunt-organized's API.
 * @param grunt the grunt object passed to your Gruntfile.js
 * @param configObject a config object that you would normally pass to `grunt.initConfig`
 * @returns {GruntOrganized}
 */
function main(grunt: IGrunt, configObject?: grunt.config.IProjectConfig): gruntOrganized.GruntOrganized {
    return new gruntOrganized.GruntOrganized(grunt, configObject);
}

export = main;

