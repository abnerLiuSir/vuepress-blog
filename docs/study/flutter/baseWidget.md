# Flutter - 基础组件
## Widget简介
### 概念
在前面的介绍中，我们知道在Flutter中几乎所有的对象都是一个Widget。与原生开发中“控件”不同的是，Flutter中的Widget的概念更广泛，它不仅可以表示UI元素，也可以表示一些功能性的组件如：用于手势检测的 `GestureDetector widget`、用于APP主题数据传递的`Theme`等等，而原生开发中的控件通常只是指UI元素。在后面的内容中，我们在描述UI元素时可能会用到“控件”、“组件”这样的概念，读者心里需要知道他们就是widget，只是在不同场景的不同表述而已。由于Flutter主要就是用于构建用户界面的，所以，在大多数时候，读者可以认为widget就是一个控件，不必纠结于概念。
### Widget与Element
在Flutter中，Widget的功能是“描述一个UI元素的配置数据”，它就是说，Widget其实并不是表示最终绘制在设备屏幕上的显示元素，而它只是描述显示元素的一个配置数据。

实际上，Flutter中真正代表屏幕上显示元素的类是Element，也就是说Widget只是描述Element的配置数据！现在，只需要知道：Widget只是UI元素的一个配置数据，并且一个Widget可以对应多个Element。这是因为同一个Widget对象可以被添加到UI树的不同部分，而真正渲染时，UI树的每一个Element节点都会对应一个Widget对象。总结一下：

- Widget实际上就是Element的配置数据，Widget树实际上是一个配置树，而真正的UI渲染树是由Element构成；不过，由于Element是通过Widget生成的，所以它们之间有对应关系，在大多数场景，我们可以宽泛地认为Widget树就是指UI控件树或UI渲染树。
- 一个Widget对象可以对应多个Element对象。这很好理解，根据同一份配置（Widget），可以创建多个实例（Element）。   

读者应该将这两点牢记在心中。
### Widget主要接口
我们先来看一下Widget类的声明：
```dart
@immutable
abstract class Widget extends DiagnosticableTree {
  const Widget({ this.key });
  final Key key;

  @protected
  Element createElement();

  @override
  String toStringShort() {
    return key == null ? '$runtimeType' : '$runtimeType-$key';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties.defaultDiagnosticsTreeStyle = DiagnosticsTreeStyle.dense;
  }

  static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType
        && oldWidget.key == newWidget.key;
  }
}
```
- `Widget`类继承自`DiagnosticableTree`，`DiagnosticableTree`即“诊断树”，主要作用是提供调试信息。
- `Key`: 这个key属性类似于React/Vue中的key，主要的作用是决定是否在下一次build时复用旧的widget，决定的条件在`canUpdate()`方法中。
- `createElement()`：正如前文所述“一个Widget可以对应多个Element”；Flutter Framework在构建UI树时，会先调用此方法生成对应节点的Element对象。此方法是Flutter Framework隐式调用的，在我们开发过程中基本不会调用到。
- `debugFillProperties(...) `复写父类的方法，主要是设置诊断树的一些特性。
- `canUpdate(...)`是一个静态方法，它主要用于在Widget树重新build时复用旧的widget，其实具体来说，应该是：是否用新的Widget对象去更新旧UI树上所对应的Element对象的配置；通过其源码我们可以看到，只要newWidget与oldWidget的runtimeType和key同时相等时就会用newWidget去更新Element对象的配置，否则就会创建新的Element。  

为Widget显式添加key的话可能（但不一定）会使UI在重新构建时变的高效，读者目前可以先忽略此参数。本书后面的示例中，只会在构建列表项UI时会显式指定Key。

