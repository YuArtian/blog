# JS基础

## 规范

[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/ECMA%E7%9A%84%E5%90%84%E7%89%88%E6%9C%AC%E8%A7%84%E8%8C%83.md](https://github.com/YuArtian/blog/blob/master/JS基础/ECMA的各版本规范.md)

## 基础

### 代码执行



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



## 请求分析（Chrome devtool）

https://developers.google.com/web/tools/chrome-devtools/network/understanding-resource-timing

https://developers.google.com/web/tools/chrome-devtools/network/reference

<img src=""/>

<a href="https://developers.google.com/web/tools/chrome-devtools/network/reference#timing-explanation">名词解释</a>

## HTTP2



# Vue

# React

# 工程化

- webpack
- 项目发布流程

# 优化

https://segmentfault.com/a/1190000022205291



# codewar刷题

# leetcode刷题

