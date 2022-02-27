// 剖析
// webpack 插件是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在 整个 编译生命周期都可以访问 compiler 对象。
// https://webpack.docschina.org/concepts/plugins/#anatomy
export default class ChangeOutputPlugin {
  apply(hooks) {
    // tap是注册， 还有tapPromise
    hooks.emitFile.tap("changeOutputPath", (context) => {
      // 注册事情，设置回调函数，当事件被触发的时候我们在这里改变webpack的打包行为
      context.changeOutputPath("./dist/bundle-20220227-plugin.js");
    });
  }
}
