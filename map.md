# JS基础

## 规范

[https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/ECMA%E7%9A%84%E5%90%84%E7%89%88%E6%9C%AC%E8%A7%84%E8%8C%83.md](https://github.com/YuArtian/blog/blob/master/JS基础/ECMA的各版本规范.md)

## ES6基础

### 1. let const

#### 不存在变量提升

使用 `let` `const` 声明的变量，在声明之前使用该对象，就会报错 `ReferenceError`

#### 暂时性死区（TDZ）

只要块级作用域内存在 let、const 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响

其本质就是，只要进入当前作用域，所要使用的变量就已经存在，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

ES6 规定暂时性死区和 let 、const 语句不出现变量提升，主要是为了减少运行时的错误，防止在变量声明前就是用这个变量，从而导致意料之外的行为

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

- CSS

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

- HTML

  - 语义化
  - 标签和元素，行内元素，块级元素

- 通信原理

  - cookie机制、session机制
  - TCP链接原理，3次握手
  - ISO网络模型
  - 缓存机制与缓存方案

- Vue

- React

- 工程化

  - webpack
  - 项目发布流程

- codewar刷题

- leetcode刷题

