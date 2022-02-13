function require(filePath) {
  const map = {
    "./foo.js": foojs,
    "./main.js": mainjs,
  };

  const fn = map[filePath];

  const module = {
    exports: {},
  };
  fn(require, module, module.exports);

  return module.exports;
}

require("./main.js");

function mainjs(require, module, exports) {
  // import { foo } from "./foo.js";
  // 将esm翻译成cjs
  const { foo } = require("./foo.js");

  foo();
  console.log("faith=============mainjs");
}

function foojs(require, module, exports) {
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
}
