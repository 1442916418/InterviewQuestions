# JavaScript

## 1. JS数据类型
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em>基本数据类型</em>
        <p>Number Undefined Boolean Null String Symbol BigInt</p>
    </li>
    <li>
        <em>引用数据类型</em>
        <p>Object Function Array Date RegExp...</p>
        <p>引用类型有方法和属性，但是基本类型是没有的</p>
    </li>
<li>
<pre>
let name = "marko";

console.log(typeof name); // "string"
console.log(name.toUpperCase()); // "MARKO"

name类型是 string，属于基本类型，所以它没有属性和方法，但是在这个例子中，我们调用了一个toUpperCase()方法，它不会抛出错误，还返回了对象的变量值。
原因是基本类型的值被临时转换或强制转换为对象，因此name变量的行为类似于对象。 除null和undefined之外的每个基本类型都有自己包装对象。也就是：String，Number，Boolean，Symbol和BigInt。 在这种情况下，name.toUpperCase()在幕后看起来如下：

console.log(new String(name).toUpperCase()); // "MARKO"

在完成访问属性或调用方法之后，新创建的对象将立即被丢弃。
</pre>
</li>
</ul>
</details>

## 2. 判断数据类型的方法
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em>typeof</em>
<pre>
console.log(typeof 2);               // number
console.log(typeof true);            // boolean
console.log(typeof 'str');           // string
console.log(typeof undefined);       // undefined
console.log(typeof []);              // object 
console.log(typeof {});              // object
console.log(typeof function(){});    // function
console.log(typeof null);            // object
</pre>
<p>优点：能够快速区分基本数据类型 </p>
<p>缺点：不能将Object、Array和Null区分，都返回object</p>
    </li>
    <li>
        <em>instanceof</em>
<pre>
console.log(2 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false 
console.log('str' instanceof String);                // false  
console.log([] instanceof Array);                    // true
console.log(function(){} instanceof Function);       // true
console.log({} instanceof Object);                   // true
</pre>
<p>优点：能够区分Array、Object和Function，适合用于判断自定义的类实例对象</p>
<p>缺点：Number，Boolean，String基本数据类型不能判断</p>
    </li>
    <li>
        <em>Object.prototype.toString.call()</em>
<pre>
var toString = Object.prototype.toString;

console.log(toString.call(2));                      //[object Number]
console.log(toString.call(true));                   //[object Boolean]
console.log(toString.call('str'));                  //[object String]
console.log(toString.call([]));                     //[object Array]
console.log(toString.call(function(){}));           //[object Function]
console.log(toString.call({}));                     //[object Object]
console.log(toString.call(undefined));              //[object Undefined]
console.log(toString.call(null));                   //[object Null]
</pre>
<p>优点：精准判断数据类型</p>
<p>缺点：写法繁琐不容易记，推荐进行封装后使用</p>
    </li>
</ul>

</details>

## 3. var,let,const的区别
<details>
<summary>展开查看答案</summary>
<ul>
    <li>var 声明的变量，其作用域为该语句所在的函数内，且存在变量提升现象，var声明的变量会挂载在window</li>
    <li>let 声明的变量，其作用域为该语句所在的代码块内，不存在变量提升</li>
    <li>const 声明的变量不允许修改，如果声明的是复合类型数据，可以修改其属性，一旦声明必须赋值,不能使用null占位</li>
</ul>
</details>

## 4. null和undefined区别
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em>Undefined</em>
        <p>Undefined类型只有一个值，即undefined。当声明的变量还未被初始化时，变量的默认值为undefined</p>
        <ul>
            <li>变量被声明了，但没有赋值时，就等于undefined</li>
            <li>调用函数时，应该提供的参数没有提供，该参数等于undefined</li>
            <li>对象没有赋值的属性，该属性的值为undefined</li>
            <li>函数没有返回值时，默认返回undefined</li>
        </ul>
    </li>
    <li>
        <em>Null</em>
        <p>Null类型也只有一个值，即null。null用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象</p>
        <ul>
            <li>作为函数的参数，表示该函数的参数不是对象</li>
            <li>作为对象原型链的终点</li>
        </ul>
    </li>
</ul>
</details>

## 5. 定义函数的方法
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
        <em>函数声明</em>
<pre>
//ES5
function getSum(){}
function (){}//匿名函数
//ES6
()=>{}
</pre>
    </li>
    <li>
        <em>函数表达式</em>
<pre>
//ES5
var getSum=function(){}
//ES6
let getSum=()=>{}
</pre>
    </li>
    <li>
        <em>构造函数</em>
<pre>
const getSum = new Function('a', 'b' , 'return a + b')
</pre>
    </li>
</ol>
</details>

## 6. JS作用域的理解
<details>
<summary>展开查看答案</summary>
<p>
JS中的作用域分为两种：全局作用域和函数作用域。函数作用域中定义的变量，只能在函数中调用，外界无法访问。没有块级作用域导致了if或for这样的逻辑语句中定义的变量可以被外界访问，因此ES6中新增了let和const命令来进行块级作用域的声明。
</p>
<a target="_blank" href="http://xieyufei.com/2016/09/21/JS-Variate-Scope.html">JS作用域</a>
</details>

## 7. 闭包的理解
<details>
<summary>展开查看答案</summary>
<p>简单来说闭包就是在函数里面声明函数，本质上说就是在函数内部和函数外部搭建起一座桥梁，使得子函数可以访问父函数中所有的局部变量，但是反之不可以，这只是闭包的作用之一，另一个作用，则是保护变量不受外界污染，使其一直存在内存中，在工作中我们还是少使用闭包的好，因为闭包太消耗内存，不到万不得已的时候尽量不使用。</p>
<a target="_blank" href="http://xieyufei.com/2016/09/20/Js-Closure.html">JS闭包</a>
</details>

## 8. 数组去重
<details>
<summary>展开查看答案</summary>
<ol>
<li>
    <em>遍历循环</em>
    <p>第一种方法也是最一般、最常用的办法，使用数组的indexOf()方法。</p>
    <p>但是indexOf方法内部实现也是去遍历数组知道找到目标为止，如果待去重的数组很长且重复的元素少，则会耗费了大量的时间</p>
<pre>
let arr = [1,'1',2,'2',1,2,'x','y','f','x','y','f'];

function unique1(arr){
	let result = [arr[0]];
	for (let i = 1; i < arr.length; i++) {
		let item = arr[i];
		if(result.indexOf(item) == -1){
			result.push(item);
		}
	}
	return result;
}

console.log(unique1(arr));
</pre>
</li>
<li>
    <em>存放Hash对象</em>
    <p>第二种方法是将数组所有的元素转变成对象的键名，利用对象键名的不可重复的特性来去重。</p>
    <p>在时间消耗上来看，这种方法比第一种方法要快很多，因为从对象中取属性值消耗的时间几乎可以不计，但是存在以下两个问题</p>
    <ol>
        <li>由于需要存放Hash对象，因此在内存占用上比第一种方法会多占用更多的内存空间，就是所谓的空间换时间</li>
        <li>从上面的排序结果我们会发现一个问题，’12’不在结果中。因为在键名中，String类型的’12’和Number类型的12对于Hash对象来说都是一样的</li>
    </ol>
<pre>
let arr = [1,'1',2,'2',1,2,'x','y','f','x','y','f'];

function unique2(arr){
	let result = [];
	let obj ={};

	for(let i =0;i<arr.length;i++){
	  let item = arr[i];
	  if(!obj[item]){
	    result.push(item);
	    obj[item] = 1;
	  }
	}

	return result;
}
console.log(unique2(arr))
</pre>
</li>
    
<li>
    <em>排序比较</em>
    <p>第三种方法利用数组原生的sort()方法，将数组先进行排序，排序后比较相邻两个元素的值。</p>
    <p>这种方法比indexOf()消耗的时间要短，比存放Hash对象占用的内存要小，算是一种折中两者的方法。但是也存在一个问题，就是去重后的数组的顺序发生了改变。</p>
    <pre>
    let arr = [1,'1',2,'2',1,2,'x','y','f','x','y','f'];

    function unique3(arr) {
        let result = [arr[0]];
        arr = arr.sort();
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i];
            if (item !== result[result.length - 1]) {
                result.push(item)
            }
        }
        return result;
    }

    console.log(unique3(arr))
    </pre>
</li>

<li>
    <em>Set类型</em>
<pre>
let arr = [1,'1',2,'2',1,2,'x','y','f','x','y','f'];

function unique4(arr){
    return Array.from(new Set(arr));
}

console.log(unique4(arr));
</pre>
</li>
<li>
<em>filter实现</em>
<pre>
var array = [1, 2, 1, 1, '1'];
function unique(array) {
    var res = array.filter(function(item, index, array){
        return array.indexOf(item) === index;
    })
    return res;
}
console.log(unique(array));
</pre>
</li>
</li>
<li>
<em>Object键值对</em>
<pre>
var array = [{value: 1}, {value: 1}, {value: 2}];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        console.log(typeof item + JSON.stringify(item))
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
    })
}