另外Widget类本身是一个抽象类，其中最核心的就是定义了createElement()接口，在Flutter开发中，我们一般都不用直接继承Widget类来实现一个新组件，相反，我们通常会通过继承StatelessWidget或StatefulWidget来间接继承Widget类来实现。StatelessWidget和StatefulWidget都是直接继承自Widget类，而这两个类也正是Flutter中非常重要的两个抽象类，它们引入了两种Widget模型，接下来我们将重点介绍一下这两个类。
### StatelessWidget
我们已经简单介绍过StatelessWidget，StatelessWidget相对比较简单，它继承自Widget类，重写了createElement()方法：
```dart
@override
StatelessElement createElement() => new StatelessElement(this);
//StatelessElement 间接继承自Element类，与StatelessWidget相对应（作为其配置数据）。

//StatelessWidget用于不需要维护状态的场景，它通常在build方法中通过嵌套其它Widget来构建UI，在构建过程中会递归的构建其嵌套的Widget。我们看一个简单的例子：

class Echo extends StatelessWidget {
  const Echo({
    Key key,  
    @required this.text,
    this.backgroundColor:Colors.grey,
  }):super(key:key);

  final String text;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        color: backgroundColor,
        child: Text(text),
      ),
    );
  }
}
```
上面的代码，实现了一个回显字符串的Echo widget。

按照惯例，widget的构造函数参数应使用命名参数，命名参数中的必要参数要**添加@required**标注，这样有利于静态代码分析器进行检查。另外，在继承widget时，第一个参数通常应该是Key，另外，如果Widget需要接收子Widget，那么child或children参数通常应被放在参数列表的最后。同样是按照惯例，Widget的属性应尽可能的被声明为final，防止被意外改变。  

然后我们可以通过如下方式使用它：
```dart
Widget build(BuildContext context) {
  return Echo(text: "hello world");
}
```

#### Context
`build`方法有一个context参数，它是`BuildContext`类的一个实例，表示当前widget在widget树中的上下文，每一个widget都会对应一个context对象（因为每一个widget都是widget树上的一个节点）。实际上，context是当前widget在widget树中位置中执行”相关操作“的一个句柄，比如它提供了从当前widget开始向上遍历widget树以及按照widget类型查找父级widget的方法。下面是在子树中获取父级widget的一个示例：
```dart
class ContextRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Context测试"),
      ),
      body: Container(
        child: Builder(builder: (context) {
          // 在Widget树中向上查找最近的父级`Scaffold` widget
          Scaffold scaffold = context.ancestorWidgetOfExactType(Scaffold);
          // 直接返回 AppBar的title， 此处实际上是Text("Context测试")
          return (scaffold.appBar as AppBar).title;
        }),
      ),
    );
  }
}
```
### StatefulWidget
和`StatelessWidget`一样，`StatefulWidget`也是继承自Widget类，并重写了`createElement()`方法，不同的是返回的Element 对象并不相同；另外StatefulWidget类中添加了一个新的接口createState()。

下面我们看看StatefulWidget的类定义：
```dart
abstract class StatefulWidget extends Widget {
  const StatefulWidget({ Key key }) : super(key: key);

  @override
  StatefulElement createElement() => new StatefulElement(this);

  @protected
  State createState();
}
```
- `StatefulElement` 间接继承自Element类，与StatefulWidget相对应（作为其配置数据）。StatefulElement中可能会多次调用createState()来创建状态(State)对象。

- `createState()` 用于创建和Stateful widget相关的状态，它在Stateful widget的生命周期中可能会被多次调用。例如，当一个Stateful widget同时插入到widget树的多个位置时，Flutter framework就会调用该方法为每一个位置生成一个独立的State实例，其实，本质上就是一个StatefulElement对应一个State实例。
### State
一个`StatefulWidget`类会对应一个`State`类，State表示与其对应的StatefulWidget要维护的状态，State中的保存的状态信息可以：

- 在widget 构建时可以被同步读取。
- 在widget生命周期中可以被改变，当State被改变时，可以手动调用其setState()方法通知Flutter framework状态发生改变，  

