import { foo } from "./foo.js";
import jsonStr from "./json/index.json";
import { jsonLoader } from "./loader/jsonLoader.js";
foo();
console.log("faith=============mainjs");

// loader核心代码 start 开始 ========================================================================
// loader核心代码 start 开始 ========================================================================
// loader核心代码 start 开始 ========================================================================

// 当我们引入 jsonStr 的时候，如果没有一个loader处理json文件，那么在打包即执行 node index.js 的时候就会报错
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

// 以下是loader的核心代码
// let loaders = webpackConfig.module.rules;
//
// loaders.forEach(({ test, use }) => {
//   if (test.test(filePath)) {
//     if (Array.isArray(use)) {
//       use.reverse();
//       use.forEach((fn) => {
//         source = fn(source);
//
//         // 如果在自己的loader调用webpack的api
//         // source.call(loaderContext, source); // call是将loaderContext传递到loader里面，loader里面的this就是loaderContext
//         // 在loader函数内部就可以使用 this.addDeps()了
//       });
//     } else {
//       source = use(source);
//     }
//   }
// });

// loader核心代码 结束 end ========================================================================
// loader核心代码 结束 end ========================================================================
// loader核心代码 结束 end ========================================================================

// 输出json文件
console.log("faith=============jsonStr", jsonStr);
