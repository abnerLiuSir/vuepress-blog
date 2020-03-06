# Dart - 函数
Dart 是一门真正面向对象的语言 
已下是函数实现的示例：
```dart
bool isNoble(int atomicNumber) {
    return _nobleGases[atomicNumber] != null;
}
// 类型声明可以省略
isNoble(int atomicNumber) {
    return _nobleGases[atomicNumber] != null;
}
//如果函数中只有一句表达式，可以使用简写语法：
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```
>提示： 在箭头 (=>) 和分号 (;) 之间只能使用一个 表达式 ，不能是 语句 。 例如：不能使用 if 语句 ，但是可以是用 条件表达式.
## 可选参数
可选参数可以是命名参数或者位置参数，但一个参数只能选择其中一种方式修饰。  
- **命名可选参数**  
```dart
//调用函数时，可以使用指定命名参数 paramName: value。 例如：

enableFlags(bold: true, hidden: false);
//定义函数是，使用 {param1, param2, …} 来指定命名参数：

/// Sets the [bold] and [hidden] flags ...
void enableFlags({bool bold, bool hidden}) {...}
//使用 @required 注释表示参数是 required 性质的命名参数， 该方式可以在任何 Dart 代码中使用（不仅仅是Flutter）。

const Scrollbar({Key key, @required Widget child})
```
此时 `Scrollbar` 是一个构造函数， 当 `child` 参数缺少时，分析器会提示错误。

Required 被定义在 `meta package`。 无论是直接引入`（import） package:meta/meta.dart `，或者引入了其他 package，而这个 package 输出（export）了 meta，比如 Flutter 的 `package:flutter/material.dart`。


- **位置可选参数**  
将参数放到 [] 中来标记参数是可选的：
```dart
String say(String from, String msg, [String device]) {
    var result = '$from says $msg';
    if (device != null) {
        result = '$result with a $device';
    }
    return result;
}

//调用 不适用可选参数
print(say('Bob', 'Howdy'));    // Bob says Howdy
print(say('Bob', 'Howdy', 'smoke signal')); //Bob says Howdy with a smoke signal
```
- **默认参数值**  
在定义方法的时候，可以使用 = 来定义可选参数的默认值。 默认值只能是**编译时常量**。 如果没有提供默认值，则默认值为 `null`。
```dart
/// 设置 [bold] 和 [hidden] 标志 ...
void enableFlags({bool bold = false, bool hidden = false}) {...}

//下面示例演示了如何为位置参数设置默认值：

String say(String from, String msg, [String device = 'carrier pigeon', String mood]) {
    var result = '$from says $msg';
    if (device != null) {
        result = '$result with a $device';
    }
    if (mood != null) {
        result = '$result (in a $mood mood)';
    }
    return result;
}

print(say('Bob', 'Howdy'));   // 'Bob says Howdy with a carrier pigeon'
```
list 或 map 可以作为默认值传递。 下面的示例定义了一个方法 `doStuff()`， 并分别指定参数 list 和 gifts 的默认值。
```dart
void doStuff(
    {List<int> list = const [1, 2, 3],
        Map<String, String> gifts = const {
        'first': 'paper',
        'second': 'cotton',
        'third': 'leather'
    }}) {
    print('list:  $list');
    print('gifts: $gifts');
}
doStuff();               //list:  [1, 2, 3]
                        //gifts: {first: paper, second: cotton, third: leather}
```
## main() 函数
任何应用都必须有一个顶级 main() 函数，作为应用服务的入口。 main() 函数返回值为空，参数为一个可选的` List<String> `。
下面是 web 应用的 main() 函数：
```dart
void main() {
    querySelector('#sample_text_id')
        ..text = 'Click me!'
        ..onClick.listen(reverseText);
}
//以上代码中的 .. 语法为 级联调用 （cascade）。 使用级联调用， 可以简化在一个对象上执行的多个操作。

//下面是一个命令行应用的 main() 方法，并且使用了输入参数：
// 这样运行应用： dart args.dart 1 test
void main(List<String> arguments) {
    print(arguments);

    assert(arguments.length == 2);
    assert(int.parse(arguments[0]) == 1);
    assert(arguments[1] == 'test');
}
```
## 函数是一等对象
一个函数可以作为另一个函数的参数。 例如：
```dart
void printElement(int element) {
    print(element);
}

var list = [1, 2, 3];

// 将 printElement 函数作为参数传递。
list.forEach(printElement);
//同样可以将一个函数赋值给一个变量，例如：

var loudify = (msg) => '!!! ${msg.toUpperCase()} !!!';
assert(loudify('hello') == '!!! HELLO !!!');
```
## 匿名函数
多数函数是有名字的， 比如 `main()` 和 `printElement()`。 也可以创建没有名字的函数，这种函数被称为 匿名函数， 有时候也被称为 `lambda` 或者 `closure` 。 匿名函数可以赋值到一个变量中， 举个例子，在一个集合中可以添加或者删除一个匿名函数。  
下面例子中定义了一个包含一个无类型参数 item 的匿名函数。 list 中的每个元素都会调用这个函数，打印元素位置和值的字符串。
```dart
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
    print('${list.indexOf(item)}: $item');
});
```
## 词法作用域
Dart 是一门词法作用域的编程语言，就意味着变量的作用域是固定的， 简单说变量的作用域在编写代码的时候就已经确定了。 花括号内的是变量可见的作用域。  
```dart
bool topLevel = true;

void main() {
    var insideMain = true;

    void myFunction() {
        var insideFunction = true;
        void nestedFunction() {
            var insideNestedFunction = true;
            print(topLevel);                   //true
            print(insideMain);                 //true
            print(insideFunction);             //true
            print(insideNestedFunction);       //true
        }
        nestedFunction();
    }
    myFunction();
}
```
nestedFunction() 可以访问所有的变量， 一直到顶级作用域变量。
## 词法闭包
闭包 即一个函数对象，即使函数对象的调用在它原始作用域之外， 依然能够访问在它词法作用域内的变量。

函数可以封闭定义到它作用域内的变量。 接下来的示例中， `makeAdder() `捕获了变量 addBy。 无论在什么时候执行返回函数，函数都会使用捕获的 `addBy` 变量。
```dart
/// 返回一个函数，返回的函数参数与 [addBy] 相加。
Function makeAdder(num addBy) {
    return (num i) => addBy + i;
}

void main() {
    // 创建一个加 2 的函数。
    var add2 = makeAdder(2);

    // 创建一个加 4 的函数。
    var add4 = makeAdder(4);

    print(add2(3));     // 5
    print(add4(3));     // 7
```
## 测试函数是否相等
下面是顶级函数，静态方法和示例方法相等性的测试示例：
```dart
void foo() {} // 顶级函数

class A {
    static void bar() {} // 静态方法
    void baz() {} // 示例方法
}

void main() {
    var x;

    // 比较顶级函数。
    x = foo;
    assert(foo == x);

    // 比较静态方法。
    x = A.bar;
    assert(A.bar == x);

    // 比较实例方法。
    var v = A(); // A的1号实例
    var w = A(); // A的2号实例
    var y = w;
    x = w.baz;

    // 两个闭包引用的同一实例（2号）,
    // 所以它们相等。
    assert(y.baz == x);

    // 两个闭包引用的非同一个实例，
    // 所以它们不相等。
    assert(v.baz != w.baz);
}
```
## 返回值
所有函数都会返回一个值。 如果没有明确指定返回值， 函数体会被隐式的添加 `return null;` 语句
```dart
foo() {}

print(foo());     //null
```