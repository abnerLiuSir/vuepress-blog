
# Dart - 变量
- 变量类型可以自动推断，或显示绑定 
```
void main() {
  var name = 'abner';
  name = 1; //A value of type 'int' can't be assigned to a variable of type 'String'.
}
```
`name`已经被推断为`String`类型 不能在赋值数字 除非用`dynamic`定义
```
void main() {
  dynamic  name = 'abner';
  name = 1; 
}
```
- 未初始化的变量其值都为null， 包括数字
```
void main() {
  int lineCount;
  print(lineCount == null); // true
}
```
- final 和 const变量只能赋值一次 
```
void main() {
  final firstName = 'Liu';
  const lastName = 'abner';
  firstName = 'l';   //Error: Setter not found: 'firstName'.
  lastName = 'a';    //Error: Setter not found: 'lastName'.
}
```
区别就是
```
//const可以使用其他const常量的值来初始化其值
const width=100;
const height=50;
const square=width*height;

//需要确定的值
final dt = DateTime.now();//正确，运行时有确定的值
const dt = const DateTime.now();//错误，需要编译时有确定的值

//值相同时final在内存中重复创建，const会引用相同值
final a1 = [11 , 22];
final a2 = [11 , 22];
print(identical(a1, a2));//false
 
const a1 = [11 , 22];
const a2 = [11 , 22];
print(identical(a1, a2));//true
```
const 还可以用来声明**常值**  
常量：为了避免寻址  
常值：为了防止内容发生变化
```
//const 可以进行算术运算
void main() {
  const r = 10;
  const double area = 3.1415926 * r * r;
  print(area);
}
```
