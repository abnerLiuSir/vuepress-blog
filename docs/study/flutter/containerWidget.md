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

## Container
我们在前面的章节示例中多次用到过`Container`组件，本节我们就详细介绍一下`Container`组件。`Container`是一个组合类容器，它本身不对应具体的`RenderObject`，它是`DecoratedBox`、`ConstrainedBox`、`Transform`、`Padding`、`Align`等组件组合的一个多功能容器，所以我们只需通过一个Container组件可以实现同时需要装饰、变换、限制的场景。下面是Container的定义：
```dart
Container({
  this.alignment,
  this.padding, //容器内补白，属于decoration的装饰范围
  Color color, // 背景色
  Decoration decoration, // 背景装饰
  Decoration foregroundDecoration, //前景装饰
  double width,//容器的宽度
  double height, //容器的高度
  BoxConstraints constraints, //容器大小的限制条件
  this.margin,//容器外补白，不属于decoration的装饰范围
  this.transform, //变换
  this.child,
})
```
`Container`的大多数属性在介绍其它容器时都已经介绍过了，不再赘述，但有两点需要说明：  

- 容器的大小可以通过`width、height`属性来指定，也可以通过`constraints`来指定；如果它们同时存在时，`width、height`优先。实际上Container内部会根据width、height来生成一个constraints。
- `color`和`decoration`是互斥的，如果同时设置它们则会报错！实际上，当指定`color`时，`Container`内会自动创建一个`decoration`。
### 实例
实现代码如下：
```dart
Container(
  margin: EdgeInsets.only(top: 50.0, left: 120.0), //容器外填充
  constraints: BoxConstraints.tightFor(width: 200.0, height: 150.0), //卡片大小
  decoration: BoxDecoration(//背景装饰
      gradient: RadialGradient( //背景径向渐变
          colors: [Colors.red, Colors.orange],
          center: Alignment.topLeft,
          radius: .98
      ),
      boxShadow: [ //卡片阴影
        BoxShadow(
            color: Colors.black54,
            offset: Offset(2.0, 2.0),
            blurRadius: 4.0
        )
      ]
  ),
  transform: Matrix4.rotationZ(.2), //卡片倾斜变换
  alignment: Alignment.center, //卡片内文字居中
  child: Text( //卡片文字
    "5.20", style: TextStyle(color: Colors.white, fontSize: 40.0),
  ),
);
```
可以看到Container具备多种组件的功能，通过查看Container源码，我们会很容易发现它正是前面我们介绍过的多种组件组合而成。在Flutter中，Container组件也正是组合优先于继承的实例。

### Padding和Margin
接下来我们来研究一下`Container`组件`margin`和`padding`属性的区别:
```dart
Container(
  margin: EdgeInsets.all(20.0), //容器外补白
  color: Colors.orange,
  child: Text("Hello world!"),
),
Container(
  padding: EdgeInsets.all(20.0), //容器内补白
  color: Colors.orange,
  child: Text("Hello world!"),
),
```
可以发现，直观的感觉就是`margin`的留白是在容器外部，而`padding`的留白是在容器内部，读者需要记住这个差异。事实上，`Container`内`margin`和`padding`都是通过`Padding` 组件来实现的，上面的示例代码实际上等价于：
```dart
Padding(
  padding: EdgeInsets.all(20.0),
  child: DecoratedBox(
    decoration: BoxDecoration(color: Colors.orange),
    child: Text("Hello world!"),
  ),
),
DecoratedBox(
  decoration: BoxDecoration(color: Colors.orange),
  child: Padding(
    padding: const EdgeInsets.all(20.0),
    child: Text("Hello world!"),
  ),
),
```
## Scaffold、TabBar、底部导航
`Material`组件库提供了丰富多样的组件，本节介绍一些常用的组件，其余的读者可以自行查看文档或`Flutter Gallery`中`Material`组件部分的示例。

### Scaffold
一个完整的路由页可能会包含导航栏、抽屉菜单(Drawer)以及底部Tab导航菜单等。如果每个路由页面都需要开发者自己手动去实现这些，这会是一件非常麻烦且无聊的事。幸运的是，`Flutter Material`组件库提供了一些现成的组件来减少我们的开发任务。`Scaffold`是一个路由页的骨架，我们使用它可以很容易地拼装出一个完整的页面。

