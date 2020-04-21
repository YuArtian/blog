# JS基础

## 规范

[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/ECMA%E7%9A%84%E5%90%84%E7%89%88%E6%9C%AC%E8%A7%84%E8%8C%83.md](https://github.com/YuArtian/blog/blob/master/JS基础/ECMA的各版本规范.md)

## 基础

> https://juejin.im/post/5c2ca1106fb9a049ac794510
>
> https://javascript.ruanyifeng.com/advanced/interpreter.html
>
> https://segmentfault.com/a/1190000013126460

### 执行环境

`JavaScript` 代码的执行要依靠 宿主环境（浏览器，Node，其他的桌面系统等）

宿主环境会通过 JS引擎（V8等）提供 `JavaScript` 的执行环境

在这个执行期环境，首先需要创建一个代码解析的初始环境，初始化的内容包含：

1. 一套与宿主环境相关联系的规则
2. JavaScript 引擎内核（基本语法规则、逻辑、命令和算法）
3. 一组内置对象和 API
4. 其他约定

> 不同的 JavaScript 引擎定义初始化环境是不同的，这就形成了所谓的浏览器兼容性问题，因为不同的浏览器使用不同 JavaScipt 引擎
>
> 微软放弃了自家的 Edge，改用了 Chromium

### 编译原理

以 V8 为例，JS引擎的工作流程如下

<img src="https://github.com/YuArtian/blog/blob/master/Map/V8%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B.png?raw=true"/>



#### 分词/词法分析（Scanner）

JS 文件只是一个源码（就是一堆字符串），机器是无法执行的，引擎会调用 Scanner 对源码进行词法分析

词法分析 就是把源码的字符串分割出来，生成一系列的 token，也就是 **词法单元（token）**

```
var sum = 30;
// 词法分析后的结果
[
  "var" : "keyword",
  "sum" : "identifier",
  "="   : "assignment",
  "30"  : "integer",
  ";"   : "eos" (end of statement)
]
```

#### 语法分析（Parser）

> https://juejin.im/post/5c2ca1106fb9a049ac794510
>
> https://v8.dev/blog/preparser
>
> https://juejin.im/post/5cf33bd751882579e53f0130
>
> 

词法分析完后，接下来的阶段就是使用 Parser 进行语法分析，语法分析的输入就是词法分析的输出

Parser 接收 词法单元流 输出 AST（抽象语法树）

词法分析和语法分析不是完全独立的，而是交错进行的，也就是说，词法分析器不会在读取所有的词法记号后再使用语法分析器来处理。在通常情况下，每取得一个词法记号，就将其送入语法分析器进行分析

<img src="https://github.com/YuArtian/blog/blob/master/Map/%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90.png?raw=true"/>

##### 语法检查

如果 JavaScript 解释器在构造语法树的时候发现有语法错误，就会抛出异常并结束整个代码块的解析

```
<script>
function func() {
  let a = 10;
  var a = 1; //Uncaught SyntaxError: Identifier 'a' has already been declared
}
</script>
```

虽然函数 `func` 没有执行，但是在语法分析阶段就已经检查出错误，并报错了

##### 生成 AST

AST（抽象语法树）指的是源代码语法所对应的树状结构

https://astexplorer.net/ 在线生成AST

例如，var sum = 30；会对应生成如下的AST

```
{
  "type": "Program",
  "start": 0,
  "end": 13,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 13,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 12,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 7,
            "name": "sum"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 12,
            "value": 30,
            "raw": "30"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```



##### 确定词法作用域

<img src="https://github.com/YuArtian/blog/blob/master/Map/%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90%E7%A1%AE%E5%AE%9A%E8%AF%8D%E6%B3%95%E4%BD%9C%E7%94%A8%E5%9F%9F.png?raw=true"/>

生成 AST 的同时也会确定相应的词法环境结构，也就是常说的作用域



##### eager parse(全量解析) 和 lazy parse（惰性解析）

然而并不是所有 Js 都需要在初始化时就被执行，因此也不需要在初始化时就解析所有的 Js！因为编译 Js 会带来三个成本问题：

1. 编译不必要的代码会占用 CPU 资源
2. 在 GC 前会占用不必要的内存空间
3. 编译后的代码会缓存在磁盘，占用磁盘空间

因此所有主流浏览器都实现了 Lazy Parse（延迟解析）

Lazy Parse 会将不必要的函数（没有立即执行的函数）进行预解析

预解析只验证它跳过函数是语法有效的，并产生正确编译外部函数所需的所有信息

而 eager parse（全量解析）则在调用这个函数时才发生

所以，有如下两种解析器

- eager parse（全面解析）：

- - 用于解析立即执行的内容
  - 构建语法树
  - 构建函数作用域(Scopes)
  - 找出所有语法错误

- lazy parse（惰性解析/预解析）：

- - 用于跳过没有立即执行的函数
  - 不构建语法树，会构建函数词法环境，但不设置词法环境中的变量引用（variable references）和变量申明（variable declarations）
  - 解析速度，大约比eager解析器快2倍
  - 找出限定的几种错误（没有遵守 JavaScript 的规范）

###### 解析过程

这两种解析器在解析的过程中是交替进行解析的

```
let a = 0; //Top level code is eager
//IIFE
(function eager() {...})() //Body is eager
//Top level function but not IIFE
function lazy() {...} //Body is lazy
//Later
...lazy();
// -> eager parsed and complied now!;
```

所有的最外层代码 和 IIFE（立即执行函数）直接使用 eager 解析

其他函数，会先进行预解析，在调用的时候才进行全面解析

下面看看一些复杂的解析情况：

```
let f1 = function lazy() {...};使用lazy-parsing,没有问题

let  f2 = function lazy() {...}()//糟糕的情况，在看到最后的括号之前已经使用了lazy-parsing，但遇到括号后，不得不里面又转向eager-parsing，重新parse
```

对于嵌套函数对于解析会带来很不好的影响

```
function lazy_outer(){          //Lazy parse this
    function inner(){....}      //This too
}

...lazy_outer(); 
//here,V8 will lazy parsing inner angin,even it has done it already once
```

嵌套函数 inner 会被预解析两次

###### 解析过程实例分析



#### 可执行代码生成与执行

将 AST 转换成可执行代码的过程被称为代码生成。这个过程与语言、目标平台相关

经过编译阶段的准备， JavaScript 代码在内存中已经被构建为 AST语法树

然后由解析器和编译器根据这个语法树结构，一行一行的边解析边执行

##### 解析器（Ignition）

解析器 解析 AST 生成字节码（bytecode），并解释执行字节码

执行期间，会将多次执行的函数标记为 `HotSpot`（热点代码），后台的编译器  `TurboFan` 编译成高效的 机器码。再次执行这段代码时，只需要执行机器码就可以了

##### 优化编译器（TurboFan）

将字节码（Bytecode）编译生成优化的机器代码（Machine Code）存储起来

再次执行的时候直接运行缓存的机器码，以此提高性能

优化代码是根据 解释器 提供的 函数参数的变量类型等优化信息来简化代码执行流程的

所以JS代码中变量的类型变来变去，是会给V8引擎增加不少麻烦的，为了提高性能，我们可以尽量不要去改变变量的类型

##### 去优化（Deoptimize）

遇到不能优化的情况（也就是上面说的类型变了）时，则 `Deoptimize` 为 bytecode 返回给 解释器 执行

去优化会降低效率的



#### 执行流程实例

> http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D

结合一段代码，分析 JS代码的编译和执行过程，以及关于 变量提升，词法环境等

```
showName()
console.log(myname)
var myname = 'yu'
console.log(myname)
function showName() {
    console.log('第一个函数showName被执行');
}
function showName() {
    console.log('第二个函数showName被执行');
}
var showName = 'showName'
console.log(showName)
```

编译阶段：

JS引擎处理源码字符串，先进入编译阶段，进行词法分析和语法分析，目的是要生成 执行上下文 和 可执行代码

进入全局上下文，生成全局词法环境（包括变量环境组件，词法环境组件等），开始逐行编译源码

- 第 1 行和第 2 行是执行语句，在编译阶段只编译成对应的AST结构，当然之前的全局环境也有对应的AST

- 第 3 行，遇到 `var` 声明。JS引擎在变量环境组件的环境记录中添加一条 `myname` 的属性，并对其初始化为 `undefined`

- 第 4 行，JavaScript 引擎发现了一个通过 function 定义的函数，所以它将函数定义存储到堆 (HEAP）中，并在环境对象中创建一个 showName 的属性，然后将该属性值指向堆中函数的位置

- 第 5 行，声明 showName 时，在环境对象中发现同名的属性，找到堆中函数定义的位置，将之前的覆盖掉

- 第 6 行，声明名为 showName 的变量，在环境对象中发现同名的属性，但是由于函数声明优先的规则，这里的 变量声明被忽略了，所以 showName 依然是函数

- 代码编译结束，词法环境构建完成，有了执行上下文和可执行代码

   JavaScript 引擎会把声明以外的代码编译为字节码

```
showName()
console.log(myname)
myname = 'yu'
console.log(myname)
showName = 'showName'
console.log(showName)
```

进入执行阶段

执行阶段：

JavaScript 引擎开始执行"可执行代码"，按照顺序一行一行地执行

- 当执行到 showName 函数时，JavaScript 引擎便开始在变量环境对象中查找该函数

  由于变量环境对象中存在该函数的引用，所以 JavaScript 引擎便开始执行该函数

  输出结果 "第二个函数showName被执行"

- 接下来打印 myname 信息，JavaScript 引擎继续在变量环境对象中查找该对象，由于变量环境存在 myname 变量，并且其值为 undefined，所以这时候就输出 undefined

- 执行第 3 行，把 "yu" 赋给 myname 变量，赋值后变量环境中的 myname 属性值改变为"yu"

- 执行第 4 行，打印 myname 信息，由于上面已经被重新赋值，所以输出 "yu"

- 执行第 5 行，将 showName 重新赋值为 'showName'，不再引用堆内存，之前的内存被回收

- 执行第 6 行，打印输出 showName，由于 showName 被重新赋值成字符串，输出 'showName'

接下来，变量环境如下所示：

```
VariableEnvironment:
     myname -> "yu", 
     showName -> "showName"
```



### 语句

<img src="https://github.com/YuArtian/blog/blob/master/Map/yuju_1.png?raw=true"/>

<img src="https://github.com/YuArtian/blog/blob/master/Map/yuju_2.jpg?raw=true"/>

#### 表达式

https://time.geekbang.org/column/article/88827

##### 连续赋值

```
a = b = c = d
```

向右结合，等价于

```
a = (b = (c = d))
```

也就是说，先把 d 的结果赋值给 c，再把整个表达式的结果赋值给 b，再赋值给 a

##### 逗号分隔的表达式会顺次执行

整个表达式的结果 就是 最后一个逗号后的表达式结果

```
a = b, b = 1, null;
```

### 声明

#### let const 声明

##### 不存在变量提升

使用 `let` `const` 声明的变量，在声明之前使用该对象，就会报错 `ReferenceError`

let 和 const 声明虽然看上去是执行到了才会生效，但是实际上，它们还是会被预处理

如果当前作用域内有声明，就无法访问到外部的变量

```
const a = 2;
if(true){
    console.log(a); //抛错
    const a = 1;   
}
```

这里在 if 的作用域中，变量 a 声明执行到之前，我们访问了变量 a，这时会抛出一个错误，这说明 const 声明仍然是有预处理机制的

在执行到 const 语句前，我们的 JavaScript 引擎就已经知道后面的代码将会声明变量 a，从而不允许我们访问外层作用域中的 a

##### 暂时性死区（TDZ）

只要块级作用域内存在 let、const 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响

其本质就是，只要进入当前作用域，所要使用的变量就已经存在，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

ES6 规定暂时性死区和 let 、const 语句不出现变量提升，主要是为了减少运行时的错误，防止在变量声明前就是用这个变量，从而导致意料之外的行为

##### 不允许重复声明

不允许在相同作用域内，重复声明同一个变量

#### var 声明

var 声明永远作用于脚本、模块和函数体这个级别，在预处理阶段，不关心赋值的部分，只管在当前作用域声明这个变量。会进行变量提升

```
var a = 1;

function foo() {
    console.log(a); //undefined
    if(false) {
        var a = 2;
    }
}

foo();
```

var 的作用能够穿透一切语句结构，它只认脚本、模块和函数体三种语法结构

#### function 声明

在全局（脚本、模块和函数体），function 声明表现跟 var 相似，不同之处在于，function 声明不但在作用域中加入变量，还会给它赋值

function 声明出现在 if 等语句中的情况有点复杂，它仍然作用于脚本、模块和函数体级别，在预处理阶段，仍然会产生变量，它不再被提前赋值

> 内核版本不一样可能会出现不同的结果

```
console.log(foo); //undefined
if(true) {
    function foo(){

    }
}
```

##### arguments

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments

`arguments`对象是所有（非箭头）函数中都可用的 局部变量，不是 `Array` ，可以被设置

可以被转换为数组，但是对参数使用slice会阻止某些JavaScript引擎中的优化

```
var args = Array.prototype.slice.call(arguments);
var args = [].slice.call(arguments);

// ES2015
const args = Array.from(arguments);
const args = [...arguments];

var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
```



`typeof` 返回 `object`

#### class 声明

class 声明在全局的行为跟 function 和 var 都不一样。在 class 声明之前使用 class 名，会抛错

但是其实 class 声明也是有预处理的

```
var c = 1;
function foo(){
    console.log(c);//报错
    class c {}
}
foo();
```

如果去掉 class 声明，则会正常打印出 1，也就是说，出现在后面的 class 声明影响了前面语句的结果

这说明，class 声明也是会被预处理的，它会在作用域中创建变量，并且要求访问它时抛出错误

class 内部，可以使用 constructor 关键字来定义构造函数。还能定义 getter/setter 和方法

class 默认内部的函数定义都是 strict 模式的



## String方法/实现

## Array方法/实现

## Object方法/实现

##　Number

## JS引擎

[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/JS%E5%BC%95%E6%93%8E.md](https://github.com/YuArtian/blog/blob/master/JS基础/JS引擎/JS引擎.md)

## 可执行环境

[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/%E5%8F%AF%E6%89%A7%E8%A1%8C%E4%BB%A3%E7%A0%81%E4%B8%8E%E6%89%A7%E8%A1%8C%E7%8E%AF%E5%A2%83.md](https://github.com/YuArtian/blog/blob/master/JS基础/可执行代码与执行环境.md)

- 执行方式=

- 上下文，执行栈=

- 作用域、作用域链=
- 闭包=
- event loop，宏任务，微任务，nodejs事件循环=
- 块级作用域

## 原型链和继承

- 继承



## Promise

### 实现一个 Promise

> https://github.com/YvetteLau/Blog/issues/2

```
/**
 * 1. new Promise时，需要传递一个 executor 执行器，执行器立刻执行
 * 2. executor 接受两个参数，分别是 resolve 和 reject
 * 3. promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled
 * 4. promise 的状态一旦确认，就不会再改变
 * 5. promise 都有 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 
 *      和 promise 失败的回调 onRejected
 * 6. 如果调用 then 时，promise已经成功，则执行 onFulfilled，并将promise的值作为参数传递进去。
 *      如果promise已经失败，那么执行 onRejected, 并将 promise 失败的原因作为参数传递进去。
 *      如果promise的状态是pending，需要将onFulfilled和onRejected函数存放起来，等待状态确定后，再依次将对应的函数执行(发布订阅)
 * 7. then 的参数 onFulfilled 和 onRejected 可以缺省
 * 8. promise 可以then多次，promise 的then 方法返回一个 promise
 * 9. 如果 then 返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功的回调(onFulfilled)
 * 10. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调(onRejected)
 * 11.如果 then 返回的是一个promise,那么需要等这个promise，那么会等这个promise执行完，promise如果成功，
 *   就走下一个then的成功，如果失败，就走下一个then的失败
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise(executor) {
    let self = this;
    self.status = PENDING;
    self.onFulfilled = [];//成功的回调
    self.onRejected = []; //失败的回调
    //PromiseA+ 2.1
    function resolve(value) {
        if (self.status === PENDING) {
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilled.forEach(fn => fn());//PromiseA+ 2.2.6.1
        }
    }

    function reject(reason) {
        if (self.status === PENDING) {
            self.status = REJECTED;
            self.reason = reason;
            self.onRejected.forEach(fn => fn());//PromiseA+ 2.2.6.2
        }
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    let self = this;
    //PromiseA+ 2.2.7
    let promise2 = new Promise((resolve, reject) => {
        if (self.status === FULFILLED) {
            //PromiseA+ 2.2.2
            //PromiseA+ 2.2.4 --- setTimeout
            setTimeout(() => {
                try {
                    //PromiseA+ 2.2.7.1
                    let x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    //PromiseA+ 2.2.7.2
                    reject(e);
                }
            });
        } else if (self.status === REJECTED) {
            //PromiseA+ 2.2.3
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        } else if (self.status === PENDING) {
            self.onFulfilled.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            self.onRejected.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    });
    return promise2;
}

function resolvePromise(promise2, x, resolve, reject) {
    let self = this;
    //PromiseA+ 2.3.1
    if (promise2 === x) {
        reject(new TypeError('Chaining cycle'));
    }
    if (x && typeof x === 'object' || typeof x === 'function') {
        let used; //PromiseA+2.3.3.3.3 只能调用一次
        try {
            let then = x.then;
            if (typeof then === 'function') {
                //PromiseA+2.3.3
                then.call(x, (y) => {
                    //PromiseA+2.3.3.1
                    if (used) return;
                    used = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    //PromiseA+2.3.3.2
                    if (used) return;
                    used = true;
                    reject(r);
                });

            }else{
                //PromiseA+2.3.3.4
                if (used) return;
                used = true;
                resolve(x);
            }
        } catch (e) {
            //PromiseA+ 2.3.3.2
            if (used) return;
            used = true;
            reject(e);
        }
    } else {
        //PromiseA+ 2.3.3.4
        resolve(x);
    }
}

module.exports = Promise;
```



- 1000个Promise

## generator

- async/await

  

## 深浅拷贝



## this指向



## new实现

new 的执行过程：

- 以构造器的 prototype 属性为原型，创建新对象 instance
- 将构造器的 this 指向 instance ，将参数传给构造器，并执行构造器
- 判断执行后返回的结果
  - 如果返回的是基本类型（值类型）则忽略掉，依然返回 instance
  - 如果返回的是引用类型，就直接返回

代码实现：

```
function _new (constructer, ...args) {
  if (!constructer) return
  let target = Object.create(constructer.prototype)
  let value = constructer.apply(target, args)
  if (value && ( typeof value === 'function' || typeof value === 'object' )) {
    return value
  }
  return target
}
```



## 类型转换

## call, bind, apply

## Proxy

## 精度丢失

## 装饰符写法应用

## instanceof

## 事件模型，冒泡机制

## 模块化

#### js模块加载方案

`CommonJS `（服务器） 、`AMD `（浏览器）、`ES6 module`

##### 区别

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性

#### ES6 module

`JavaScript` 有两种源文件，一种叫做脚本，一种叫做模块。这个区分是在 ES6 引入了模块机制开始的，在 ES5 和之前的版本中，就只有一种源文件类型（就只有脚本）。脚本是可以由浏览器或者 node 环境引入执行的，而模块只能由 `JavaScript ` 代码用 `import ` 引入执行

模块和脚本之间的区别仅仅在于是否包含 import 和 export

现代浏览器可以支持用 `script ` 标签引入模块或者脚本，如果要引入模块，必须给 `script ` 标签添加 `type=“module”` 。如果引入脚本，则不需要 `type`

```
<script type="module" src="xxxxx.js"></script>
```

`script ` 标签如果不加 `type="module"`，默认认为我们加载的文件是脚本而非模块，如果我们在脚本中写了 `export`，就会抛错

## 其他

### 指令序言机制

脚本和模块都支持一种特别的语法，叫做指令序言（Directive Prologs）

"use strict"是 JavaScript 标准中规定的唯一一种指令序言

JavaScript 的指令序言是只有一个字符串直接量的表达式语句，它只能出现在脚本、模块和函数体的最前面

### 自动加分号



# 高级js

- 防抖/节流
- 柯里化
- combineReduce
- 模块化标准和实现
- 设计模式
  - 观察者模式实现

- 浏览器原理

  - 浏览器架构，各个进程作用，如何协调工作
  - 内核架构，各个线程作用，如何协调工作
- 渲染过程，加载优化方案
  
  - 回流和重绘
  
  - js defer，sync
    - css preload
    - 各个标签位置影响
    - 阻塞渲染原理
  - webworker和sharedworker原理与应用
- 图层和图层合并

# CSS

- 优先级计算方式
- flex布局方案
- grid布局方案
- 垂直居中，水平居中，居中方案
- img 优化方案，size
- less，sass使用
  - 函数
  - 变量
- 定位，绝对定位，相对定位
- 文档流
- 盒模型
- float
- 清除浮动
- 塌陷和解决塌陷

# HTML

- 语义化
- 标签和元素，行内元素，块级元素
- 通信原理

  - cookie机制、session机制
  - TCP链接原理，3次握手
  - ISO网络模型
  - 缓存机制与缓存方案

# 浏览器原理

[浏览器原理](https://github.com/YuArtian/blog/blob/master/JS基础/浏览器原理/浏览器原理.md)

## 浏览器

pc 端使用 `navigator` 获取 `appName`，`appCodeName`，`userAgent` 等都没有参考价值，并不能正确的获取名称。（这样主要是出于兼容的考虑 [?] ）<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator">Navigator</a>

移动端可以使用 `navigator.userAgent` 来判断客户端型号 <a href="https://segmentfault.com/a/1190000008789985">移动端UserAgent</a>

## 浏览器的进程

浏览器是多进程的，有：

- Browser 主进程：浏览器的主进程（负责协调、主控），只有一个
- 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建 
- GPU进程：最多一个，用于3D绘制等 
- 浏览器渲染进程（浏览器内核，Renderer）：默认每个Tab页面一个进程，互不影响。进行页面渲染，脚本执行，事件处理等
- 网络进程：该进程主要负责页面的网络资源加载，比如在地址栏输入一个网页地址，网络进程会将请求后得到的资源交给渲染进程处理

**浏览器多进程的优势**

相比于单进程浏览器，多进程有如下优点：

- 避免单个page crash影响整个浏览器
- 避免第三方插件crash影响整个浏览器
- 多进程充分利用多核优势
- 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

当然，内存等资源消耗也会更大，有点空间换时间的意思

## 浏览器内核（渲染进程|Renderer）

Chrome：Blink（Webkit的分支）



页面的渲染，JS的执行，事件的循环，都在这个进程内进行

浏览器内核是多线程的，如图

<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8E%9F%E7%90%86/1.png?raw=true" style="width:300px;"/>

- **GUI 渲染线程**
  * 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等
  * 当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行
  * 注意，GUI渲染线程与JS引擎线程是互斥的，当JS引擎执行时GUI线程会被挂起（相当于被冻结了），GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行

- **JS引擎线程**（<a href="[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/JS%E5%BC%95%E6%93%8E.md](https://github.com/YuArtian/blog/blob/master/JS基础/JS引擎/JS引擎.md)">JS引擎</a>）
  * 也称为JS内核，负责处理Javascript脚本程序（例如V8引擎）
  * JS引擎线程负责解析Javascript脚本，运行代码
  * JS引擎一直等待着任务队列中任务的到来，然后加以处理，一个Tab页（renderer进程）中无论什么时候都只有一个JS线程在运行JS程序
  * 同样注意，GUI渲染线程与JS引擎线程是互斥的，所以如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞
- **事件触发线程**
  * 归属于浏览器而不是JS引擎，用来控制事件循环
  * 当JS引擎执行代码块如 `setTimeOut` 时（也可来自浏览器内核的其他线程，如鼠标点击、AJAX异步请求等），会将对应任务添加到事件线程
  * 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理
  * 注意，由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）
- **定时器触发线程**
  * setInterval与setTimeout所在线程
  * 浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
  * 因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待JS引擎空闲后执行）
  * 注意，W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms
- **异步http请求线程**
  * 在XMLHttpRequest在连接后是通过浏览器新开一个线程请求
  * 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由JavaScript引擎执行

## webworker & sharedWorker

- 创建Worker时，JS引擎向浏览器申请开一个子线程（子线程是浏览器开的，完全受主线程控制，而且不能操作DOM）
- JS引擎线程与worker线程间通过特定的方式通信（postMessage API，需要通过序列化对象来与线程交互特定的数据）

## 浏览器渲染流程

> https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn
>
> https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn
>
> https://juejin.im/post/5bd96c5a5188257f96542cbf

浏览器器内核拿到内容后，正常的渲染大概可以划分成以下几个步骤：

- 输入url，发起请求，请求html文件

- 预扫描<?>

- <img src="https://github.com/YuArtian/blog/blob/master/Map/domtree%E7%94%9F%E6%88%90%E8%BF%87%E7%A8%8B.png?raw=true"/>

  1. **转换：** 浏览器从磁盘或网络读取 HTML 的原始字节，并根据文件的指定编码（例如 UTF-8）将它们转换成各个字符
  2. **令牌化：** 浏览器将字符串转换成 [W3C HTML5 标准](http://www.w3.org/TR/html5/)规定的各种令牌，例如，“\<html\>”、“\<body\>”，以及其他尖括号内的字符串。每个令牌都具有特殊含义和一组规则
  3. **词法分析：** 把发出的令牌转换成定义其 属性：规则（key: value）的 "对象"
  4. **DOM 构建：** 根据 HTML 标签之间的嵌套关系，把词法分析后创建的对象链接在一个树数据结构内

  > 上面的最终输出是 文档对象模型 (DOM)，浏览器对页面进行的所有进一步处理都会用到

  > 解析 HTML 标签过程中如果遇到了脚本标签 \<script\> DOM 构建会暂停，直道脚本下载完并执行完毕

  > 如果遇到 link 标签，会立即发出对该资源的请求，下载 css 文件，不阻塞 DOM 构建

  > 如果遇到 style 标签，则参与 CSSOM（CSS 对象模型）的构建，不阻塞 DOM 构建

- 生成DOM的同时也在构建 CSSOM （CSS 对象模型）

  和 DOM 的生成一样，CSS 字节转换成字符，接着转换成令牌和节点，最后链接到一个称为 CSSOM 的树结构内

  每个浏览器都提供一组默认样式（也称为“User Agent 样式”），即不提供任何自定义样式时所看到的样式，我们的样式只是替换这些默认样式

- 将 CSSOM 结合 DOM 合并成 渲染树（render tree）

  - 某些节点不可见（例如脚本标记、元标记等），因为它们不会体现在渲染输出中，所以会被忽略

  - 某些节点通过 CSS 隐藏，因此在渲染树中也会被忽略，例如，该节点上设置了`display: none` 属性

    **Note:**  `visibility: hidden` 与 `display: none` 是不一样的。前者隐藏元素，但元素仍占据着布局空间（即将其渲染成一个空框），而后者 (`display: none`) 将元素从渲染树中完全移除，元素既不可见，也不是布局的组成部分

  - 对于每个可见节点，为其找到适配的 CSSOM 规则并应用它们

- 布局 render 树（Layout/reflow），负责各元素尺寸、位置的计算

- 绘制 render 树（Paint），绘制页面像素信息，本质上就是填充像素的过程

  包括绘制文字、颜色、图像、边框和阴影等，也就是一个 DOM 元素所有的可视效果

  一般来说，这个绘制过程是在多个层上完成的

- 渲染层合并（Composite），对页面中 DOM 元素的绘制是在多个层上进行的

  在每个层上完成绘制过程之后，浏览器会将所有层按照合理的顺序合并成一个图层，然后显示在屏幕上

  对于有位置重叠的元素的页面，这个过程尤其重要，因为一旦图层的合并顺序出错，将会导致元素显示异常

  





<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8E%9F%E7%90%86/2.png?raw=true"/>





### 重绘（Repaint）和重排/回流（Reflow）

回流必将引起重绘，重绘不一定会引起回流

#### 重排（Reflow）

通过构造渲染树，将可见DOM节点以及它对应的样式结合起来，还需要计算它们在设备视口（viewport）内的确切位置和大小，这个计算的阶段就是 重排

当 `Render Tree` 中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器也会重排

根据改变的范围和程度，渲染树中或大或小的部分需要重新计算，有些改变会触发整个页面的重排

比如，滚动条出现的时候或者修改了根节点

我们前面知道了，回流这一阶段主要是计算节点的位置和几何信息，那么当页面布局和几何信息发生变化的时候，就需要回流。比如以下情况：

- 添加或删除可见的DOM元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代
- 页面一开始渲染的时候（这肯定避免不了）
- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

#### 重绘（Repaint）

最终，通过构造渲染树和回流阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息(位置、大小)

那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘节点

#### 浏览器的优化机制

现代的浏览器都是很聪明的，由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。但是！**当你获取布局信息的操作的时候，会强制队列刷新**，比如当你访问以下属性或者使用以下方法：

- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- clientTop、clientLeft、clientWidth、clientHeight
- getComputedStyle()
- getBoundingClientRect
- 具体可以访问这个网站：https://gist.github.com/paulirish/5d52fb081b3570c81e3a

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，**最好避免使用上面列出的属性，他们都会刷新渲染队列。**如果要使用它们，最好将值缓存起来

#### 如何避免重绘或者重排

> https://github.com/chenjigeng/blog/issues/4

##### 最小化重绘和重排

由于重绘和重排可能代价比较昂贵，因此最好就是可以减少它的发生次数。为了减少发生次数，我们可以合并多次对DOM和样式的修改，然后一次处理掉。考虑这个例子

```
const el = document.getElementById('test');
el.style.padding = '5px';
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
```

例子中，有三个样式属性被修改了，每一个都会影响元素的几何结构，引起回流。当然，大部分现代浏览器都对其做了优化，因此，只会触发一次重排。但是如果在旧版的浏览器或者在上面代码执行的时候，有其他代码访问了布局信息(上文中的会触发回流的布局信息)，那么就会导致三次重排。

因此，我们可以合并所有的改变然后依次处理，比如我们可以采取以下的方式：

- 使用cssText

  ```
  const el = document.getElementById('test');
  el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;';
  ```

- 修改CSS的class

  ```
  const el = document.getElementById('test');
  el.className += ' active';
  ```

##### 批量修改DOM

> 注意这个例子跟上面的例子是不一样的
>
> 这里是对新生成的 li 操作，并插入 ul
>
> 上面的例子是直接修改了已有的元素多次的情况

当我们需要对DOM对一系列修改的时候，可以通过以下步骤减少回流重绘次数：

1. 使元素脱离文档流
2. 对其进行多次修改
3. 将元素带回到文档中

该过程的第一步和第三步可能会引起回流，但是经过第一步之后，对DOM的所有修改都不会引起回流，因为它已经不在渲染树了。

有三种方式可以让DOM脱离文档流：

- 隐藏元素，应用修改，重新显示
- 使用文档片段(document fragment)在当前DOM之外构建一个子树，再把它拷贝回文档。
- 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。

考虑我们要执行一段批量插入节点的代码：

```
function appendDataToElement(appendToElement, data) {
    let li;
    for (let i = 0; i < data.length; i++) {
    	li = document.createElement('li');
        li.textContent = 'text';
        appendToElement.appendChild(li);
    }
}

const ul = document.getElementById('list');
appendDataToElement(ul, data);
```

如果我们直接这样执行的话，由于每次循环都会插入一个新的节点，会导致浏览器回流一次。

我们可以使用这三种方式进行优化:

###### 隐藏元素，应用修改，重新显示

这个会在展示和隐藏节点的时候，产生两次重绘

```
function appendDataToElement(appendToElement, data) {
    let li;
    for (let i = 0; i < data.length; i++) {
    	li = document.createElement('li');
        li.textContent = 'text';
        appendToElement.appendChild(li);
    }
}
const ul = document.getElementById('list');
ul.style.display = 'none';
appendDataToElement(ul, data);
ul.style.display = 'block';
```

###### 文档片段(document fragment)

通过 `createDocumentFragment` 创建一个游离于DOM树之外的节点，然后在此节点上批量操作，最后插入DOM树中，因此只触发一次重排

```
const ul = document.getElementById('list');
const fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
ul.appendChild(fragment);
```

###### 拷贝原始元素

将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素

```
const ul = document.getElementById('list');
const clone = ul.cloneNode(true);
appendDataToElement(clone, data);
ul.parentNode.replaceChild(clone, ul);
```

对于上述那种情况，我写了一个[demo](https://chenjigeng.github.io/example/share/避免回流重绘/批量修改DOM.html)来测试修改前和修改后的性能。然而实验结果不是很理想。

> 原因：原因其实上面也说过了，浏览器会使用队列来储存多次修改，进行优化，所以对这个优化方案，我们其实不用优先考虑

##### 避免触发同步布局事件

上文我们说过，当我们访问元素的一些属性的时候，会导致浏览器强制清空队列，进行强制同步布局。举个例子，比如说我们想将一个p标签数组的宽度赋值为一个元素的宽度，我们可能写出这样的代码：

```
function initP() {
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.width = box.offsetWidth + 'px';
    }
}
```

这段代码看上去是没有什么问题，可是其实会造成很大的性能问题。在每次循环的时候，都读取了box的一个offsetWidth属性值，然后利用它来更新p标签的width属性。这就导致了每一次循环的时候，浏览器都必须先使上一次循环中的样式更新操作生效，才能响应本次循环的样式读取操作。每一次循环都会强制浏览器刷新队列。我们可以优化为:

```
const width = box.offsetWidth;
function initP() {
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.width = width + 'px';
    }
}
```

同样，我也写了个[demo](https://chenjigeng.github.io/example/share/避免回流重绘/避免快速连续的布局.html)来比较两者的性能差异。你可以自己点开这个demo体验下。这个对比差距就比较明显

##### 对于复杂动画效果,使用绝对定位让其脱离文档流

对于复杂动画效果，由于会经常的引起回流重绘，因此，我们可以使用绝对定位，让它脱离文档流。否则会引起父元素以及后续元素频繁的回流。这个我们就直接上个[例子](https://chenjigeng.github.io/example/share/避免回流重绘/将复杂动画浮动化.html)。

打开这个例子后，我们可以打开控制台，控制台上会输出当前的帧数(虽然不准)。

[![image-20181210223750055](https://camo.githubusercontent.com/b55259705298334e5b07754a86ef0fea14795a6c/68747470733a2f2f696d67323031382e636e626c6f67732e636f6d2f626c6f672f3939333334332f3230313831322f3939333334332d32303138313231303233313034383630392d3631393032323439342e706e67)](https://camo.githubusercontent.com/b55259705298334e5b07754a86ef0fea14795a6c/68747470733a2f2f696d67323031382e636e626c6f67732e636f6d2f626c6f672f3939333334332f3230313831322f3939333334332d32303138313231303233313034383630392d3631393032323439342e706e67)

从上图中，我们可以看到，帧数一直都没到60。这个时候，只要我们点击一下那个按钮，把这个元素设置为绝对定位，帧数就可以稳定60

##### 合成层优化（GPU加速）

> https://fed.taobao.org/blog/taofed/do71ct/performance-composite/



常见的触发硬件加速的css属性：

- transform
- opacity
- filters
- will-change

在某些特定条件下，浏览器会主动将渲染层提至合成层，那么影响 composite 的因素有哪些？

1. 3D transforms: translate3d, translateZ 等;
2. video, canvas, iframe 等元素;
3. 通过 Element.animate() 实现的 opacity 动画转换;
4. 通过 СSS 动画实现的 opacity 动画转换;
5. position: fixed;
6. will-change;
7. filter;
8. 有合成层后代同时本身 overflow 不为 visible（如果本身是因为明确的定位因素产生的 SelfPaintingLayer，则需要 z-index 不为 auto）
   等等…

###### 优点

提升为合成层简单说来有以下几点好处：

- 合成层的位图，会交由 GPU 合成，比 CPU 处理要快

- 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层

- 对于 transform 和 opacity 效果，不会触发 layout 和 paint



**以下是应该提升为合成层的情况**

###### 提升动画效果的元素

提升合成层的最好方式是使用 CSS 的 will-change 属性

will-change 设置为 opacity、transform、top、left、bottom、right 可以将元素提升为合成层

```
#target {
  will-change: transform;
}
```

对于那些目前还不支持 will-change 属性的浏览器，目前常用的是使用一个 3D transform 属性来强制提升为合成层：

```
#target {
  transform: translateZ(0);
}
```

###### 使用 transform 或者 opacity 来实现动画效果

>  元素提升为合成层后，transform 和 opacity 不会触发 paint，但如果不是合成层，则其依然会触发 paint

对于一些体验要求较高的关键动画，比如一些交互复杂的玩法页面，存在持续变化位置的 animation 元素

最好是使用 transform 来实现而不是通过改变 left/top 的方式

这样做的原因是，如果使用 left/top 来实现位置变化，animation 节点和 Document 将被放到了同一个 GraphicsLayer 中进行渲染，持续的动画效果将导致整个 Document 不断地执行重绘

而使用 transform 并且 提升为合成层的话，能够让 animation 节点被放置到一个独立合成层中进行渲染绘制，动画发生时不会影响到其它层

并且另一方面，动画会完全运行在 GPU 上，相比起 CPU 处理图层后再发送给显卡进行显示绘制来说，这样的动画往往更加流畅

###### 减少绘制区域

对于不需要重新绘制的区域应尽量避免绘制，以减少绘制区域，比如一个 fix 在页面顶部的固定不变的导航 header，在页面内容某个区域 repaint 时，整个屏幕包括 fix 的 header 也会被重绘

而对于固定不变的区域，我们期望其并不会被重绘，因此可以通过之前的方法，将其提升为独立的合成层

减少绘制区域，需要仔细分析页面，区分绘制区域，减少重绘区域甚至避免重绘

###### css3硬件加速的坑

- 如果你为太多元素使用css3硬件加速，会导致内存占用较大，会有性能问题

- 在GPU渲染字体会导致抗锯齿无效

  这是因为GPU和CPU的算法不同

  因此如果你不在动画结束的时候关闭硬件加速，会产生字体模糊



### 渲染阻塞

HTML 和 CSS 都是阻塞浏览器渲染的资源

#### HTML阻塞渲染

HTML 显然是必需的，因为如果没有 DOM，我们就没有可渲染的内容，但 CSS 的必要性可能就不太明显

#### CSS阻塞渲染

CSS 是阻塞渲染的资源。需要将它尽早、尽快地下载到客户端，以便缩短首次渲染的时间

**但是 CSS 并不阻塞 DOM解析生成 DOM tree**

CSS 有可能阻塞在它后面的 `js` 代码的执行

比如在一个 `link` 标签后面的 `js` 代码会一直等到 css 加载完成之后才执行

Firefox 在样式表加载和解析的过程中，会禁止所有脚本

而对于 WebKit 而言，仅当脚本尝试访问的样式属性可能受尚未加载的样式表影响时，它才会禁止该脚本

#### JS阻塞渲染

解析DOM时，当浏览器遇到一个 script 标记，DOM 构建将暂停，直至脚本完成执行，然后继续构建 DOM

每次去执行  JavaScript 脚本都会严重地阻塞 DOM树 的构建

##### <a href="#defer_async"/>defer 和 async</a>



### 样式计算

构建渲染树时，需要计算每一个渲染对象的可视化属性，这是通过计算每个元素的样式属性来完成的



### 页面生命周期

> https://zh.javascript.info/onload-ondomcontentloaded

HTML 页面的生命周期包含三个重要事件：

- `DOMContentLoaded` —— 浏览器已完全加载 HTML，并构建了 DOM 树，但像 img 和样式表之类的外部资源可能尚未加载完成
- `load` —— 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等
- `beforeunload/unload` —— 当用户正在离开页面时

每个事件都是有用的：

- `DOMContentLoaded` 事件 —— DOM 已经就绪，因此处理程序可以查找 DOM 节点，并初始化接口
- `load` 事件 —— 外部资源已加载完成，样式已被应用，图片大小也已知了
- `beforeunload` 事件 —— 用户正在离开：我们可以检查用户是否保存了更改，并询问他是否真的要离开
- `unload` 事件 —— 用户几乎已经离开了，但是我们仍然可以启动一些操作，例如发送统计数据

#### DOMContentLoaded

##### 使用

`DOMContentLoaded` 事件发生在 `document` 对象上，必须用 `addEventListenser` 捕获

```
document.addEventListener("DOMContentLoaded", ready);
// 不是 "document.onDOMContentLoaded = ..."
```

##### DOMContentLoaded 和 js

DOMContentLoaded 会等待所有 js 脚本执行结束之后才触发

例外：

- 带有 `async` 的 js 不会阻塞 DOMContentLoaded
- `document.createElement('script')` 动态生成的 js 不会阻塞 DOMContentLoaded

##### DOMContentLoaded 和 css

css 不阻塞 DOMContentLoaded

例外：

样式之后有 js 脚本，因为 js 必须等 css 加载完才能执行，而 DOMContentLoaded 要等 js 加载完

所以，这个时候的 css 间接的阻塞了 DOMContentLoaded

##### 內建自动填充

Firefox，Chrome 和 Opera 都会在 `DOMContentLoaded` 中自动填充表单

如果 `DOMContentLoaded` 被需要加载很长时间的脚本延迟触发，那么自动填充也会等待

#### window.onload

当整个页面，包括样式、图片和其他资源被加载完成时，会触发 `window` 对象上的 `load` 事件

可以通过 `onload` 属性获取此事件

#### window.onbeforeunload

> https://www.chromestatus.com/feature/5082396709879808

如果访问者触发了离开页面的导航（navigation）或试图关闭窗口，`beforeunload` 处理程序将要求进行更多确认

onbeforeunload 的弹窗只有在特定条件时（页面中存在 form 等并且和用户发生交互）才被触发弹窗

但是事件是一直会被触发的

#### window.unload

当访问者离开页面时，`window` 对象上的 `unload` 事件就会被触发

我们可以在那里做一些不涉及延迟的操作，例如关闭相关的弹出窗口等

##### 发送分析数据

有一个值得注意的特殊情况是发送分析数据

假设我们收集有关页面使用情况的数据：鼠标点击，滚动，被查看的页面区域等

自然地，当用户要离开的时候，我们希望通过 `unload` 事件将数据保存到我们的服务器上

但是通常，当一个文档被卸载时（unloaded），所有相关的网络请求都会被中止，有两种方法方法可以满足这种需求

###### navigator.sendBeacon

离开页面的时候，可以利用 navigator.sendBeacon 发送数据

它在后台发送数据，转换到另外一个页面不会有延迟：浏览器离开页面，但仍然在执行 `sendBeacon`

```
let analyticsData = { /* 带有收集的数据的对象 */ };

window.addEventListener("unload", function() {
  navigator.sendBeacon("/analytics", JSON.stringify(analyticsData));
};
```

- 请求以 POST 方式发送
- 我们不仅能发送字符串，还能发送表单以及其他格式的数据，但通常是一个字符串化的对象
- 数据大小限制在 64kb

###### fetch 中的 keepalive

同样可以做到离开页面还能进行网络请求

但有一些限制：

-  `keepalive` 请求的 body 限制为 64kb
  - 如果我们收集了更多数据，我们可以定期将其以数据包的形式发送出去，这样就不会留下太多数据给最后的 `onunload` 请求了
  - 该限制是对当前正在进行的所有请求的。因此，我们无法通过创建 100 个请求，每个 64kb 这样来作弊
- 如果请求是在 `onunload` 中发起的，将无法处理服务器响应，因为文档在那个时候已经卸载了（unloaded），函数将无法工作
  - 通常来说，服务器会向此类请求发送空响应，所以这不是问题

#### document.readyState & readystatechange

`document.readyState` 属性可以为我们提供当前加载状态的信息

- `loading` —— 文档正在被加载
- `interactive` —— 文档被全部读取
- `complete` —— 文档被全部读取，并且所有资源（例如图片等）都已加载完成

还有一个 `readystatechange` 事件，会在状态发生改变时触发，因此我们可以打印所有这些状态

#### 整体声明周期流程

```
<script>
  log('initial readyState:' + document.readyState);

  document.addEventListener('readystatechange', () => log('readyState:' + document.readyState));
  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));

  window.onload = () => log('window onload');
</script>

<iframe src="iframe.html" onload="log('iframe onload')"></iframe>

<img src="http://en.js.cx/clipart/train.gif" id="img">
<script>
  img.onload = () => log('img onload');
</script>
```

典型输出：

1. [1] initial readyState:loading
2. [2] readyState:interactive
3. [2] DOMContentLoaded
4. [3] iframe onload
5. [4] img onload
6. [4] readyState:complete
7. [4] window onload

### css加载是否会阻塞dom树渲染

头部引入的 css，下载是由异步线程单独下载

- css加载不会阻塞DOM树解析（异步加载时DOM照常构建）
- 但会阻塞render树渲染（渲染时需等css加载完毕，因为render树需要css信息）

### 普通图层和复合图层

> https://juejin.im/entry/59dc9aedf265da43200232f9



### <a name="defer_async">script标签中的 defer 和 async</a>

> https://segmentfault.com/q/1010000000640869
>
> https://github.com/hehongwei44/my-blog/issues/72

1.  **普通脚本** \<script src="script.js" \>\</script\>

   没有 `defer` 或 `async`，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 `script` 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行

2.  **async** \<script async src="script.js">\</script\>

   `async` 一定会在页面的 load 事件前执行，但可能会在 DOMContentLoad 事件触发之前或之后执行

   `async` 的脚本下载完成之后会立刻执行，执行过程会阻塞渲染

   `async` 并不保证执行顺序，可以用于 Google Analytics 之类的不依赖其他脚本的代码

3.  **defer** \<script defer src="script.js">\</script\>

   有 `defer`，加载后续文档元素的过程将和 `script.js` 的加载并行进行（异步）

   `defer` 按照加载顺序执行脚本<?> 

   `script.js` 的执行要在所有元素解析完成之后，`DOMContentLoaded` 事件触发之前完成
   
4.  **动态脚本**

    ```
    let script = document.createElement('script');
    script.src = "/article/script-async-defer/long.js";
    document.body.append(script); // (*)
    ```

    当脚本被附加到文档 `(*)` 时，脚本就会立即开始加载

    默认情况下，动态脚本的行为是 `async` 的

    可以通过将 `async` 特性显式地修改为 `false`，以将脚本的加载顺序更改为文档顺序（就像常规脚本一样）

不支持 defer 属性的浏览器的话，把所有脚本都丢到 \</body\> 之前，此法可保证非脚本的其他一切元素能够以最快的速度得到加载和解析

<img src="https://github.com/YuArtian/blog/blob/master/Map/async_defer.png?raw=true"/>





## 优化

**1. 使用 `media` 媒体查询来优化 CSS文件加载，避免防止阻塞的发生 <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=zh-cn">参考</a> **

eg：

```
<link href="style.css"    rel="stylesheet">
<link href="style.css"    rel="stylesheet" media="all">
<link href="portrait.css" rel="stylesheet" media="orientation:portrait">
<link href="print.css"    rel="stylesheet" media="print">
```

- 第一个声明阻塞渲染，适用于所有情况
- 第二个声明同样阻塞渲染：“all”是默认类型，如果您不指定任何类型，则隐式设置为“all”。因此，第一个声明和第二个声明实际上是等效的
- 第三个声明具有动态媒体查询，将在网页加载时计算。根据网页加载时设备的方向（<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/orientation">`orientation` 属性</a>），portrait.css 可能阻塞渲染，也可能不阻塞渲染
- 最后一个声明只在打印网页时应用，因此网页首次在浏览器中加载时，它不会阻塞渲染

**2. 使用 CDN节点加速**

**3. 合理使用缓存**

#### 



# 网络通信

## Web网络基础

> 参考
>
> https://mp.weixin.qq.com/s?__biz=MzAxNDYwODEzNw==&mid=2247485663&idx=1&sn=5f74a69b69c1880d32a17e0977554d55&source=41#wechat_redirect
>
> 

### 网络分层

#### 为什么要分层：

1. 各层次之间是独立的

   某一层并不需要知道它的下一层是如何实现的，而仅仅需要知道该层通过层间的接口所提供的服务。这样，整个问题的复杂程度就下降了。也就是说上一层的工作如何进行并不影响下一层的工作，这样我们在进行每一层的工作设计时只要保证接口不变可以随意调整层内的工作方式

2. 灵活性好

   当任何一层发生变化时，只要层间接口关系保持不变，则在这层以上或以下层均不受影响。当某一层出现技术革新或者某一层在工作中出现问题时不会连累到其它层的工作，排除问题时也只需要考虑这一层单独的问题即可

3. 结构上可分割开

   各层都可以采用最合适的技术来实现。技术的发展往往不对称的，层次化的划分有效避免了木桶效应，不会因为某一方面技术的不完善而影响整体的工作效率

4. 易于实现和维护

   这种结构使得实现和调试一个庞大又复杂的系统变得易于处理，因为整个的系统已经被分解为若干个相对独立的子系统。进行调试和维护时，可以对每一层进行单独的调试，避免了出现找不到、解决错问题的情况

5. 能促进标准化工作

   因为每一层的功能及其所提供的服务都已有了精确的说明。标准化的好处就是可以随意替换其中的某一层，对于使用和科研来说十分方便

#### OSI模型（7层）

ISO提出的OSI（Open System Interconnection）模型将网络分为七层

即 物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

OSI模型共分七层：

1. 物理层：用物理手段将电脑连接起来，对应网线、网卡、接口等物理设备

2. 数据链路层：将由物理层传来的未经处理的位数据包装成数据帧，在通信的实体间建立数据链路连接

   - MAC地址：网络中计算机设备的唯一标识，从计算机在厂商生产出来就被十六进制的数标识为MAC 地址
   - 广播：广播可以帮助我们能够知道对方的 MAC 地址

3. 网络层：为数据在结点之间传输创建逻辑链路，通过[路由选择](https://baike.baidu.com/item/路由选择)算法为子网选择最适当的 ip地址，是 **IP协议**工作的地方

   两台计算机之间的通信分为同一子网络和不同子网络之间。怎么判断两台计算机是否在同一子网络（局域网）中？这就是网络层要解决的问题

   - IP协议：IP编址方案、分组封装格式及分组转发规则
   - 子网掩码：由 32 个二进制位组成，用来划分IP地址中哪一部分是网络号，哪一部分是机器号

4. 传输层：向用户提供可靠的端口到端口(End-to-End)服务，处理[数据包](https://baike.baidu.com/item/数据包)错误、数据包次序，以及其他一些关键传输问题。传输层向高层屏蔽了下层数据通信的细节，是**TCP协议**工作的地方

   - UDP协议
   - TCP协议： TCP 三次握手和四次挥手，就是传输层中完成的

5. 会话层：建立起两端之间的会话关系，并负责数据的传送，负责维护两个结点之间的传输链接，以便确保点到点传输不中断，以及管理数据交换等功能

6. 表示层：用于处理在两个通信系统中交换信息的表示方式，主要包括数据格式变换、[数据加密与解密](https://baike.baidu.com/item/数据加密与解密)、[数据压缩](https://baike.baidu.com/item/数据压缩)与恢复等功能

7. 应用层：网络操作系统和具体的应用程序，对应WWW服务器、FTP服务器等应用软件，**HTTP协议** 工作的地方

   - HTTP协议

#### 因特网协议（5层）

因特网协议栈共有五层：应用层、传输层、网络层、链路层和物理层

这也是实际使用中使用的分层方式

#### TCP/IP模型（4层）

应用层、传输层、网络层、数据链路层

### TCP/IP 协议族

**TCP/IP** 是互联网相关的各类协议族的总称

通常使用的网络（包括互联网）是在 `TCP/IP` 协议族的基础上运作的。而 `HTTP ` 属于它内部的一个子集

## HTTP状态码

### 101 Switching Protocol（协议切换）

表示服务器响应客户端升级协议的请求（ `Upgrade` 请求头 ）正在进行协议切换

## 协议升级机制

### <a name="升级到WebSocket">升级到WebSocket</a>

通过升级HTTP或HTTPS连接来实现 WebSocket

对于前端来讲，可以直接使用 [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) ，大部分都会自动完成

```html
webSocket = new WebSocket("ws://destination.server.ext", "optionalProtocol");
```

或者 `wss://` 

#### Connection & Upgrade（请求头）（必须）

如果需要从头开始创建WebSocket连接，则必须自己处理握手过程。

创建初始HTTP / 1.1会话后，需要通过向[`Upgrade`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Upgrade)和[`Connection`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Connection)标头添加标准请求来请求升级，如下所示：

```html
Connection: Upgrade
Upgrade: websocket
```

#### 其他可选

##### Sec-WebSocket-Extensions（请求头）

WebSocket  扩展

用 `,` 分隔，有参数的字段用 `;` 分隔

```html
Sec-WebSocket-Extensions: superspeed, colormode; depth=16
```

##### Sec-WebSocket-Key（请求）

是一个 Base64 encode的值，这个是浏览器随机生成的，告诉服务器：别忽悠我，我要验证你是不是webSocket客服

##### Sec-WebSocket-Accept（仅响应头）

和 Sec-WebSocket-Key 配合使用，并不能提供安全性，只能防止乱用。

这样的机制可以验证双方都是 socket

##### Sec-WebSocket-Protocol

是一个用户定义的字符串，用来区分相同URL下，不同的服务所需要的协议

##### Sec-WebSocket-Version

说明 WebSocket 版本

### <a name="升级到HTTP/2">升级到HTTP/2</a> <?>

#### http

客户端使用 HTTP `Upgrade` 机制请求升级

HTTP2-Settings 首部字段是一个专用于连接的首部字段，它包含管理 HTTP/2 连接的参数(使用 Base64 编码)，其前提是假设服务端会接受升级请求

```
 GET / HTTP/1.1
 Host: server.example.com
 Connection: Upgrade, HTTP2-Settings
 Upgrade: h2c
 HTTP2-Settings: <base64url encoding of HTTP/2 SETTINGS payload>
```

服务器如果支持 http/2 并同意升级，则转换协议，否则忽略

```
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: h2c
```

目前浏览器只支持 TLS 加密下的 HTTP/2 通信，也就是说，HTTP 不能协商升级到 HTTP/2

#### https

TLS 加密中在 Client-Hello 和 Server-Hello 的过程中通过 [ALPN](https://zh.wikipedia.org/wiki/应用层协议协商) 进行协议协商，可以升级到 HTTP/2

## WebSocket

> WebSocket 是什么原理？为什么可以实现持久连接？ - Ovear的回答 - 知乎 https://www.zhihu.com/question/20215561/answer/40316953



Websocket是一个**持久化**的协议，相对于HTTP这种**非持久**的协议来说

Websocket是基于HTTP协议的，或者说**借用**了HTTP的协议来完成一部分握手

### [升级到WebSocket](#升级到WebSocket)



## 请求分析（Chrome devtool）

https://developers.google.com/web/tools/chrome-devtools/network/understanding-resource-timing

https://developers.google.com/web/tools/chrome-devtools/network/reference

<img src="https://github.com/YuArtian/blog/blob/master/Map/waterfall-hover.png?raw=true"/>

<a href="https://developers.google.com/web/tools/chrome-devtools/network/reference#timing-explanation">名词解释</a>

## 

## HTTP2

> https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn
>
> https://http2.akamai.com/demo
>
> HTTP/2 相比 1.0 有哪些重大改进？ - Leo Zhang的回答 - 知乎 https://www.zhihu.com/question/34074946/answer/75364178
>
> HTTP/2 对现在的网页访问，有什么大的优化呢？体现在什么地方？ - Leo Zhang的回答 - 知乎 https://www.zhihu.com/question/24774343/answer/96586977
>
> https://juejin.im/post/5b88a4f56fb9a01a0b31a67e

### HTTP/2 的主要目标

- 通过支持完整的请求与响应复用来减少延迟
- 通过有效压缩 HTTP 标头字段将协议开销降至最低
- 增加对请求优先级和服务器推送的支持

### HTTP/2 主要特点

HTTP/2 没有改动 HTTP 的应用语义。 HTTP 方法、状态代码、URI 和标头字段等核心概念一如往常

不过，HTTP/2 修改了数据格式化（分帧）以及在客户端与服务器间传输的方式

HTTP/2 中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流

每个数据流都以消息的形式发送，而消息又由一个或多个帧组成

多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装

### 二进制分帧层

在不改动 HTTP/1.x 的语义、方法、状态码、URI 以及首部字段….. 的情况下, HTTP/2 是如何做到「突破 HTTP1.1 的性能限制，改进传输性能，实现低延迟和高吞吐量」的 ?

关键之一就是在 应用层(HTTP/2)和传输层(TCP or UDP)之间增加一个二进制分帧层

新的二进制分帧机制改变了客户端与服务器之间交换数据的方式

- *数据流*：已建立的连接内的双向字节流，可以承载一条或多条消息
- *消息*：与逻辑请求或响应消息对应的完整的一系列帧
- *帧*：HTTP/2 通信的最小单位，每个帧都包含帧头，至少也会标识出当前帧所属的数据流

这些概念的关系总结如下：

- 所有通信都在一个 TCP 连接上完成，此连接可以承载任意数量的双向数据流
- 每个数据流都有一个唯一的标识符和可选的优先级信息，用于承载双向消息
- 每条消息都是一条逻辑 HTTP 消息（例如请求或响应），包含一个或多个帧
- 帧是最小的通信单位，承载着特定类型的数据，例如 HTTP 标头、消息负载等等。 来自不同数据流的帧可以交错发送，然后再根据每个帧头的数据流标识符重新组装

### 多路复用

在一个 TCP 连接上，我们可以向对方不断发送帧，每帧的 stream identifier 的标明这一帧属于哪个流，然后在对方接收时，根据 stream identifier 拼接每个流的所有帧组成一整块数据。 把 HTTP/1.1 每个请求都当作一个流，那么多个请求变成多个流，请求响应数据分成多个帧，不同流中的帧交错地发送给对方，这就是 HTTP/2 中的多路复用

流的概念实现了单连接上多个 请求 - 响应 并行，解决了线头阻塞的问题

减少了 TCP 连接数量和 TCP 连接慢启动造成的问题，合并多个请求为一个的优化也将不再适用

### 首部压缩

HTTP/2 使用了专门为首部压缩而设计的 [HPACK](https://link.zhihu.com/?target=http%3A//http2.github.io/http2-spec/compression.html) 算法

### 服务端推送<?>

> server push 需要服务端设置，并不是说浏览器发起请求，与此请求相关的资源服务端就会自动推送

服务端推送是一种在客户端请求之前发送数据的机制

在 HTTP/2 中，服务器可以对客户端的一个请求发送多个响应

Server Push 让 HTTP1.x 时代使用内嵌资源的优化手段变得没有意义；如果一个请求是由你的主页发起的，服务器很可能会响应主页内容、logo 以及样式表，因为它知道客户端会用到这些东西

#### Sever Push过程<?>

先发送 **PUSH_PROMISE** 帧，来告知客户端要推送的内容。对于要 push 的资源，客户端不再发起请求

#### 如果客户端早已在缓存中有了一份 copy 怎么办<?>

因为 Push 本身具有投机性，所以肯定会出现推送过去的东西浏览器不需要的情况

1. 允许客户端发送 **RESET_STREAM** 主动取消 push <?>

   即使这样，Server-Push 满足条件时便会发起推送，可是客户端已经有缓存了想发送 RST 拒收，而服务器在收到 RST 之前已经推送资源了，虽然这部分推送无效但是肯定会占用带宽

2. Cache Digests <?>

3. 客户端可以限制 PUSH 流的数目，也可以设置一个很低的流量窗口来限制 PUSH 发送的数据大小

### 数据流优先级<?>

HTTP/2 标准允许每个数据流都有一个关联的权重和依赖关系：

- 可以向每个数据流分配一个介于 1 至 256 之间的整数。
- 每个数据流与其他数据流之间可以存在显式依赖关系

### 流控制<?>

流控制是一种阻止发送方向接收方发送大量数据的机制

### 如何升级到 HTTP/2

#### 部署 HTTP/2

> https://zhuanlan.zhihu.com/p/29609078

<img src="https://github.com/YuArtian/blog/blob/master/Map/%E5%A6%82%E4%BD%95%E5%8D%87%E7%BA%A7%E5%88%B0http2.jpg?raw=true"/>

nginx和客户端是HTTP/2，而nginx和业务服务还是HTTP/1.1，因为nginx的服务和业务服务通常是处于同一个内网，速度一般会很快，而nginx和客户端的连接就不太可控了，如果业务服务本身支持HTTP/2，会更好

#### 协商升级

[HTTP/2协商升级](#HTTP/2协商升级)

# 网络安全

## 劫持

最常见的都是 ISP（网络运营商）的劫持

### DNS劫持

DNS劫持：在DNS服务器中，将www..com的域名对应的IP地址进行了变化。你解析出来的域名对应的IP，在劫持前后不一样

1. 本地DNS劫持 ：攻击者在用户的计算机上安装木马恶意软件，并更改本地DNS设置以将用户重定向到恶意站点

2. 路由器DNS劫持：许多路由器都有默认密码或固件漏洞，攻击者可以接管路由器并覆盖DNS设置，从而影响连接到该路由器的所有用户

3. 中间 DNS攻击的人：攻击者拦截用户和DNS服务器之间的通信，并提供指向恶意站点的不同目标IP地址

4. 流氓DNS服务器：攻击者攻击DNS服务器，并更改DNS记录以将DNS请求重定向到恶意站点

### HTTP劫持

HTTP劫持：你DNS解析的域名的IP地址不变。在和网站交互过程中的劫持了你的请求。在网站发给你信息前就给你返回了请求

通常是在网页上加入一些广告，网站升级成 https 可以降低风险

# 跨域

## 同源策略

> https://www.zhihu.com/question/25427931

两个 url 中的 协议、域名、端口 都相同的时候，则认为他们是同源的

一个域内的脚本仅仅具有本域内的权限，可以理解为本域脚本只能读写本域内的资源，而无法访问其它域的资源

这种安全限制称为同源策略，然而安全性和方便性是成反比的

设想若把 html、js、css、flash，image 等文件全部布置在一台服务器上，小网站这样凑活还行，大中网站如果这样做服务器根本受不了的，可用性都不能保证

现代浏览器在安全性和可用性之间选择了一个平衡点。在遵循同源策略的基础上，选择性地为同源策略"开放了后门"

img script style 等标签，都允许垮域引用资源，严格说这都是不符合同源要求的

然而，你也只能是引用这些资源而已，并不能读取这些资源的内容

## JSONP

json with padding 填充式json

### 原理

1. JSONP是通过 script 标签加载数据的方式去获取数据当做 JS 代码来执行

2. 提前在页面上声明一个函数，函数名通过接口传参的方式传给后台，后台解析到函数名后在原始数据上「包裹」这个函数名，发送给前端。换句话说，JSONP 需要对应接口的后端的配合才能实现

### 封装

```
function jsonp(setting){
  setting.data = setting.data || {}
  setting.key = setting.key||'callback'
  setting.callback = setting.callback||function(){} 
  setting.data[setting.key] = '__onGetData__'

  window.__onGetData__ = function(data){
    setting.callback (data);
  }

  var script = document.createElement('script')
  var query = []
  for(var key in setting.data){
    query.push( key + '='+ encodeURIComponent(setting.data[key]) )
  }
  script.src = setting.url + '?' + query.join('&')
  document.head.appendChild(script)
  document.head.removeChild(script)

}

jsonp({
  url: 'http://api.jirengu.com/weather.php',
  callback: function(ret){
    console.log(ret)
  }
})
jsonp({
  url: 'http://photo.sina.cn/aj/index',
  key: 'jsoncallback',
  data: {
    page: 1,
    cate: 'recommend'
  },
  callback: function(ret){
    console.log(ret)
  }
})
```

### 缺点

- 只有 GET 方法

- 错误处理机制并不完善

- JSONP并不是跨域规范，它存在很明显的安全问题：callback参数注入和资源访问授权设置

  可以在服务端端进行一些权限的限制

  服务端和客户端也都依然可以做一些注入的安全处理，哪怕被攻克，它也只能读一些东西

  但是就算是比较安全的CORS，同样可以在服务端设置出现漏洞或者不在浏览器的跨域限制环境下进行攻击，而且它不仅可以读，还可以写

## CORS

> https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
>
> https://zhuanlan.zhihu.com/p/38972475
>
> 



跨域资源共享([CORS](https://developer.mozilla.org/zh-CN/docs/Glossary/CORS)) 是一种机制，它使用额外的 [HTTP](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP) 头来告诉浏览器 让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源

CORS 请求会带上 `Origin`请求头，用来向别人的网站表明自己是谁；非 CORS 请求不带`Origin`头

跨域资源共享标准（ [cross-origin sharing standard](http://www.w3.org/TR/cors/) ）允许在下列场景中使用跨域 HTTP 请求：

- 由 [`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 或 [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 发起的跨域 HTTP 请求。
- Web 字体 (CSS 中通过` @font-face `使用跨域字体资源), [因此，网站就可以发布 TrueType 字体资源，并只允许已授权网站进行跨站调用](http://www.webfonts.info/wiki/index.php?title=%40font-face_support_in_Firefox)
- [WebGL 贴图](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)
- 使用 `drawImage` 将 Images/video 画面绘制到 canvas

### 预检请求

#### 简单请求

简单请求不会触发预检请求，满足下面情况的成为简单请求

- 使用 GET、HEAD、POST 方法

- 首部字段不能超出以下集合

  - Accept

  - Accept-Language

  - Content-Language

  - Content-Type，以及其值仅限于：

    - text/plain
    - multipart/form-data
    - application/x-www-form-urlencode

  - 请求中 `XMLHttpRequestUpload` 对象均没有注册任何事件监听

    但 `XMLHttpRequestUpload`  可以使用 `XMLHttpRequestUpload.upload` 访问

  - 请求中没有 `ReadableStream` 对象

> 部分浏览器的部分版本的实现可能会为 [`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept), [`Accept-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language), 和 [`Content-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Language) 首部字段的值添加了额外的限制
>
> 总之还是要看浏览器的实现才行

#### 预检请求

不满足简单请求的，都必须首先使用 OPTIONS 方法发起一个预检请求到服务器，来确定服务器是否允许后续的实际请求

"预检请求“的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响



### CORS 静态资源缓存错乱

> https://zhuanlan.zhihu.com/p/38972475

#### 情况1

在同一个浏览器下，先打开了`foo.taobao.com`上的一个页面，访问了我们的资源，这个资源被浏览器缓存了下来，和资源内容一起缓存的还有`Access-Control-Allow-Origin: https://foo.taobao.com`响应头

这时又打开 `bar.taobao.com`上的一个页面，这个页面也要访问那个资源，这时它会读取本地缓存，读到的 `Access-Control-Allow-Origin`头是缓存下的 `https://foo.taobao.com` 而不是自己想要的 `https://bar.taobao.com`，这时就报跨域错误了，虽然它应该是能访问到这份资源的

#### 情况2

上面举的例子是“区分对待不同的`Origin`请求头”这类条件型 CORS 响应下引起的缓存错乱，这种问题是需要用户访问多个网站（`foo.taobao.com`和`bar.taobao.com`）后才可能触发的问题

“区分对待有无`Origin`请求头”也可能会造成类似的问题，而且在同一个站点下就有可能触发

比如用户先访问了`foo.taobao.com`的一个页面 A，页面 A 里用 img 标签加载了一张图片，注意这时候这张图片已经被浏览器缓存了，并且缓存里没有 Access-Control-Allow-Origin 响应头，因为发起的请求不带 Origin 请求头

此时用户又访问了 `foo.taobao.com` 的另一个页面 B，**页面 B 里用 XHR 请求同一张图片**

结果读了缓存，没有发现 CORS 响应头，报了跨域错误

在一些场景下，页面 A 和页面 B 有可能会是同一个页面，也就是说在同一个页面里就有可能触发这个问题

#### 解决

使用 Vary：Origin

有一个 HTTP **响应头**叫 `Vary`，`Vary` 响应头就是让同一个 URL 根据某个请求头的不同而使用不同的缓存

比如常见的 `Vary: Accept-Encoding` 表示客户端要根据`Accept-Encoding`请求头的不同而使用不同的缓存，比如 gizp 的缓存一份，未压缩的缓存为另一份

在 CORS 的场景下，我们需要使用 `Vary: Origin` 来保证不同网站发起的请求使用各自的缓存

比如从`foo.taobao.com`发起的请求缓存下的响应头是：

```text
Access-Control-Allow-Origin: https://foo.taobao.com
Vary: Origin
```

的话，`bar.taobao.com`在发起同 URL 的请求就不会使用这份缓存了，因为 `Origin`请求头变了

还有 img 标签发起的非 CORS 请求缓存下的响应头是：

```text
Vary: Origin
```

的话， 在使用 **XHR 发起的 CORS 请求**也不会使用那份缓存，因为 `Origin` 请求头从无到有，也算是变了

##### 总结一下就是

**对于可缓存的静态资源来说**

- 如果是写死的 `Access-Control-Allow-Origin`，一定不要加 `Vary: Origin`
- 如果是根据 `Origin`请求头动态计算出的 `Access-Control-Allow-Origin`，一定要始终加上 `Vary: Origin`，即便在没有 `Origin`请求头的情况

然而 OSS 和 S3 都有这样的 bug，并没有在响应中加入 vary

##### 如何解决

如果服务提供商就是不修，只能自己解决。可以通过增加额外的 URL 参数的方式，比如在非 CORS 请求场景下不加额外参数，在 CORS 场景下加个 `?cors`，这样就不会使用同一份缓存了







# Sec-Fetch-Mode







# Vue

# React

# 工程化

- webpack
- 项目发布流程

# 优化

https://segmentfault.com/a/1190000022205291



# codewar刷题

# leetcode刷题

