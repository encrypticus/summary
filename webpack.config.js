const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');// создает index.html из index.pug
const CleanWebpackPlugin = require('clean-webpack-plugin');// очищает папку сборки перед пересборкой
const MiniCssExtractPlugin = require("mini-css-extract-plugin");// обрабатывает css
const styleLintPlugin = require('stylelint-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: './src/index.js',// точка входа

  output: {// точка выхода
    filename: 'scripts.js', // имя выходного js-файла
    path: path.resolve(__dirname, 'dist'),// директория, в которой будет лежать выходной файл
  },

  // devServer: {// локальный сервер перезагрузки, hot reload
  //   overlay: true,
  //   // host: '192.168.14.2',
  //   port: 8080,
  //   host: 'localhost',// имя хоста
  //   contentBase: path.join(__dirname, 'dist'),
  //   watchContentBase: true,
  //   index: 'index.html',
  //   open: true// открыть странцу в браузере при запуске сервера
  // },

  watch: true,// отслеживать файлы в директории src для горячей пересборки

  module: {// модули, обрабатывающие файлы с указаным расширением
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },

      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },

      {
        test:/\.pug$/,
        loaders: [
          'html-loader',
          'pug-html-loader?{"pretty": true, "exports": false}'
        ]
      },

      // {
      //   test: /\.pug$/,
      //   exclude: /node_modules/,
      //   loader: 'pug-loader?pretty=true'
      // },

      {
        test: /\.(ico)$/,// фавиконку положить в корень сайта
        loader: 'file-loader?name=./[name].[ext]'
      },

      {
        test: /\.(png|gif|jpg|jpeg)$/,
        loader: 'file-loader?name=./img/[name][hash:7].[ext]'// к имени изображения добавить первые 7 цифр его хэша
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader?name=./fonts/[name].[ext]',
      },

      {
        test:/\.svg$/,
        exclude: [/img/],
        loader: 'file-loader?name=./fonts/[name].[ext]'
      },

      {
        test:/\.svg$/,
        exclude: [/fonts/],
        loader: 'file-loader?name=./img/[name][hash:7].[ext]'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),// в параметре директория, подлежащая очистке

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug',
      inject: "head",
      favicon: "src/summary.ico"
    }),

    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css"
    }),

    new styleLintPlugin({
      // configFile: '.stylelintrc',
      context: './',
      fix: true,
      files: ['**/*.scss', '**/*.css'],
      // failOnError: false,
      quiet: false,
    }),

    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/'
    })
  ],

  /**
   * Секция разрешений; resolve.extends перечисляет какие модули можно подключать, не указывая расширения. В данном случае
   * разрешено без указания расширения в pug-файлах подключать другие pug-файлы - в index.pug файл шаблона index.template.pug
   * "экстендится" без указания расширения
   */
  resolve: {
    extensions: ['.js', '.pug', '.woff', '.ttf', '.svg']
  }
};