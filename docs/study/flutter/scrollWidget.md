# Flutter - 可滚动组件
## 可滚动组件简介
当组件内容超过当前显示视口(`ViewPort`)时，如果没有特殊处理，`Flutter`则会提示`Overflow`错误。为此，Flutter提供了多种可滚动组件（`Scrollable Widget`）用于显示列表和长布局。在本章中，我们先介绍一下常用的可滚动组件（如`ListView`、`GridView`等），然后介绍一下`ScrollController`。可滚动组件都直接或间接包含一个`Scrollable`组件，因此它们包括一些共同的属性，为了避免重复介绍，我们在此统一介绍一下：
```dart
Scrollable({
  ...
  this.axisDirection = AxisDirection.down,
  this.controller,
  this.physics,
  @required this.viewportBuilder, //后面介绍
})
```
- `axisDirection`滚动方向。
- `physics`：此属性接受一个`ScrollPhysics`类型的对象，它决定可滚动组件如何响应用户操作，比如用户滑动完抬起手指后，继续执行动画；或者滑动到边界时，如何显示。默认情况下，Flutter会根据具体平台分别使用不同的`ScrollPhysics`对象，应用不同的显示效果，如当滑动到边界时，继续拖动的话，在iOS上会出现弹性效果，而在`Android`上会出现微光效果。如果你想在所有平台下使用同一种效果，可以显式指定一个固定的`ScrollPhysics`，`Flutter SDK`中包含了两个`ScrollPhysics`的子类，他们可以直接使用：
1. `ClampingScrollPhysics`：Android下微光效果。
2. `BouncingScrollPhysics`：iOS下弹性效果。
- `controller`：此属性接受一个`ScrollController`对象。`ScrollController`的主要作用是控制滚动位置和监听滚动事件。默认情况下，`Widget`树中会有一个默认的`PrimaryScrollController`，如果子树中的可滚动组件没有显式的指定`controller`，并且`primary`属性值为`true`时（默认就为true），可滚动组件会使用这个默认的`PrimaryScrollController`。这种机制带来的好处是父组件可以控制子树中可滚动组件的滚动行为，例如，`Scaffold`正是使用这种机制在iOS中实现了点击导航栏回到顶部的功能。
### Scrollbar
`Scrollbar`是一个Material风格的滚动指示器（滚动条），如果要给可滚动组件添加滚动条，只需将`Scrollbar`作为可滚动组件的任意一个父级组件即可，如：
```dart
Scrollbar(
  child: SingleChildScrollView(
    ...
  ),
);
```
`Scrollbar`和`CupertinoScrollbar`都是通过监听滚动通知来确定滚动条位置的。  

### CupertinoScrollbar
`CupertinoScrollbar`是iOS风格的滚动条，如果你使用的是Scrollbar，那么在iOS平台它会自动切换为`CupertinoScrollbar`。

### ViewPort视口
在很多布局系统中都有`ViewPort`的概念，在Flutter中，术语`ViewPort`（视口），如无特别说明，则是指一个Widget的实际显示区域。例如，一个`ListView`的显示区域高度是800像素，虽然其列表项总高度可能远远超过800像素，但是其`ViewPort`仍然是800像素。

### 基于Sliver的延迟构建
通常可滚动组件的子组件可能会非常多、占用的总高度也会非常大；如果要一次性将子组件全部构建出将会非常昂贵！为此，Flutter中提出一个`Sliver`（中文为“薄片”的意思）概念，如果一个可滚动组件支持`Sliver`模型，那么该滚动可以将子组件分成好多个“薄片”（Sliver），只有当`Sliver`出现在视口中时才会去构建它，这种模型也称为“基于Sliver的延迟构建模型”。可滚动组件中有很多都支持基于Sliver的延迟构建模型，如`ListView、GridView`，但是也有不支持该模型的，如`SingleChildScrollView`。

### 主轴和纵轴
在可滚动组件的坐标描述中，通常将滚动方向称为主轴，非滚动方向称为纵轴。由于可滚动组件的默认方向一般都是沿垂直方向，所以默认情况下主轴就是指垂直方向，水平方向同理。

## SingleChildScrollView

`SingleChildScrollView`类似于Android中的`ScrollView`，它只能接收一个子组件。定义如下：
```dart
SingleChildScrollView({
  this.scrollDirection = Axis.vertical, //滚动方向，默认是垂直方向
  this.reverse = false, 
  this.padding, 
  bool primary, 
  this.physics, 
  this.controller,
  this.child,
})
```
除了上一节我们介绍过的可滚动组件的通用属性外，我们重点看一下reverse和primary两个属性：

- `reverse`：该属性API文档解释是：是否按照阅读方向相反的方向滑动，如：`scrollDirection`值为`Axis.horizontal`，如果阅读方向是从左到右(取决于语言环境，阿拉伯语就是从右到左)。`reverse`为`true`时，那么滑动方向就是从右往左。其实此属性本质上是决定可滚动组件的初始滚动位置是在“头”还是“尾”，取false时，初始滚动位置在“头”，反之则在“尾”，
- `primary`：指是否使用`widget`树中默认的`PrimaryScrollController`；当滑动方向为垂直方向（s`crollDirection`值为`Axis.vertical`）并且没有指定controller时，primary默认为true.
需要注意的是，通常`SingleChildScrollView`只应在期望的内容不会超过屏幕太多时使用，这是因为`SingleChildScrollView`不支持基于`Sliver`的延迟实例化模型，所以如果预计视口可能包含超出屏幕尺寸太多的内容时，那么使用`SingleChildScrollView`将会非常昂贵（性能差），此时应该使用一些支持Sliver延迟加载的可滚动组件，如`ListView`。  

下面是一个将大写字母A-Z沿垂直方向显示的例子，由于垂直方向空间会超过屏幕视口高度，所以我们使用`SingleChildScrollView`：
```dart
class SingleChildScrollViewTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Scrollbar( // 显示进度条
      child: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Center(
          child: Column( 
            //动态创建一个List<Widget>  
            children: str.split("") 
                //每一个字母都用一个Text显示,字体为原来的两倍
                .map((c) => Text(c, textScaleFactor: 2.0,)) 
                .toList(),
          ),
        ),
      ),
    );
  }
}
```