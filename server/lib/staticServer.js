var apiServer      = require('./apiServer');
var lessMiddleware = require('less-middleware');
var restify        = require('restify');

apiServer.use(lessMiddleware('ui', {
	force: true,
	debug: false
}));

var serveNodeModules = restify.plugins.serveStatic({
	directory: './node_modules',
	maxAge: 3600
});

apiServer.get({ path: "/scripts/node_modules/**", name: 'nodeModules' }, function(req, res, next){
	req._path = req.params[0];
	serveNodeModules(req, res, next);
});

var serveBrowserModel = restify.plugins.serveStatic({
	directory: './server/',
	maxAge: 3600
});

apiServer.get({ path: "/scripts/lib/**", name: 'browserModel' }, function(req, res, next){
	req._path = 'lib/'+req.params[0];
	serveBrowserModel(req, res, next);
});

apiServer.get({path: "/"}, restify.plugins.serveStatic({
	directory: 'ui',
	maxAge: 1,
	default: 'index.html'
}));


apiServer.get({path: "/styles/*"}, restify.plugins.serveStatic({
	appendRequestPath: true,
	directory: 'ui',
	maxAge: 3600,
	default: 'index.html'
}));

apiServer.get({path: "/*"}, restify.plugins.serveStatic({
	directory: 'ui',
	maxAge: 3600,
	default: 'index.html'
}));