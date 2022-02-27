import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import ejs from "ejs";
import { jsonLoader } from "./example/loader/jsonLoader.js";
// transformFromAst 将esm转化为cjm,并且使用transformFromAst必须安装 babel-preset-env
import { transformFromAst } from "babel-core";

// 引入我们自己写的plugin插件-改变打包输出的路径
import ChangeOutputPlugin from "./example/plugin/ChangeOutputPlugin.js";
// 事件机制-plugin是基于事件机制的
import { SyncHook } from "tapable";

let id = 0;

let webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [jsonLoader],
      },
    ],
    // 配置我们的插件
    plugins: [new ChangeOutputPlugin()],
  },
};

const hooks = {
  // context入参
  emitFile: new SyncHook(["context"]),
};

// 注册我们的插件到webpack
function initPlugins() {
  const plugins = webpackConfig.module.plugins;
  plugins.forEach((plugin) => {
    // 每个插件plugin都会实现一个apply的方法，来注册插件事件tap
    plugin.apply(hooks);
  });
}

initPlugins();

const loaderContext = {
  addDeps() {
    console.log("模拟调用webpack的api");
  },
};

// 生成内容与依赖
function createAsset(filePath) {
  // 1 获取文件的内容
  // 2 获取依赖关系

  // 抽象语法树转换 https://astexplorer.net/
  //  ast 抽象语法树,通过babel
  // 安装 @babel/parser 将我们的代码转换为 ast
  // npm install @babel/traverse
  // 要获取ast内某个节点的内容,可以使用 @babel/traverse
  let source = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });

  let loaders = webpackConfig.module.rules;

  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      if (Array.isArray(use)) {
        use.reverse();
        use.forEach((fn) => {
          source = fn(source);

          // 如果在自己的loader调用webpack的api
          // source.call(loaderContext, source); // call是将loaderContext传递到loader里面，loader里面的this就是loaderContext
          // 在loader函数内部就可以使用 this.addDeps()了
        });
      } else {
        source = use(source);
      }
    }
  });

  const ast = parser.parse(source, {
    sourceType: "module",
  });

  const deps = [];
  traverse.default(ast, {
    // ImportDeclaration 可以通过 https://astexplorer.net/ 去拿, 在左侧鼠标聚焦之后就会显示对应的结构在那里
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });

  // 将esm模块转化为cjm的模块
  // 将esm转化为cjm的原因是将图[依赖,内容]全部塞到一个大的js文件之后,import只能在最外部,但是此刻每个模块都形成了一个函数块
  let { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });

  console.log("faith=============code", code);

  return {
    deps,
    code,
    filePath,
    mapping: {},
    id: id++,
  };
}

// 生成图
function createGraph() {
  const mainAsset = createAsset("./example/main.js");

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath));
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }

  return queue;
}

const graph = createGraph();

function build(graph) {
  // 读取模版信息
  const templete = fs.readFileSync("./bundle.ejs", {
    encoding: "utf-8",
  });

  const data = graph.map((asset) => {
    return {
      id: asset.id,
      code: asset.code,
      mapping: asset.mapping,
    };
  });

  // 如下代码是template里面的动态渲染代码类似于jsp 里面的data就是我们ejs.render传入的data
  // <% data.forEach((item) => { %>
  //   '<%- item["filePath"] %>': function (require, module, exports) {
  //     <%- item["code"] %>
  //       },
  // <% }); %>

  // 通过ejs生成模版代码
  const code = ejs.render(templete, { data });

  let outPutPath = "./dist/bundle-pro.js";
  // 这里的context的目的是让plugin触发，在回调函数内能够改变webpack打包的行为,在tap注册事件的回调函数那里可以调 context.changeOutputPath
  let context = {
    changeOutputPath: function (path) {
      outPutPath = path;
    },
  };

  // 插件plugin【ChangeOutputPlugin】 触发事件
  // hooks代表钩子函数
  hooks.emitFile.call(context);

  // 将我们模版代码生成bundle.js文件
  fs.writeFileSync(outPutPath, code);
}

build(graph);
