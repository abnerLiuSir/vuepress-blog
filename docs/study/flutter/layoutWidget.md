# Flutter - 布局类组件
## 布局类组件简介
布局类组件都会包含一个或多个子组件，不同的布局类组件对子组件排版(`layout`)方式不同。我们在前面说过`Element`树才是最终的绘制树，`Element`树是通过`Widget`树来创建的（通过W`idget.createElement()`），`Widget`其实就是`Element`的配置数据。在`Flutter`中，根据`Widget`是否需要**包含子节点**将`Widget`分为了三类，分别对应三种Element，如下表：
| Widget | 对应的Element | 用途 |
| :---: | :---: | :---: |
|LeafRenderObjectWidget |	LeafRenderObjectElement |	`Widget`树的叶子节点，用于没有子节点的`widget`，通常基础组件都属于这一类，如Image。|
|SingleChildRenderObjectWidget |	SingleChildRenderObjectElement |	包含一个子`Widget`，如：`ConstrainedBox`、`DecoratedBox`等|
|MultiChildRenderObjectWidget |	MultiChildRenderObjectElement |	包含多个子`Widget`，一般都有一个`children`参数，接受一个`Widget`数组。如`Row、Column、Stack`等 |

>`Flutter`中的很多`Widget`是直接继承自`StatelessWidget`或`StatefulWidget`，然后在`build()`方法中构建真正的`RenderObjectWidget`，如`Text`，它其实是继承自`StatelessWidget`，然后在`build()`方法中通过`RichText`来构建其子树，而`RichText`才是继承自`MultiChildRenderObjectWidget`。所以为了方便叙述，我们也可以直接说Text属于`MultiChildRenderObjectWidget`（其它widget也可以这么描述），这才是本质。读到这里我们也会发现，其实`StatelessWidget``和StatefulWidget`就是两个用于组合`Widget`的基类，它们本身并不关联最终的渲染对象（`RenderObjectWidget`）。

布局类组件就是指直接或间接继承(包含)`MultiChildRenderObjectWidget的Widget`，它们一般都会有一个`children`属性用于接收子`Widget`。我们看一下继承关系 `Widget > RenderObjectWidget > (Leaf/SingleChild/MultiChild)RenderObjectWidget` 。  

`RenderObjectWidget`类中定义了创建、更新`RenderObject`的方法，子类必须实现他们，关于`RenderObject`我们现在只需要知道它是最终布局、渲染UI界面的对象即可，也就是说，对于布局类组件来说，其布局算法都是通过对应的`RenderObject`对象来实现的，所以读者如果对接下来介绍的某个布局类组件的原理感兴趣，可以查看其对应的RenderObject的实现，比如Stack（层叠布局）对应的RenderObject对象就是RenderStack，而层叠布局的实现就在RenderStack中。
## 线性布局（Row和Column）
所谓线性布局，即指沿水平或垂直方向排布子组件。`Flutter`中通过`Row`和`Column`来实现线性布局，类似于Android中的`LinearLayout`控件。`Row`和`Column`都继承自`Flex`

### 主轴和纵轴
对于线性布局，有主轴和纵轴之分，如果布局是沿水平方向，那么主轴就是指水平方向，而纵轴即垂直方向；如果布局沿垂直方向，那么主轴就是指垂直方向，而纵轴就是水平方向。在线性布局中，有两个定义对齐方式的枚举类`MainAxisAlignment`和`CrossAxisAlignment`，分别代表主轴对齐和纵轴对齐。

