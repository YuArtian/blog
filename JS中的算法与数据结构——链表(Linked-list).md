# JS中的算法与数据结构——链表(Linked-list)

## 实现一个链表

```javascript
//节点类
class LinkedListNode {
    constructor(data){
        this.data = data
        this.next = null
    }
}
//链表类
const head = Symbol("head")
class LinkedList {
    constructor(){
        this[head] = null
    }
    //增加节点
    add(data){
        const newNode = new LinkedListNode(data)
        if (this[head] === null) {
            this[head] = newNode
        } else {
            let current = this[head]
            while(current.next){
                current = current.next
            }
            current.next = newNode
        }
    }
    //查找当前节点
    findAt(index){
        if (index > -1) {
            let current = this[head]
            let i = 0
            while(current !== null){
                if(i === index){
                    return current
                }
                current = current.next
                i++
            }
        } else {
            return undefined
        }
    }
    find(data){
        let current = this[head]
        while((current !== null) && (current.data !== data)){
            current = current.next
        }
        return current === null ? undefined : current
    }
    //查找前一个节点
    findPrevAt(index){
        if(index < 1){
            return undefined
        }
        let current = this[head]
        let previous = null
        let i = 0
        while(current !== null){
            if(i === index){
                return previous
            }
            previous = current
            current = current.next
            i++
        }
        return undefined
    }
    findPrev(data){
        let current = this[head]
        let previous = null
        while(current !== null){
            if(current.data === data){
                return previous === null ? undefined : previous
            }
            previous = current
            current = current.next
        }
        return undefined
    }
    //删除节点
    removeAt(index){
        //边界
        if(this[head] === null || index < 0){
            console.error('节点不存在')
            return undefined
        }
        //第一个节点
        if(index === 0){
            const node = this[head]
            this[head] = this[head].next
            return node
        }
        const current = this.findAt(index)
        const previous = this.findPrevAt(index)
        //未找到节点
        if(current === undefined){
            console.error('节点不存在')
            return undefined
        }
        //最后一个节点
        if(current.next === null){
            previous.next = null
            return current
        }
        //中间节点
        previous.next = current.next
        return current
    }
    remove(data){
        //边界
        if(this[head] === null){
            console.error('节点不存在')
            return undefined
        }
        const current = this.find(data)
        const previous = this.findPrev(data)
        //节点未找到
        if(current === undefined){
            console.error('节点不存在')
            return undefined
        }
        //第一个节点
        if(previous === undefined){
            const node = this[head]
            this[head] = this[head].next
            return node
        }
        //最后一个节点
        if(current.next === null){
            previous.next = null
            return current
        }
        //中间节点
        previous.next = current.next
        return current
    }
    //插入节点
    insertAt(node, index){
        //在前面插入
        if(index < 0){
            const current = this[head]
            this[head] = new LinkedListNode(node)
            this[head].next = current
            return
        }
        let current = this.findAt(index)
        if(current === undefined){
            console.error('节点不存在')
            return undefined
        }
        const newNode = new LinkedListNode(node)
        newNode.next = current.next
        current.next = newNode
    }
    insert(node, data){
        let current = this.find(data)
        if(current === undefined){
            console.error('节点不存在')
            return undefined
        }
        const newNode = new LinkedListNode(node)
        newNode.next = current.next
        current.next = newNode
    }
    //可迭代
    *[Symbol.iterator](){
        let current = this[head]
        while(current !== null){
            yield current.data
            current = current.next
        }
    }
}
```

### 应用

```javascript
//test
const list = new LinkedList()
list.add('0')
list.add('1')
list.add('2')
list.add('3')
list.add('4')
for(let i of list){
    console.log(i)
}
```

## 相关题目

### 合并两个有序链表

将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

#### 示例：

```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

#### 题解

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

const list_1 = new LinkedList()
list_1.add(1)
list_1.add(2)
list_1.add(4)
const list_2 = new LinkedList()
list_2.add(1)
list_2.add(3)
list_2.add(4)

function mergeTwoLists(l1, l2) {
    if (l1 === null) {
        return l2;
    } else if (l2 === null) {
        return l1;
    }
    let newHead = new LinkedListNode(0);
    let temp = newHead;
    while (l1 || l2) {
        if (l1 === null) {
            newHead.next = l2;
            break;
        }
        if (l2 === null) {
            newHead.next = l1;
            break;
        }
        console.log('l1',l1)
        console.log('l2',l2)
        if (l1.data <= l2.data) {
            newHead.next = l1
            newHead = newHead.next;
            l1 = l1.next;
        } else {
            newHead.next = l2;
            newHead = newHead.next;
            l2 = l2.next;
        }
    }
    return temp.next;
};

const newList = mergeTwoLists(list_1[head], list_2[head])
console.log('newList',newList) // 1->1->2->3->4->4
```

