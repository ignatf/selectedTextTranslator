const path = require("path");

var config = {
    // TODO: Add common Configuration
    module: {},
};

var contentConfig = Object.assign({}, config, {
    entry: "./content/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }
});

var backgroundConfig = Object.assign({}, config,{
    entry: "./background/background.js",
    output: {
        filename: "background.js",
        path: path.resolve(__dirname, "dist")
    }
});

// Return Array of Configurations
module.exports = [
    contentConfig, backgroundConfig,       
];