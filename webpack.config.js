const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');// создает index.html из index.pug
const CleanWebpackPlugin = require('clean-webpack-plugin');// очищает папку сборки перед пересборкой
const MiniCssExtractPlugin = require("mini-css-extract-plugin");// обрабатывает css
const styleLintPlugin = require('stylelint-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const config = {
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

  module: {// модули, обрабатывающие файлы с указанным расширением
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

      {// обработка svg-шрифтов
        test: /\.svg$/,
        exclude: [/img/],
        loader: 'file-loader?name=./fonts/[name].[ext]'
      },

      {// обработка svg-изображений
        test: /\.svg$/,
        exclude: [/fonts/],
        loader: 'file-loader?name=./img/[name][hash:7].[ext]'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),// в параметре директория, подлежащая очистке

    // преобразует index.pug в index.html и кладет в папку dist
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug',
      inject: "head",
      favicon: "src/summary.ico"
    }),

    // извлекает файл стилей и кладет в папку dist
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css"
    }),

    // линтер стилевых файлов
    new styleLintPlugin({
      // configFile: '.stylelintrc',
      context: './',
      fix: true,
      files: ['**/*.scss', '**/*.css'],
      // failOnError: false,
      quiet: false,
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

// функция вторым аргументом принимает args.mode от прописанных в package.json скриптов: args.mode = development или args.mode = production
module.exports = (env, args) => {

  if (args.mode === "development") {// в режиме разработки
    // использовать browserSync
    config.plugins.push(new BrowserSyncPlugin({host: 'localhost', port: 3000, proxy: 'http://localhost:8080/'}));

    // не минифицировать выходной index.html
    config.module.rules.push(
        {
          test: /\.pug$/,
          loaders: [
            'html-loader',
            'pug-html-loader?{"pretty": true, "exports": false}'
          ]
        }
    );

    // генерация sourcemap; для того чтобы карта сгенерировалась обязательно нужно у обоих лоадеров:
    // sass-loader и css-loader установить параметр sourceMap=true
    config.devtool = "source-map";

    config.module.rules.push(
        {
          test: /\.(scss|sass)$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader?sourceMap=true",
            "sass-loader?sourceMap=true"
          ]
        }
    );
  }

  if (args.mode === "production") {// в режиме продакшен

    // минифицировать выходной index.html
    config.module.rules.push(
        {
          test: /\.pug$/,
          loaders: [
            'html-loader',
            'pug-html-loader?{"pretty": false, "exports": false}'
          ]
        }
    );

    // обрабатывать стилевые файлы без генерации карты кода
    config.module.rules.push(
        {
          test: /\.(scss|sass)$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader"
          ]
        }
    );
  }

  if (args.mode !== "development" && args.mode !== "production") {
    args.mode = "development";
  }

  return config;
}