#### 实现一个 `Storage`

   > 实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)

   首先，什么是单例模式。。。

   ##### 定义

   确保一个类仅有一个实例，并提供一个访问它的全局访问点。

   ##### 应用场景

   比如说线程池，全局缓存等。 `window` 对象就是一个单例。这种只需要一个对象的就用单例模式。

--> 回到题目

   1. ES5

      ```javascript
      function StorageSingleton () {}
      StorageSingleton.prototype.getItem = function (key){
          return localStorage.getItem(key)
      }
      StorageSingleton.prototype.setItem = function (key, value) {
          return localStorage.setItem(key, value)
      }
      
      var Storage = (function(){
          var instance
          return function(){
              return instance || instance = new StorageSingleton()
          }
      })()
      var a = new Storage()
      var b = new Storage()
      a === b // true
      a.setItem('a','a')
      b.getItem('a') // 'a'
      ```
  2. ES6

      ```javascript
      class Storage {
          constructor(){
              if(!Storage.instance){
                  Storage.instance = this
              }
              return Storage.instance
          }
          getItem (key) {
              return localStorage.getItem(key)
          }
          setItem (key, value) {
              return localStorage.setItem(key, value)
          }
      }
      let a = new Storage()
      let b = new Storage()
      a === b // true
      a.setItem('a','a')
      b.getItem('a') // 'a'
      ```