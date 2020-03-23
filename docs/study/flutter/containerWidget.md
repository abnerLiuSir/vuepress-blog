# 容器类Widget
容器类`Widget`和布局类`Widget`都作用于其子`Widget`，不同的是：

- 布局类`Widget`一般都需要接收一个`widget`数组（children），他们直接或间接继承自（或包含）`MultiChildRenderObjectWidget` ；而容器类`Widget`一般只需要接收一个子`Widget`（child），他们直接或间接继承自（或包含）`SingleChildRenderObjectWidget`。
- 布局类`Widget`是按照一定的排列方式来对其子`Widget`进行排列；而容器类`Widget`一般只是包装其子`Widget`，对其添加一些修饰（补白或背景色等）、变换(旋转或剪裁等)、或限制(大小等)。

## 填充（Padding）
`Padding`可以给其子节点添加填充（留白），和边距效果类似。我们在前面很多示例中都已经使用过它了，现在来看看它的定义：
```dart
Padding({
  ...
  EdgeInsetsGeometry padding,
  Widget child,
})
```
`EdgeInsetsGeometry`是一个抽象类，开发中，我们一般都使用`EdgeInsets`类，它是`EdgeInsetsGeometry`的一个子类，定义了一些设置填充的便捷方法。

#### EdgeInsets
我们看看`EdgeInsets`提供的便捷方法：

- `fromLTRB(double left, double top, double right, double bottom)`：分别指定四个方向的填充。
- `all(double value)` : 所有方向均使用相同数值的填充。
- `only({left, top, right ,bottom })`：可以设置具体某个方向的填充(可以同时指定多个方向)。
- `symmetric({ vertical, horizontal })`：用于设置对称方向的填充，`vertical`指`top`和`bottom`，`horizontal`指`left`和`right`。
#### 示例
下面的示例主要展示了`EdgeInsets`的不同用法，比较简单，源码如下：
```dart
class PaddingTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      //上下左右各添加16像素补白
      padding: EdgeInsets.all(16.0),
      child: Column(
        //显式指定对齐方式为左对齐，排除对齐干扰
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            //左边添加8像素补白
            padding: const EdgeInsets.only(left: 8.0),
            child: Text("Hello world"),
          ),
          Padding(
            //上下各添加8像素补白
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Text("I am Jack"),
          ),
          Padding(
            // 分别指定四个方向的补白
            padding: const EdgeInsets.fromLTRB(20.0,.0,20.0,20.0),
            child: Text("Your friend"),
          )
        ],
      ),
    );
  }
}
```
## 尺寸限制类容器
尺寸限制类容器用于限制容器大小，`Flutter`中提供了多种这样的容器，如`ConstrainedBox`、`SizedBox`、`UnconstrainedBox`、`AspectRatio`等，本节将介绍一些常用的。

### ConstrainedBox
`ConstrainedBox`用于对子组件添加额外的约束。例如，如果你想让子组件的最小高度是80像素，你可以使用`const BoxConstraints(minHeight: 80.0)`作为子组件的约束。

### 示例
我们先定义一个`redBox`，它是一个背景颜色为红色的盒子，不指定它的宽度和高度：
```dart
Widget redBox=DecoratedBox(
  decoration: BoxDecoration(color: Colors.red),
);
//我们实现一个最小高度为50，宽度尽可能大的红色容器。

ConstrainedBox(
  constraints: BoxConstraints(
    minWidth: double.infinity, //宽度尽可能大
    minHeight: 50.0 //最小高度为50像素
  ),
  child: Container(
      height: 5.0, 
      child: redBox 
  ),
)
```
可以看到，我们虽然将`Container`的高度设置为5像素，但是最终却是50像素，这正是`onstrainedBoCx`的最小高度限制生效了。如果将`Container`的高度设置为80像素，那么最终红色区域的高度也会是80像素，因为在此示例中，`ConstrainedBox`只限制了最小高度，并未限制最大高度。
### BoxConstraints
`BoxConstraints`用于设置限制条件，它的定义如下：
```dart
const BoxConstraints({
  this.minWidth = 0.0, //最小宽度
  this.maxWidth = double.infinity, //最大宽度
  this.minHeight = 0.0, //最小高度
  this.maxHeight = double.infinity //最大高度
})
```
`BoxConstraints`还定义了一些便捷的构造函数，用于快速生成特定限制规则的`BoxConstraints`，如`BoxConstraints.tight(Size size)`，它可以生成给定大小的限制；`const BoxConstraints.expand()`可以生成一个尽可能大的用以填充另一个容器的`BoxConstraints`。