### Row
`Row`可以在水平方向排列其子`widget`。定义如下：
```dart
Row({
  ...  
  TextDirection textDirection,    
  MainAxisSize mainAxisSize = MainAxisSize.max,    
  MainAxisAlignment mainAxisAlignment = MainAxisAlignment.start,
  VerticalDirection verticalDirection = VerticalDirection.down,  
  CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.center,
  List<Widget> children = const <Widget>[],
})
```
- `textDirection`：表示水平方向子组件的布局顺序(是从左往右还是从右往左)，默认为系统当前`Locale`环境的文本方向(如中文、英语都是从左往右，而阿拉伯语是从右往左)。
- `mainAxisSize`：表示`Row`在主轴(水平)方向占用的空间，默认是`MainAxisSize.max`，表示尽可能多的占用水平方向的空间，此时无论子`widgets`实际占用多少水平空间，`Row`的宽度始终等于水平方向的最大宽度；而`MainAxisSize.min`表示尽可能少的占用水平空间，当子组件没有占满水平剩余空间，则Row的实际宽度等于所有子组件占用的的水平空间；
- `mainAxisAlignment`：表示子组件在`Row`所占用的水平空间内对齐方式，如果`mainAxisSize`值为`MainAxisSize.min`，则此属性无意义，因为子组件的宽度等于`Row`的宽度。只有当`mainAxisSize`的值为`MainAxisSize.max`时，此属性才有意义，
`MainAxisAlignment.start`表示沿`textDirection`的初始方向对齐，如`textDirection`取值为`TextDirection.ltr`时，则`MainAxisAlignment.start`表示左对齐，`textDirection`取值为`TextDirection.rtl`时表示从右对齐。而`MainAxisAlignment.end`和`MainAxisAlignment.start`正好相反；`MainAxisAlignment.center`表示居中对齐。读者可以这么理解：`textDirection`是`mainAxisAlignment`的参考系。
- `verticalDirection`：表示`Row`纵轴（垂直）的对齐方向，默认是`VerticalDirection.down`，表示从上到下。
- `crossAxisAlignment`：表示子组件在纵轴方向的对齐方式，Row的高度等于子组件中最高的子元素高度，它的取值和`MainAxisAlignment`一样(包含`start、end、 center`三个值)，不同的是crossAxisAlignment的参考系是`verticalDirection`，即`verticalDirection`值为`VerticalDirection.down`时`crossAxisAlignment.start`指顶部对齐，`verticalDirection`值为`VerticalDirection.up`时，`crossAxisAlignment.start`指底部对齐；而`crossAxisAlignment.end`和`crossAxisAlignment.start`正好相反；
- `children` ：子组件数组。
### 示例
请阅读下面代码，先想象一下运行的结果：
```dart
Column(
  //测试Row对齐方式，排除Column默认居中对齐的干扰
  crossAxisAlignment: CrossAxisAlignment.start,
  children: <Widget>[
    Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text(" hello world "),
        Text(" I am Jack "),
      ],
    ),
    Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text(" hello world "),
        Text(" I am Jack "),
      ],
    ),
    Row(
      mainAxisAlignment: MainAxisAlignment.end,
      textDirection: TextDirection.rtl,
      children: <Widget>[
        Text(" hello world "),
        Text(" I am Jack "),
      ],
    ),
    Row(
      crossAxisAlignment: CrossAxisAlignment.start,  
      verticalDirection: VerticalDirection.up,
      children: <Widget>[
        Text(" hello world ", style: TextStyle(fontSize: 30.0),),
        Text(" I am Jack "),
      ],
    ),
  ],
)
```
第一个`Row`很简单，默认为居中对齐；  
第二个`Row`，由于`mainAxisSize`值为`MainAxisSize.min`，`Row`的宽度等于两个`Text`的宽度和，所以对齐是无意义的，所以会从左往右显示；  
第三个`Row`设置`textDirection`值为`TextDirection.rtl`，所以子组件会从右向左的顺序排列，而此时`MainAxisAlignment.end`表示左对齐，所以最终显示结果就是图中第三行的样子；  
第四个`Row`测试的是**纵轴的对齐方式**，由于两个子`Text`字体不一样，所以其高度也不同，我们指定了`verticalDirection`值为`VerticalDirection.up`，即从低向顶排列，而此时`crossAxisAlignment`值为`CrossAxisAlignment.start`表示底对齐。

### Column
`Column`可以在垂直方向排列其子组件。参数和`Row`一样，不同的是布局方向为垂直，主轴纵轴正好相反，读者可类比`Row`来理解，下面看一个例子：
```dart
import 'package:flutter/material.dart';

class CenterColumnRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Text("hi"),
        Text("world"),
      ],
    );
  }
}
```
由于我们没有指定`Column`的`mainAxisSize`，所以使用默认值`MainAxisSize.max`，则`Column`会在垂直方向占用尽可能多的空间，此例中为屏幕高度。  
由于我们指定了 `crossAxisAlignment` 属性为`CrossAxisAlignment.center`，那么子项在Column纵轴方向（此时为水平方向）会居中对齐。注意，在水平方向对齐是有边界的，总宽度为`Column`占用空间的实际宽度，而实际的宽度取决于子项中宽度最大的`Widget`。在本例中，`Column`有两个子`Widget`，而显示“`world`”的`Text`宽度最大，所以`Column`的实际宽度则为`Text`("`world`") 的宽度，所以居中对齐后`Text("hi")`会显示在`Text("world")`的中间部分。  

