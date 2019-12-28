const webpack = require("webpack");
// const path = require("path");
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",    
                jQuery:"jquery",    
                "windows.jQuery":"jquery"    
              })
        ]
      },
    publicPath:'./'
}