const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");

const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
      canisterDetails[network];
    return prev;
  }, {});
}
const canisterEnvVariables = initCanisterEnv();

const isDevelopment = process.env.NODE_ENV !== "production";

const frontendDirectory = "sustainations_dao_assets";

const asset_entry = path.join("src", frontendDirectory, "src", "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    // The frontend.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.js`.
    index: path.join(__dirname, asset_entry).replace(/\.html$/, ".js"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
    alias: {
      '@components': path.resolve(__dirname, './src/sustainations_dao_assets/src/@fuse'),
      '@fuse': path.resolve(__dirname, './src/sustainations_dao_assets/src/@fuse'),
      '@history': path.resolve(__dirname, './src/sustainations_dao_assets/src/@history'),
      '@lodash': path.resolve(__dirname, './src/sustainations_dao_assets/src/@lodash'),
      '@mock-api': path.resolve(__dirname, './src/sustainations_dao_assets/src/@mock-api'),
      'api': path.resolve(__dirname, './src/sustainations_dao_assets/src/api'),
      'app/store': path.resolve(__dirname, './src/sustainations_dao_assets/src/app/store'),
      'app/shared-components': path.resolve(__dirname, './src/sustainations_dao_assets/src/app/shared-components'),
      'app/configs': path.resolve(__dirname, './src/sustainations_dao_assets/src/app/configs'),
      'app/theme-layouts': path.resolve(__dirname, './src/sustainations_dao_assets/src/app/theme-layouts'),
      'app/AppContext': path.resolve(__dirname, './src/sustainations_dao_assets/src/app/AppContext'),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", frontendDirectory),
  },

  // Depending in the language or framework you are using for
  // front-end development, add module loaders to the default
  // webpack configuration. For example, if you are using React
  // modules and CSS as described in the "Adding a stylesheet"
  // tutorial, uncomment the following lines:
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.(js|ts|tsx|jsx)$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|dat|patt|glb|gltf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|dat|patt|glb|gltf)$/i,
        use: [
          {
            loader: "url-loader"
          }
        ]
      },
      {
        test: /\.(css|scss|sass)$/i,
        use: ["style-loader", "css-loader", "sass-loader", 'postcss-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, asset_entry),
      favicon: path.join(
        __dirname,
        "src",
        "sustainations_dao_assets",
        "assets",
        "favicon.ico"
      ),
      cache: false,
      minify: !isDevelopment
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
          }
        : undefined,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src", frontendDirectory, "assets"),
          to: path.join(__dirname, "dist", frontendDirectory),
        },
      ],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      II_URL: isDevelopment
        ? dotenv.parsed.CANISTER_IDENTITY_LOCAL_URL
        : "https://identity.ic0.app/#authorize",
      ...canisterEnvVariables,
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
      "React": "react",
    }),
    new Dotenv({
      path: "./.env" // Path to .env file (this is the default)
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
  ],
  // proxy /api to port 8000 during development
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    hot: true,
    port: 3000,
    watchFiles: [path.resolve(__dirname, "src", frontendDirectory)],
    liveReload: true,
    historyApiFallback: true,
  },
};