实际上，`Row`和`Column`都只会在主轴方向占用尽可能大的空间，而纵轴的长度则取决于**他们最大子元素的长度**。如果我们想让本例中的两个文本控件在整个手机屏幕中间对齐，我们有两种方法：  

- 将`Column`的宽度指定为屏幕宽度；这很简单，我们可以通过`ConstrainedBox`或`SizedBox`来强制更改宽度限制，例如：
```dart
ConstrainedBox(
  constraints: BoxConstraints(minWidth: double.infinity), 
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.center,
    children: <Widget>[
      Text("hi"),
      Text("world"),
    ],
  ),
);
```
将`minWidth`设为`double.infinity`，可以使宽度占用尽可能多的空间。

- 使用Center Widget；

### 特殊情况
如果`Row`里面嵌套`Row`，或者`Column`里面再嵌套`Column`，那么只有对最外面的`Row`或`Column`会占用尽可能大的空间，里面`Row`或`Column`所占用的空间为实际大小，下面以`Column`为例说明：
```dart
Container(
  color: Colors.green,
  child: Padding(
    padding: const EdgeInsets.all(16.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.max, //有效，外层Colum高度为整个屏幕
      children: <Widget>[
        Container(
          color: Colors.red,
          child: Column(
            mainAxisSize: MainAxisSize.max,//无效，内层Colum高度为实际高度  
            children: <Widget>[
              Text("hello world "),
              Text("I am Jack "),
            ],
          ),
        )
      ],
    ),
  ),
);
```
如果要让里面的Column占满外部Column，可以使用Expanded 组件：
```dart
Expanded( 
  child: Container(
    color: Colors.red,
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center, //垂直方向居中对齐
      children: <Widget>[
        Text("hello world "),
        Text("I am Jack "),
      ],
    ),
  ),
)
```
## 弹性布局（Flex）
弹性布局允许子组件按照一定比例来分配父容器空间。弹性布局的概念在其它UI系统中也都存在，如H5中的弹性盒子布局，Android中的`FlexboxLayout`等。Flutter中的弹性布局主要通过`Flex`和`Expanded`来配合实现。

### Flex
`Flex`组件可以沿着水平或垂直方向排列子组件，如果你知道主轴方向，使用`Row`或`Column`会方便一些，因为`Row`和`Column`都继承自`Flex`，参数基本相同，所以能使用`Flex`的地方基本上都可以使用`Row`或`Column`。`Flex`本身功能是很强大的，它也可以和`Expanded`组件配合实现弹性布局。接下来我们只讨论`Flex`和弹性布局相关的属性(其它属性已经在介绍Row和Column时介绍过了)。
```dart
Flex({
  ...
  @required this.direction, //弹性布局的方向, Row默认为水平方向，Column默认为垂直方向
  List<Widget> children = const <Widget>[],
})
```
`Flex`继承自`MultiChildRenderObjectWidget`，对应的`RenderObject`为`RenderFlex`，`RenderFlex`中实现了其布局算法。