Flutter framework在收到消息后，会重新调用其build方法重新构建widget树，从而达到更新UI的目的。
State中有两个常用属性：

- `widget`，它表示与该State实例关联的widget实例，由Flutter framework动态设置。注意，这种关联并非永久的，因为在应用生命周期中，UI树上的某一个节点的widget实例在重新构建时可能会变化，但State实例只会在第一次插入到树中时被创建，当在重新构建时，如果widget被修改了，Flutter framework会动态设置`State.widget`为新的widget实例。

- `context`。StatefulWidget对应的`BuildContext`，作用同StatelessWidget的BuildContext。

#### State生命周期
理解`State`的生命周期对flutter开发非常重要，在接下来的示例中，我们实现一个计数器widget，点击它可以使计数器加1，由于要保存计数器的数值状态，所以我们应继承StatefulWidget，代码如下：
```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({
    Key key,
    this.initValue: 0
  });

  final int initValue;

  @override
  _CounterWidgetState createState() => new _CounterWidgetState();
}
//CounterWidget接收一个initValue整型参数，它表示计数器的初始值。下面我们看一下State的代码：

class _CounterWidgetState extends State<CounterWidget> {  
  int _counter;

  @override
  void initState() {
    super.initState();
    //初始化状态  
    _counter=widget.initValue;
    print("initState");
  }

  @override
  Widget build(BuildContext context) {
    print("build");
    return Scaffold(
      body: Center(
        child: FlatButton(
          child: Text('$_counter'),
          //点击后计数器自增
          onPressed:()=>setState(()=> ++_counter,
          ),
        ),
      ),
    );
  }

  @override
  void didUpdateWidget(CounterWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    print("didUpdateWidget");
  }

  @override
  void deactivate() {
    super.deactivate();
    print("deactive");
  }

  @override
  void dispose() {
    super.dispose();
    print("dispose");
  }

  @override
  void reassemble() {
    super.reassemble();
    print("reassemble");
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print("didChangeDependencies");
  }

}
//接下来，我们创建一个新路由，在新路由中，我们只显示一个CounterWidget：

Widget build(BuildContext context) {
  return CounterWidget();
}
```
我们运行应用并打开该路由页面，在新路由页打开后，屏幕中央就会出现一个数字0，然后控制台日志输出：
```
I/flutter ( 5436): initState
I/flutter ( 5436): didChangeDependencies
I/flutter ( 5436): build
```
可以看到，在`StatefulWidget`插入到Widget树时首先initState方法会被调用。

然后我们点击⚡️按钮热重载，控制台输出日志如下：
```
I/flutter ( 5436): reassemble
I/flutter ( 5436): didUpdateWidget
I/flutter ( 5436): build
```
可以看到此时initState 和didChangeDependencies都没有被调用，而此时didUpdateWidget被调用。

接下来，我们在widget树中移除CounterWidget，将路由build方法改为：
```dart
Widget build(BuildContext context) {
  //移除计数器 
  //return CounterWidget();
  //随便返回一个Text()
  return Text("xxx");
}
```
然后热重载，日志如下：
```
I/flutter ( 5436): reassemble
I/flutter ( 5436): deactive
I/flutter ( 5436): dispose
```
我们可以看到，在CounterWidget从widget树中移除时，deactive和dispose会依次被调用。

下面我们来看看各个回调函数：

