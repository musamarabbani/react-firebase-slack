const path = require('path');
const rewireAliases = require('react-app-rewire-aliases');

module.exports = function override(config, env) {
	//do stuff with the webpack config...
	config = rewireAliases.aliasesOptions({
		'@src': path.resolve(__dirname, 'src'),
		'@components': path.resolve(__dirname, 'src/components'),
	})(config, env);
	return config;
};
