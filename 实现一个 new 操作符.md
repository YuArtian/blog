# 实现一个 new 操作符

### new 操作符的执行过程

1. 生成一个新对象{}
2. 将新对象的 \_\_proto\_\_ (隐式原型)指向构造函数的prototype
3. 将this绑定到新对象上
4. 返回构造函数的返回值，如果构造函数没有返回，则返回这个新对象

### ES5实现

```javascript
function _new (fn){
    var obj = {}
    var args = Array.prototype.shift.call(arguments)
    obj.__proto__ = fn.prototype
    var result = fn.apply(obj, args)
    if(result instanceof Object){
        return result
    }
    return obj
}
```

### ES6实现

```javascript
function _new (fn, ...args) {
    let obj = Object.create(fn)
    let result = fn.apply(obj, args)
    return result instanceof Object ? result : obj
}
```

### 具体问题

1. ```javascript
   function Foo (){
       this.name = 'Foo'
   }
   function Boo (){
       this.name = 'Boo'
       return {}
   }
   console.log('new Foo().name', new Foo().name) // 'Foo'
   console.log('Foo().name', Foo().name)// Error
   console.log('new Boo().name', new Boo().name)//undefined
   console.log('Boo().name', Boo().name)//undefined
   ```

   