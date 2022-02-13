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

var _index = require("./json/index.json");

var _index2 = _interopRequireDefault(_index);

var _jsonLoader = require("./loader/jsonLoader.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _foo.foo)();
console.log("faith=============mainjs"); // 当我们引入 jsonStr 的时候，如果没有一个loader处理json文件，那么在打包即执行 node index.js 的时候就会报错
// 此刻我们要去写一个 jsonLoader 来处理json文件
// 我们去 index.js去配置, 初始代码我们可以去官网去拿
//
// import { jsonLoader } from "./example/loader/jsonLoader.js";
// let webpackConfig = {
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: jsonLoader,
//       },
//     ],
//   },
// };
// 我们应该在什么时机去调用我们的 loader？
// 应该在刚拿到源码的时候就去调用命中的loader
// const source = fs.readFileSync(filePath, {
//   encoding: "utf-8",
// });

console.log("faith=============jsonStr", _index2.default);
        },  {"./foo.js":1,"./json/index.json":2,"./loader/jsonLoader.js":3}],

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
        },  {"./bar.js":4}],

    '2': [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\n  \"age\" : 27,\n  \"name\": \"faith\"\n}";
        },  {}],

    '3': [function (require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonLoader = jsonLoader;

function jsonLoader(source) {
  console.log("faith=============jsonLoaderjsonLoader");
  return "export default " + JSON.stringify(source);
}
        },  {}],

    '4': [function (require, module, exports) {
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
