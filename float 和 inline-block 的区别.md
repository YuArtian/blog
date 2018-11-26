# float 和 inline-block 的区别

这个布局问题常常出现在可换行的列表上。

#### 共性

float 和 display: inline-block 都可以做到让元素成一排排列，然后根据父元素的宽度自动换行到下一列。

都可以自由设置元素的宽高。

#### 区别

float 元素会产生浮动效果，元素脱离当前文档流，如果父元素不清除浮动将不被撑开。

如果浮动元素高度不一致，那么下一行的第一个元素将会出现在上一行高度最大的元素的右边。

就像这样：

![1](/Users/yuartian/Downloads/1.png)

但是 inline-block 会以当前行最高的元素作为行高，下一行从头排列：

![image-20181103153226721](/Users/yuartian/Library/Application Support/typora-user-images/image-20181103153226721.png)

但是子元素之间会有空隙：

![3](/Users/yuartian/Downloads/3.png)

这是因为标签和标签之间的空格导致的。

如果你想消除这个空隙：

1. 你可以把回车去掉把标签连着写。例如：

```html
<ul>
    <li>...</li><li>...</li><li>...</li>...
</ul>
```

2. 但是这样也挫了，而且不方便浏览代码。那么你也可以在父元素上设置 font-size: 0; 使空格消除。如果子元素上有字体要求就在子元素上再设置回来就好了。

3. letter-spacing 可以控制文字的水平间距，设置成负值就可以消除空格啦。

而且 inline-block 默认的垂直方向的对齐方式是 baseline 的，想要顶部对齐需要设置 vertical-align 为 top。

#### 总结

尽可能使用 inline-block ，避免使用float布局。在DOM的布局渲染阶段 float 布局要比 inline-block 消耗性能。

如果有特殊的要求，比如两个元素一左一右的那种，那么 flex 布局了解一下，也要比float要好一点。

关键是 float 还有烦人的清除浮动问题。