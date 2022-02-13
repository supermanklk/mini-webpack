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
require(0);
})({


    '0': [function (require, module, exports) {
        "use strict";

var _foo = require("./foo.js");

(0, _foo.foo)();
console.log("faith=============mainjs");
        },  {"./foo.js":1}],

    '1': [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

(0, _bar.sayName)();

function foo() {
  console.log("faith=============");
}
        },  {"./bar.js":2}],

    '2': [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sayName = sayName;

function sayName() {
  console.log("sayName", "bin 您好");
}
        },  {}],


});