### SizedBox
`SizedBox`用于给子元素指定固定的宽高，如：
```dart
SizedBox(
  width: 80.0,
  height: 80.0,
  child: redBox
)
```dart
实际上SizedBox只是ConstrainedBox的一个定制，上面代码等价于：
```dart
ConstrainedBox(
  constraints: BoxConstraints.tightFor(width: 80.0,height: 80.0),
  child: redBox, 
)
```
而`BoxConstraints.tightFor(width: 80.0,height: 80.0)`等价于：
```dart
BoxConstraints(minHeight: 80.0,maxHeight: 80.0,minWidth: 80.0,maxWidth: 80.0)
```
而实际上`ConstrainedBox`和`SizedBox`都是通过`RenderConstrainedBox`来渲染的，我们可以看到`ConstrainedBox`和`SizedBox`的`createRenderObject()`方法都返回的是一个`RenderConstrainedBox`对象：
```dart
@override
RenderConstrainedBox createRenderObject(BuildContext context) {
  return new RenderConstrainedBox(
    additionalConstraints: ...,
  );
}
```
### 多重限制
如果某一个组件有多个父级`ConstrainedBox`限制，那么最终会是哪个生效？我们看一个例子：
```dart
ConstrainedBox(
    constraints: BoxConstraints(minWidth: 60.0, minHeight: 60.0), //父
    child: ConstrainedBox(
      constraints: BoxConstraints(minWidth: 90.0, minHeight: 20.0),//子
      child: redBox,
    )
)
```
上面我们有父子两个`ConstrainedBox`，他们的限制条件不同  

最终显示效果是宽90，高60，也就是说是子`ConstrainedBox`的`minWidth`生效，而`minHeight`是父`ConstrainedBox`生效。单凭这个例子，我们还总结不出什么规律，我们将上例中父子限制条件换一下：
```dart
ConstrainedBox(
    constraints: BoxConstraints(minWidth: 90.0, minHeight: 20.0),
    child: ConstrainedBox(
      constraints: BoxConstraints(minWidth: 60.0, minHeight: 60.0),
      child: redBox,
    )
)
```

最终的显示效果仍然是90，高60，效果相同，但意义不同，因为此时`minWidth`生效的是父`ConstrainedBox`，而`minHeight`是子`ConstrainedBox`生效。

通过上面示例，我们发现有多重限制时，对于`minWidth`和`minHeight`来说，是取父子中相应数值较大的。实际上，只有这样才能保证父限制与子限制不冲突。

### UnconstrainedBox
`UnconstrainedBox`不会对子组件产生任何限制，它允许其子组件按照其本身大小绘制。一般情况下，我们会很少直接使用此组件，但在"去除"多重限制的时候也许会有帮助，我们看下下面的代码：
```dart
ConstrainedBox(
    constraints: BoxConstraints(minWidth: 60.0, minHeight: 100.0),  //父
    child: UnconstrainedBox( //“去除”父级限制
      child: ConstrainedBox(
        constraints: BoxConstraints(minWidth: 90.0, minHeight: 20.0),//子
        child: redBox,
      ),
    )
)
```
上面代码中，如果没有中间的`UnconstrainedBox`，那么根据上面所述的多重限制规则，那么最终将显示一个90×100的红色框。但是由于`UnconstrainedBox` “去除”了父`ConstrainedBox`的限制，则最终会按照子`ConstrainedBox`的限制来绘制`redBox`，即90×20：  

但是，`UnconstrainedBox`对父组件限制的“去除”并非是真正的去除：上面例子中虽然红色区域大小是90×20，但上方仍然有80的空白空间。也就是说父限制的`minHeight(100.0)`仍然是生效的，只不过它不影响最终子元素`redBox`的大小，但仍然还是占有相应的空间，可以认为此时的父`ConstrainedBox`是作用于子`UnconstrainedBox`上，而`redBox`只受子`ConstrainedBox`限制  

那么有什么方法可以彻底去除父`ConstrainedBox`的限制吗？答案是否定的！所以在此提示读者，在定义一个通用的组件时，如果要对子组件指定限制，那么一定要注意，因为一旦指定限制条件，子组件如果要进行相关自定义大小时将可能非常困难，因为子组件在不更改父组件的代码的情况下无法彻底去除其限制条件。  

在实际开发中，当我们发现已经使用`SizedBox`或`ConstrainedBox`给子元素指定了宽高，但是仍然没有效果时，几乎可以断定：已经有父元素已经设置了限制！举个例子，如`Material`组件库中的`AppBar`（导航栏）的右侧菜单中，我们使用`SizedBox`指定了`loading`按钮的大小，代码如下：
```dart
 AppBar(
   title: Text(title),
   actions: <Widget>[
         SizedBox(
             width: 20, 
             height: 20,
             child: CircularProgressIndicator(
                 strokeWidth: 3,
                 valueColor: AlwaysStoppedAnimation(Colors.white70),
             ),
         )
   ],
)
```
### 其它尺寸限制类容器
除了上面介绍的这些常用的尺寸限制类容器外，还有一些其他的尺寸限制类容器，比如`AspectRatio`，它可以指定子组件的长宽比、`LimitedBox `用于指定最大宽高、`FractionallySizedBox `可以根据父容器宽高的百分比来设置子组件宽高等