#### 示例
我们实现一个页面，它包含：

1. 一个导航栏
2. 导航栏右边有一个分享按钮
3. 有一个抽屉菜单
4. 有一个底部导航
5. 右下角有一个悬浮的动作按钮  

上面代码中我们用到了如下组件：

| 组件名称 |	解释 |
| --- | --- |
|AppBar |	一个导航栏骨架 |
|MyDrawer |	抽屉菜单 |
|BottomNavigationBar |	底部导航栏 |
|FloatingActionButton |	漂浮按钮 |
下面我们来分别介绍一下它们。

###  AppBar
`AppBar`是一个`Material`风格的导航栏，通过它可以设置导航栏标题、导航栏菜单、导航栏底部的Tab标题等。下面我们看看AppBar的定义：
```dart
AppBar({
  Key key,
  this.leading, //导航栏最左侧Widget，常见为抽屉菜单按钮或返回按钮。
  this.automaticallyImplyLeading = true, //如果leading为null，是否自动实现默认的leading按钮
  this.title,// 页面标题
  this.actions, // 导航栏右侧菜单
  this.bottom, // 导航栏底部菜单，通常为Tab按钮组
  this.elevation = 4.0, // 导航栏阴影
  this.centerTitle, //标题是否居中 
  this.backgroundColor,
  ...   //其它属性见源码注释
})
```
如果给`Scaffold`添加了抽屉菜单，默认情况下`Scaffold`会自动将`AppBar`的`leading`设置为菜单按钮（如上面截图所示），点击它便可打开抽屉菜单。如果我们想自定义菜单图标，可以手动来设置leading，如：
```dart
Scaffold(
  appBar: AppBar(
    title: Text("App Name"),
    leading: Builder(builder: (context) {
      return IconButton(
        icon: Icon(Icons.dashboard, color: Colors.white), //自定义图标
        onPressed: () {
          // 打开抽屉菜单  
          Scaffold.of(context).openDrawer(); 
        },
      );
    }),
    ...  
  )
)
```
可以看到左侧菜单已经替换成功。

代码中打开抽屉菜单的方法在`ScaffoldState`中，通过`Scaffold.of(context)`可以获取父级最近的`Scaffold `组件的State对象
### TabBar
下面我们通过“`bottom`”属性来添加一个导航栏底部`Tab`按钮组  


Material组件库中提供了一个`TabBar`组件，它可以快速生成`Tab`菜单，下面是上图对应的源码：
```dart
class _ScaffoldRouteState extends State<ScaffoldRoute>
    with SingleTickerProviderStateMixin {

  TabController _tabController; //需要定义一个Controller
  List tabs = ["新闻", "历史", "图片"];

  @override
  void initState() {
    super.initState();
    // 创建Controller  
    _tabController = TabController(length: tabs.length, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        ... //省略无关代码
        bottom: TabBar(   //生成Tab菜单
          controller: _tabController,
          tabs: tabs.map((e) => Tab(text: e)).toList()
        ),
      ),
      ... //省略无关代码

  }
}
```
上面代码首先创建了一个`TabController `，它是用于控制/监听Tab菜单切换的。接下来通过`TabBar`生成了一个底部菜单栏，`TabBar`的`tabs`属性接受一个`Widget`数组，表示每一个`Tab`子菜单，我们可以自定义，也可以像示例中一样直接使用`Tab` 组件，它是`Material`组件库提供的`Material`风格的Tab菜单。

