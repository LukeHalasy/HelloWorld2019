const withTypescript = require('@zeit/next-typescript');
const withCss = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-plugin-transpile-modules');
const lessToJS = require('less-vars-to-js');
const webpack = require('webpack');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { publicRuntimeConfig, serverRuntimeConfig } = require('../backend/config/env-config');

// fix: prevents error when .css/.less files are required by node
if (typeof require !== 'undefined') {
	// tslint:disable: no-empty
	require.extensions['.less'] = () => {};
	require.extensions['.css'] = () => {};
}

const themeVariables = lessToJS(readFileSync(resolve(__dirname, './assets/theme.less'), 'utf8'));

module.exports = withPlugins(
	[
		[
			withTM,
			{
				transpileModules: ['shared']
			}
		],
		[withTypescript],
		[withCss],
		[
			withLess,
			{
				lessLoaderOptions: {
					javascriptEnabled: true,
					modifyVars: themeVariables // Change theme
				}
			}
		]
	],
	{
		publicRuntimeConfig,
		serverRuntimeConfig,
		webpack: (config, options) => {
			const { dev, isServer } = options;
			// if (isServer && dev) {
			// 	const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

			// 	config.plugins.push(
			// 		new ForkTsCheckerWebpackPlugin({
			// 			tsconfig: '../tsconfig.server.json',
			// 			tslint: '../tslint.json'
			// 		})
			// 	);
			// }
			// config.plugins.push(
			// 	new webpack.DefinePlugin({
			// 		'process.env.NODE_ENV': process.env.NODE_ENV
			// 	})
			// );

			return config;
		}
	}
);
