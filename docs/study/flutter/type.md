# Dart - 内置类型
## 数字 (Number)
Dart 语言的 Number 有两种类型:  
- **int**  
整数值不大于64位， 具体取决于平台。 在 `Dart VM` 上， 值的范围从 -2<sup>63</sup> 到 2<sup>63</sup> - 1. Dart 被编译为 `JavaScript` 时，使用 JavaScript numbers, 值的范围从 -2<sup>53</sup> 到 2<sup>53</sup> - 1.

- **double**  
64位（双精度）浮点数，依据 IEEE 754 标准。 
`int` 和 `double` 都是 `num.` 的亚类型。 `num` 类型包括基本运算 +， -， /， 和 *， 以及 `abs()`， `ceil()`， 和 `floor()`， 等函数方法。 （按位运算符，例如»，定义在 int 类中。） 如果 `num` 及其亚类型找不到你想要的方法， 尝试查找使用 [dart:math](https://api.dartlang.org/stable/dart-math) 库。
```
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
```
print((3 << 1) == 6); // 0011 << 1 == 0110
print((3 >> 1) == 1); // 0011 >> 1 == 0001
print((3 | 4) == 7); // 0011 | 0100 == 0111
```
## String
Dart 字符串是一组 UTF-16 单元序列。 字符串通过单引号或者双引号创建。  
```
var s1 = 'Single quotes work well for string literals.';
var s2 = "Double quotes work just as well.";
var s3 = 'It\'s easy to escape the string delimiter.';
var s4 = "It's even easier to use the other delimiter.";
```
字符串可以通过` ${expression} `的方式内嵌表达式。 如果表达式是一个标识符，则 {} 可以省略。 在 Dart 中通过调用就对象的 `toString()` 方法来得到对象相应的字符串。  

不同于JS ，可以使用 + 运算符来把多个字符串连接为一个，也可以把多个字面量字符串写在一起来实现字符串连接：
```
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
```
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

```
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
```
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
```
var list = [1, 2, 3];
print(list.length == 3);  // true
print(list[1] == 2);      // true

list[1] = 1;
print(list[1] == 1);      // true
```
## Set
在 Dart 中 Set 是一个元素唯一且无需的集合。 Dart 为 Set 提供了 Set 字面量和 Set 类型。
下面是通过字面量创建 Set 的一个简单示例：
```
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
```