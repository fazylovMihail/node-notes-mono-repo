import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

interface WebpackEnv {
  [key: string]: any;
}

interface WebpackArgv {
  mode?: "production" | "development" | "none";
  [key: string]: any;
}

export default (env: WebpackEnv, argv: WebpackArgv): Configuration => {
  const isProd = argv.mode === "production";
  const currentMode =
    argv.mode ||
    (process.env.NODE_ENV as Configuration["mode"]) ||
    "development";

  return {
    mode: currentMode,
    entry: "./src/main.tsx",
    target: "web",
    context: __dirname,
    output: {
      path: path.resolve(process.cwd(), "dist/client"),
      filename: isProd ? "js/[name].[contenthash:8].js" : "js/[name].js",
      chunkFilename: isProd
        ? "js/[name].[contenthash:8].chunk.js"
        : "js/[name].chunk.js",
      publicPath: "/",
      clean: true,
    },
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@client": path.resolve(__dirname, "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
      },
    },
    optimization: {
      minimize: isProd,
      minimizer: ["...", new CssMinimizerPlugin()],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            reuseExistingChunk: true,
          },
          common: {
            name: "common",
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: "single",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: !isProd,
                compilerOptions: {
                  module: "esnext",
                },
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]",
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024,
            },
          },
          generator: {
            filename: "images/[name].[hash:8][ext]",
          },
        },
        {
          test: /\.svg$/i,
          oneOf: [
            {
              resourceQuery: /url/,
              type: "asset/resource",
              generator: {
                filename: "images/[name].[hash:8][ext]",
              },
            },
            {
              issuer: /\.[jt]sx?$/,
              resourceQuery: { not: [/url/] },
              use: [
                {
                  loader: "@svgr/webpack",
                  options: { icon: true },
                },
              ],
            },
          ],
        },
        {
          test: /\.module\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isProd
                    ? "[hash:base64:8]"
                    : "[name]__[local]--[hash:base64:5]",
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        minify: isProd
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
              minifyURLs: true,
            }
          : false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public/sprite.svg"),
            to: "sprite.svg",
            noErrorOnMissing: true,
          },
        ],
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: "css/[name].[contenthash:8].css",
              chunkFilename: "css/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
    ],
  };
};
