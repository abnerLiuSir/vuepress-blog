# Dart - 类
Dart 是一种基于类和 mixin 继承机制的面向对象的语言。 每个对象都是一个类的实例，所有的类都继承于 Object. 。 基于 * Mixin 继承* 意味着每个类（除 Object 外） 都只有一个超类， 一个类中的代码可以在其他多个继承类中重复使用。
## 使用类的成员变量
- 对象的由函数和数据（即方法和实例变量）组成。 
- 方法的调用要通过对象来完成： 调用的方法可以访问其对象的其他函数和数据。
使用 (`.`) 来引用实例对象的变量和方法：
```dart
var p = Point(2, 2);

// 为实例的变量 y 设置值。
p.y = 3;

// 获取变量 y 的值。
assert(p.y == 3);

// 调用 p 的 distanceTo() 方法。
num distance = p.distanceTo(Point(4, 4));
//使用 ?. 来代替 . ， 可以避免因为左边对象可能为 null ， 导致的异常：
// 如果 p 为 non-null，设置它变量 y 的值为 4。
p?.y = 4;
```
## 使用构造函数
通过 构造函数 创建对象。 构造函数的名字可以是 `ClassName` 或者 `ClassName.identifier`。例如， 以下代码使用 Point 和 Point.fromJson() 构造函数创建 Point 对象：
```dart
var p1 = Point(2, 2);
var p2 = Point.fromJson({'x': 1, 'y': 2});
```
>版本提示： 在 Dart 2 中 new 关键字变成了可选的。
一些类提供了常量构造函数。 使用常量构造函数，在构造函数名之前加 const 关键字，来创建编译时常量时：
```dart
var p = const ImmutablePoint(2, 2);
```
## 获取对象的类型
使用对象的 `runtimeType` 属性， 可以在运行时获取对象的类型， `runtimeType `属性回返回一个 Type 对象。
`print('The type of a is ${a.runtimeType}');`
## 实例变量
下面是声明实例变量的示例：
```dart
class Point {
  num x; // 声明示例变量 x，初始值为 null 。
  num y; // 声明示例变量 y，初始值为 null 。
  num z = 0; // 声明示例变量 z，初始值为 0 。
}

class Point {
  num x;
  num y;
}

//所有实例变量都生成隐式 getter 方法。 非 final 的实例变量同样会生成隐式 setter 方法。
void main() {
  var point = Point();
  point.x = 4; // Use the setter method for x.
  assert(point.x == 4); // Use the getter method for x.
  assert(point.y == null); // Values default to null.
}
```
如果在声明时进行了示例变量的初始化， 那么初始化值会在示例创建时赋值给变量， 该赋值过程在构造函数及其初始化列表执行之前。

## 构造函数
通过创建一个与其类同名的函数来声明构造函数   
面通过最常见的构造函数形式， 即生成构造函数， 创建一个类的实例：
```dart
class Point {
    num x, y;

    Point(num x, num y) {
        // 还有更好的方式来实现下面代码，敬请关注。
        this.x = x;
        this.y = y;
    }
}
```
使用 this 关键字引用当前实例。
>提示： 近当存在命名冲突时，使用 this 关键字。 否则，按照 Dart 风格应该省略 this 。
通常模式下，会将构造函数传入的参数的值赋值给对应的实例变量， Dart 自身的语法糖精简了这些代码：
```dart
class Point {
    num x, y;
    // 在构造函数体执行前，
    // 语法糖已经设置了变量 x 和 y。
    Point(this.x, this.y);
}
```
- 默认构造函数  
在没有声明构造函数的情况下， Dart 会提供一个默认的构造函数。 默认构造函数没有参数并会调用父类的无参构造函数。  
- 构造函数不被继承  
子类不会继承父类的构造函数。 子类不声明构造函数，那么它就只有默认构造函数 (匿名，没有参数) 。
- 命名构造函数
使用命名构造函数可为一个类实现多个构造函数， 也可以使用命名构造函数来更清晰的表明函数意图
```dart
class Point {
    num x, y;

    Point(this.x, this.y);

    // 命名构造函数
    Point.origin() {
        x = 0;
        y = 0;
    }
}
```
切记，构造函数不能够被继承， 这意味着父类的命名构造函数不会被子类继承。 **如果希望使用父类中定义的命名构造函数创建子类， 就必须在子类中实现该构造函数。**
- 调用父类非默认构造函数  
默认情况下，子类的构造函数会自动调用父类的默认构造函数（匿名，无参数）。 父类的构造函数在子类构造函数体开始执行的位置被调用。 如果提供了一个 initializer list （初始化参数列表）， 则初始化参数列表在父类构造函数执行之前执行。 总之，执行顺序如下：  

> - 1. initializer list （初始化参数列表）
> - 2. superclass’s no-arg constructor （父类的无名构造函数）
> - 3. main class’s no-arg constructor （主类的无名构造函数）
- 初始化列表  
除了调用超类构造函数之外， 还可以在构造函数体执行之前初始化实例变量。 各参数的初始化用逗号分隔。
```dart
// 在构造函数体执行之前，
// 通过初始列表设置实例变量。
Point.fromJson(Map<String, num> json)
    : x = json['x'],
    y = json['y'] {
    print('In Point.fromJson(): ($x, $y)');
}
```
## 重定向构造函数
有时构造函数的唯一目的是重定向到同一个类中的另一个构造函数。 重定向构造函数的函数体为空， 构造函数的调用在冒号 (`:`) 之后。
```dart
class Point {
    num x, y;

    // 类的主构造函数。
    Point(this.x, this.y);

    // 指向主构造函数
    Point.alongXAxis(num x) : this(x, 0);
}
```
## 常量构造函数
如果该类生成的对象是固定不变的， 那么就可以把这些对象定义为编译时常量。 为此，需要定义一个 const 构造函数， 并且声明所有实例变量为 `final`。
```dart
class ImmutablePoint {
    static final ImmutablePoint origin = const ImmutablePoint(0, 0);

    final num x, y;

    const ImmutablePoint(this.x, this.y);
}
```
## 工厂构造函数
当执行构造函数并不总是创建这个类的一个新实例时，则使用 factory 关键字。 例如，一个工厂构造函数可能会返回一个 cache 中的实例， 或者可能返回一个子类的实例。  
以下示例演示了从缓存中返回对象的工厂构造函数
```dart

class Logger {
    final String name;
    bool mute = false;

    // 从命名的 _ 可以知，
    // _cache 是私有属性。
    static final Map<String, Logger> _cache =
        <String, Logger>{};

    factory Logger(String name) {
        if (_cache.containsKey(name)) {
            return _cache[name];
        } else {
            final logger = Logger._internal(name);
            _cache[name] = logger;
            return logger;
        }
    }

    Logger._internal(this.name);

    void log(String msg) {
        if (!mute) print(msg);
    }
}
```
## 方法
方法是为对象提供行为的函数。

