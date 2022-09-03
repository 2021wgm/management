let proPlugin = [];
if(process.env.NODE_ENV === 'production') {
  proPlugin.push("transform-remove-console")
}

module.exports = {
  "presets": [
      '@vue/cli-plugin-babel/preset',
      ["@babel/preset-env", { "modules": false }]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      },
    ],
    ...proPlugin,
    ["@babel/plugin-transform-runtime"]
  
  ]
}








