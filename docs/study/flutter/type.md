# Dart - 内置类型
## 数字 (Number)
Dart 语言的 Number 有两种类型:  
- **int**  
整数值不大于64位， 具体取决于平台。 在 `Dart VM` 上， 值的范围从 -2<sup>63</sup> 到 2<sup>63</sup> - 1. Dart 被编译为 `JavaScript` 时，使用 JavaScript numbers, 值的范围从 -2<sup>53</sup> 到 2<sup>53</sup> - 1.

- **double**  
64位（双精度）浮点数，依据 IEEE 754 标准。 
`int` 和 `double` 都是 `num.` 的亚类型。 `num` 类型包括基本运算 +， -， /， 和 *， 以及 `abs()`， `ceil()`， 和 `floor()`， 等函数方法。 （按位运算符，例如»，定义在 int 类中。） 如果 `num` 及其亚类型找不到你想要的方法， 尝试查找使用 [dart:math](https://api.dartlang.org/stable/dart-math) 库。
```dart
void main() {
    var x = 1;                // 1
    var oct = 0721;           // 721  区别于JS 0 开头不会为八进制 而是十进制
    var hex = 0xDEADBEEF;     // 3735928559
    // 字符串转数字
    var one = int.parse('1');
    print(one == 1);

    // String -> double
    var onePointOne = double.parse('1.1');
    print(onePointOne == 1.1);

    // int -> String
    String oneAsString = 1.toString();
    print(oneAsString == '1');

    // double -> String
    String piAsString = 3.14159.toStringAsFixed(2);
    print(piAsString == '3.14');
}
```
int 特有的传统按位运算操作，移位（<<， >>），按位与（&）以及 按位或（|）。 例如：  
```dart
print((3 << 1) == 6); // 0011 << 1 == 0110
print((3 >> 1) == 1); // 0011 >> 1 == 0001
print((3 | 4) == 7); // 0011 | 0100 == 0111
```
## String
Dart 字符串是一组 UTF-16 单元序列。 字符串通过单引号或者双引号创建。  
```dart
var s1 = 'Single quotes work well for string literals.';
var s2 = "Double quotes work just as well.";
var s3 = 'It\'s easy to escape the string delimiter.';
var s4 = "It's even easier to use the other delimiter.";
```
字符串可以通过` ${expression} `的方式内嵌表达式。 如果表达式是一个标识符，则 {} 可以省略。 在 Dart 中通过调用就对象的 `toString()` 方法来得到对象相应的字符串。  

不同于JS ，可以使用 + 运算符来把多个字符串连接为一个，也可以把多个字面量字符串写在一起来实现字符串连接：
```dart
var s1 = 'String '
    'concatenation'
    " works even over line breaks.";
print(s1 ==
    'String concatenation works even over '
    'line breaks.');                                      //true

var s2 = 'The + operator ' + 'works, as well.';
print(s2 == 'The + operator works, as well.');            //true
```
使用连续三个单引号或者三个双引号实现多行字符串对象的创建：  
```dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```
使用 r 前缀，可以创建 “原始 raw” 字符串：
```
var s = r"In a raw string, even \n isn't special."          // 加r 不会编译转义字符等 会执行原始String

```
一个编译时常量的字面量字符串中，如果存在插值表达式，表达式内容也是编译时常量， 那么该字符串依旧是编译时常量。 插入的常量值类型可以是 null，数值，字符串或布尔值。

```dart
// const 类型数据
const aConstNum = 0;
const aConstBool = true;
const aConstString = 'a constant string';

// 非 const 类型数据
var aNum = 0;
var aBool = true;
var aString = 'a string';
const aConstList = [1, 2, 3];

const validConstString = '$aConstNum $aConstBool $aConstString'; //const 类型数据
// const invalidConstString = '$aNum $aBool $aString $aConstList'; //非 const 类型数据


```
## Boolean
Dart 使用 `bool` 类型表示布尔值。 Dart 只有字面量`true and false `是布尔类型， 这两个对象都是编译时常量。  

Dart 的类型安全意味着不能使用 `if (nonbooleanValue) `或者 `assert (nonbooleanValue)`。 而是应该像下面这样，明确的进行值检查：
```dart
// 检查空字符串。
var fullName = '';
assert(fullName.isEmpty);

// 检查 0 值。
var hitPoints = 0;
assert(hitPoints <= 0);

// 检查 null 值。
var unicorn;
assert(unicorn == null);

// 检查 NaN 。
var iMeantToDoThis = 0 / 0;
assert(iMeantToDoThis.isNaN);
```
## List
几乎每种编程语言中最常见的集合可能是 array 或有序的对象集合。 在 Dart 中的 `Array` 就是 List 对象， 通常称之为 List 。  
Dart 中的 List 字面量非常像 JavaScript 中的 array 字面量。 下面是一个 Dart List 的示例：
```dart
var list = [1, 2, 3];
print(list.length == 3);  // true
print(list[1] == 2);      // true

list[1] = 1;
print(list[1] == 1);      // true
```
## Set
在 Dart 中 Set 是一个元素唯一且无需的集合。 Dart 为 Set 提供了 Set 字面量和 Set 类型。
下面是通过字面量创建 Set 的一个简单示例：
```dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
```
- 是 Set 还是 Map ？   
Map 字面量语法同 Set 字面量语法非常相似。 因为先有的 Map 字母量语法，所以 {} 默认是 Map 类型。   如果忘记在 {} 上注释类型或赋值到一个未声明类型的变量上，   那么 Dart 会创建一个类型为 `Map<dynamic, dynamic>` 的对象。  
使用 add() 或 addAll() 为已有的 Set 添加元素：
```dart
var elements = <String>{};
elements.add('fluorine');
elements.addAll(halogens);
```
使用 .length 来获取 Set 中元素的个数：
```
print(elements.length);   //5       {fluorine, chlorine, bromine, iodine, astatine}
```
在 Set 字面量前增加 const ，来创建一个编译时 Set 常量：
```dart
final constantSet = const {
  'fluorine',
  'chlorine',
  'bromine',
  'iodine',
  'astatine',
};
// constantSet.add('helium'); // Uncommenting this causes an error.
```
## Map
通常来说， Map 是用来关联`keys `和` values `的对象。 `keys `和 `values` 可以是任何类型的对象。在一个 Map 对象中一个 `key `只能出现一次。 但是` value` 可以出现多次。 Dart 中 Map 通过 Map 字面量 和 Map 类型来实现。
```dart
var gifts = {
  // Key:    Value
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};

var nobleGases = {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};
```
---
>Dart 会将 gifts 的类型推断为`Map<String, String>`， nobleGases 的类型推断为 `Map<int, String>` 。 如果尝试在上面的 map 中添加错误类型，那么分析器或者运行时会引发错误。

Map 对象也可以使用 Map 构造函数创建：  
```dart
var gifts = Map();   // new关键字可以省略
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';

var nobleGases = Map();
nobleGases[2] = 'helium';
nobleGases[10] = 'neon';
nobleGases[18] = 'argon';

//类似 JavaScript ，添加 key-value 对到已有的 Map 中：

var gifts = {'first': 'partridge'};
gifts['fourth'] = 'calling birds'; // Add a key-value pair
//类似 JavaScript ，从一个 Map 中获取一个 value：

var gifts = {'first': 'partridge'};
print(gifts['first'] == 'partridge');
如果 Map 中不包含所要查找的 key，那么 Map 返回 null：

var gifts = {'first': 'partridge'};
print(gifts['fifth'] == null);
使用 .length 函数获取当前 Map 中的 key-value 对数量：

var gifts = {'first': 'partridge'};
gifts['fourth'] = 'calling birds';
assert(gifts.length == 2);
```
## Rune
在 Dart 中， Rune 用来表示字符串中的 UTF-32 编码字符。  
表示 Unicode 编码的常用方法是， \uXXXX, 这里 XXXX 是一个4位的16进制数。  心形符号 (♥) 是 \u2665。
对于特殊的非 4 个数值的情况， 把编码值放到大括号中即可。 例如，emoji 的笑脸 😀 是 \u{1f600}。
## Symbol
一个 Symbol 对象表示 Dart 程序中声明的运算符或者标识符。 你也许永远都不需要使用 Symbol ，但要按名称引用标识符的 API 时， Symbol 就非常有用了。 因为代码压缩后会改变标识符的名称，但不会改变标识符的符号。 通过字面量 Symbol ，也就是标识符前面添加一个 # 号，来获取标识符的 Symbol 。
```dart
#radix
#bar
```