`Tab`组件有三个可选参数，除了可以指定文字外，还可以指定Tab菜单图标，或者直接自定义组件样式。Tab组件定义如下：
```dart
Tab({
  Key key,
  this.text, // 菜单文本
  this.icon, // 菜单图标
  this.child, // 自定义组件样式
})
```
开发者可以根据实际需求来定制。
### TabBarView
通过`TabBar`我们只能生成一个静态的菜单，真正的`Tab`页还没有实现。由于`Tab`菜单和`Tab`页的切换需要同步，我们需要通过`TabController`去监听`Tab`菜单的切换去切换`Tab`页，代码如：
```dart
_tabController.addListener((){  
  switch(_tabController.index){
    case 1: ...;
    case 2: ... ;   
  }
});
```
如果我们`Tab`页可以滑动切换的话，还需要在滑动过程中更新`TabBar`指示器的偏移！显然，要手动处理这些是很麻烦的，为此，`Material`库提供了一个`TabBarView`组件，通过它不仅可以轻松的实现`Tab`页，而且可以非常容易的配合`TabBar`来实现同步切换和滑动状态同步，示例如下：
```dart
Scaffold(
  appBar: AppBar(
    ... //省略无关代码
    bottom: TabBar(
      controller: _tabController,
      tabs: tabs.map((e) => Tab(text: e)).toList()),
  ),
  drawer: new MyDrawer(),
  body: TabBarView(
    controller: _tabController,
    children: tabs.map((e) { //创建3个Tab页
      return Container(
        alignment: Alignment.center,
        child: Text(e, textScaleFactor: 5),
      );
    }).toList(),
  ),
  ... // 省略无关代码  
)
```

现在，无论是点击导航栏`Tab`菜单还是在页面上左右滑动，`Tab`页面都会切换，并且`Tab`菜单的状态和`Tab`页er`是同一个！正是如此，`Ta面始终保持同步！那它们是如何实现同步的呢？细心的读者可能已经发现，上例中`TabBar`和`TabBarView`的`controllbBar`和`TabBarView`正是通过同一个`controller`来实现菜单切换和滑动状态同步的
### 抽屉菜单Drawer
`Scaffold`的`drawer`和`endDrawer`属性可以分别接受一个`Widget`来作为页面的左、右抽屉菜单。如果开发者提供了抽屉菜单，那么当用户手指从屏幕左（或右）侧向里滑动时便可打开抽屉菜单。本节开始部分的示例中实现了一个左抽屉菜单`MyDrawer`，它的源码如下：
```dart
class MyDrawer extends StatelessWidget {
  const MyDrawer({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: MediaQuery.removePadding(
        context: context,
        //移除抽屉菜单顶部默认留白
        removeTop: true,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(top: 38.0),
              child: Row(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: ClipOval(
                      child: Image.asset(
                        "imgs/avatar.png",
                        width: 80,
                      ),
                    ),
                  ),
                  Text(
                    "Wendux",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  )
                ],
              ),
            ),
            Expanded(
              child: ListView(
                children: <Widget>[
                  ListTile(
                    leading: const Icon(Icons.add),
                    title: const Text('Add account'),
                  ),
                  ListTile(
                    leading: const Icon(Icons.settings),
                    title: const Text('Manage accounts'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```
抽屉菜单通常将`Drawer`组件作为根节点，它实现了`Material`风格的菜单面板，`MediaQuery.removePadding`可以移除`Drawer`默认的一些留白（比如`Drawer`默认顶部会留和手机状态栏等高的留白），读者可以尝试传递不同的参数来看看实际效果。抽屉菜单页由顶部和底部组成，顶部由用户头像和昵称组成，底部是一个菜单列表，用`ListView`实现，

### FloatingActionButton
`FloatingActionButton`是`Material`设计规范中的一种特殊`Button`，通常悬浮在页面的某一个位置作为某种常用动作的快捷入口，如本节示例中页面右下角的"➕"号按钮。我们可以通过`Scaffold`的`floatingActionButton`属性来设置一个`FloatingActionButton`，同时通过`floatingActionButtonLocation`属性来指定其在页面中悬浮的位置，这个比较简单，不再赘述。

### 底部Tab导航栏
我们可以通过`Scaffold`的`bottomNavigationBar`属性来设置底部导航，如本节开始示例所示，我们通过`Material`组件库提供的`BottomNavigationBar`和`BottomNavigationBarItem`两种组件来实现`Material`风格的底部导航栏。可以看到上面的实现代码非常简单，所以不再赘述，  

`Material`组件库中提供了一个`BottomAppBar` 组件，它可以和`FloatingActionButton`配合实现这种“打洞”效果，源码如下：
```dart
bottomNavigationBar: BottomAppBar(
  color: Colors.white,
  shape: CircularNotchedRectangle(), // 底部导航栏打一个圆形的洞
  child: Row(
    children: [
      IconButton(icon: Icon(Icons.home)),
      SizedBox(), //中间位置空出
      IconButton(icon: Icon(Icons.business)),
    ],
    mainAxisAlignment: MainAxisAlignment.spaceAround, //均分底部导航栏横向空间
  ),
)
```
可以看到，上面代码中没有控制打洞位置的属性，实际上，打洞的位置取决于`FloatingActionButton`的位置，上面`FloatingActionButton`的位置为：
```dart
floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
```
所以打洞位置在底部导航栏的正中间。

