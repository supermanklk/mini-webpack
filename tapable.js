import { SyncHook, AsyncParallelHook } from "tapable";

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook([
        "source",
        "target",
        "routesList",
      ]),
    };
  }

  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    // 调用call就是触发事件
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    return this.hooks.calculateRoutes
      .promise(source, target, routesList)
      .then((res) => {
        // res is undefined for AsyncParallelHook
        return routesList.getRoutes();
      });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, (err) => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }

  /* ... */
}

// 1、注册
let car = new Car();
// 调用tap函数就是注册
// 同步
car.hooks.accelerate.tap("test 1", (speed) => {
  console.log("faith=============", "accelerate", speed);
});

// 2、触发
car.setSpeed(100);
