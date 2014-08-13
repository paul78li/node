/**
 * Created by paul on 2014/8/11.
 */
var man = {
    hands: 2,
    legs: 2,
    heads: 1
};
// 在代码的另一个地方给所有的对象添加了一个方法
//if (typeof Object.prototype.clone === "undefined") {
//    Object.prototype.clone = function () {
//    };
//}
// 1.for-in循环
for (var i in man) {
    if (man.hasOwnProperty(i)) { // filter
        console.log(i, ":", man[i]);
    }
}
// 2.反模式:
// 不使用hasOwnProperty()过滤的for-in循环
for (var i in man) {
    console.log(i, ":", man[i]);
}
//另外一种调用hasOwnProperty()的方法是通过Object.prototype来调用，像这样：
for (var i in man) {
    if (Object.prototype.hasOwnProperty.call(man, i)) { // 过滤
        console.log(i, ":", man[i]);
    }
}
var i,
    hasOwn = Object.prototype.hasOwnProperty;
for (i in man) {
    if (hasOwn.call(man, i)) { // 过滤
        console.log(i, ":", man[i]);
    }
}


//switch模式
//
//你可以通过下面这种模式来增强switch语句的可读性和健壮性：

var inspect_me = 0,
    result = '';
switch (inspect_me) {
    case 0:
        result = "zero";
        break;
    case 1:
        result = "one";
        break;
    default:
        result = "unknown";
}
console.log(result);


//避免隐式类型转换
//
//在JavaScript对变量进行比较时会有一些隐式的数据类型转换。比如诸如false == 0或"" == 0之类的比较都返回true。
//
//为了避免隐式类型转换对程序造成干扰，推荐使用===和!==运算符，它们除了比较值还会比较类型：
var zero = 0;
if (zero === false) {
    // 不会执行，因为zero是0，不是false
    console.log('no')
}
// 反模式
if (zero == false) {
    // 代码块会执行…
    console.log('process')
}

// 反模式
//var property = "name";
//console.log(eval("Object." + property));
//// 更好的方式
//var property = "name";
//console.log(Object[property]);


// 反模式
var myFunc = function () {
    console.log('test');
};
//setTimeout("myFunc()", 1000);
//setTimeout("myFunc(1, 2, 3)", 1000);
// 更好的方式
//setTimeout(myFunc, 1000);
//setTimeout(function () {
//    myFunc(1, 2, 3);
//}, 1000);

function outer(a, b) {
    var c = 1,
        d = 2,
        inner;
    if (a > b) {
        inner = function () {
            return {
                r: c - d
            };
        };
    } else {
        inner = function () {
            return {
                r: c + d
            };
        };
    }
    return inner;
}
var fff = outer(2, 1);
console.log(fff().r);
//=============================================
//实际上， 传的是i的引用
function wrapElements(a) {
    var result = []
    for (var i = 0, n = a.length; i < n; i++) {

        result[i] = function () {
            return a[i]
        }
    }
    console.log('i=' + i)
    return result
}
var wrapped = wrapElements([1, 2, 3])
var elem0 = wrapped[0]
console.log(elem0())
//应该改为
function wrapElementsRight(a) {
    var result = []
    for (var i = 0, n = a.length; i < n; i++) {
        (function () {
            var j = i
            result[i] = function () {
                return a[j]
            }
        })();
    }
//    console.log('i=' + i)
    return result
}
var wrappedRight = wrapElementsRight([1, 2, 3])
var elem0Right = wrappedRight[0]
console.log(elem0Right())
//=============================================
var obj1 = {
    hello: function () {
        return "hello " + this.username;
    },
    username: "wo"
};
console.log(obj1.hello());
var obj2 = {
    hello: obj1.hello,
    username: "ni"
}
console.log(obj2.hello());
//=============================================
//
function User(name, pwd) {
    this.name = name
    this.pwd = pwd
}
//用new初始化对象
var user = new User('a', 'b')
console.log(user.name)
//=============================================

//高阶函数
var sort1 = [3, 4, 1, 2, 5]
//sort1.sort()
sort1.sort(
    function (x, y) {
        if (x < y) {
            return 1
        }
        if (x > y) {
            return -1
        }
        return 0
    }
)
console.log(sort1)
//=============================================
var strs = ['aa', 'bc', 'de']

var strs1 = strs.map(
    function (ele) {
        return ele.toUpperCase()
    }
)
console.log(strs1)
//=============================================

function buildStr(n, callback) {
    var res = ""
    for (var i = 0; i < n; i++) {
        res += callback(i)
    }
    return res
}
var aCode = 'a'.charCodeAt(0);
var alphabet = buildStr(26, function (i) {
    return String.fromCharCode(aCode + i)
});

console.log(alphabet)

var randomStr = buildStr(10, function (i) {
    return String.fromCharCode(Math.floor(Math.random() * 26) + aCode)
})
console.log(randomStr)
//=============================================

// apply()和call()的真正用武之地是能够扩充函数赖以运行的作用域
this.firstName = "diz";
this.lastName = "song";
var myObject = { firstName: "my", lastName: "Object" };
function HelloName() {
    console.log("Hello " + this.firstName + " " + this.lastName, " glad to meet you!");
}
HelloName.call(this); //
HelloName.call(myObject);


function sum(num1, num2) {
    return num1 + num2;
}
console.log(sum.call(null, 10, 10)); //20
console.log(sum.apply(null, [10, 20])); //30
//=============================================

//可变参数 arguments
function average() {
    for (var i = 0, n = arguments.length, sum = 0; i < n; i++) {
        sum += arguments[i]
    }
    return sum / n
}

console.log(average(1, 3, 5, 1))
//=============================================
//永远不要修改arguments对象
function callMethod(obj, method) {
    //指定slice索引位置为2
    var args = [].slice.call(arguments, 2)
    return obj[method].apply(obj, args)
}
var obj = {
    add: function () {
        for (var i = 0, n = arguments.length, sum = 0; i < n; i++) {
            sum += arguments[i]
        }
        return sum
    }
}
console.log(callMethod(obj, 'add', 17, 25, 3))

//=============================================
//迭代器用法
function values() {
    var i = 0, n = arguments.length, a = arguments
    return{
        hasNext: function () {
            return i < n
        },
        next: function () {
            if (i >= n) {
                throw new Error('end of iteration')
            }
            return a[i++]
        }
    }
}
var it = values(1, 2, 3)
while (it.hasNext()) {
    console.log(it.next())
}

//=============================================
var buffer = {
    entries : [],
    add : function(s){
        this.entries.push(s)
    },
    join: function(){
        return this.entries.join('')
    }
}
var source = ['a','-','1']
//并不是每个高阶函数都会提供其回调函数的接收者，即下面注释的语句，forEach提供了接收者，如果某个高阶函数没有提供接收者，那么用注释语句的后面一条语句 bind()
//source.forEach(buffer.add,buffer)
//常用写法，可以用bind()方法简化该种写法
//source.forEach(function(s){
//    buffer.add(s)
//})
source.forEach(buffer.add.bind(buffer))
var ret = buffer.join()
console.log(ret)
//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================


//=============================================
