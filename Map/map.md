# JS基础

## 规范

[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/ECMA%E7%9A%84%E5%90%84%E7%89%88%E6%9C%AC%E8%A7%84%E8%8C%83.md](https://github.com/YuArtian/blog/blob/master/JS基础/ECMA的各版本规范.md)

## 基础

### 语句



### let const var

#### 不存在变量提升

使用 `let` `const` 声明的变量，在声明之前使用该对象，就会报错 `ReferenceError`

#### 暂时性死区（TDZ）

只要块级作用域内存在 let、const 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响

其本质就是，只要进入当前作用域，所要使用的变量就已经存在，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

ES6 规定暂时性死区和 let 、const 语句不出现变量提升，主要是为了减少运行时的错误，防止在变量声明前就是用这个变量，从而导致意料之外的行为

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

<del>function 声明出现在 if 等语句中的情况有点复杂，它仍然作用于脚本、模块和函数体级别，在预处理阶段，仍然会产生变量，它不再被提前赋值</del>

新旧版本的内核不一样，这里新版的内核依然可以得到 function 的值

```
console.log(foo); //undefined //f foo(){}
if(true) {
    function foo(){

    }
}
```

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

- 1000个Promise

## generator

- async/await

  

## 深浅拷贝



## this指向



## new实现

new 的执行过程：

- 以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象
- 将 this 和调用参数传给构造器，执行
- 如果构造器返回的是对象，则返回，否则返回第一步创建的对象

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

# Vue

# React

# 工程化

- webpack
- 项目发布流程

# codewar刷题

# leetcode刷题

