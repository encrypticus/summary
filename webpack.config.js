const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');// создает index.html из index.pug
const CleanWebpackPlugin = require('clean-webpack-plugin');// очищает папку сборки перед пересборкой
const MiniCssExtractPlugin = require("mini-css-extract-plugin");// обрабатывает css
const styleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: './src/index.js',// точка входа

  output: {// точка выхода
    filename: 'scripts.js', // имя выходного js-файла
    path: path.resolve(__dirname, 'dist'),// директория, в которой будет лежать выходной файл
  },

  devServer: {// локальный сервер перезагрузки, hot reload
    overlay: true,
    // host: '192.168.1.33',
    host: 'localhost',// имя хоста
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    index: 'index.html',
    open: true// открыть странцу в браузере при запуске сервера
  },

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
        test: /\.pug$/,
        exclude: /node_modules/,
        loader: 'pug-loader?pretty=true'
      },

      {
        test: /\.(ico)$/,// фавиконку положить в корень сайта
        loader: 'file-loader?name=./[name].[ext]'
      },

      {
        test: /\.(png|gif|jpg|jpeg)$/,
        loader: 'file-loader?name=./img/[name][hash:7].[ext]'// к имени изображения добавить первые 7 цифр его хэша
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        loader: 'file-loader?name=./fonts/[name].[ext]',
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),// в параметре директория, подлежащая очистке

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug',
      inject: false
    }),

    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css"
    }),

      new styleLintPlugin({
      // configFile: '.stylelintrc',
      context: 'src',
      fix: true,
      files: '**/*.scss',
      failOnError: false,
      quiet: false,
    })
  ],

  /**
   * Секция разрешений; resolve.extends перечисляет какие модули можно подключать, не указывая расширения. В данном случае
   * разрешено без указания расширения в pug-файлах подключать другие pug-файлы - в index.pug файл шаблона index.template.pug
   * "экстендится" без указания расширения
   */
  resolve: {
    extensions: ['.pug', '.woff', '.ttf', '.svg']
  }
};