## 装饰容器DecoratedBox
`DecoratedBox`可以在其子组件绘制前(或后)绘制一些装饰（`Decoration`），如背景、边框、渐变等。DecoratedBox定义如下：
```dart
const DecoratedBox({
  Decoration decoration,
  DecorationPosition position = DecorationPosition.background,
  Widget child
})
```
- `decoration`：代表将要绘制的装饰，它的类型为`Decoration`。`Decoration`是一个抽象类，它定义了一个接口 `createBoxPainter()`，子类的主要职责是需要通过实现它来创建一个画笔，该画笔用于绘制装饰。
- `position`：此属性决定在哪里绘制`Decoration`，它接收`DecorationPosition`的枚举类型，该枚举类有两个值：
1. `background`：在子组件之后绘制，即背景装饰。
2. `foreground`：在子组件之上绘制，即前景。
### BoxDecoration
我们通常会直接使用`BoxDecoration`类，它是一个`Decoration`的子类，实现了常用的装饰元素的绘制。
```dart
BoxDecoration({
  Color color, //颜色
  DecorationImage image,//图片
  BoxBorder border, //边框
  BorderRadiusGeometry borderRadius, //圆角
  List<BoxShadow> boxShadow, //阴影,可以指定多个
  Gradient gradient, //渐变
  BlendMode backgroundBlendMode, //背景混合模式
  BoxShape shape = BoxShape.rectangle, //形状
})
```
各个属性名都是自解释的，详情读者可以查看API文档。下面我们实现一个带阴影的背景色渐变的按钮：
```dart
 DecoratedBox(
    decoration: BoxDecoration(
      gradient: SweepGradient(colors:[Colors.red,Colors.orange[700]]), //背景渐变
      borderRadius: BorderRadius.circular(3.0), //3像素圆角
      boxShadow: [ //阴影
        BoxShadow(
            color:Colors.black54,
            offset: Offset(2.0,2.0),
            blurRadius: 4.0
        )
      ]
    ),
  child: Padding(padding: EdgeInsets.symmetric(horizontal: 80.0, vertical: 18.0),
    child: Text("Login", style: TextStyle(color: Colors.white),),
  )
)
```
## 变换（Transform）
`Transform`可以在其子组件绘制时对其应用一些矩阵变换来实现一些特效。`Matrix4`是一个4D矩阵，通过它我们可以实现各种矩阵操作，下面是一个例子：
```dart
Container(
  color: Colors.black,
  child: new Transform(
    alignment: Alignment.topRight, //相对于坐标系原点的对齐方式
    transform: new Matrix4.skewY(0.3), //沿Y轴倾斜0.3弧度
    child: new Container(
      padding: const EdgeInsets.all(8.0),
      color: Colors.deepOrange,
      child: const Text('Apartment for rent!'),
    ),
  ),
);
```
### 平移
Transform.translate接收一个offset参数，可以在绘制时沿x、y轴对子组件平移指定的距离。
```dart
DecoratedBox(
  decoration:BoxDecoration(color: Colors.red),
  //默认原点为左上角，左移20像素，向上平移5像素  
  child: Transform.translate(
    offset: Offset(-20.0, -5.0),
    child: Text("Hello world"),
  ),
)
```
### 旋转
`Transform.rotate`可以对子组件进行旋转变换，如：
```dart
DecoratedBox(
  decoration:BoxDecoration(color: Colors.red),
  child: Transform.rotate(
    //旋转90度
    angle:math.pi/2 ,
    child: Text("Hello world"),
  ),
)；
```
注意：要使用math.pi需先进行如下导包。
```dart
import 'dart:math' as math;
```
### 缩放
`Transform.scale`可以对子组件进行缩小或放大，如：
```dart
DecoratedBox(
  decoration:BoxDecoration(color: Colors.red),
  child: Transform.scale(
      scale: 1.5, //放大到1.5倍
      child: Text("Hello world")
  )
);
```
### 注意
- `Transform`的变换是应用在绘制阶段，而并不是应用在布局(layout)阶段，所以无论对子组件应用何种变化，其占用空间的大小和在屏幕上的位置都是固定不变的，因为这些是在布局阶段就确定的。下面我们具体说明：
```dart
 Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: <Widget>[
    DecoratedBox(
      decoration:BoxDecoration(color: Colors.red),
      child: Transform.scale(scale: 1.5,
          child: Text("Hello world")
      )
    ),
    Text("你好", style: TextStyle(color: Colors.green, fontSize: 18.0),)
  ],
)
```

由于第一个Text应用变换(放大)后，其在绘制时会放大，但其占用的空间依然为红色部分，所以第二个Text会紧挨着红色部分，最终就会出现文字重合。

- 由于矩阵变化只会作用在绘制阶段，所以在某些场景下，在`UI`需要变化时，可以直接通过矩阵变化来达到视觉上的`UI`改变，而不需要去重新触发`build`流程，这样会节省`layout`的开销，所以性能会比较好。如之前介绍的`Flow`组件，它内部就是用矩阵变换来更新`UI`，除此之外，`Flutter`的动画组件中也大量使用了`Transform`以提高性能。  

由于`RotatedBox`是作用于`layout`阶段，所以子组件会旋转90度（而不只是绘制的内容），`decoration`会作用到子组件所占用的实际空间上，所以最终就是上图的效果，读者可以和前面`Transform.rotate`示例对比理解。

