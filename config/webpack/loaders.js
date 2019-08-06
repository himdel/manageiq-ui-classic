const merge = require('webpack-merge')

const { env, publicPath } = require('./configuration.js')
const babelrc = require('../../.babelrc.js');

let babelOptions = merge(babelrc, {
  babelrc: false,
  compact: false,
});

// set WEBPACK_VERBOSE=1 to get more warnings
if (env.WEBPACK_VERBOSE) {
  // don't drop any whitespace from the bundle, prevents warnings about filesize over the limit
  delete babelOptions.compact;
}

module.exports = [
  {
    test: /\.(js|jsx)$/,
    use: [
      'ng-annotate-loader',
      {
        loader: 'babel-loader',
        options: babelOptions,
      }
    ],
    exclude: /node_modules/,
  },

  {
    test: require.resolve('bootstrap-datepicker'),
    use: 'imports-loader?exports=>undefined,define=>undefined',
  },
  {
    test: require.resolve('bootstrap-select'),
    use: 'imports-loader?module=>undefined,define=>undefined,this=>window',
  },

  {
    test: /\.(scss|sass)$/i,
    include: /manageiq-ui-service/,
    use: [
      'style-loader',
      'css-loader?importLoaders=1&sourceMap=true',
      {
        loader: 'sass-loader',
        options: {
          data: '$img-base-path: /ui/service',
          sourceMap: true,
          includePaths: [
            '/home/himdel/manageiq-ui-service/client/assets/sass',
            '/home/himdel/manageiq-ui-service/node_modules/bootstrap-sass/assets/stylesheets',
            '/home/himdel/manageiq-ui-service/node_modules/patternfly/dist/sass/patternfly',
            '/home/himdel/manageiq-ui-service/node_modules/font-awesome/scss',
            '/home/himdel/manageiq-ui-service/node_modules/@manageiq/font-fabulous/assets/stylesheets',
          ],
        },
      },
    ],
  },

  {
    test: /\.css$/i,
    include: /manageiq-ui-service/,
    use: [
      'style-loader',
      'css-loader?importLoaders=0&sourceMap=true',
      // 'css-loader?importLoaders=1&sourceMap=true',
      // 'postcss-loader',
    ],
  },

  {
    test: /\.(scss|sass|css)$/i,
    exclude: /manageiq-ui-service/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          minimize: env.NODE_ENV === 'production',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: () => [require('autoprefixer')]
        },
      },
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },

  {
    test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2)$/i,
    use: [{
      loader: 'file-loader',
      options: {
        publicPath,
        name: '[name]-[hash].[ext]',
      }
    }]
  },

  // ui-service: html loaders: populate angular's templateCache
  {
    test: /\/client\/.*\.html$/,
    use: [
      'ngtemplate-loader?relativeTo=manageiq-ui-service/client/',
      'html-loader?attrs=false&minimize=true'
    ]
  },
];
