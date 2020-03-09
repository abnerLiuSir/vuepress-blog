# Dart - 异步支持
Dart 库中包含许多返回 Future 或 Stream 对象的函数. 这些函数在设置完耗时任务（例如 I/O 操作）后， 就立即返回了，不会等待耗任务完成。 使用 async 和 await 关键字实现异步编程。 可以让你像编写同步代码一样实现异步操作。
## 处理 Future
可以通过下面两种方式，获得 Future 执行完成的结果：
- 使用 async 和 await.
- 使用 Future API  
使用 async 和 await 关键字的代码是异步的。 虽然看起来有点想同步代码。 例如，下面的代码使用 await 等待异步函数的执行结果。
```dart
await lookUpVersion();
//要使用 await ， 代码必须在 异步函数（使用 async 标记的函数）中：
Future checkVersion() async {
  var version = await lookUpVersion();
  // Do something with version
}
```
>提示： 虽然异步函数可能会执行耗时的操作， 但它不会等待这些操作。 相反，异步函数只有在遇到第一个 await 表达式（时才会执行。 也就是说，它返回一个 Future 对象， 仅在await表达式完成后才恢复执行。
使用 try， catch， 和 finally 来处理代码中使用 await 导致的错误。
```dart
try {
    version = await lookUpVersion();
} catch (e) {
    // React to inability to look up the version
}
//一个异步函数中可以多次使用 await 。 例如，下面代码中等待了三次函数结果：
var entrypoint = await findEntrypoint();
var exitCode = await runExecutable(entrypoint, args);
await flushThenExit(exitCode);
```
在 `await `表达式 中， 表达式 的值通常是一个 `Future` 对象； 如果不是，这是表达式的值会被自动包装成一个 Future 对象。 `Future` 对象指明返回一个对象的承诺（`promise`）。 await 表达式 执行的结果为这个返回的对象。 await 表达式会阻塞代码的执行，直到需要的对象返回为止。  
**如果在使用 await 导致编译时错误， 确认 await 是否在一个异步函数中。** 例如，在应用的 main() 函数中使用 await ， main() 函数的函数体必须被标记为 async ：
```dart
Future main() async {
    checkVersion();
    print('In main: version is ${await lookUpVersion()}');
}
```
## 声明异步函数
函数体被 async 标示符标记的函数，即是一个_异步函数_。 将 async 关键字添加到函数使其返回Future。 例如，考虑下面的同步函数，它返回一个 String ：
```dart
String lookUpVersion() => '1.0.0';
//将来的实现将非常耗时，将其更改为异步函数，返回值是 Future 。
Future<String> lookUpVersion() async => '1.0.0';
```
注意，函数体不需要使用Future API。 如有必要， Dart 会创建 Future 对象。

如果函数没有返回有效值， 需要设置其返回类型为 `Future<void> `。
## 处理 Stream
当需要从 Stream 中获取数据值时， 可以通过一下两种方式：

- 使用 async 和 一个 异步循环 （await for）。
- 使用 Stream API。
>在使用 await for 前，确保代码清晰， 并且确实希望等待所有流的结果。 例如，通常不应该使用 await for 的UI事件侦听器， 因为UI框架会发送无穷无尽的事件流。
await for循环的使用形式：
```dart
await for (varOrType identifier in expression) {
    // Executes each time the stream emits a value.
}
```
上面 表达式 返回的值必须是 Stream 类型。 执行流程如下：

- 等待，直到流发出一个值。
- 执行 for 循环体，将变量设置为该发出的值
- 重复1和2，直到关闭流。
使用 break 或者 return 语句可以停止接收 stream 的数据， 这样就跳出了 for 循环， 并且从 stream 上取消注册。 **如果在实现异步 for 循环时遇到编译时错误， 请检查确保 await for 处于异步函数中。** 例如，要在应用程序的 main() 函数中使用异步 fo r循环， main() 函数体必须标记为 async` ：
```dart
Future main() async {
    // ...
    await for (var request in requestServer) {
        handleRequest(request);
    }
    // ...
}
```
## 生成器
当您需要延迟生成( lazily produce )一系列值时， 可以考虑使用_生成器函数_。 Dart 内置支持两种生成器函数：
- Synchronous 生成器： 返回一个 Iterable 对象。
- Asynchronous 生成器： 返回一个 Stream 对象。  

```dart
//通过在函数体标记 sync*， 可以实现一个同步生成器函数。 使用 yield 语句来传递值：  
Iterable<int> naturalsTo(int n) sync* {
    int k = 0;
    while (k < n) yield k++;
}

//通过在函数体标记 async*， 可以实现一个异步生成器函数。 使用 yield 语句来传递值：

Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}

//如果生成器是递归的，可以使用 yield* 来提高其性能：
Iterable<int> naturalsDownFrom(int n) sync* {
    if (n > 0) {
        yield n;
        yield* naturalsDownFrom(n - 1);
    }
}
```
## 可调用类
## 元数据
使用元数据可以提供有关代码的其他信息。 元数据注释以字符 @ 开头， 后跟对编译时常量 (如 deprecated) 的引用或对常量构造函数的调用。  

对于所有 Dart 代码有两种可用注解：@deprecated 和 @override。 
```dart
class Television {
    /// _Deprecated: Use [turnOn] instead._
    @deprecated
    void activate() {
        turnOn();
    }

    /// Turns the TV's power on.
    void turnOn() {...}
}
//可以自定义元数据注解。 下面的示例定义了一个带有两个参数的 @todo 注解：
library todo;

class Todo {
    final String who;
    final String what;

    const Todo(this.who, this.what);
}
import 'todo.dart';

@Todo('seth', 'make this do something')
void doSomething() {
    print('do something');
}
```
元数据可以在 library、 class、 typedef、 type parameter、 constructor、 factory、 function、 field、 parameter 或者 variable 声明之前使用，也可以在 import 或者 export 指令之前使用。 使用反射可以在运行时获取元数据信息。