`BottomAppBar`的`shape`属性决定洞的外形，`CircularNotchedRectangle`实现了一个圆形的外形，我们也可以自定义外形。

##  剪裁（Clip）
`Flutter`中提供了一些剪裁函数，用于对组件进行剪裁。

| 剪裁Widget |	作用 |
| --- | --- |
| ClipOval |	子组件为正方形时剪裁为内贴圆形，为矩形时，剪裁为内贴椭圆 |
| ClipRRect |	将子组件剪裁为圆角矩形 |
| ClipRect |	剪裁子组件到实际占用的矩形大小（溢出部分剪裁） |
下面看一个例子：
```dart
import 'package:flutter/material.dart';

class ClipTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 头像  
    Widget avatar = Image.asset("imgs/avatar.png", width: 60.0);
    return Center(
      child: Column(
        children: <Widget>[
          avatar, //不剪裁
          ClipOval(child: avatar), //剪裁为圆形
          ClipRRect( //剪裁为圆角矩形
            borderRadius: BorderRadius.circular(5.0),
            child: avatar,
          ), 
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Align(
                alignment: Alignment.topLeft,
                widthFactor: .5,//宽度设为原来宽度一半，另一半会溢出
                child: avatar,
              ),
              Text("你好世界", style: TextStyle(color: Colors.green),)
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ClipRect(//将溢出部分剪裁
                child: Align(
                  alignment: Alignment.topLeft,
                  widthFactor: .5,//宽度设为原来宽度一半
                  child: avatar,
                ),
              ),
              Text("你好世界",style: TextStyle(color: Colors.green))
            ],
          ),
        ],
      ),
    );
  }
}
```
上面示例代码注释比较详细，在此不再赘述。但值得一提的是最后的两个Row！它们通过`Align`设置`widthFactor`为`0.5`后，图片的实际宽度等于`60×0.5`，即原宽度一半，但此时图片溢出部分依然会显示，所以第一个“你好世界”会和图片的另一部分重合，为了剪裁掉溢出部分，我们在第二个Row中通过ClipRect将溢出部分剪裁掉了。
### CustomClipper
如果我们想剪裁子组件的特定区域，比如，在上面示例的图片中，如果我们只想截取图片中部40×30像素的范围应该怎么做？这时我们可以使用`CustomClipper`来自定义剪裁区域，实现代码如下：  

首先，自定义一个CustomClipper：
```dart
class MyClipper extends CustomClipper<Rect> {
  @override
  Rect getClip(Size size) => Rect.fromLTWH(10.0, 15.0, 40.0, 30.0);

  @override
  bool shouldReclip(CustomClipper<Rect> oldClipper) => false;
}
```
- `getClip()`是用于获取剪裁区域的接口，由于图片大小是60×60，我们返回剪裁区域为`Rect.fromLTWH(10.0, 15.0, 40.0, 30.0)`，及图片中部`40×30`像素的范围。
- `shouldReclip()` 接口决定是否重新剪裁。如果在应用中，剪裁区域始终不会发生变化时应该返回`false`，这样就不会触发重新剪裁，避免不必要的性能开销。如果剪裁区域会发生变化（比如在对剪裁区域执行一个动画），那么变化后应该返回true来重新执行剪裁。  

然后，我们通过`ClipRect`来执行剪裁，为了看清图片实际所占用的位置，我们设置一个红色背景：
```dart
DecoratedBox(
  decoration: BoxDecoration(
    color: Colors.red
  ),
  child: ClipRect(
      clipper: MyClipper(), //使用自定义的clipper
      child: avatar
  ),
)
```
可以看到我们的剪裁成功了，但是图片所占用的空间大小仍然是60×60（红色区域），这是因为剪裁是在layout完成后的**绘制阶段**进行的，所以不会影响组件的大小，这和Transform原理是相似的。