### Expanded
可以按比例“扩伸” `Row、Column`和`Flex`子组件所占用的空间。
```dart
const Expanded({
  int flex = 1, 
  @required Widget child,
})
```
`flex`参数为弹性系数，如果为`0`或`null`，则`child`是没有弹性的，即不会被扩伸占用的空间。如果大于0，所有的Expanded按照其`flex`的比例来分割主轴的全部空闲空间。下面我们看一个例子：
```dart
class FlexLayoutTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        //Flex的两个子widget按1：2来占据水平空间  
        Flex(
          direction: Axis.horizontal,
          children: <Widget>[
            Expanded(
              flex: 1,
              child: Container(
                height: 30.0,
                color: Colors.red,
              ),
            ),
            Expanded(
              flex: 2,
              child: Container(
                height: 30.0,
                color: Colors.green,
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(top: 20.0),
          child: SizedBox(
            height: 100.0,
            //Flex的三个子widget，在垂直方向按2：1：1来占用100像素的空间  
            child: Flex(
              direction: Axis.vertical,
              children: <Widget>[
                Expanded(
                  flex: 2,
                  child: Container(
                    height: 30.0,
                    color: Colors.red,
                  ),
                ),
                Spacer(
                  flex: 1,
                ),
                Expanded(
                  flex: 1,
                  child: Container(
                    height: 30.0,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    )
  }
}
```
示例中的`Spacer`的功能是占用指定比例的空间，实际上它只是`Expanded`的一个包装类，`Spacer`的源码如下：
```dart
class Spacer extends StatelessWidget {
  const Spacer({Key key, this.flex = 1})
    : assert(flex != null),
      assert(flex > 0),
      super(key: key);

  final int flex;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: flex,
      child: const SizedBox.shrink(),
    );
  }
}
```
### 小结
弹性布局比较简单，唯一需要注意的就是`Row、Column`以及`Flex`的关系。
## 流式布局
在介绍`Row`和`Colum`时，如果子`widget`超出屏幕范围，则会报溢出错误，如：
```dart
Row(
  children: <Widget>[
    Text("xxx"*100)
  ],
);
```
这是因为`Row`默认只有一行，如果超出屏幕不会折行。我们把超出屏幕显示范围会自动折行的布局称为流式布局。`Flutter`中通过`Wrap`和`Flow`来支持流式布局，将上例中的`Row`换成`Wrap`后溢出部分则会自动折行
### Wrap
下面是Wrap的定义:
```dart
Wrap({
  ...
  this.direction = Axis.horizontal,
  this.alignment = WrapAlignment.start,
  this.spacing = 0.0,
  this.runAlignment = WrapAlignment.start,
  this.runSpacing = 0.0,
  this.crossAxisAlignment = WrapCrossAlignment.start,
  this.textDirection,
  this.verticalDirection = VerticalDirection.down,
  List<Widget> children = const <Widget>[],
})
```
我们可以看到`Wrap`的很多属性在`Row`（包括Flex和Column）中也有，如`direction`、`crossAxisAlignment`、`textDirection`、`verticalDirection`等，这些参数意义是相同的，我们不再重复介绍下面我们看一下Wrap特有的几个属性：

- `spacing`：主轴方向子widget的间距
- `runSpacing`：纵轴方向的间距
- `runAlignment`：纵轴方向的对齐方式
下面看一个示例子：
```dart
Wrap(
  spacing: 8.0, // 主轴(水平)方向间距
  runSpacing: 4.0, // 纵轴（垂直）方向间距
  alignment: WrapAlignment.center, //沿主轴方向居中
  children: <Widget>[
    new Chip(
      avatar: new CircleAvatar(backgroundColor: Colors.blue, child: Text('A')),
      label: new Text('Hamilton'),
    ),
    new Chip(
      avatar: new CircleAvatar(backgroundColor: Colors.blue, child: Text('M')),
      label: new Text('Lafayette'),
    ),
    new Chip(
      avatar: new CircleAvatar(backgroundColor: Colors.blue, child: Text('H')),
      label: new Text('Mulligan'),
    ),
    new Chip(
      avatar: new CircleAvatar(backgroundColor: Colors.blue, child: Text('J')),
      label: new Text('Laurens'),
    ),
  ],
)
```
### Flow
我们一般很少会使用`Flow`，因为其过于复杂，需要自己实现子widget的位置转换，在很多场景下首先要考虑的是`Wrap`是否满足需求。`Flow`主要用于一些需要自定义布局策略或性能要求较高(如动画中)的场景。`Flow`有如下优点：  

- **性能好**；`Flow`是一个对子组件尺寸以及位置调整非常高效的控件，`Flow`用转换矩阵在对子组件进行位置调整的时候进行了优化：在`Flow`定位过后，如果子组件的尺寸或者位置发生了变化，在`FlowDelegate`中的`paintChildren()`方法中调用`context`.`paintChild` 进行重绘，而`context.paintChild`在重绘时使用了转换矩阵，并没有实际调整组件位置。
- **灵活**；由于我们需要自己实现`FlowDelegate`的`paintChildren()`方法，所以我们需要自己计算每一个组件的位置，因此，可以自定义布局策略。  

缺点：  

