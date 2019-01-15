# 良心推荐 --> React-Grid-Layout

> 最近在做交易所相关的项目，用到的一个非常好用的 React 库。用来做拖拽组件的，先上法王！

![RGL_show](/Users/yuartian/Downloads/RGL_show.gif)

(图片来自RGL官方git) gif 录制自 [BitMEX.com](https://www.bitmex.com/)

ReactGridLayout 的用法非常简单 => 就是和你的其他组件一样使用 ：）

但是要记得引入库（npm install react-grid-layout）之后，要也引入相关的样式文件并确保它们都生效啦

```javascript
/node_modules/react-grid-layout/css/styles.css
/node_modules/react-resizable/css/styles.css
```

当然你同时也可以写自己的 class

一个基本的例子：

```react
import GridLayout from 'react-grid-layout';

class MyFirstGrid extends React.Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
    return (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </GridLayout>
    )
  }
}
```

这种最基础的用法中你必须要给出 `width` 属性，否则你的 `gridItem` 会挤在一起， 并且控制台会报错。

ReactGridLayout 甚至还可以结合响应式一起使用，只要应用它的 `Responsive` 

```react
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

class MyResponsiveGrid extends React.Component {
  render() {
    // {lg: layout1, md: layout2, ...}
    var layouts = getLayoutsFromSomewhere();
    return (
      <ResponsiveGridLayout className="layout" layouts={layouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        <div key="1">1</div>
        <div key="2">2</div>
        <div key="3">3</div>
      </ResponsiveGridLayout>
    )
  }
}
```



`breakpoints` 设置分割点，`cols` 设置相应宽度下的总格数，`layouts` 里面的 `layout1` 的属性名同基础的 layout 属性配置

不过，这种用法依然需要指定宽度。很不方便对吧，我们的场景大多是全屏或者自适应宽度的。

RGL 提供了 `WidthProvider` HOC 来满足你变态的需求。。。结合`Responsive`它就能在初始化和 `window resize` 时自动确定宽度。下面是一个例子：

```react
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

class MyResponsiveGrid extends React.Component {
  render() {
    // {lg: layout1, md: layout2, ...}
    var layouts = getLayoutsFromSomewhere();
    return (
      <ResponsiveGridLayout className="layout" layouts={layouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        <div key="1">1</div>
        <div key="2">2</div>
        <div key="3">3</div>
      </ResponsiveGridLayout>
    )
  }
}
```

接下来再展示一个利用`localStorage`存储响应式布局的例子吧～

```react
import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

/**
 * This layout demonstrates how to sync multiple responsive layouts to localstorage.
 */
class ResponsiveLocalStorageLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts))
    };
  }

  static get defaultProps() {
    return {
      className: "layout",
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 30
    };
  }

  resetLayout() {
    this.setState({ layouts: {} });
  }

  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ layouts });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.resetLayout()}>Reset Layout</button>
        <ResponsiveReactGridLayout
          className="layout"
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
        >
          <div key="1" data-grid={{ w: 2, h: 3, x: 0, y: 0, minW: 2, minH: 3 }}>
            <span className="text">1</span>
          </div>
          <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0, minW: 2, minH: 3 }}>
            <span className="text">2</span>
          </div>
          <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0, minW: 2, minH: 3 }}>
            <span className="text">3</span>
          </div>
          <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
            <span className="text">4</span>
          </div>
          <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0, minW: 2, minH: 3 }}>
            <span className="text">5</span>
          </div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

module.exports = ResponsiveLocalStorageLayout;

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
```

OK，that's all 。打完收工👋 

：）

