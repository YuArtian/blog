# 微任务，宏任务以及Even Loop

 JavaScript的一大特点就是单线程， 也就是说，同一时间只能做一件事 

 为了协调事件、用户交互、脚本、UI 渲染和网络处理等行为，防止主线程的不阻塞，`Event Loop` 的方案应运而生。`Event Loop` 包含两类：一类是基于 [Browsing Context](https://www.w3.org/TR/html5/browsers.html#browsing-context)，一种是基于 [Worker](https://www.w3.org/TR/workers/#worker)。二者的运行是独立的，也就是说，每一个 `JavaScript `运行的"线程环境"都有一个独立的 `Event Loop`，每一个 `Web Worker` 也有一个独立的 `Event Loop` 

## 任务队列

根据规范，事件循环是通过[任务队列](https://www.w3.org/TR/html5/webappapis.html#task-queues)的机制来进行协调的。一个 Event Loop 中，可以有一个或者多个任务队列(task queue)，一个任务队列便是一系列有序任务(task)的集合；每个任务都有一个任务源(task source)，源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。

在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务[处理模型](https://www.w3.org/TR/html5/webappapis.html#event-loops-processing-model)是比较复杂的，但关键步骤如下：

- 在此次 tick 中选择最先进入队列的任务(oldest task)，如果有则执行(一次)
- 检查是否存在 Microtasks，如果存在则不停地执行，直至清空 Microtasks Queue
- 更新 render
- 主线程重复执行上述步骤

仔细查阅规范可知，异步任务可分为 `task` 和 `microtask` 两类，不同的API注册的异步任务会依次进入自身对应的队列中，然后等待 Event Loop 将它们依次压入执行栈中执行

(macro)task主要包含：script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境)

microtask主要包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)

> 在 Node 中，会优先清空 next tick queue，即通过process.nextTick 注册的函数，再清空 other queue，常见的如Promise；此外，timers(setTimeout/setInterval) 会优先于 setImmediate 执行，因为前者在 `timer` 阶段执行，后者在 `check` 阶段执行。

> requestAnimationFrame 既不属于 macrotask, 也不属于 microtask： https://stackoverflow.com/questions/43050448/when-will-requestanimationframe-be-executed

setTimeout/Promise 等API便是任务源，而进入任务队列的是他们指定的具体执行任务。来自不同任务源的任务会进入到不同的任务队列。其中setTimeout与setInterval是同源的

## 总结

```javascript
new Promise(resolve => {
    resolve(1);
    
    Promise.resolve().then(() => {
    	// t2
    	console.log(2)
    });
    console.log(4)
}).then(t => {
	// t1
	console.log(t)
});
console.log(3);
```

这段代码的流程大致如下：

1. script 任务先运行。首先遇到 `Promise` 实例，构造函数首先执行，所以首先输出了 4。此时 microtask 的任务有 `t2` 和 `t1`
2. script 任务继续运行，输出 3。至此，第一个宏任务执行完成。
3. 执行所有的微任务，先后取出 `t2` 和 `t1`，分别输出 2 和 1
4. 代码执行完毕

综上，上述代码的输出是：4321

为什么 `t2` 会先执行呢？理由如下：

- 根据 [Promises/A+规范](http://www.ituring.com.cn/article/66566)：

> 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 `then` 方法被调用的那一轮事件循环之后的新执行栈中执行

- `Promise.resolve` 方法允许调用时不带参数，直接返回一个`resolved` 状态的 `Promise` 对象。立即 `resolved` 的 `Promise` 对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时。