console.log(unique(array)); // [{value: 1}, {value: 2}]
</pre>
</li>
</ol>
</details>

## 9. call,apply和bind区别
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
        <em>apply</em>
        <p>apply和call的区别是call方法接受的是若干个参数列表，而apply接收的是一个包含多个参数的数组</p>
<pre>
fun.apply(thisArg, [argsArray])
</pre>
    </li>
    <li>
        <em>call</em>
        <p>apply和call的区别是call方法接受的是若干个参数列表，而apply接收的是一个包含多个参数的数组</p>
<pre>
fun.call(thisArg[, arg1[, arg2[, ...]]])
</pre>
    </li>
    <li>
        <em>bind</em>
        <p>而bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列</p>
<pre>
var bindFn = fun.bind(thisArg[, arg1[, arg2[, ...]]])
bindFn()   
</pre>
    </li>
</ol>
<a target="_blank" href="https://juejin.im/post/5caaeb4bf265da24fd4dadb1">call,apply,bind</a>
</details>

## 10. ==和===区别
<details>
<summary>展开查看答案</summary>
<ul>
    <li>
        <em>==</em>
        <p>== 两边值类型不同的时候，要先进行类型转换，再比较</p>
        <ol>
            <li>如果类型不同，进行类型转换</li>
            <li>判断比较的是否是 null 或者是 undefined, 如果是, 返回 true</li>
            <li>判断两者类型是否为 string 和 number, 如果是, 将字符串转换成 number</li>
            <li>判断其中一方是否为 boolean, 如果是, 将 boolean 转为 number 再进行判断</li>
            <li>判断其中一方是否为 object 且另一方为 string、number 或者 symbol , 如果是, 将 object 转为原始类型再进行判断</li>
        </ol>
    </li>
    <li>
        <em>===</em>
        <p>===不做类型转换，类型不同的一定不等</p>
    </li>
    <li>
        <em>经典面试题：[] == ![] 为什么是true</em>
        <p>转化步骤:</p>
        <ol>
            <li>!运算符优先级最高，![]会被转为为false，因此表达式变成了：[] == false</li>
            <li>根据上面第(4)条规则，如果有一方是boolean，就把boolean转为number，因此表达式变成了：[] == 0</li>
            <li>根据上面第(5)条规则，把数组转为原始类型，调用数组的toString()方法，[]转为空字符串，因此表达式变成了：'' == 0</li>
            <li>根据上面第(3)条规则，两边数据类型为string和number，把空字符串转为0，因此表达式变成了：0 == 0</li>
            <li>两边数据类型相同，0==0为true</li>
        </ol>
    </li>
</ul>
</details>

## 11. 深拷贝和浅拷贝
<details>
<summary>展开查看答案</summary>

<ul>
    <li>
        <em>浅拷贝</em>
<pre>
function simpleClone(obj) {
    var result = {};
    for (var i in obj) {
        result[i] = obj[i];
    }
    return result;
}
</pre>
    </li>
    <li>
        <em>深拷贝，遍历对象中的每一个属性</em>
<pre>
function deepClone(obj) {
    let result;
    if (typeof obj == 'object') {
        result = isArray(obj) ? [] : {}
        for (let i in obj) {
            //isObject(obj[i]) ? deepClone(obj[i]) : obj[i]
            //多谢"朝歌在掘金"指出，多维数组会有问题
            result[i] = isObject(obj[i])||isArray(obj[i])?deepClone(obj[i]):obj[i]
        }
    } else {
        result = obj
    }
    return result
}
function isObject(obj) {
    return Object.prototype.toString.call(obj) == "[object Object]"
}
function isArray(obj) {
    return Object.prototype.toString.call(obj) == "[object Array]"
}
</pre>
    </li>
</ul>
</details>

## 12. 防抖和节流
<details>
<summary>展开查看答案</summary>

<ul>
    <li>
        <em>防抖</em>
<pre>
// 示例一
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}

// 示例二
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func,wait,immediate) {
    let timeout;

    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
}
</pre>
</li>
<li>
        <em>节流</em>
<pre>
// 示例一
function throttle(fn, cycle) {
  let start = Date.now();
  let now;
  let timer;
  return function () {
    now = Date.now();
    clearTimeout(timer);
    if (now - start >= cycle) {
      fn.apply(this, arguments);
      start = now;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, cycle);
    }
  }
}

// 示例二
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait ,type) {
    if(type===1){
        var previous = 0;
    }else if(type===2){
        var timeout;
    }
    return function() {
        let context = this;
        let args = arguments;
        if(type===1){
            let now = Date.now();

            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        }else if(type===2){
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(context, args)
                }, wait)
            }
        }
    }
}
</pre>
</li>
</ul>
</details>

## 13. 0.1+0.2!=0.3怎么处理
<details>
<summary>展开查看答案</summary>
<p>把需要计算的数字升级（乘以10的n次幂）成计算机能够精确识别的整数，等计算完成后再进行降级（除以10的n次幂），即：</p>
<pre>
(0.1*10 + 0.2*10)/10 == 0.3 //true
</pre>
<a target="_blank" href="http://xieyufei.com/2018/03/07/JS-Decimal-Accuracy.html">JS闭包</a>
</details>

## 14. JS实现继承
<details>
<summary>展开查看答案</summary>
<p>首先创建一个父类</p>
<pre>
// 定义一个动物类
function Animal(name, color) {
    // 属性
    this.name = name || 'Animal';
    this.color = color || ['black'];
    // 实例方法
    this.sleep = function () {
        console.log(this.name + '正在睡觉！');
    }
}
// 原型方法
Animal.prototype.eat = function (food) {
    console.log(this.name + '正在吃：' + food);
};
</pre>
<ul>
<li>
    <em>原型链继承</em>
    <p>new了一个空对象，这个空对象指向Animal并且Cat.prototype指向了这个空对象，这种就是基于原型链的继承</p>
    <p>特点：基于原型链，既是父类的实例，也是子类的实例。</p>
    <p>缺点：1.无法实现多继承；2.所有新实例都会共享父类实例的属性。</p>
<pre>
function Cat(name) {
    this.name = name || 'tom'
}
Cat.prototype = new Animal()

var cat = new Cat()
cat.color.push('red')
cat.sleep() //tom正在睡觉！
cat.eat('fish') //tom正在吃：fish
console.log(cat.color) //["black", "red"]
console.log(cat instanceof Animal) //true
console.log(cat instanceof Cat) //true
var new_cat = new Cat()
console.log(new_cat.color) //["black", "red"]
</pre>
</li>
<li>
    <em>构造继承</em>
    <p>特点：可以实现多继承（call多个），解决了所有实例共享父类实例属性的问题。</p>
    <p>缺点：1.只能继承父类实例的属性和方法；2.不能继承原型上的属性和方法。</p>
<pre>
function Dog(name) {
    Animal.call(this)
    this.name = name || 'mica'
}
var dog = new Dog()
dog.color.push('blue')
dog.sleep() // mica正在睡觉！
dog.eat('bone') //Uncaught TypeError: dog.eat is not a function
console.log(dog.color) //["black", "blue"]
console.log(dog instanceof Animal) //false
console.log(dog instanceof Dog) //true
var new_dog = new Dog()
console.log(new_dog.color) //["black"]
</pre>
</li>
<li>
    <em>组合继承</em>
    <p>特点：可以继承实例属性/方法，也可以继承原型属性/方法</p>
    <p>缺点：调用了两次父类构造函数，生成了两份实例</p>
<pre>
function Mouse(name){
    Animal.call(this)
    this.name = name || 'jerry'
}
Mouse.prototype = new Animal()
Mouse.prototype.constructor = Mouse

