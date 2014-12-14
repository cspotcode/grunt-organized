/// <reference path="../../typings/all.d.ts" />
"use strict";

import gruntModule = require('grunt');
import _ = require('lodash');

export class GruntOrganized {
    constructor(public grunt: IGrunt, public config: gruntModule.config.IProjectConfig = {}) {
        this.grunt.initConfig(config);
        _.bindAll(this);
    }

    addConfig(additional: {}): GruntOrganized {
        _.each(additional, (additionalTaskConfig: {}, taskName: string) => {
            this._addTargetsToTask(taskName, additionalTaskConfig);
        });

        // allow chaining
        return this;
    }

    private _addTargetsToTask(taskName: string, additionalTargets: {}) {
        if(!_.has(this.config, taskName)) this.config[taskName] = {};
        var existingTaskConfig = this.config[taskName];
        var existingTargetNames = _.keys(existingTaskConfig);
        var additionalTargetNames = _.keys(additionalTargets);
        var conflictingTargetNames = _.intersection(additionalTargetNames, existingTargetNames);
        if(conflictingTargetNames.length)
            throw new Error('Attempt to override already-configured targets for task "' + taskName + '" is not allowed: "' + conflictingTargetNames.join('","') + '"');
        _.extend(existingTaskConfig, additionalTargets);
    }
    
    private _unusedTargetNameForTask(taskName: string, targetName: string) {
        var taskConfig = this.config[taskName];
        if(!taskConfig) return targetName;
        var postfix = 1;
        var unusedTargetName = targetName;
        while(_.has(taskConfig, unusedTargetName)) {
            postfix++;
            unusedTargetName = targetName + postfix;
        }
        return unusedTargetName;
    }
    
    private _unusedTaskName(taskName: string) {
        var taskNameSuffix = 1;
        var unusedTaskName = taskName;
        while(this.grunt.task.exists(unusedTaskName)) {
            unusedTaskName = taskName + ++taskNameSuffix;
        }
        return unusedTaskName;
    }

    registerTask(targetName:string, description: string, ...configs:Array<any>): gruntModule.task.TaskModule;
    registerTask(targetName:string, ...configs:Array<any>): gruntModule.task.TaskModule;
    registerTask(targetName:string, description: string, configs:Array<any>): gruntModule.task.TaskModule;
    registerTask(targetName:string, configs:Array<any>): gruntModule.task.TaskModule;
    registerTask(targetName:string, ...rest: Array<any>): gruntModule.task.TaskModule {
        // Normalize arguments //
        
        // Is a description provided?
        var description: string = undefined;
        if(typeof rest[0] === 'string') {
            description = rest.shift();
        }
        
        // Should we delegate to grunt's default registerTask?
        if(typeof rest[0] === 'function' && rest.length === 1)
            return this.grunt.registerTask.apply(this.grunt, arguments);
        
        // Were we passed an array of configs?  Else each config is a separate argument.
        var configs: Array<any>;
        if(_.isArray(rest[0])) {
            configs = rest[0];
        } else {
            configs = rest;
        }
        
        /////////////////////////
        
        var subtaskNames: Array<string> = [];

        _.each(configs, (config: any) => {
            if(typeof config === 'function') {
                var taskName = this._unusedTaskName('fn-' + targetName);
                this.grunt.registerTask(taskName, config);
                subtaskNames.push(taskName);
            } else if(typeof config === 'string') {
                subtaskNames.push(config);
            } else {
                // iterate over each task in the config object
                _.each(config, (taskConfig:{}, taskName:string) => {
                    var additionalTargets:{[k: string]: {}} = {};
                    var unusedTargetName = this._unusedTargetNameForTask(taskName, targetName);
                    additionalTargets[unusedTargetName] = taskConfig;
                    this._addTargetsToTask(taskName, additionalTargets);
                    subtaskNames.push(taskName + ':' + unusedTargetName);
                });
            }
        });
        
        // Fail if a task with the desired name already exists
        if(this.grunt.task.exists(targetName))
            throw new Error('A task already exists with the name "' + targetName + '"');

        // Register a task that executes all the subtasks in order
        if(typeof description === 'string')
            return this.grunt.registerTask(targetName, description, subtaskNames);
        else
            return this.grunt.registerTask(targetName, subtaskNames);

    }
}
