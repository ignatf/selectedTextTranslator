const path = require("path");

var config = {
    mode: 'development',
    module: {},
};

var contentConfig = Object.assign({}, config, {
    entry: "./content/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "src/dist")
    }
});

var backgroundConfig = Object.assign({}, config,{
    entry: "./background/background.js",
    output: {
        filename: "background.js",
        path: path.resolve(__dirname, "src/dist")
    }
});

// Return Array of Configurations
module.exports = [
    contentConfig, backgroundConfig,       
];