- `initState`：当Widget第一次插入到Widget树时会被调用，对于每一个State对象，Flutter framework只会调用一次该回调，所以，通常在该回调中做一些一次性的操作，如状态初始化、订阅子树的事件通知等。不能在该回调中调用`BuildContext.inheritFromWidgetOfExactType`，原因是在初始化完成后，Widget树中的`InheritFromWidget`也可能会发生变化，所以正确的做法应该在在`build（）`方法或`didChangeDependencies()`中调用它。
- `didChangeDependencies()`：当State对象的依赖发生变化时会被调用；例如：在之前`build() `中包含了一个`InheritedWidget`，然后在之后的build() 中InheritedWidget发生了变化，那么此时InheritedWidget的子widget的`didChangeDependencies()`回调都会被调用。典型的场景是当系统语言Locale或应用主题改变时，Flutter framework会通知widget调用此回调。
- `build()`：此回调读者现在应该已经相当熟悉了，它主要是用于构建Widget子树的，会在如下场景被调用：  
1. 在调用initState()之后。
2. 在调用didUpdateWidget()之后。
3. 在调用setState()之后。
4. 在调用didChangeDependencies()之后。
5. 在State对象从树中一个位置移除后（会调用deactivate）又重新插入到树的其它位置之后。
- `reassemble()`：此回调是专门为了开发调试而提供的，在热重载(hot reload)时会被调用，此回调在Release模式下永远不会被调用。
`didUpdateWidget()`：在widget重新构建时，Flutter framework会调用Widget.canUpdate来检测Widget树中同一位置的新旧节点，然后决定是否需要更新，如果Widget.canUpdate返回true则会调用此回调。正如之前所述，Widget.canUpdate会在新旧widget的key和runtimeType同时相等时会返回true，也就是说在在新旧widget的key和runtimeType同时相等时didUpdateWidget()就会被调用。
- `deactivate()`：当State对象从树中被移除时，会调用此回调。在一些场景下，Flutter framework会将State对象重新插到树中，如包含此State对象的子树在树的一个位置移动到另一个位置时（可以通过GlobalKey来实现）。如果移除后没有重新插入到树中则紧接着会调用dispose()方法。
- `dispose()`：当State对象从树中被永久移除时调用；通常在此回调中释放资源。  

StatefulWidget生命周期  
![state](../../.vuepress/public/img/state.jpg)
>注意：在继承StatefulWidget重写其方法时，对于包含@mustCallSuper标注的父类方法，都要在子类方法中先调用父类方法。
### 在Widget树中获取State对象
由于`StatefulWidget`的的具体逻辑都在其State中，所以很多时候，我们需要获取StatefulWidget对应的State对象来调用一些方法，比如Scaffold组件对应的状态类ScaffoldState中就定义了打开SnackBar(路由页底部提示条)的方法。我们有两种方法在子widget树中获取父级StatefulWidget的State对象。

## 状态管理
响应式的编程框架中都会有一个永恒的主题——“状态(State)管理”，无论是在React/Vue（两者都是支持响应式编程的Web开发框架）还是Flutter中，他们讨论的问题和解决的思想都是一致的。所以，如果你对React/Vue的状态管理有了解，可以跳过本节。言归正传，我们想一个问题，`StatefulWidget`的状态应该被谁管理？Widget本身？父Widget？都会？还是另一个对象？答案是取决于实际情况！以下是管理状态的最常见的方法：

- Widget管理自己的状态。
- Widget管理子Widget状态。
- 混合管理（父Widget和子Widget都管理状态）。  

如何决定使用哪种管理方法？下面是官方给出的一些原则可以帮助你做决定：

- 如果状态是用户数据，如复选框的选中状态、滑块的位置，则该状态最好由父Widget管理。
- 如果状态是有关界面外观效果的，例如颜色、动画，那么状态最好由Widget本身来管理。
- 如果某一个状态是不同Widget共享的则最好由它们共同的父Widget管理。
在Widget内部管理状态封装性会好一些，而在父Widget中管理会比较灵活。有些时候，如果不确定到底该怎么管理状态，那么推荐的首选是在父widget中管理（灵活会显得更重要一些）。

接下来，我们将通过创建三个简单示例TapboxA、TapboxB和TapboxC来说明管理状态的不同方式。 这些例子功能是相似的 ——创建一个盒子，当点击它时，盒子背景会在绿色与灰色之间切换。状态 _active确定颜色：绿色为true ，灰色为false