var mouse = new Mouse()
mouse.color.push('yellow)
mouse.sleep() //jerry正在睡觉！
mouse.eat('carrot') //jerry正在吃：carrot
console.log(mouse instanceof Animal)//true
console.log(mouse instanceof Mouse)//true
var new_mouse = new Mouse()
console.log(new_mouse.color) //["black"]
</pre>
</li>
</ul>
</details>

## 15. js中函数执行
<details>
<summary>展开查看答案</summary>
<pre>
1. 确定“this”的值 (确切的来说，this在JS里面不是一个变量名而是一个关键字)
2. 创建一个新的作用域
3. 处理形参/实参（没有定义过才声明，无论如何都重新赋值，没有对应实参则赋值为"undefined"）： 
对于每一个传入的实参，按照从左往右的顺序依次执行：如果对应的形参在本作用域中还没有定义，则在本作用域中声明形参，并赋值。如果已经定义过了，则重新给其赋值。(没有对应实参则赋值为"undefined"）（没有定义：就是“没有声明”的意思）
4. 处理函数定义（没有定义过才声明，无论如何都重新赋值）： 
对该函数中所有的定义的函数，按照代码写的顺序依次执行：如果这个变量名在本作用域中还没有定义，则在本作用域中声明这个函数名，并且赋值为对应的函数，如果定义了这个变量，在可写的情况下重新给这个变量赋值为这个函数，否则抛出异常。
5. 处理 "arguments"（没有定义过才声明和赋值）: 
如果在本作用域中没有定义 arguments，则在本作用域中声明arguments并给其赋值。
6. 处理变量声明（没有定义过才声明，不赋值）：
对于所有变量声明，按照代码写的顺序依次执行：如果在本作用域中没有定义这个变量，则在本作用域中声明这个变量，赋值为undefined
7. 然后执行函数代码。（当然是去变量定义里面的 var 执行）
</pre>
</details>

## 16. new一个对象的过程中发生了什么嘛
<details>
<summary>展开查看答案</summary>
<pre>
1. 创建空对象；
var obj = {};
2. 设置新对象的constructor属性为构造函数的名称，设置新对象的__proto__属性指向构造函数的prototype对象；
obj.__proto__ = ClassA.prototype;
3. 使用新对象调用函数，函数中的this被指向新实例对象：
ClassA.call(obj);//{}.构造函数();          
4. 如果无返回值或者返回一个非对象值，则将新对象返回；如果返回值是一个新对象的话那么直接直接返回该对象。
</pre>
</details>

## 17. 宏任务跟微任务
<details>
<summary>展开查看答案</summary>
<p>macro-task(宏任务)：包括整体代码script，setTimeout，setInterval</p>
<p>micro-task(微任务)：Promise，process.nextTick</p>
<a target="_blank" href="https://juejin.im/post/59e85eebf265da430d571f89">这一次，彻底弄懂 JavaScript 执行机制</a>
</details>

## 18. 数组的常用方法
<details>
<summary>展开查看答案</summary>
<b>改变原数组的方法</b>

<ul>
<li>
<em>splice() 添加/删除数组元素</em>
<pre>
语法：arrayObject.splice(index,howmany,item1,.....,itemX)
参数:
   1.index：必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
   2.howmany：可选。要删除的项目数量。如果设置为 0，则不会删除项目。
   3.item1, ..., itemX： 可选。向数组添加的新项目。

返回值: 如果有元素被删除,返回包含被删除项目的新数组。
</pre>
</li>
<li>
<em>sort() 数组排序</em>
<pre>
语法：arrayObject.sort(sortby)
参数:
   1.sortby	可选。规定排序顺序。必须是函数。。

返回值: 返回包排序后的新数组。
</pre>
</li>
<li>
<em>pop() 删除一个数组中的最后的一个元素</em>
<pre>
语法：arrayObject.pop()
参数:无

返回值: 返回被删除的元素。
</pre>
</li>
<li>
<em>shift() 删除数组的第一个元素</em>
<pre>
语法：arrayObject.shift()
参数:无

返回值: 返回被删除的元素。
</pre>
</li>
<li>
<em>push() 向数组的末尾添加元素</em>
<pre>
语法：arrayObject.push(newelement1,newelement2,....,newelementX)
参数:
   1.newelement1	必需。要添加到数组的第一个元素。
   2.newelement2	可选。要添加到数组的第二个元素。
   3.newelementX	可选。可添加若干个元素。

返回值: arrayObject 的新长度。
</pre>
</li>
<li>
<em>unshift() 向数组的开头添加一个或更多元素</em>
<pre>
语法：arrayObject.unshift(newelement1,newelement2,....,newelementX)
参数:
   1.newelement1	必需。要添加到数组的第一个元素。
   2.newelement2	可选。要添加到数组的第二个元素。
   3.newelementX	可选。可添加若干个元素。

返回值: arrayObject 的新长度。
</pre>
</li>
<li>
<em>reverse() 颠倒数组中元素的顺序</em>
<pre>
语法：arrayObject.reverse()
参数:无

返回值: 颠倒后的新数组。
</pre>
</li>
<li>
<em>copyWithin() 指定位置的成员复制到其他位置</em>
<pre>
语法： array.copyWithin(target, start = 0, end = this.length)
参数:
   1.target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
   2.start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
   3.end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。

返回值: 返回当前数组。
</pre>
</li>
<li>
<em>fill() 填充数组</em>
<pre>
语法： array.fill(value, start, end)
参数:
   1.value	必需。填充的值。
   2.start	可选。开始填充位置。
   3.end	可选。停止填充位置 (默认为 array.length)

返回值: 返回当前数组。
</pre>
</li>
</ul><br />

<b>不改变原数组的方法</b>
<ul>
<li>
<em>slice() 浅拷贝数组的元素</em>
<pre>
语法： array.slice(begin, end);
参数:
   1.begin(可选): 索引数值,接受负值，从该索引处开始提取原数组中的元素,默认值为0。
   2.end(可选):索引数值(不包括),接受负值，在该索引处前结束提取原数组元素，默认值为数组末尾(包括最后一个元素)。

返回值: 返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象，且原数组不会被修改。
</pre>
</li>
<li>
<em>join() 数组转字符串</em>
<pre>
语法：array.join(str)
参数:
   1.str(可选): 指定要使用的分隔符，默认使用逗号作为分隔符。

返回值: 返回生成的字符串。
</pre>
</li>
<li>
<em>concat() 合并两个或多个数组</em>
<pre>
语法： var newArr =oldArray.concat(arrayX,arrayX,......,arrayX)
参数:
   1.arrayX（必须）：该参数可以是具体的值，也可以是数组对象。可以是任意多个。

返回值: 返回返回合并后的新数组。
</pre>
</li>
<li>
<em>indexOf() 查找数组是否存在某个元素</em>
<pre>
语法：array.indexOf(searchElement,fromIndex)
参数:
   1.searchElement(必须):被查找的元素
   2.fromIndex(可选):开始查找的位置(不能大于等于数组的长度，返回-1)，接受负值，默认值为0。

返回值: 返回下标
</pre>
</li>
<li>
<em>lastIndexOf() 查找指定元素在数组中的最后一个位置</em>
<pre>
语法：arr.lastIndexOf(searchElement,fromIndex)
参数:
   1.searchElement(必须): 被查找的元素
   2.fromIndex(可选): 逆向查找开始位置，默认值数组的长度-1，即查找整个数组。

返回值: 方法返回指定元素,在数组中的最后一个的索引，如果不存在则返回 -1。（从数组后面往前查找）
</pre>
</li>
<li>
<em>includes() 查找数组是否包含某个元素</em>
<pre>
语法： array.includes(searchElement,fromIndex=0)
参数:
   1.searchElement(必须):被查找的元素
   2.fromIndex(可选):默认值为0，参数表示搜索的起始位置，接受负值。正值超过数组长度，数组不会被搜索，返回false。负值绝对值超过长数组度，重置从0开始搜索。

返回值: 返回布尔
</pre>
</li>
</ul>

</details>

## 19. 立即执行函数IIFE
<details>
<summary>展开查看答案</summary>
<p>声明一个匿名函数，马上调用这个匿名函数。目的是保护内部变量不受污染。</p>
<pre>
(function(n1, n2) {
    console.log("这是匿名函数的自执行的第一种写法，结果为:" + (n1 + n2))
})(10, 100);
(function start(n1, n2) {
    console.log("这是函数声明方式的自执行的第一种写法，结果为:" + (n1 + n2))
})(10, 100);
(function(n1, n2) {
    console.log("这是匿名函数的自执行的第二种写法，结果为：" + (n1 + n2))
}(10, 100));
(function start(n1, n2) {
    console.log("这是函数声明方式的自执行的第二种写法，结果为：" + (n1 + n2))
}(10, 100));
</pre>
</details>

## 20. js原型和原型链
<details>
<summary>展开查看答案</summary>
<p>每个对象都会在其内部初始化一个属性，就是prototype(原型)，当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么他就会去prototype里找这个属性，这个prototype又会有自己的prototype，于是就这样一直找下去，也就是我们平时所说的原型链的概念。</p>
<p>关系：instance.constructor.prototype = instance.proto</p>
<p>特点：JavaScript对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本，当我们修改原型时，与之相关的对象也会继承这一改变。
当我们需要一个属性时，JavaScript引擎会先看当前对象中是否有这个属性，如果没有的话，就会查找它的prototype对象是否有这个属性，如此递推下去，一致检索到Object内建对象。</p>
<pre>

function Func(){}
Func.prototype.name = "汪某";
Func.prototype.getInfo = function() {
   return this.name;
}
var person = new Func();
console.log(person.getInfo());//"汪某"
console.log(Func.prototype);//Func { name = "汪某", getInfo = function() }

</pre>
<a target="_blank" href="https://juejin.im/post/5cb6d11be51d456e60003ad9">JS原型和原型链</a>
</details>

## 21. Promise
<details>
<summary>展开查看答案</summary>
<p>一句话概括Promise：Promise对象用于异步操作，它表示一个尚未完成且预计在未来完成的异步操作。</p>
<p>promise是用来解决两个问题的：</p>
<ul>
    <li>回调地狱，代码难以维护，常常第一个的函数的输出是第二个函数的输入这种现象</li>
    <li>promise可以支持多个并发的请求，获取并发请求中的数据</li>
</ul>
<pre>
/*Promise 的简单实现*/

class MyPromise {
    constructor(fn) {
        this.resolvedCallbacks = [];
        this.rejectedCallbacks = [];
        this.state = "PADDING";
        this.value = "";
        fn(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(value) {
        if (this.state === "PADDING") {
            this.state = "RESOLVED";
            this.value = value;
            this.resolvedCallbacks.forEach(cb => cb());
        }
    }
    reject(value) {
        if (this.state === "PADDING") {
            this.state = "REJECTED";
            this.value = value;
            this.rejectedCallbacks.forEach(cb => cb());
        }
    }
    then(resolve = function() {}, reject = function() {}) {
        if (this.state === "PADDING") {
            this.resolvedCallbacks.push(resolve);
            this.rejectedCallbacks.push(reject);
        }
        if (this.state === "RESOLVED") {
            resolve(this.value);
        }
        if (this.state === "REJECTED") {
            reject(this.value);
        }
    }
}
</pre>
</details>

## 22. async/await
<details>
<summary>展开查看答案</summary>
<p>async/await是 JS 中编写异步或非阻塞代码的新方法。它建立在Promises之上，让异步代码的可读性和简洁度都更高。</p>
<p>async/await是 JS 中编写异步或非阻塞代码的新方法。 它建立在Promises之上，相对于 Promise 和回调，它的可读性和简洁度都更高。 但是，在使用此功能之前，我们必须先学习Promises的基础知识，因为正如我之前所说，它是基于Promise构建的，这意味着幕后使用仍然是Promise。</p>
<b>使用 Promise</b><br />
<pre>
function callApi() {
  return fetch("url/to/api/endpoint")
    .then(resp => resp.json())
    .then(data => {
      //do something with "data"
    }).catch(err => {
      //do something with "err"
    });
}
</pre>
<b>使用async/await</b><br />
<p>在async/await，我们使用 tru/catch 语法来捕获异常</p>
<pre>
async function callApi() {
  try {
    const resp = await fetch("url/to/api/endpoint");
    const data = await resp.json();
    //do something with "data"
  } catch (e) {
    //do something with "err"
  }
}
</pre>
<strong>注意:使用 async关键声明函数会隐式返回一个Promise。</strong><br />
<pre>
const giveMeOne = async () => 1;

giveMeOne()
  .then((num) => {
    console.log(num); // logs 1
  });
</pre>
<strong>注意:await关键字只能在async function中使用。在任何非async function的函数中使用await关键字都会抛出错误。await关键字在执行下一行代码之前等待右侧表达式(可能是一个Promise)返回。</strong><br />
<pre>
const giveMeOne = async () => 1;

function getOne() {
  try {
    const num = await giveMeOne();
    console.log(num);
  } catch (e) {
    console.log(e);
  }
}

// Uncaught SyntaxError: await is only valid in async function

async function getTwo() {
  try {
    const num1 = await giveMeOne(); // 这行会等待右侧表达式执行完成
    const num2 = await giveMeOne(); 
    return num1 + num2;
  } catch (e) {
    console.log(e);
  }
}

await getTwo(); // 2
</pre>
</details>

## 23. 深拷贝、浅拷贝
<details>
<summary>展开查看答案</summary>
<p>浅拷贝和深拷贝都只针对于引用数据类型，浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存；但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象</p>
<b>区别：浅拷贝只复制对象的第一层属性、深拷贝可以对对象的属性进行递归复制；</b>
<img src="https://user-gold-cdn.xitu.io/2019/4/22/16a4440bf4894c69?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"><br />

<h3>浅拷贝实现方式</h3>
<ol>
<li>
<em>自定义函数</em>
<pre>
function simpleCopy (initalObj) {
   var obj = {};
   for ( var i in initalObj) {
    obj[i] = initalObj[i];
   }
   return obj;
}
</pre>
</li>
<li>
<em>ES6 的 Object.assign()</em>
<pre>
let newObj = Object.assign({}, obj);
</pre>
</li>
<li>
<em>ES6 的对象扩展</em>
<pre>
let newObj = {...obj};
</pre>
</li>
</ol>

<h3>深拷贝的实现方式</h3>
<ol>
<li>
<em>JSON.stringify 和 JSON.parse</em>
<pre>
用 JSON.stringify 把对象转换成字符串，再用 JSON.parse 把字符串转换成新的对象。
let newObj = JSON.parse(JSON.stringify(obj));
</pre>
</li>
<li>
<em>lodash</em>
<pre>
用 lodash 函数库提供的 _.cloneDeep 方法实现深拷贝。
var _ = require('lodash');
var newObj = _.cloneDeep(obj);
</pre>
</li>
<li>
<em>封装</em>
<pre>
function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
        // for...in 会把继承的属性一起遍历
        for (let key in obj) {
            // 判断是不是自有属性，而不是继承属性
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象或数组，如果是，递归复制
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = this.deepClone(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
</pre>
</li>
</ol>
</details>

## 24. 跨域
<details>
<summary>展开查看答案</summary>
<p>跨域需要针对浏览器的同源策略来理解，同源策略指的是请求必须是同一个端口，同一个协议，同一个域名，不同源的客户端脚本在没有明确授权的情况下，不能读写对方资源。</p>
<p>受浏览器同源策略的影响，不是同源的脚本不能操作其他源下面的对象。想要操作另一个源下的对象是就需要跨域</p>
<ul>
    <li>jsonp</li>
    <li>iframe</li>
    <li>跨域资源共享(CORS)</li>
    <li>nginx 代理跨域</li>
</ul>
</details>

## 25. for in 和 for of
<details>
<summary>展开查看答案</summary>

<ul>
<li>
<em>for in</em>
<pre>
1.一般用于遍历对象的可枚举属性。以及对象从构造函数原型中继承的属性。对于每个不同的属性，语句都会被执行。
2.不建议使用for in 遍历数组，因为输出的顺序是不固定的。
3.如果迭代的对象的变量值是null或者undefined, for in不执行循环体，建议在使用for in循环之前，先检查该对象的值是不是null或者undefined
</pre>
</li>
<li>
<em>for of</em>
<pre>
1.for…of 语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句
</pre>
</li>
</ul>
<pre>
var s = {
    a: 1,
    b: 2,
    c: 3
}
var s1 = Object.create(s);
for (var prop in s1) {
    console.log(prop); //a b c
    console.log(s1[prop]); //1 2 3
}
for (let prop of s1) {
    console.log(prop); //报错如下 Uncaught TypeError: s1 is not iterable 
}
for (let prop of Object.keys(s1)) {
    console.log(prop); // a b c
    console.log(s1[prop]); //1 2 3
}
</pre>
</details>

## 26. 如何阻止冒泡？
<details>
<summary>展开查看答案</summary>
<p>冒泡型事件：事件按照从最特定的事件目标到最不特定的事件目标(document对象)的顺序触发。</p>
<p>w3c的方法是e.stopPropagation()，IE则是使用e.cancelBubble = true。</p>
<pre>
//阻止冒泡行为 
function stopBubble(e) { 
//如果提供了事件对象，则这是一个非IE浏览器 
if ( e && e.stopPropagation ) 
    //因此它支持W3C的stopPropagation()方法 
    e.stopPropagation(); 
else 
    //否则，我们需要使用IE的方式来取消事件冒泡 
    window.event.cancelBubble = true; 
}
</pre>
</details>

## 27. 如何阻止默认事件？
<details>
<summary>展开查看答案</summary>
<p>w3c的方法是e.preventDefault()，IE则是使用e.returnValue = false</p>
<pre>
//阻止浏览器的默认行为 
function stopDefault( e ) { 
    //阻止默认浏览器动作(W3C) 
    if ( e && e.preventDefault ) 
        e.preventDefault(); 
    //IE中阻止函数器默认动作的方式 
    else 
        window.event.returnValue = false; 
    return false; 
}
</pre>
</details>

## 28. Class
<details>
<summary>展开查看答案</summary>
<p>es6新增的Class其实也是语法糖，js底层其实没有class的概念的，其实也是原型继承的封装</p>
<pre>
class People {
    constructor(props) {
        this.props = props;
        this.name = '汪某';
    }
    callMyName() {
        console.log(this.name);
    }
}
class Name extends People { // extends 其实就是继承了哪个类
    constructor(props) {
        //  super相当于 把类的原型拿过来 
        //  People.call(this, props)
        super(props)
    }
    callMyApple() {
        console.log('我是汪某！')
    }
}

let a = new Name('啊啊啊')
a.callMyName(); //汪某
a.callMyApple(); // 我是汪某！
</pre>

<pre>
   //ES5 Version
   function Person(firstName, lastName, age, address){
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
      this.address = address;
   }

   Person.self = function(){
     return this;
   }

   Person.prototype.toString = function(){
     return "[object Person]";
   }

   Person.prototype.getFullName = function (){
     return this.firstName + " " + this.lastName;
   }  

   //ES6 Version
   class Person {
        constructor(firstName, lastName, age, address){
            this.lastName = lastName;
            this.firstName = firstName;
            this.age = age;
            this.address = address;
        }

        static self() {
           return this;
        }

        toString(){
           return "[object Person]";
        }

        getFullName(){
           return `${this.firstName} ${this.lastName}`;
        }
   }

   重写方法并从另一个类继承

   //ES5 Version
    Employee.prototype = Object.create(Person.prototype);

    function Employee(firstName, lastName, age, address, jobTitle, yearStarted) {
    Person.call(this, firstName, lastName, age, address);
    this.jobTitle = jobTitle;
    this.yearStarted = yearStarted;
    }

    Employee.prototype.describe = function () {
    return `I am ${this.getFullName()} and I have a position of ${this.jobTitle} and I started at ${this.yearStarted}`;
    }

    Employee.prototype.toString = function () {
    return "[object Employee]";
    }

    //ES6 Version
    class Employee extends Person { //Inherits from "Person" class
    constructor(firstName, lastName, age, address, jobTitle, yearStarted) {
        super(firstName, lastName, age, address);
        this.jobTitle = jobTitle;
        this.yearStarted = yearStarted;
    }

    describe() {
        return `I am ${this.getFullName()} and I have a position of ${this.jobTitle} and I started at ${this.yearStarted}`;
    }

    toString() { // Overriding the "toString" method of "Person"
        return "[object Employee]";
    }
    }


所以我们要怎么知道它在内部使用原型？

class Something {

}

function AnotherSomething(){

}
const as = new AnotherSomething();
const s = new Something();

console.log(typeof Something); // "function"
console.log(typeof AnotherSomething); // "function"
console.log(as.toString()); // "[object Object]"
console.log(as.toString()); // "[object Object]"
console.log(as.toString === Object.prototype.toString); // true
console.log(s.toString === Object.prototype.toString); // true

</pre>
</details>

## 29. 实现一个new操作符
<details>
<summary>展开查看答案</summary>
<pre>
function New(func) {
    var res = {};
    if (func.prototype !== null) {
        res.__proto__ = func.prototype;
    }
    var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
        return;
        ret;
    }
    return;
    res;
}
var obj = New(A, 1, 2);
// equals to
var obj = new A(1, 2);
</pre>
</details>

## 30. 实现一个call或 apply
<details>
<summary>展开查看答案</summary>
<b>call</b>
<pre>
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}
</pre>
<b>apply</b>
<pre>
Function.prototype.apply2 = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
</pre>
<a target="_blank" href="https://juejin.im/post/5907eb99570c3500582ca23c">JavaScript深入之call和apply的模拟实现</a>
</details>

## 31. 实现一个Function.bind
<details>
<summary>展开查看答案</summary>
<b>实现一个Function.bind</b>
<pre>
Function.prototype.bind2 = function (context) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {};
    var fbound = function () {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP();
    return fbound;
}
</pre>
<a target="_blank" href="https://juejin.im/post/59093b1fa0bb9f006517b906#heading-6">JavaScript深入之bind的模拟实现</a>
</details>

## 32. 实现一个继承
<details>
<summary>展开查看答案</summary>
<pre>
function Parent(name) {
    this.name = name;
}

Parent.prototype.sayName = function() {
    console.log('parent name:', this.name);
}

function Child(name, parentName) {
    Parent.call(this, parentName);
    this.name = name;
}

function create(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}
Child.prototype = create(Parent.prototype);
Child.prototype.sayName = function() {
    console.log('child name:', this.name);
}

Child.prototype.constructor = Child;
var parent = new Parent('汪某');
parent.sayName();// parent name: 汪某
var child = new Child('son', '汪某');
</pre>
</details>

## 33. 手写一个Promise
<details>
<summary>展开查看答案</summary>
<pre>
function myPromise(constructor) {
    let self = this;
    self.status = "pending"
        //定义状态改变前的初始状态
    self.value = undefined;
    //定义状态为resolved的时候的状态
    self.reason = undefined;
    //定义状态为rejected的时候的状态
    function resolve(value) {
        //两个==="pending"，保证了状态的改变是不可逆的
        if (self.status === "pending") {
            self.value = value;
            self.status = "resolved";
        }
    }
    function reject(reason) {
        //两个==="pending"，保证了状态的改变是不可逆的
        if (self.status === "pending") {
            self.reason = reason;
            self.status = "rejected";
        }
    }
    //捕获构造异常
    try {
        constructor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

//同时，需要在 myPromise的原型上定义链式调用的 then方法：
myPromise.prototype.then = function(onFullfilled, onRejected) {
    let self = this;
    switch (self.status) {
        case "resolved":
            onFullfilled(self.value);
            break;
        case "rejected":
            onRejected(self.reason);
            break;
        default:
    }
}

//测试一下：
var p = new myPromise(function(resolve, reject) {
    resolve(1)
});
p.then(function(x) {
    console.log(x)
})
</pre>
<a target="_blank" href="https://juejin.im/post/5b2f02cd5188252b937548ab">BAT前端经典面试问题：史上最最最详细的手写Promise教程</a>
</details>

## 34. 手写防抖(Debouncing)和节流(Throttling)
<details>
<summary>展开查看答案</summary>
<p>完整版详见上方，此处给出面试版</p>
<pre>
// 防抖函数
function debounce(fn, wait) {
    let timer;
    return function() {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, wait)
    }
}

// 节流函数
function throttle(fn, wait) {
    let prev = new Date();
    return function() {
        const args = arguments;
        const now = new Date();
        if (now - prev > wait) {
            fn.apply(this, args);
            prev = new Date();
        }
    }
}
</pre>
</details>

## 35. 手写一个JS深拷贝
<details>
<summary>展开查看答案</summary>
<pre>
function deepCopy(obj) {
    //判断是否是简单数据类型，
    if (typeof obj == "object") {
        //复杂数据类型
        var result = obj.constructor == Array ? [] : {};
        for (let i in obj) {
            result[i] = typeof obj[i] == "object" ? deepCopy(obj[i]) : obj[i];
        }
    } else {
        //简单数据类型 直接 == 赋值
        var result = obj;
    }
    return result;
}
</pre>
</details>

## 36. js求平面两点之间的距离
<details>
<summary>展开查看答案</summary>
<pre>
// 数据可以以数组方式存储，也可以是对象方式
let a = {x:'6', y:10},
        b = {x: 8, y: 20};
function distant(a,b){
    let dx = Number(a.x) - Number(b.x)
    let dy = Number(a.y) - Number(b.y)
    return Math.pow(dx*dx + dy*dy, .5)
}
</pre>
</details>

## 37. 如何将浮点数点左边的数每三位添加一个逗号，如12000000.11转化为『12,000,000.11』?
<details>
<summary>展开查看答案</summary>
<pre>
function commafy(num){
  	return num && num
  		.toString()
  		.replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2){
  			return $2 + ',';
  		});
  }
</pre>
</details>

## 38. DOM操作——怎样添加、移除、移动、复制、创建和查找节点?
<details>
<summary>展开查看答案</summary>
<ol>
    <li>创建一个DOM片段 createDocumentFragment() </li>
    <li>创建一个具体的元素 createElement() </li>
    <li>创建一个文本节点 createTextNode()</li>
    <li>添加 appendChild()</li>
    <li>移除 removeChild()</li>
    <li>替换 replaceChild()</li>
    <li>插入 insertBefor()</li>
    <li>通过标签名称 getElementsByTagName() </li>
    <li>通过元素的Name属性的值(IE容错能力较强，会得到一个数组，其中包括id等于name值的) getElementsByName()</li>
    <li>通过元素Id，唯一性 getElementById()</li>
    <li>通过元素ClassName getElementsByClassName</li>
</ol>
</details>

## 39. 如何判断当前脚本运行在浏览器还是node环境中？（阿里）
<details>
<summary>展开查看答案</summary>
<pre>
this === window ? 'browser' : 'node';
</pre>
</details>

## 40. 检测浏览器版本版本有哪些方式
<details>
<summary>展开查看答案</summary>
<pre>
功能检测、userAgent特征检测

比如：navigator.userAgent
//"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36
(KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"
</pre>
</details>

## 41. 判断当前运行环境
<details>
<summary>展开查看答案</summary>
<pre>
 navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
)
</pre>
</details>

## 42. 使用(+)字符串快速转换为 number
<details>
<summary>展开查看答案</summary>
<pre>
["1", "2", "3"].map((item) => +item);
</pre>
<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus">+ MDN文档</a>
</details>

## 43. 什么是事件传播?
<details>
<summary>展开查看答案</summary>
<p>当事件发生在DOM元素上时，该事件并不完全发生在那个元素上。 在“冒泡阶段”中，事件冒泡或向上传播至父级，祖父母，祖父母或父级，直到到达window为止；而在“捕获阶段”中，事件从window开始向下触发元素 事件或event.target</p>

<b>事件传播有三个阶段：</b>

<ul>
    <li>捕获阶段–事件从 window 开始，然后向下到每个元素，直到到达目标元素。</li>
    <li>目标阶段–事件已达到目标元素。</li>
    <li>冒泡阶段–事件从目标元素冒泡，然后上升到每个元素，直到到达 window</li>
</ul>

<img src="https://user-gold-cdn.xitu.io/2020/1/9/16f879b5b51541a1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" />
</details>

## 44. 什么是事件冒泡？
<details>
<summary>展开查看答案</summary>
<p>当事件发生在DOM元素上时，该事件并不完全发生在那个元素上。 在冒泡阶段，事件冒泡，或者事件发生在它的父代，祖父母，祖父母的父代，直到到达window为止。</p>
<p>
addEventListener方法具有第三个可选参数useCapture，其默认值为false，事件将在冒泡阶段中发生，如果为true，则事件将在捕获阶段中发生。 如果单击child元素，它将分别在控制台上记录child，parent，grandparent，html，document和window，这就是事件冒泡。
</p>

<pre>
&lt;div class="grandparent"&gt;
  &lt;div class="parent"&gt;
   &lt;div class="child"&gt;1&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;

function addEvent(el, event, callback, isCapture = false) {
    if (!el || !event || !callback || typeof callback !== 'function') return; 
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }; 
     el.addEventListener(event, callback, isCapture);
    }
    addEvent(document, 'DOMContentLoaded', () => {
      const child = document.querySelector('.child');
      const parent = document.querySelector('.parent');
      const grandparent = document.querySelector('.grandparent');
      addEvent(child, 'click', function (e) {    console.log('child');  });
      addEvent(parent, 'click', function (e) {    console.log('parent');  });
      addEvent(grandparent, 'click', function (e) {    console.log('grandparent');  });
      addEvent(document, 'click', function (e) {    console.log('document');  });
      addEvent('html', 'click', function (e) {    console.log('html');  })
      addEvent(window, 'click', function (e) {    console.log('window');  })
    });
</pre>
</details>

## 45. 什么是事件捕获？
<details>
<summary>展开查看答案</summary>
<p>当事件发生在 DOM 元素上时，该事件并不完全发生在那个元素上。在捕获阶段，事件从window开始，一直到触发事件的元素。</p>
<p>addEventListener方法具有第三个可选参数useCapture，其默认值为false，事件将在冒泡阶段中发生，如果为true，则事件将在捕获阶段中发生。 如果单击child元素，它将分别在控制台上打印window，document，html，grandparent和parent，这就是事件捕获。</p>
<pre>
&lt;div class="grandparent"&gt;
  &lt;div class="parent"&gt;
   &lt;div class="child"&gt;1&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;

function addEvent(el, event, callback, isCapture = false) {
    if (!el || !event || !callback || typeof callback !== 'function') return;
    if (typeof el === 'string') {  
     el = document.querySelector(el);  
    }; 
    el.addEventListener(event, callback, isCapture);}
    addEvent(document, 'DOMContentLoaded', () => {  const child = document.querySelector('.child');
    const parent = document.querySelector('.parent');
    const grandparent = document.querySelector('.grandparent');
    addEvent(child, 'click', function (e) {    console.log('child');  }); 
    addEvent(parent, 'click', function (e) {    console.log('parent');  }); 
    addEvent(grandparent, 'click', function (e) {    console.log('grandparent');  });
    addEvent(document, 'click', function (e) {    console.log('document');  });
    addEvent('html', 'click', function (e) {    console.log('html');  }) 
    addEvent(window, 'click', function (e) {    console.log('window');  })});
</pre>
</details>

## 46. event.preventDefault() 和 event.stopPropagation()方法之间有什么区别？
<details>
<summary>展开查看答案</summary>
<p>
event.preventDefault() 方法可防止元素的默认行为。 如果在表单元素中使用，它将阻止其提交。 如果在锚元素中使用，它将阻止其导航。 如果在上下文菜单中使用，它将阻止其显示或显示。 event.stopPropagation()方法用于阻止捕获和冒泡阶段中当前事件的进一步传播。
</p>
</details>

## 47. 如何知道是否在元素中使用了`event.preventDefault()`方法？
<details>
<summary>展开查看答案</summary>
<p>
我们可以在事件对象中使用event.defaultPrevented属性。 它返回一个布尔值用来表明是否在特定元素中调用了event.preventDefault()。
</p>
</details>

## 48. 为什么在 JS 中比较两个相似的对象时返回 false？
<details>
<summary>展开查看答案</summary>
<p>JS 以不同的方式比较对象和基本类型。在基本类型中，JS 通过值对它们进行比较，而在对象中，<b>JS 通过引用或存储变量的内存中的地址对它们进行比较</b>。这就是为什么第一个console.log语句返回false，而第二个console.log语句返回true。a和c有相同的引用地址，而a和b没有。
</p>
<pre>
let a = { a: 1 };let b = { a: 1 };
let c = a;
console.log(a === b); // 打印 false，即使它们有相同的属性
console.log(a === c); // true
</pre>
</details>

## 49.  !! 运算符能做什么？
<details>
<summary>展开查看答案</summary>
<p>!!运算符可以将右侧的值强制转换为布尔值，这也是将值转换为布尔值的一种简单方法。</p>
<pre>
console.log(!!null); // false
console.log(!!undefined); // false
console.log(!!''); // false
console.log(!!0); // false
console.log(!!NaN); // false
console.log(!!' '); // true
console.log(!!{}); // true
console.log(!![]); // true
console.log(!!1); // true
console.log(!![].length); // false
</pre>
</details>

## 50. 如何在一行中计算多个表达式的值？
<details>
<summary>展开查看答案</summary>
<p>可以使用逗号运算符在一行中计算多个表达式。 它从左到右求值，并返回右边最后一个项目或最后一个操作数的值。</p>
<pre>
let x = 5;
x = (x++ , x = addFive(x), x *= 2, x -= 5, x += 10);
function addFive(num) {
  return num + 5;
}
</pre>
</details>

## 51. 手动实现 Array.prototype.map 方法
<details>
<summary>展开查看答案</summary>
<pre>
function (arr, mapCallback){
    // 首先，检查传递的参数是否正确
    if (!Array.isArray(arr) || !arr.length || typeof mapCallback !== "function"){
        return [];
    } else {
        let result = [];
        // 每次调用此函数是，都会创建一个 result 数组
        // 因为不想改变原始数组
        for (let i = 0; i < arr.length; i ++>){
            result.push(mapCallback(arr[i], i, arr));
            // 将 mapCallback 返回的结果 push 到 result 数组中
        }
        return result;
    }
}
</pre>
</details>

## 52. 手动实现Array.prototype.filter方法
<details>
<summary>展开查看答案</summary>
<pre>
    function filter(arr, fillterCallback{
        // 首先，检查传递的参数是否正确
        if (!Array.isArray(arr) || !arr.length || typeof filterCallback !== "function"){
            return [];
        } else {
            let result = [];
            // 每次调用此函数时，都会创建一个 result 数组
            // 因为不想改变原始数组
            for (let i = 0;i < arr.length; i ++){
                // 检查 filterCallback 的返回值是否有真值
                if (filterCallback(arr[i], i, arr)){
                    // 如果条件为真，则将数组原始 push 到 result 中
                    result.push(arr[i]);
                }
            }
            return result;
        }
    }
</pre>
</details>

## 53. 手动实现Array.prototype.reduce方法
<details>
<summary>展开查看答案</summary>
<pre>
function reduce(arr, reduceCallback, initialValue){
    // 首先，检查传递的参数是否正确
    if (!Array.isArray(arr) || !arr.length || typof reduceCallback !~== "function"){
        return [];
    } else {
        // 如果没有将initialValue传递给该函数，我们将使用第一个数组项作为initialValue
        let hasInitialValue = initialValue !== undefined;
        let value = hasInitialValue ? initialValue : arr[0];

        // 如果有传递 initialValue，则索引从 1 开始，否则从 0 开始
        for (let i = hasInitialValue ? 0 : 1; i < arr.length; i ++>){
            value = reduceCallback(value, arr[i], i, arr);
        }
        return value;
    }
}
</pre>
</details>

## 54. arguments 的对象是什么？
<details>
<summary>展开查看答案</summary>
<p>
arguments对象是函数中传递的参数值的集合。它是一个类似数组的对象，因为它有一个length属性，我们可以使用数组索引表示法arguments[1]来访问单个值，但它没有数组中的内置方法，如：forEach、reduce、filter和map。
</p>
</details>

## 55.  如何创建一个没有 prototype(原型)的对象？
<details>
<summary>展开查看答案</summary>
<p>我们可以使用Object.create方法创建没有原型的对象</p>
<pre>
const o1 = {};
console.log(o1.toString()); // [object Object]

const o2 = Object.create(null);
console.log(o2.toString());
// throws an error o2.toString is not a function 
</pre>
</details>

## 56. ES6或ECMAScript 2015有哪些新特性？
<details>
<summary>展开查看答案</summary>
<ul>
    <li>箭头函数</li>
    <li>类</li>
    <li>模板字符串</li>
    <li>加强的对象字面量</li>
    <li>对象结构</li>
    <li>Promise</li>
    <li>生成器</li>
    <li>模块</li>
    <li>Symbol</li>
    <li>Set</li>
    <li>函数默认参数</li>
    <li>rest 和展开</li>
    <li>块级作用域</li>
    <li>let、const</li>
</ul>
</details>

## 57. 箭头函数
<details>
<summary>展开查看答案</summary>
<p>
箭头函数表达式的语法比函数表达式更简洁，并且没有自己的this，arguments，super或new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。
</p>
<p>
ES5 版本中有function(){}声明和return关键字，这两个关键字分别是创建函数和返回值所需要的。在箭头函数版本中，我们只需要()括号，不需要 return 语句，因为如果我们只有一个表达式或值需要返回，箭头函数就会有一个隐式的返回
</p>
</details>

## 58. 展开(spread )运算符和 剩余(Rest) 运算符有什么区别
<details>
<summary>展开查看答案</summary>
<p>展开运算符(spread)是三个点(...)，可以将一个数组转为用逗号分隔的参数序列。说的通俗易懂点，有点像化骨绵掌，把一个大元素给打散成一个个单独的小元素</p>
<p>剩余运算符也是用三个点(...)表示，它的样子看起来和展开操作符一样，但是它是用于解构数组和对象。在某种程度上，剩余元素和展开元素相反，展开元素会“展开”数组变成多个元素，剩余元素会收集多个元素和“压缩”成一个单一的元素。</p>

<pre>
调用add函数时使用了展开操作符，对nums数组进行展开。所以参数a的值是5 ，b的值是6，所以sum 是11。
function add(a, b) {
  return a + b;
};

const nums = [5, 6];
const sum = add(...nums);
console.log(sum);
</pre>
<pre>
有一个add函数，它接受任意数量的参数，并将它们全部相加，然后返回总数
const [first, ...others] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(others); // [2,3,4,5]
</pre>
<pre>
剩余操作符提取所有剩余的数组值，并将它们放入除第一项之外的其他数组中。
const [first, ...others] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(others); // [2,3,4,5]
</pre>
</details>

## 59. 隐式和显式转换有什么区别
<details>
<summary>展开查看答案</summary>
<ul>
<li>
<em>隐式强制转换是一种将值转换为另一种类型的方法，这个过程是自动完成的，无需我们手动操作</em>
<pre>
console.log(1 + '6'); // 16
console.log(false + true); // 1
console.log(6 * '2'); // 12
第一个console.log语句结果为16。在其他语言中，这会抛出编译时错误，但在 JS 中，1被转换成字符串，然后与+运算符连接。我们没有做任何事情，它是由 JS 自动完成。
第二个console.log语句结果为1，JS 将false转换为boolean 值为 0，,true为1，因此结果为1。
第三个console.log语句结果12，它将'2'转换为一个数字，然后乘以6 * 2，结果是12。
</pre>
</li>
<li>
<em>而显式强制是将值转换为另一种类型的方法，我们需要手动转换</em>
<pre>
console.log(1 + parseInt('6'));
本例中，我们使用parseInt函数将'6'转换为number ，然后使用+运算符将1和6相加
</pre>
</li>
</ul>

</details>

## 60. 什么是NaN？ 以及如何检查值是否为NaN？
<details>
<summary>展开查看答案</summary>
<p>NaN表示**“非数字”**是 JS 中的一个值，该值是将数字转换或执行为非数字值的运算结果，因此结果为NaN。</p>
<pre>
let a;

console.log(parseInt('abc')); // NaN
console.log(parseInt(null)); // NaN
console.log(parseInt(undefined)); // NaN
console.log(parseInt(++a)); // NaN
console.log(parseInt({} * 10)); // NaN
console.log(parseInt('abc' - 2)); // NaN
console.log(parseInt(0 / 0)); // NaN
console.log(parseInt('10a' * 10)); // NaN
</pre>
<p>JS 有一个内置的isNaN方法，用于测试值是否为isNaN值，但是这个函数有一个奇怪的行为</p>
<pre>
console.log(isNaN()); // true
console.log(isNaN(undefined)); // true
console.log(isNaN({})); // true
console.log(isNaN(String('a'))); // true
console.log(isNaN(() => { })); // true
</pre>
<p>所有这些console.log语句都返回true，即使我们传递的值不是NaN。</p>
<p>在ES6中，建议使用Number.isNaN方法，因为它确实会检查该值（如果确实是NaN），或者我们可以使自己的辅助函数检查此问题，因为在 JS 中，NaN是唯一的值，它不等于自己。</p>
<pre>
function checkIfNaN(value) {
  return value !== value;
}
</pre>
</details>

## 61. 如何判断值是否为数组？
<details>
<summary>展开查看答案</summary>
<p>我们可以使用Array.isArray方法来检查值是否为数组。 当传递给它的参数是数组时，它返回true，否则返回false。</p>
<pre>
console.log(Array.isArray(5));  // false
console.log(Array.isArray("")); // false
console.log(Array.isArray()); // false
console.log(Array.isArray(null)); // false
console.log(Array.isArray({ length: 5 })); // false

console.log(Array.isArray([])); // true
</pre>
<p>如果环境不支持此方法，则可以使用polyfill实现。</p>
<pre>
function isArray(value){
 return Object.prototype.toString.call(value) === "[object Array]"
}

Object.prototype.toString.call([]).slice(8,-1)
</pre>
<p>当然还可以使用传统的方法：</p>
<pre>
let a = []
if (a instanceof Array) {
  console.log('是数组')
} else {
  console.log('非数组')
}
</pre>
</details>

## 62. 如何在不使用%模运算符的情况下检查一个数字是否是偶数？
<details>
<summary>展开查看答案</summary>
<p>可以对这个问题使用按位&运算符，&对其操作数进行运算，并将其视为二进制值，然后执行与运算</p>
<pre>
function isEven(num) {
  if (num & 1) {
    return false
  } else {
    return true
  }
}
</pre>
<p>0 二进制数是 000 1 二进制数是 001 2 二进制数是 010 3 二进制数是 011 4 二进制数是 100 5 二进制数是 101 6 二进制数是 110 7 二进制数是 111</p>
<p>执行console.log(5&1)这个表达式时，结果为1。首先，&运算符将两个数字都转换为二进制，因此5变为101，1变为001。</p>
<p>然后，它使用按位怀运算符比较每个位（0和1）。 101&001，从表中可以看出，如果a & b为1，所以5&1结果为1。</p>
<p>
首先我们比较最左边的1&0，结果是0。<br />
然后我们比较中间的0&0，结果是0。<br />
然后我们比较最后1&1，结果是1。<br />
最后，得到一个二进制数001，对应的十进制数，即1。<br />
</p>
<p>由此我们也可以算出console.log(4 & 1) 结果为0。知道4的最后一位是0，而0 & 1 将是0。如果你很难理解这一点，我们可以使用递归函数来解决此问题。</p>
<pre>
function isEven(num) {
  if (num < 0 || num === 1) return false;
  if (num == 0) return true;
  return isEven(num - 2);
}
</pre>
</details>

## 63. 如何检查对象中是否存在某个属性？
<details>
<summary>展开查看答案</summary>
<ul>
<li>
<em>使用 in 操作符号</em>
<pre>
const o = { 
  "prop" : "bwahahah",
  "prop2" : "hweasa"
};

console.log("prop" in o); // true
console.log("prop1" in o); // false
</pre>
</li>
<li>
<em>使用 hasOwnProperty 方法，hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。</em>
<pre>
console.log(o.hasOwnProperty("prop2")); // true
console.log(o.hasOwnProperty("prop1")); // false
</pre>
</li>
<li>
<em>使用括号符号obj["prop"]。如果属性存在，它将返回该属性的值，否则将返回undefined</em>
<pre>
console.log(o["prop"]); // "bwahahah"
console.log(o["prop1"]); // undefined
</pre>
</li>
</ul>

</details>

## 64. 如何在 JS 中创建对象
<details>
<summary>展开查看答案</summary>

<ol>
<li>
<em>使用对象字面量：</em>
<pre>
const o = {
  name: "前端小智",
  greeting() {
    return `Hi, 我是${this.name}`;
  }
};

o.greeting(); // "Hi, 我是前端小智"
</pre>
</li>
<li>
<em>使用构造函数：</em>
<pre>
function Person(name) {
   this.name = name;
}

Person.prototype.greeting = function () {
   return `Hi, 我是${this.name}`;
}

const mark = new Person("前端小智");

mark.greeting(); // "Hi, 我是前端小智"
</pre>
</li>
<li>
<em>使用 Object.create 方法</em>
<pre>
const n = {
   greeting() {
      return `Hi, 我是${this.name}`;
   }
};

const o = Object.create(n); 
o.name = "前端小智";
</pre>
</li>
</ol>

</details>

## 65. Object.seal 和 Object.freeze 方法之间有什么区别
<details>
<summary>展开查看答案</summary>
<ol>
    <li>
        <em>Object.freeze()</em>
        <p>Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。</p>
    </li>
    <li>
        <em>Object.seal()</em>
        <p>Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。</p>
    </li>
    <ul>
        <li>
        <b>相同点</b>
        <ul>
            <li>ES5新增。</li>
            <li>对象不可能扩展，也就是不能再添加新的属性或者方法</li>
            <li>对象已有属性不允许被删除。</li>
            <li>对象属性特性不可以重新配置。</li>
        </ul>
        </li>
        <li>
        <b>不同点</b>
        <ul>
            <li>Object.seal方法生成的密封对象，如果属性是可写的，那么可以修改属性值。 * Object.freeze方法生成的冻结对象，属性都是不可写的，也就是属性值无法更改。</li>
        </ul>
        </li>
    </ul>
</ol>

</details>

## 66. in 运算符和 Object.hasOwnProperty 方法有什么区别
<details>
<summary>展开查看答案</summary>

<ol>
<li>
<em>hasOwnPropert方法</em>
<p>hasOwnPropert()方法返回值是一个布尔值，指示对象自身属性中是否具有指定的属性，因此这个方法会忽略掉那些从原型链上继承到的属性。</p>
<pre>
Object.prototype.phone= '15345025546';

let obj = {
	name: '前端小智',
	age: '28'
}
console.log(obj.hasOwnProperty('phone')) // false
console.log(obj.hasOwnProperty('name')) // true
可以看到，如果在函数原型上定义一个变量phone，hasOwnProperty方法会直接忽略掉
</pre>
</li>
<li>
<em>in 运算符</em>
<p>如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。</p>
<p>上面的例子来演示</p>
<pre>
console.log('phone' in obj) // true
可以看到in运算符会检查它或者其原型链是否包含具有指定名称的属性
</pre>
</li>
</ol>
</details>

## 67. 函数表达式和函数声明之间有什么区别
<details>
<summary>展开查看答案</summary>
<pre>
hoistedFunc();
notHoistedFunc();

function hoistedFunc(){
  console.log("注意：我会被提升");
}

var notHoistedFunc = function(){
  console.log("注意：我没有被提升");
}
</pre>
<p>
notHoistedFunc调用抛出异常：Uncaught TypeError: notHoistedFunc is not a function，而hoistedFunc调用不会，因为hoistedFunc会被提升到作用域的顶部，而notHoistedFunc 不会。
</p>
</details>

## 68. 调用函数，可以使用哪些方法？
<details>
<summary>展开查看答案</summary>

<ol>
<li>
<em>作为函数调用</em>
<p>如果一个函数没有作为方法、构造函数、apply、call 调用时，此时 this 指向的是 window 对象（非严格模式）</p>
<pre>
  //Global Scope

  function add(a,b){
    console.log(this);
    return a + b;
  }  

  add(1,5); // 打印 "window" 对象和 6

  const o = {
    method(callback){
      callback();
    }
  }

  o.method(function (){
      console.log(this); // 打印 "window" 对象
  });
</pre>
</li>
<li>
<em>作为方法调用</em>
<p>如果一个对象的属性有一个函数的值，我们就称它为方法。调用该方法时，该方法的this值指向该对象。</p>
<pre>
const details = {
  name : "Marko",
  getName(){
    return this.name;
  }
}

details.getName(); // Marko
</pre>
</li>
<li>
<em>作为构造函数的调用</em>
<p>如果在函数之前使用new关键字调用了函数，则该函数称为构造函数。构造函数里面会默认创建一个空对象，并将this指向该对象。</p>
<pre>
function Employee(name, position, yearHired) {
  // 创建一个空对象 {}
  // 然后将空对象分配给“this”关键字
  // this = {};
  this.name = name;
  this.position = position;
  this.yearHired = yearHired;
  // 如果没有指定 return ,这里会默认返回 this
};

const emp = new Employee("Marko Polo", "Software Developer", 2017);
</pre>
</li>
<li>
<em>使用apply和call方法调用</em>
<p>使用apply和call方法调用</p>
<pre>
const obj1 = {
 result:0
};

const obj2 = {
 result:0
};


function reduceAdd(){
   let result = 0;
   for(let i = 0, len = arguments.length; i < len; i++){
     result += arguments[i];
   }
   this.result = result;
}


reduceAdd.apply(obj1, [1, 2, 3, 4, 5]);  // reduceAdd 函数中的 this 对象将是 obj1
reduceAdd.call(obj2, 1, 2, 3, 4, 5); // reduceAdd 函数中的 this 对象将是 obj2
</pre>
</li>
</ol>
</details>

## 69. 什么时候不使用箭头函数? 说出三个或更多的例子？
<details>
<summary>展开查看答案</summary>
<ol>
    <li>当想要函数被提升时(箭头函数是匿名的)</li>
    <li>要在函数中使用this/arguments时，由于箭头函数本身不具有this/arguments，因此它们取决于外部上下文</li>
    <li>使用命名函数(箭头函数是匿名的)</li>
    <li>使用函数作为构造函数时(箭头函数没有构造函数)</li>
    <li>当想在对象字面是以将函数作为属性添加并在其中使用对象时，因为咱们无法访问 this 即对象本身。</li>
</ol>
</details>

## 70. Object.freeze() 和 const 的区别是什么？
<details>
<summary>展开查看答案</summary>
<ul>
<li>
<em>const 声明一个只读的变量，一旦声明，常量的值就不可改变</em>
<pre>
const person = {
    name: "Leonardo"
};
let animal = {
    species: "snake"
};
person = animal; // ERROR "person" is read-only    
</pre>
</li>
<li>
<em>Object.freeze适用于值，更具体地说，适用于对象值，它使对象不可变，即不能更改其属性。</em>
<pre>
let person = {
    name: "Leonardo"
};
let animal = {
    species: "snake"
};
Object.freeze(person);
person.name = "Lima"; //TypeError: Cannot assign to read only property 'name' of object
console.log(person); 
</pre>
</li>
</ul>
</details>

## 71. 如何在 JS 中“深冻结”对象
<details>
<summary>展开查看答案</summary>
<p>如果咱们想要确保对象被深冻结，就必须创建一个递归函数来冻结对象类型的每个属性</p>
<ul>
<li>
<em>没有深冻结</em>
<pre>
let person = {
    name: "Leonardo",
    profession: {
        name: "developer"
    }
};
Object.freeze(person); 
person.profession.name = "doctor";
console.log(person); //output { name: 'Leonardo', profession: { name: 'doctor' } }
</pre>
</li>
<li>
<em>深冻结</em>
<pre>
function deepFreeze(object) {
    let propNames = Object.getOwnPropertyNames(object);
    for (let name of propNames) {
        let value = object[name];
        object[name] = value && typeof value === "object" ?
            deepFreeze(value) : value;
    }
    return Object.freeze(object);
}
let person = {
    name: "Leonardo",
    profession: {
        name: "developer"
    }
};
deepFreeze(person);
person.profession.name = "doctor"; // TypeError: Cannot assign to read only property 'name' of object
</pre>
</li>
</ul>
</details>

## 72. Iterator是什么，有什么作用
<details>
<summary>展开查看答案</summary>
<p>遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署Iterator接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。</p>
<b>Iterator 的作用有三个</b>
<ol>
    <li>为各种数据结构，提供一个统一的、简便的访问接口</li>
    <li>使得数据结构的成员能够按某种次序排列</li>
    <li>ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费</li>
</ol>
<b>遍历过程</b>
<ol>
    <li>创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象</li>
    <li>第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员</li>
    <li>第二次调用指针对象的next方法，指针就指向数据结构的第二个成员</li>
    <li>不断调用指针对象的next方法，直到它指向数据结构的结束位置</li>
</ol>
<p>每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。</p>
<pre>
//obj就是可遍历的，因为它遵循了Iterator标准，且包含[Symbol.iterator]方法，方法函数也符合标准的Iterator接口规范。
//obj.[Symbol.iterator]() 就是Iterator遍历器
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};
</pre>
</details>

## 73.Generator 函数是什么，有什么作用？
<details>
<summary>展开查看答案</summary>
<p>如果说 JavaScrip 是 ECMAScript 标准的一种具体实现、Iterator遍历器是Iterator的具体实现，那么Generator函数可以说是Iterator接口的具体实现方式。</p>
<p>执行Generator函数会返回一个遍历器对象，每一次Generator函数里面的yield都相当一次遍历器对象的next()方法，并且可以通过next(value)方法传入自定义的value,来改变Generator函数的行为。</p>
<p>Generator函数可以通过配合Thunk 函数更轻松更优雅的实现异步编程和控制流管理</p>
</details>

## 74. 
<details>
<summary>展开查看答案</summary>
</details>

## 75. 
<details>
<summary>展开查看答案</summary>
</details>

## 76. 
<details>
<summary>展开查看答案</summary>
</details>

## 77. 
<details>
<summary>展开查看答案</summary>
</details>

## 78. 
<details>
<summary>展开查看答案</summary>
</details>

