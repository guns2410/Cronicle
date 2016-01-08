// Cronicle API Layer - Configuration
// Copyright (c) 2015 Joseph Huckaby
// Released under the MIT License

var fs = require('fs');
var assert = require("assert");
var async = require('async');

var Class = require("pixl-class");
var Tools = require("pixl-tools");

module.exports = Class.create({
	
	api_config: function(args, callback) {
		// send config to client
		var self = this;
		
		// do not cache this API response
		this.forceNoCacheResponse(args);
		
		// if there is no master server, this has to fail (will be polled for retries)
		if (!this.multi.masterHostname) {
			return callback({ code: 'master', description: "No master server found" });
		}
		
		var resp = {
			code: 0,
			version: this.server.__version,
			config: Tools.mergeHashes( this.server.config.get('client'), {
				debug: this.server.debug ? 1 : 0,
				job_memory_max: this.server.config.get('job_memory_max'),
				base_api_uri: this.api.config.get('base_uri'),
				default_privileges: this.usermgr.config.get('default_privileges'),
				free_accounts: this.usermgr.config.get('free_accounts')
			} ),
			port: args.request.headers.ssl ? this.web.config.get('https_port') : this.web.config.get('http_port'),
			master_hostname: this.multi.masterHostname
		};
		
		callback(resp);
	}
	
} );