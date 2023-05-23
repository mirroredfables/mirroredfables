module.exports = {
  stories: ["../src/**/*.stories.?(ts|tsx|js|jsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-react-native-web",
  ],
  framework: "@storybook/react",
  typescript: {
    reactDocgen: "none",
  },
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    const rule = {
      test: /postMock.html$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    };

    config.module.rules.push(rule);

    // Return the altered config
    return config;
  },
};