- 使用复杂。
- 不能自适应子组件大小，必须通过指定父容器大小或实现TestFlowDelegate的getSize返回固定大小。  

示例：  

我们对六个色块进行自定义流式布局：
```dart
Flow(
  delegate: TestFlowDelegate(margin: EdgeInsets.all(10.0)),
  children: <Widget>[
    new Container(width: 80.0, height:80.0, color: Colors.red,),
    new Container(width: 80.0, height:80.0, color: Colors.green,),
    new Container(width: 80.0, height:80.0, color: Colors.blue,),
    new Container(width: 80.0, height:80.0,  color: Colors.yellow,),
    new Container(width: 80.0, height:80.0, color: Colors.brown,),
    new Container(width: 80.0, height:80.0,  color: Colors.purple,),
  ],
)
```
实现TestFlowDelegate:
```dart
class TestFlowDelegate extends FlowDelegate {
  EdgeInsets margin = EdgeInsets.zero;
  TestFlowDelegate({this.margin});
  @override
  void paintChildren(FlowPaintingContext context) {
    var x = margin.left;
    var y = margin.top;
    //计算每一个子widget的位置  
    for (int i = 0; i < context.childCount; i++) {
      var w = context.getChildSize(i).width + x + margin.right;
      if (w < context.size.width) {
        context.paintChild(i,
            transform: new Matrix4.translationValues(
                x, y, 0.0));
        x = w + margin.left;
      } else {
        x = margin.left;
        y += context.getChildSize(i).height + margin.top + margin.bottom;
        //绘制子widget(有优化)  
        context.paintChild(i,
            transform: new Matrix4.translationValues(
                x, y, 0.0));
         x += context.getChildSize(i).width + margin.left + margin.right;
      }
    }
  }

  @override
  getSize(BoxConstraints constraints){
    //指定Flow的大小  
    return Size(double.infinity,200.0);
  }

  @override
  bool shouldRepaint(FlowDelegate oldDelegate) {
    return oldDelegate != this;
  }
}
```
## 层叠布局 Stack、Positioned
层叠布局和Web中的绝对定位、Android中的Frame布局是相似的，子组件可以根据距父容器四个角的位置来确定自身的位置。绝对定位允许子组件堆叠起来（按照代码中声明的顺序）。`Flutter`中使用`Stack`和`Positioned`这两个组件来配合实现绝对定位。`Stack`允许子组件堆叠，而`Positioned`用于根据`Stack`的四个角来确定子组件的位置。  
### Stack
```dart
Stack({
  this.alignment = AlignmentDirectional.topStart,
  this.textDirection,
  this.fit = StackFit.loose,
  this.overflow = Overflow.clip,
  List<Widget> children = const <Widget>[],
})
```
- `alignment`：此参数决定如何去对齐没有定位（没有使用Positioned）或部分定位的子组件。所谓部分定位，在这里特指没有在某一个轴上定位：`left、right`为横轴，`top、bottom`为纵轴，只要包含某个轴上的一个定位属性就算在该轴上有定位。
- `textDirection`：和`Row、Wrap`的`textDirection`功能一样，都用于确定`alignment`对齐的参考系，即：`textDirection`的值为`TextDirection.ltr`，则`alignment`的`start`代表左，`end`代表右，即从左往右的顺序；`textDirection`的值为TextDirection.rtl，则alignment的start代表右，end代表左，即从右往左的顺序。
fit：此参数用于确定没有定位的子组件如何去适应Stack的大小。StackFit.loose表示使用子组件的大小，StackFit.expand表示扩伸到Stack的大小。
overflow：此属性决定如何显示超出Stack显示空间的子组件；值为Overflow.clip时，超出部分会被剪裁（隐藏），值为Overflow.visible 时则不会。
Positioned
const Positioned({
  Key key,
  this.left, 
  this.top,
  this.right,
  this.bottom,
  this.width,
  this.height,
  @required Widget child,
})
left、top 、right、 bottom分别代表离Stack左、上、右、底四边的距离。width和height用于指定需要定位元素的宽度和高度。注意，Positioned的width、height 和其它地方的意义稍微有点区别，此处用于配合left、top 、right、 bottom来定位组件，举个例子，在水平方向时，你只能指定left、right、width三个属性中的两个，如指定left和width后，right会自动算出(left+width)，如果同时指定三个属性则会报错，垂直方向同理。