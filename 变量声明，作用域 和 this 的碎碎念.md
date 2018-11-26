# 变量声明，作用域 和 this 的碎碎念

## 变量声明

- ES5 中使用 var 或者 function 声明一个变量
- ES6 中声明变量的方式比较多：let， const，import，class 。

### var 和 变量提升

使用 var 声明变量会存在变量提升的现象

```javascript
console.log(a) // undefined
var a = 1
```

实际上JS的编译器在遇到代码 `var a = 1` 时会先进行 LHS ，向当前作用域查找是否已经存在一个名称为 a 的变量

如果有则忽略该声明，如果没有则会在当前作用域集合中创建一个新的变量，名为 a 。

编译器接下来还会生成引擎运行时需要的代码，用来处理赋值操作 a = 1。

以上是JS引擎运行前，编译器在编译过程中的处理。

在引擎运行时，处理 a = 1 ，先进行 RHS，查找当前作用域是否有名称为 a 的变量。如果有则赋值。如果没有则向上级作用域查找。如果最终也没有找到变量则报错 `Uncaught ReferenceError: a is not defined`

ps：RHS 查询是查找并取得某个变量的值。LHS 查询是找到要赋值的位置。

### let / const 和 块级作用域

使用 let 和 const 声明的变量只在当前的代码块中有效，绑定在当前的块级作用域中。在此之前的ES5中只有全局作用域和函数作用域。

```javascript
{
    var a = 1;
    let b = 2;
}
console.log(a) // 1
console.log(b) // Uncaught ReferenceError: b is not defined
```

值得注意的是在 循环中的应用

```javascript
let arr = []
for(let i=0; i<10; i++){
    console.log(i) //0, //1, //2, ... //9
    arr[i] = function () {
        console.log(i)
    }
}
arr[0]() //0
arr[1]() //1
.
.
.
console.log(i) // Uncaught ReferenceError: i is not defined
```

由此可见，i 只存在于循环内部。这解决了以前 var 循环的问题

```javascript
var arr = []
for(var i=0; i<10; i++){
    console.log(i) //0, //1, //2, ... //9
    arr[i] = function () {
        console.log(i)
    }
}
arr[0]() //10
arr[1]() //10
.
.
.
console.log(i) //10
```

由于 i 是由 var 声明的会提升到全局作用域，全局作用域下只有一个变量 i ，每一次循环都是同一个变量 i ，函数中console.log(i) 中的 i 都是全局作用域下的那个 i。所以，最后的 i 累加到了  10。

然而由 let 声明的 i 只在当前的代码块中有效，只在当前的循环中有效，每次循环都是一个新声明的变量 i 。之前的值由JS引擎内部记住用来初始化本次循环的 i 。

ps： for 循环的作用域中，循环变量的定义作为父级作用域，循环内部作为单独的子作用域使用。

### 暂时性死区（TDZ）

在块级作用域中使用 let / const 声明一个变量之后，该变量就绑定了这个块级作用域。凡是在 let / const 声明之前使用该变量的，都会报错

```javascript
{
    console.log(a) // Uncaught ReferenceError: a is not defined
    let a = 1
}
```

在 let 之前的这个区域就成为 暂时性死区 ( temporal dead zone / TDZ )