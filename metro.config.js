// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude react-native-maps from web
config.resolver.blockList = [
  /node_modules\/react-native-maps\/.*/,
];

module.exports = config;
