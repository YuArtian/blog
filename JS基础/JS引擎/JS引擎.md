# JS引擎

在运行C、C++以及Java等程序之前，需要进行编译，不能直接执行源码

但对于JavaScript来说，我们可以直接执行源码(比如：node xx.js)，它是在运行的时候先编译再执行，这种方式被称为即时编译(Just-in-time compilation)，简称为 JIT

JS引擎就是 JIT 编译器。负责编译代码，执行代码，分配内存以及垃圾回收

**JavaScirpt引擎可以将JS代码编译为不同CPU(Intel, ARM以及MIPS等)对应的汇编代码**

虽然浏览器非常多，但是主流的JavaScirpt引擎其实很少，毕竟开发一个JavaScript引擎是一件非常复杂的事情。比较出名的JS引擎有这些：

- [V8](https://v8.dev/) (Google)
- [SpiderMonkey](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey) (Mozilla)
- [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore?language=objc) (Apple)
- [Chakra](https://github.com/microsoft/ChakraCore) (Microsoft)
- IOT：[duktape](https://github.com/svaarala/duktape)、[JerryScript](https://github.com/jerryscript-project/jerryscript)

还有，最近发布[QuickJS](https://bellard.org/quickjs/)与[Hermes](https://hermesengine.dev/)也是JS引擎，它们都超越了浏览器范畴

## V8

V8由许多子模块构成，其中这4个模块是最重要的：

- [Parser](https://v8.dev/blog/scanner)：负责将 JavaScript 源码转换为 Abstract Syntax Tree (AST)
- [Ignition](https://v8.dev/docs/ignition)：interpreter，即解释器，负责将 AST 转换为 Bytecode，解释执行 Bytecode；同时收集 TurboFan优化编译所需的信息，比如函数参数的类型；
- [TurboFan](https://v8.dev/docs/turbofan)：compiler，即编译器，利用 Ignitio 所收集的类型信息，将 Bytecode 转换为优化的汇编代码；
- [Orinoco](https://v8.dev/blog/trash-talk)：garbage collector，[垃圾回收](https://blog.fundebug.com/2019/07/03/javascript-garbage-collection/)模块，负责将程序不再需要的内存空间回收；

其中，Parser，Ignition以及TurboFan可以将JS源码编译为汇编代码

当 V8 编译 JavaScript 代码时，解析器(parser)将生成一个抽象语法树(AST)。语法树是 JavaScript 代码的句法结构的树形表示形式。解释器 Ignition 根据语法树生成字节码。TurboFan 是 V8 的优化编译器，TurboFan 将字节码生成优化的机器代码



其流程图如下：

<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/1.jpg?raw=true"/>

<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/3.png?raw=true" />



简单地说，Parser将JS源码转换为AST，然后Ignition将AST转换为Bytecode，最后TurboFan将Bytecode转换为经过优化的 Machine Code (实际上是汇编代码)。

- 如果函数没有被调用，则V8不会去编译它。
- 如果函数只被调用1次，则 Ignition 将其编译 Bytecode 就直接解释执行了。TurboFan 不会进行优化编译，因为它需要 Ignition 收集函数执行时的类型信息。这就要求函数至少需要执行1次，TurboFan才有可能进行优化编译。
- 如果函数被调用多次，则它有可能会被识别为热点函数，且Ignition收集的类型信息证明可以进行优化编译的话，这时TurboFan则会将Bytecode编译为Optimized Machine Code，以提高代码的执行性能。

图片中的红线是逆向的，这的确有点奇怪，Optimized Machine Code会被还原为Bytecode，这个过程叫做Deoptimization。这是因为Ignition收集的信息可能是错误的，比如add函数的参数之前是整数，后来又变成了字符串。生成的Optimized Machine Code已经假定add函数的参数是整数，那当然是错误的，于是需要进行Deoptimization（去优化）

### Bytecode 与 Machine Code

`Bytecode` 某种程度上就是汇编语言，只是它没有对应特定的CPU，或者说它对应的是虚拟的CPU

这样的话，生成Bytecode时简单很多，无需为不同的CPU生产不同的代码

要知道，V8支持9种不同的CPU，引入一个中间层 Bytecode，可以简化V8的编译流程，提高可扩展性

Node 中输出 bytecode

```
node --print-bytecode xxx.js
```

`Machine Code` 其实是汇编代码，可读性差很多。而且，机器的CPU类型不一样的话，生成的汇编代码也不一样

<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/2.jpg?raw=true"/>

### 分析（Parser）

#### 词法分析（Scanner）

JS 文件只是一个源码，机器是无法执行的，词法分析 就是把源码的字符串分割出来，生成一系列的 token

<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/4.png?raw=true"/>

#### 语法分析（Parser）

词法分析完后，接下来的阶段就是进行语法分析。语法分析语法分析的输入就是词法分析的输出，输出是AST抽象语法树。当程序出现语法错误的时候，V8在语法分析阶段抛出异常

<img src="https://github.com/YuArtian/blog/blob/master/JS%E5%9F%BA%E7%A1%80/JS%E5%BC%95%E6%93%8E/5.png?raw=true"/>

### 解析器（Ignition）

解析器 解析 AST 生成字节码（bytecode），并解释执行字节码

V8 字节码：

1.  每个字节码指定其输入和输出作为寄存器操作数
2.  Ignition 使用registers寄存器 r0，r1，r2... 和累加器寄存器（accumulator register）
3.  registers寄存器：函数参数和局部变量保存在用户可见的寄存器中
4. 累加器：是非用户可见寄存器，用于保存中间结果

执行期间，会将多次执行的函数标记为 `HotSpot`（热点代码） ，后台的编译器  `TurboFan` 编译成高效的 机器码。但再次执行这段代码时，只需要执行机器码就可以了。

### 编译器（TurboFan）优化

优化代码编译过程，生成 `Machine Code` 。主要是根据 解释器 提供的 类型信息等优化信息，来简化代码执行流程。遇到不能优化的情况时，则 `Deoptimize` 为 bytecode 返回给 解释器 执行

由于 优化 是根据变量类型来决定的，所以JS代码中变量的类型变来变去，是会给V8引擎增加不少麻烦的，为了提高性能，我们可以尽量不要去改变变量的类型



> https://blog.fundebug.com/2019/07/16/how-does-v8-work/



