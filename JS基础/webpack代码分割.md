webpack代码分割

代码分割

1. 为什么分割代码

   1. 如今web应用多为SPA，遇到的首要问题是，所有模块打包到一起之后，如何避免首次入口文件过大，导致首屏渲染速度大大降低。解决方法相比都知道，可以使用`import()`语法实现模块的懒加载,比如`vue-router`:

       const main = () => import(/* webpackChunkName: "main" */ '@/views/main/index.vue')

   2. 使用懒加载之后，各个模块志中的公共模块就会重复打包

webpack3 commonChunkPlugin 缺点

```


为了解决上述第二个问题，`CommonsChunkPlugin`应运而生，它能够将全部的懒加载模块引入的共用模块统一抽取出来，形成一个新的common块，但是这又回到了上述第一个问题，首屏需要加载的公共模块往往过大，导致渲染太慢。

以前这就需要你在代码重复与入口文件控制方面做个平衡，而这个平衡挺不利于多人开发的，也不易于优化。（需要团队成员事先交流评估，哪些模块需要懒加载，哪些可以直接集成。另外，个人有个想法，就是在配置`CommonsChunkPlugin`的时候，指定抽取哪些组件里面的公共模块，理论上可行，但是团队配合比较麻烦。）

`CommonsChunkPlugin`的另一个缺点是，配置复杂，各种配置多样化，新手往往看的一脸懵逼，就如官方推荐的配置：

    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks (module) {
            // any required modules inside node_modules are extracted to vendor
            return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
                path.join(__dirname, '../node_modules')
            ) === 0
            )
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        async: 'vendor-async',
        children: true,
        minChunks: 3
    })

很多人往往不明白为什么要这样配置三次(分别是为了提取第三方模块，运行模块和业务模块)，另外其他的各种文档还有各种不同的配置
```