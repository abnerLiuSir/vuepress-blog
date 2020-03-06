# Dart - 运算符
下表是 Dart 定义的运算符。 多数运算符可以被重载
| Description | Operator |
| :---: | :---: |
| 一元后缀 | expr++    expr--    ()    []    .    ?. |
| 一元前缀 | -expr    !expr    ~expr    ++expr    --expr |
| 乘除 | *    /    %  ~/ |
| 加减 |+    -|
| 移位 | <<    >>    >>> |
| 按位与 | & |
| 按位或 | `|` |
| 按位异或 | ^ |
| 关系和类型测试 | >=    >    <=    <    as    is    is! |
| 比较 | ==    !=    |
| 逻辑与 | && |
| 逻辑或 | `||` |
| 如果为空 | ?? |
| 三目运算符 | expr1 ? expr2 : expr3 |
|  级联调用  | ..|
| 赋值 | =    *=    /=   +=   -=   &=   ^=   etc.|
在 运算符表 中， 每一行的运算符优先级，由上到下依次排列，第一行优先级最高，最后一行优先级最低。 例如 % 运算符优先级高于 == ， 而 == 高于 &&。 根据优先级规则，那么意味着以下两行代码执行的方式相同：
```dart
// 括号可以提高可读性。
if ((n % i == 0) && (d % i == 0)) ...

// 可读性差，但是是等效的。
if (n % i == 0 && d % i == 0) ...
```
## 算术运算符
| Description | Meaning |
| :---: | :---: |
| + | 加 |
| – | 减 |
| -expr | 负数 反转表达式 |
| * | 乘|
| / | 除 |
| ~/ | 除之后取整 |
| % | 取余 |
```dart
print(2 + 3 );                 // 5
print(2 - 3 );                 // -1
print(2 * 3);                  // 6
print(5 / 2 );                 // 2.5 结果是双浮点型
print(5 ~/ 2);            // 2 结果是整型
print(5 % 2);             // 1 余数

print('5/2 = ${5 ~/ 2} r ${5 % 2}' == '5/2 = 2 r 1');
```
Dart 还支持前缀和后缀，自增和自减运算符。
| Description | Meaning |
| :---: | :---: |
| ++var | 先自增再赋值 |
| var++ | 先赋值再自增 |
| --var | 先自减再赋值 |
| var-- | 先赋值再自减 |
```dart

var a, b;

a = 0;
b = ++a; // a自加后赋值给b。
assert(a == b); // 1 == 1

a = 0;
b = a++; // a先赋值给b后，a自加。
assert(a != b); // 1 != 0

a = 0;
b = --a; // a自减后赋值给b。
assert(a == b); // -1 == -1

a = 0;
b = a--; // a先赋值给b后，a自减。
assert(a != b); // -1 != 0
```
## 关系运算符
| Description | Meaning |
| :---: | :---: |
| == | 相等 |
| != | 不等 |
| > | 大于 |
| < | 小于 |
| >= | 大于等于 |
| <= | 小于等于 |
要测试两个对象x和y是否表示相同的事物， 使用 == 运算符。 (在极少数情况下， 要确定两个对象是否完全相同，需要使用 `identical() `函数。) 下面给出 == 运算符的工作原理：
- 1. 如果 x 或 y 可以 null，都为 null 时返回 true ，其中一个为 null 时返回 false。
- 2. 结果为函数 `x.==(y)` 的返回值。
```dart
assert(2 == 2);
assert(2 != 3);
assert(3 > 2);
assert(2 < 3);
assert(3 >= 3);
assert(2 <= 3);
```
## 类型判定运算符
| Description | Meaning |
| :---: | :---: |
| as | 类型转换 |
| is | 如果对象具有指定的类型，则为True |
| is! | 如果对象具有指定的类型，则为False |
使用 as 运算符将对象强制转换为特定类型。 通常，可以认为是 is 类型判定后，被判定对象调用函数的一种缩写形式。 请考虑以下代码：
```dart
if (emp is Person) {
    // Type check
    emp.firstName = 'Bob';
}
//使用 as 运算符进行缩写：
(emp as Person).firstName = 'Bob';
```
>提示： 以上代码并不是等价的。 如果 emp 为 null 或者不是 Person 对象， 那么第一个 is 的示例，后面将不回执行； 第二个 as 的示例会抛出异常。
## 赋值运算符
使用 = 为变量赋值。 使用 ??= 运算符时，只有当被赋值的变量为 null 时才会赋值给它。
```dart
// 将值赋值给变量a
a = value;
// 如果b为空时，将变量赋值给b，否则，b的值保持不变。
b ??= value;
```
复合赋值运算符（如 += ）将算术运算符和赋值运算符组合在了一起。  
以下示例使用赋值和复合赋值运算符：
```dart
var a = 2; // 使用 = 复制
a *= 3; // 复制并做乘法运算： a = a * 3
assert(a == 6);
```
## 逻辑运算符
逻辑操作符可以反转或组合布尔表达式。  
| Description | Meaning |
| :---: | :---: |
| !expr | 反转表达式将false更改为true，反之亦然 |
| || | 逻辑或 |
| && | 逻辑与 |
```dart
if (!done && (col == 0 || col == 3)) {
    // ...Do something...
}
```
## 按位和移位运算符
| Description | Meaning |
| :---: | :---: |
| & | 与 |
| | | 或 |
| ^ | 异或 |
| ~expr | 一元按位补码（0变为1； 1变为0） |
| << | 左移 |
| >> | 右移 |
```dart
final value = 0x22;     //34     0010 0010
final bitmask = 0x0f;   //15     0000 1111

assert((value & bitmask) == 0x02); // AND
assert((value & ~bitmask) == 0x20); // AND NOT
assert((value | bitmask) == 0x2f); // OR
assert((value ^ bitmask) == 0x2d); // XOR
assert((value << 4) == 0x220); // Shift left
assert((value >> 4) == 0x02); // Shift right
```
## 条件表达式
Dart有两个运算符，有时可以替换 if-else 表达式， 让表达式更简洁：  
`condition ? expr1 : expr2`
就是三目运算符
## 级联运算符 (..)
级联运算符 (..) 可以实现对同一个对像进行一系列的操作。 除了调用函数， 还可以访问同一对象上的字段属性。 这通常可以节省创建临时变量的步骤， 同时编写出更流畅的代码。
```dart
querySelector('#confirm') // 获取对象。
  ..text = 'Confirm' // 调用成员变量。
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
  /**
  第一句调用函数 querySelector() ， 返回获取到的对象。 获取的对象依次执行级联运算符后面的代码， 代码执行后的返回值会被 忽略。
    *上面的代码等价于：
  */
    var button = querySelector('#confirm');
    button.text = 'Confirm';
    button.classes.add('important');
    button.onClick.listen((e) => window.alert('Confirmed!'));
```
级联运算符可以嵌套，例如：
```dart
final addressBook = (AddressBookBuilder()
      ..name = 'jenny'
      ..email = 'jenny@example.com'
      ..phone = (PhoneNumberBuilder()
            ..number = '415-555-0100'
            ..label = 'home')
          .build())
    .build();
```
## 其他运算符
| Description | Name | Meaning |
| :---: | :---: | :---: |
| () | 功能应用 | 代表一个函数调用 |
| [] | 列表访问 | 引用列表中指定索引处的值 |
| . | 会员访问 | 引用表达式的属性；示例：foo.bar从表达式foo中选择属性栏 |
| ?. | 有条件的成员访问 | 类似于 `.`，但是最左边的操作数可以为null；示例：foo？.bar从表达式foo中选择属性bar，除非foo为null（在这种情况下foo？.bar的值为null） |