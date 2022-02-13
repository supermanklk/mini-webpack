// 以下整个代码块就是我们最初手写的bundle模版
// 我们要根据该模版动态生成有效的bundle.js
// 我们如何根据模版动态生成有效的bundle呢?
//    目前有2种方式 一种是我们手动拼接字符串
//                一种是我们用ejs库来生成.
// 我们肯定是使用ejs根据模版来生成bundle.js ejs的官方 https://ejs.co/
// 安装 npm install ejs
((modules) => {
  function require(id) {
    const [fn, mapping] = modules[id];

    const module = {
      exports: {},
    };

    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }
    fn(localRequire, module, module.exports);

    return module.exports;
  }
  require(1);
})({
  1: [
    function (require, module, exports) {
      // import { foo } from "./foo.js";
      // 将esm翻译成cjs
      const { foo } = require("./foo.js");

      foo();
      console.log("faith=============mainjs-2");
    },
    {
      "./foo.js": 2,
    },
  ],
  2: [
    function (require, module, exports) {
      // export function foo() {
      //   console.log("faith=============");
      // }
      // 将esm翻译成cjs
      function foo() {
        console.log("faith=============");
      }

      module.exports = {
        foo,
      };
    },
    {},
  ],
});
