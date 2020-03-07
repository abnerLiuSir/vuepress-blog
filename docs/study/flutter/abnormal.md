## Dart - 异常
Dart 代码可以抛出和捕获异常。 异常表示一些未知的错误情况。 如果异常没有被捕获， 则异常会抛出， 导致抛出异常的代码终止执行。
## throw
下面是关于抛出或者 引发 异常的示例：  
```dart
throw FormatException('Expected at least 1 section');

//也可以抛出任意的对象：

throw 'Out of llamas!';
```
>提示： 高质量的生产环境代码通常会实现 Error 或 Exception 类型的异常抛出。
因为抛出异常是一个表达式， 所以可以在 => 语句中使用，也可以在其他使用表达式的地方抛出异常：
```dart
void distanceTo(Point other) => throw UnimplementedError();
```
## catch
捕获异常可以避免异常继续传递（除非重新抛出（ rethrow ）异常）。 可以通过捕获异常的机会来处理该异常：
```dart
try {
    breedMoreLlamas();
} on OutOfLlamasException {
    buyMoreLlamas();
}
```
通过指定多个 catch 语句，可以处理可能抛出多种类型异常的代码。 与抛出异常类型匹配的第一个 catch 语句处理异常。 如果 catch 语句未指定类型， 则该语句可以处理任何类型的抛出对象：
```dart
try {
breedMoreLlamas();
} on OutOfLlamasException {
    // 一个特殊的异常
    buyMoreLlamas();
} on Exception catch (e) {
    // 其他任何异常
    print('Unknown exception: $e');
} catch (e) {
    // 没有指定的类型，处理所有异常
    print('Something really unknown: $e');
}
//如上述代码所示，捕获语句中可以同时使用 on 和 catch ，也可以单独分开使用。 使用 on 来指定异常类型， 使用 catch 来 捕获异常对象。

//catch() 函数可以指定1到2个参数， 第一个参数为抛出的异常对象， 第二个为堆栈信息 ( 一个 StackTrace 对象 )。
try {
    // ···
} on Exception catch (e) {
    print('Exception details:\n $e');
} catch (e, s) {
    print('Exception details:\n $e');
    print('Stack trace:\n $s');
}
``
如果仅需要部分处理异常， 那么可以使用关键字 rethrow 将异常重新抛出。
```dart
void misbehave() {
    try {
        dynamic foo = true;
        print(foo++); // Runtime error
    } catch (e) {
        print('misbehave() partially handled ${e.runtimeType}.');
        rethrow; // Allow callers to see the exception.
    }
}

void main() {
    try {
        misbehave();
    } catch (e) {
        print('main() finished handling ${e.runtimeType}.');
    }
}
```
## finally
不管是否抛出异常， finally 中的代码都会被执行。 如果 catch 没有匹配到异常， 异常会在 finally 执行完成后，再次被抛出：
```dart
try {
    breedMoreLlamas();
} finally {
    // Always clean up, even if an exception is thrown.
    cleanLlamaStalls();
}

//任何匹配的 catch 执行完成后，再执行 finally ：

try {
    breedMoreLlamas();
} catch (e) {
    print('Error: $e'); // Handle the exception first.
} finally {
    cleanLlamaStalls(); // Then clean up.
}
``