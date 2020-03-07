# Dart - 控制流程语句
## if 和 else
```dart
if (isRaining()) {
    you.bringRainCoat();
} else if (isSnowing()) {
    you.wearJacket();
} else {
    car.putTopDown();
}
```
>和 JavaScript 不同， Dart 的判断条件必须是布尔值，不能是其他类型
## for 循环
进行迭代操作，可以使用标准 for 语句。 例如：
```dart
var message = StringBuffer('Dart is fun');
for (var i = 0; i < 5; i++) {
  message.write('!');              //Dart is fun!!!!!
}
```
闭包在 Dart 的 for 循环中会捕获循环的 index 索引值， 来避免 JavaScript 中常见的陷阱。
```dart
var callbacks = [];
for (var i = 0; i < 2; i++) {
    callbacks.add(() => print(i));
}
callbacks.forEach((c) => c());
```
I如果要迭代一个实现了 Iterable 接口的对象， 可以使用 forEach() 方法， 如果不需要使用当前计数值， 使用 forEach() 是非常棒的选择；
`candidates.forEach((candidate) => candidate.interview());`
实现了 Iterable 的类（比如， List 和 Set）同样也支持使用 for-in 进行迭代操作 iteration ：
```dart
var collection = [0, 1, 2];
for (var x in collection) {
  print(x); // 0 1 2
}
```
## while 和 do-while
```dart
//while 循环在执行前判断执行条件：

while (!isDone()) {
  doSomething();
}
//do-while 循环在执行后判断执行条件：

do {
  printLine();
} while (!atEndOfPage());
```
## break 和 continue
```dart
//使用 break 停止程序循环：

while (true) {
  if (shutDownRequested()) break;
  processIncomingRequests();
}
//使用 continue 跳转到下一次迭代：

for (int i = 0; i < candidates.length; i++) {
  var candidate = candidates[i];
  if (candidate.yearsExperience < 5) {
    continue;
  }
  candidate.interview();
}
//如果对象实现了 Iterable 接口 （例如，list 或者 set）。 那么上面示例完全可以用另一种方式来实现：

candidates
    .where((c) => c.yearsExperience >= 5)
    .forEach((c) => c.interview());
```
## switch 和 case
在 Dart 中 switch 语句使用 == 比较整数，字符串，或者编译时常量。 比较的对象必须都是同一个类的实例（并且不可以是子类）， 类必须没有对 == 重写 **枚举类型**可以用于 switch 语句。   
在 case 语句中，每个非空的 case 语句结尾需要跟一个 break 语句。 除 break 以外，还有可以使用 continue, throw，者 return。  
当没有 case 语句匹配时，执行 default 代码：  
```dart
var command = 'OPEN';
switch (command) {
  case 'CLOSED':
    executeClosed();
    break;
  case 'PENDING':
    executePending();
    break;
  case 'APPROVED':
    executeApproved();
    break;
  case 'DENIED':
    executeDenied();
    break;
  case 'OPEN':
    executeOpen();
    break;
  default:
    executeUnknown();
}
```
但是， Dart 支持空 case 语句， 允许程序以 fall-through 的形式执行。  
```dart
var command = 'CLOSED';
switch (command) {
  case 'CLOSED':
    executeClosed();
    continue nowClosed;
  // Continues executing at the nowClosed label.

  nowClosed:
  case 'NOW_CLOSED':
    // Runs for both CLOSED and NOW_CLOSED.
    executeNowClosed();
    break;
}
}
```
case 语句可以拥有局部变量， 这些局部变量只能在这个语句的作用域中可见。
## assert
如果 assert 语句中的布尔条件为 false ， 那么正常的程序执行流程会被中断。 在本章中包含部分 assert 的使用， 下面是一些示例：
```dart
// 确认变量值不为空。
assert(text != null);

// 确认变量值小于100。
assert(number < 100);

// 确认 URL 是否是 https 类型。
assert(urlString.startsWith('https'));
```
>assert 语句只在开发环境中有效， 在生产环境是无效的； Flutter 中的 assert 只在 debug 模式 中有效。 开发用的工具，例如 dartdevc 默认是开启 assert 功能。 其他的一些工具， 例如 dart 和 dart2js, 支持通过命令行开启 assert ： --enable-asserts。
