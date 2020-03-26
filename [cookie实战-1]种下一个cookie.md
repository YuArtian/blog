# [cookie实战记录-1]种下一个cookie

## 引子

`cookie` 🍪 ~ 

也是前端实际工作中一定会碰到的（哎？<a href="[https://github.com/YuArtian/blog/blob/master/%E5%A6%82%E4%BD%95%E8%A7%A3%E5%86%B3%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82%E7%9A%84%E7%AB%9E%E6%80%81%E9%97%AE%E9%A2%98.md](https://github.com/YuArtian/blog/blob/master/如何解决异步请求的竞态问题.md)">为什么要说也呢。。。</a>）

而且由于前一阵 `Chrome` 的更新改了关于 `cookie` `sameSite` 属性的默认值，对一些项目会有不同程度的影响

所以趁机整理一下 `cookie` 相关的东西

ps: 这应该是会做成一个系列文章。总之就是比较懒，所以一点一点挤牙膏。不定时更新

pps: 写文章没想过教别人什么，就是想把书本上理论上的东西实践一下，其实就是做个实验记录

把实验过程和结果展示出来，如果有不正确不科学的地方欢迎指出，并不一定改正

## 关于 cookie

`cookie` 有别与其他存储方式，虽然存储在客户端，但要由服务器设置。也主要用于和服务器通信

`cookie` 主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

创建 `cookie` 方式：

- 由服务端设置，在响应中设置  `Set-Cookie` 响应头部
- 由客户端设置，使用 `document.cookie` 来读取和写入

创建成功之后，每次请求都会通过 `Cookie ` 字段，将对应域名下的  `cookie` 带给服务器

`cookie `是 `key=value `的格式存储，可以通过设置额外的属性，声明一条 `cookie` 的作用域，有效时间等。这些设置都统一写在`Set-Cookie` 字段中，形如：

`Set-Cookie: key=value; Path=/; Domain=xx.com; Max-Age=10086;`



> 更加详细的内容 ----> <a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies">来自MDN</a>

## 同源才能种下 cookie

出于安全考虑，浏览器采用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy">同源策略</a>  `cookie` 的写入要满足同源才行

也就是说，当前页面 和  有`Set-Cookie`  头的响应必须满足同源（协议，地址和端口号都必须相同）

我们先试验一下不同源的失败案例

#### 失败案例

为了覆盖全面，我们分别实验 `ip` 地址 和 域名 两种情况

无论如何，我们都要搞一个 `index.html` 发请求，`app.js` 作为服务端接受请求，试图种下`cookie` 

代码如下：

`index.html`

<img src="https://github.com/YuArtian/blog/blob/master/img/cookie%E5%AE%9E%E6%88%98/%E7%A7%8D%E4%B8%80%E4%B8%AAcookie/1.png?raw=true" />

`app.js`

<img src="https://github.com/YuArtian/blog/blob/master/img/cookie%E5%AE%9E%E6%88%98/%E7%A7%8D%E4%B8%80%E4%B8%AAcookie/2.png?raw=true"/>



##### 使用 ip 地址

接下来，我们直接点开 `index.html` 是不行的。。那就变成 `file://...` 了，总之，我们这里需要起一个服务

我这里为了求简单（主要是我电脑上就有）用了 <a href="https://github.com/http-party/http-server#readme">http-server</a> 。在 `index.html` 目录终端输入 `http-server` 命令就可以了

打开 `127.0.0.1:8080` 可以看到我们的页面啦，然而你会发现，虽然响应中有了 `Set-Cookie` 字段，`cookie` 还是没有种成功的

<img src="https://github.com/YuArtian/blog/blob/master/img/cookie%E5%AE%9E%E6%88%98/%E7%A7%8D%E4%B8%80%E4%B8%AAcookie/3.gif?raw=true"/>

之所以失败了，是因为在浏览器上我们的地址是 `127.0.0.1:8080` ，然而携带 `Set-Cookie` 头部的响应却来自 `127.0.0.1:3000` 。端口不同，所以不是同源的，`cookie` 就没种上

##### 使用域名

为了能用得起域名。。。我们可以改本地 `host` 配置为

```javascript
# cookie
127.0.0.1 a.com
```

`http-server` 启动命令改为

```javascript
http-server -p 80
```

在地址栏输入 `a.com` 就可以访问我们的 `index.html` 了，当然请求也要变一下

```javascript
fetch('http://a.com:3000/givemeacookie').then(...)
```

当然结果也一如既往

<img src="" />



#### 成功案例



那如果满足同源的条件，`cookie` 能不能在 ip 中使用呢？

为了达到同源的目的，我们使用 `ngnix` 进行代理

> Mac 的话还是推荐使用 `homebrew` 安装，自己解压编译什么的可太烦了
>
> 直接 `brew search nginx` 简单又省事

> 启动 `ngnix` 时可能会出现
>
>  `nginx: [error] open() "/usr/local/var/run/nginx.pid" failed (2: No such file or directory)`
>
> 不要紧张，不要害pia，找到你的 nginx.conf 的文件夹目录，mac 默认在 ` /usr/local/etc/nginx` 下，然后运行
> `nginx -c /usr/local/etc/nginx/nginx.conf` 
> 再运行`nginx -s reload`，就可以了



`ngnix` 配置如下图

<img src="https://github.com/YuArtian/blog/blob/master/img/cookie%E5%AE%9E%E6%88%98/%E7%A7%8D%E4%B8%80%E4%B8%AAcookie/4.png?raw=true"/>

有了 `nginx` 我们就不用 `http-server` 了，修改重启后直接访问 `127.0.0.1:8888`

当然，要记得 `index.html` 中的请求地址也要改成

```javascript
fetch('/api/givemeacookie').then(...)
```

这样，通过 `nginx` 就变成同源的了，我们再来操作一下





