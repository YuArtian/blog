# JS异步编程( Promise，async，setTimeout以及event loop等)

<h3 id='single_thread_js'>浅谈1：单线程的 JS</h3>

众所周知，JS是单线程的。同一时间只能运行一个脚本，多个脚本必须一个接一个的运行。

而且脚本的加载与页面渲染互斥，脚本加载的时间过长就会导致页面渲染阻塞。[ --> 浏览器的线程](#brower_thread)

<h3 id='brower_threaded'>深究：浏览器线程</h3>

浏览器是多线程的，以下是其主要线程

- GUI渲染线程： 负责渲染页面。基本过程有：
   	1. 根据HTML解析出DOM结构。
   	2. 根据CSS解析出CSSOM