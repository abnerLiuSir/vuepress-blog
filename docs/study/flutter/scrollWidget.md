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
## ListView
ListView是最常用的可滚动组件之一，它可以沿一个方向线性排布所有子组件，并且它也支持基于`Sliver`的延迟构建模型。我们看看ListView的默认构造函数定义：
```dart
ListView({
  ...  
  //可滚动widget公共参数
  Axis scrollDirection = Axis.vertical,
  bool reverse = false,
  ScrollController controller,
  bool primary,
  ScrollPhysics physics,
  EdgeInsetsGeometry padding,

  //ListView各个构造函数的共同参数  
  double itemExtent,
  bool shrinkWrap = false,
  bool addAutomaticKeepAlives = true,
  bool addRepaintBoundaries = true,
  double cacheExtent,

  //子widget列表
  List<Widget> children = const <Widget>[],
})
```
上面参数分为两组：第一组是可滚动组件的公共参数，本章第一节中已经介绍过，不再赘述；第二组是`ListView`各个构造函数（ListView有多个构造函数）的共同参数，我们重点来看看这些参数，：

- `itemExtent`：该参数如果不为`null`，则会强制children的“**长度**”为itemExtent的值；这里的“长度”是指滚动方向上子组件的长度，也就是说如果滚动方向是垂直方向，则itemExtent代表子组件的高度；如果滚动方向为水平方向，则itemExtent就代表子组件的宽度。在ListView中，指定`itemExtent`比让子组件自己决定自身长度会更高效，这是因为指定`itemExtent`后，滚动系统可以提前知道列表的长度，而无需每次构建子组件时都去再计算一下，尤其是在滚动位置频繁变化时（滚动系统需要频繁去计算列表高度）。
- `shrinkWrap`：该属性表示是否根据子组件的总长度来设置`ListView`的长度，默认值为`false` 。默认情况下，ListView的会在滚动方向尽可能多的占用空间。当`ListView`在一个无边界(滚动方向上)的容器中时，`shrinkWrap必`须为`true`。
- `addAutomaticKeepAlives`：该属性表示是否将列表项（子组件）包裹在`AutomaticKeepAlive `组件中；典型地，在一个懒加载列表中，如果将列表项包裹在`AutomaticKeepAlive`中，在该列表项滑出视口时它也不会被**GC（垃圾回收）**，它会使用`KeepAliveNotification`来保存其状态。如果列表项自己维护其`KeepAlive`状态，那么此参数必须置为`false`。
- `addRepaintBoundaries`：该属性表示是否将列表项（子组件）包裹在`RepaintBoundary`组件中。当可滚动组件滚动时，将列表项包裹在`RepaintBoundary`中可以避免列表项重绘，但是当列表项重绘的开销非常小（如一个颜色块，或者一个较短的文本）时，不添加`RepaintBoundary`反而会更高效。和`addAutomaticKeepAlive`一样，如果列表项自己维护其`KeepAlive`状态，那么此参数必须置为`false`。
>注意：上面这些参数并非ListView特有，在本章后面介绍的其它可滚动组件也可能会拥有这些参数，它们的含义是相同的。

### 默认构造函数
默认构造函数有一个`children`参数，它接受一个`Widget`列表（List）。这种方式适合只有少量的子组件的情况，因为这种方式需要将所有`children`都提前创建好（这需要做大量工作），而不是等到子`widget`真正显示的时候再创建，也就是说通过默认构造函数构建的`ListView`没有应用基于`Sliver`的懒加载模型。实际上通过此方式创建的`ListView`和使用`SingleChildScrollView+Column`的方式没有本质的区别。下面是一个例子：
```dart
ListView(
  shrinkWrap: true, 
  padding: const EdgeInsets.all(20.0),
  children: <Widget>[
    const Text('I\'m dedicating every day to you'),
    const Text('Domestic life was never quite my style'),
    const Text('When you smile, you knock me out, I fall apart'),
    const Text('And I thought I was so smart'),
  ],
);
```
再次强调，可滚动组件通过一个**List**来作为其`children`属性时，只适用于子组件较少的情况，这是一个通用规律，并非`ListView`自己的特性，像`GridView`也是如此。

### ListView.builder
`ListView.builder`适合列表项比较多（或者无限）的情况，因为只有当子组件真正显示的时候才会被创建，也就说通过该构造函数创建的`ListView`是支持基于`Sliver`的懒加载模型的。下面看一下`ListView.builder`的核心参数列表：
```dart
ListView.builder({
  // ListView公共参数已省略  
  ...
  @required IndexedWidgetBuilder itemBuilder,
  int itemCount,
  ...
})
```
- `itemBuilder`：它是列表项的构建器，类型为`IndexedWidgetBuilder`，返回值为一个`widget`。当列表滚动到具体的`index`位置时，会调用该构建器构建列表项。
- `itemCount`：列表项的数量，如果为`null`，则为无限列表。
可滚动组件的构造函数如果需要一个列表项`Builder`，那么通过该构造函数构建的可滚动组件通常就是支持基于`Sliver`的懒加载模型的，反之则不支持，这是个一般规律。我们在后面在介绍可滚动组件的构造函数时将不再专门说明其是否支持基于`Sliver`的懒加载模型了。

下面看一个例子：
```dart
ListView.builder(
    itemCount: 100,
    itemExtent: 50.0, //强制高度为50.0
    itemBuilder: (BuildContext context, int index) {
      return ListTile(title: Text("$index"));
    }
);
```

### ListView.separated
`ListView.separated`可以在生成的列表项之间添加一个分割组件，它比`ListView.builder`多了一个`separatorBuilder`参数，该参数是一个分割组件生成器。

下面我们看一个例子：奇数行添加一条蓝色下划线，偶数行添加一条绿色下划线。
```dart
class ListView3 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    //下划线widget预定义以供复用。  
    Widget divider1=Divider(color: Colors.blue,);
    Widget divider2=Divider(color: Colors.green);
    return ListView.separated(
        itemCount: 100,
        //列表项构造器
        itemBuilder: (BuildContext context, int index) {
          return ListTile(title: Text("$index"));
        },
        //分割器构造器
        separatorBuilder: (BuildContext context, int index) {
          return index%2==0?divider1:divider2;
        },
    );
  }
}
```
### 实例：无限加载列表

假设我们要从数据源异步分批拉取一些数据，然后用`ListView`展示，当我们滑动到列表末尾时，判断是否需要再去拉取数据，如果是，则去拉取，拉取过程中在表尾显示一个`loading`，拉取成功后将数据插入列表；如果不需要再去拉取，则在表尾提示"没有更多"。代码如下：
```dart
class InfiniteListView extends StatefulWidget {
  @override
  _InfiniteListViewState createState() => new _InfiniteListViewState();
}

class _InfiniteListViewState extends State<InfiniteListView> {
  static const loadingTag = "##loading##"; //表尾标记
  var _words = <String>[loadingTag];

  @override
  void initState() {
    super.initState();
    _retrieveData();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: _words.length,
      itemBuilder: (context, index) {
        //如果到了表尾
        if (_words[index] == loadingTag) {
          //不足100条，继续获取数据
          if (_words.length - 1 < 100) {
            //获取数据
            _retrieveData();
            //加载时显示loading
            return Container(
              padding: const EdgeInsets.all(16.0),
              alignment: Alignment.center,
              child: SizedBox(
                  width: 24.0,
                  height: 24.0,
                  child: CircularProgressIndicator(strokeWidth: 2.0)
              ),
            );
          } else {
            //已经加载了100条数据，不再获取数据。
            return Container(
                alignment: Alignment.center,
                padding: EdgeInsets.all(16.0),
                child: Text("没有更多了", style: TextStyle(color: Colors.grey),)
            );
          }
        }
        //显示单词列表项
        return ListTile(title: Text(_words[index]));
      },
      separatorBuilder: (context, index) => Divider(height: .0),
    );
  }

  void _retrieveData() {
    Future.delayed(Duration(seconds: 2)).then((e) {
      _words.insertAll(_words.length - 1,
          //每次生成20个单词
          generateWordPairs().take(20).map((e) => e.asPascalCase).toList()
      );
      setState(() {
        //重新构建列表
      });
    });
  }

}
```
需要说明的是，`_retrieveData()`的功能是模拟从数据源异步获取数据，我们使用`english_words`包的`generateWordPairs()`方法每次生成20个单词。

### 添加固定列表头
很多时候我们需要给列表添加一个固定表头，比如我们想实现一个商品列表，需要在列表顶部添加一个“商品列表”标题
  
我们按照之前经验，写出如下代码：
```dart
@override
Widget build(BuildContext context) {
  return Column(children: <Widget>[
    ListTile(title:Text("商品列表")),
    ListView.builder(itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Text("$index"));
    }),
  ]);
}
```
然后运行，发现并没有出现我们期望的效果，相反触发了一个异常；
```
Error caught by rendering library, thrown during performResize()。
Vertical viewport was given unbounded height ...
```
从异常信息中我们可以看到是因为ListView高度边界无法确定引起，所以解决的办法也很明显，我们需要给ListView指定边界，我们通过SizedBox指定一个列表高度看看是否生效：
```dart
... //省略无关代码
SizedBox(
    height: 400, //指定列表高度为400
    child: ListView.builder(itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Text("$index"));
    }),
),
...
```
可以看到，我们期望的效果实现了，但是这种方法并不优雅，如果页面布局发生变化，比如表头布局调整导致表头高度改变，那么剩余空间的高度就得重新计算。那么有什么方法可以自动拉伸    以填充屏幕剩余空间的方法吗？当然有！答案就是`Flex`。前面已经介绍过在弹性布局中，可以使用`Expanded`自动拉伸组件大小，并且我们也说过`Column`是继承自Flex的，所以我们可以直接使用`Column+Expanded`来实现，代码如下：
```dart
@override
Widget build(BuildContext context) {
  return Column(children: <Widget>[
    ListTile(title:Text("商品列表")),
    Expanded(
      child: ListView.builder(itemBuilder: (BuildContext context, int index) {
        return ListTile(title: Text("$index"));
      }),
    ),
  ]);
}
```
运行后，和上图一样，完美实现了！
### 总结
本节主要介绍了ListView的一些公共参数以及常用的构造函数。不同的构造函数对应了不同的列表项生成模型，如果需要自定义列表项生成模型，可以通过`ListView.custom`来自定义，它需要实现一个`SliverChildDelegate`用来给`ListView`生成列表项组件，更多详情请参考API文档。

## GridView
`GridView`可以构建一个二维网格列表，其默认构造函数定义如下：
```dart
GridView({
  Axis scrollDirection = Axis.vertical,
  bool reverse = false,
  ScrollController controller,
  bool primary,
  ScrollPhysics physics,
  bool shrinkWrap = false,
  EdgeInsetsGeometry padding,
  @required SliverGridDelegate gridDelegate, //控制子widget layout的委托
  bool addAutomaticKeepAlives = true,
  bool addRepaintBoundaries = true,
  double cacheExtent,
  List<Widget> children = const <Widget>[],
})
```
我们可以看到，GridView和ListView的大多数参数都是相同的，它们的含义也都相同的，如有疑惑读者可以翻阅ListView一节，在此不再赘述。我们唯一需要关注的是`gridDelegate`参数，类型是`SliverGridDelegate`，它的作用是控制`GridView`子组件如何排列(layout)。  

`SliverGridDelegate`是一个抽象类，定义了`GridView Layout`相关接口，子类需要通过实现它们来实现具体的布局算法。Flutter中提供了两个`SliverGridDelegate`的子类`SliverGridDelegateWithFixedCrossAxisCount`和`SliverGridDelegateWithMaxCrossAxisExten`t，我们可以直接使用，下面我们分别来介绍一下它们。

### SliverGridDelegateWithFixedCrossAxisCount
该子类实现了一个横轴为固定数量子元素的layout算法，其构造函数为：
```dart
SliverGridDelegateWithFixedCrossAxisCount({
  @required double crossAxisCount, 
  double mainAxisSpacing = 0.0,
  double crossAxisSpacing = 0.0,
  double childAspectRatio = 1.0,
})
```
- `crossAxisCount`：横轴子元素的数量。此属性值确定后子元素在横轴的长度就确定了，即`ViewPort`横轴长度除以`crossAxisCount`的商。
- `mainAxisSpacing`：主轴方向的间距。
- `crossAxisSpacing`：横轴方向子元素的间距。
- `childAspectRatio`：子元素在横轴长度和主轴长度的比例。由于`crossAxisCount`指定后，子元素横轴长度就确定了，然后通过此参数值就可以确定子元素在主轴的长度。  

可以发现，子元素的大小是通过`crossAxisCount`和`childAspectRatio`两个参数共同决定的。注意，这里的子元素指的是子组件的最大显示空间，注意确保子组件的实际大小不要超出子元素的空间。

下面看一个例子：
```dart
GridView(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
      crossAxisCount: 3, //横轴三个子widget
      childAspectRatio: 1.0 //宽高比为1时，子widget
  ),
  children:<Widget>[
    Icon(Icons.ac_unit),
    Icon(Icons.airport_shuttle),
    Icon(Icons.all_inclusive),
    Icon(Icons.beach_access),
    Icon(Icons.cake),
    Icon(Icons.free_breakfast)
  ]
);
```
### GridView.count
`GridView.count`构造函数内部使用了`SliverGridDelegateWithFixedCrossAxisCount`，我们通过它可以快速的创建横轴固定数量子元素的GridView，上面的示例代码等价于：
```dart
GridView.count( 
  crossAxisCount: 3,
  childAspectRatio: 1.0,
  children: <Widget>[
    Icon(Icons.ac_unit),
    Icon(Icons.airport_shuttle),
    Icon(Icons.all_inclusive),
    Icon(Icons.beach_access),
    Icon(Icons.cake),
    Icon(Icons.free_breakfast),
  ],
);
```
### SliverGridDelegateWithMaxCrossAxisExtent
该子类实现了一个横轴子元素为固定最大长度的layout算法，其构造函数为：
```dart
SliverGridDelegateWithMaxCrossAxisExtent({
  double maxCrossAxisExtent,
  double mainAxisSpacing = 0.0,
  double crossAxisSpacing = 0.0,
  double childAspectRatio = 1.0,
})
```
- `maxCrossAxisExtent`为子元素在横轴上的最大长度，之所以是“最大”长度，是因为横轴方向每个子元素的长度仍然是等分的，举个例子，如果ViewPort的横轴长度是450，那么当`maxCrossAxisExtent`的值在区间[450/4，450/3)内的话，子元素最终实际长度都为112.5，而`childAspectRatio`所指的子元素横轴和主轴的长度比为最终的长度比。其它参数和`SliverGridDelegateWithFixedCrossAxisCount`相同。

下面我们看一个例子：
```dart
GridView(
  padding: EdgeInsets.zero,
  gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
      maxCrossAxisExtent: 120.0,
      childAspectRatio: 2.0 //宽高比为2
  ),
  children: <Widget>[
    Icon(Icons.ac_unit),
    Icon(Icons.airport_shuttle),
    Icon(Icons.all_inclusive),
    Icon(Icons.beach_access),
    Icon(Icons.cake),
    Icon(Icons.free_breakfast),
  ],
);
```
### GridView.extent
GridView.extent构造函数内部使用了SliverGridDelegateWithMaxCrossAxisExtent，我们通过它可以快速的创建纵轴子元素为固定最大长度的的GridView，上面的示例代码等价于：
```dart
GridView.extent(
   maxCrossAxisExtent: 120.0,
   childAspectRatio: 2.0,
   children: <Widget>[
     Icon(Icons.ac_unit),
     Icon(Icons.airport_shuttle),
     Icon(Icons.all_inclusive),
     Icon(Icons.beach_access),
     Icon(Icons.cake),
     Icon(Icons.free_breakfast),
   ],
 );
 ```
### GridView.builder
上面我们介绍的`GridView`都需要一个`widget`数组作为其子元素，这些方式都会提前将所有子`widget`都构建好，所以只适用于子`widget`数量比较少时，当子`widget`比较多时，我们可以通过`GridView.builder`来动态创建子`widget`。`GridView.builder` 必须指定的参数有两个：
```dart
GridView.builder(
 ...
 @required SliverGridDelegate gridDelegate, 
 @required IndexedWidgetBuilder itemBuilder,
)
```
其中`itemBuilder`为子widget构建器。
### 示例
假设我们需要从一个异步数据源（如网络）分批获取一些Icon，然后用GridView来展示：
```dart
class InfiniteGridView extends StatefulWidget {
  @override
  _InfiniteGridViewState createState() => new _InfiniteGridViewState();
}

class _InfiniteGridViewState extends State<InfiniteGridView> {

  List<IconData> _icons = []; //保存Icon数据

  @override
  void initState() {
    // 初始化数据  
    _retrieveIcons();
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3, //每行三列
            childAspectRatio: 1.0 //显示区域宽高相等
        ),
        itemCount: _icons.length,
        itemBuilder: (context, index) {
          //如果显示到最后一个并且Icon总数小于200时继续获取数据
          if (index == _icons.length - 1 && _icons.length < 200) {
            _retrieveIcons();
          }
          return Icon(_icons[index]);
        }
    );
  }

  //模拟异步获取数据
  void _retrieveIcons() {
    Future.delayed(Duration(milliseconds: 200)).then((e) {
      setState(() {
        _icons.addAll([
          Icons.ac_unit,
          Icons.airport_shuttle,
          Icons.all_inclusive,
          Icons.beach_access, Icons.cake,
          Icons.free_breakfast
        ]);
      });
    });
  }
}
```
## CustomScrollView
`CustomScrollView`是可以使用`Sliver`来自定义滚动模型（效果）的组件。它可以包含多种滚动模型，举个例子，假设有一个页面，顶部需要一个`GridView`，底部需要一个`ListView`，而要求整个页面的滑动效果是统一的，即它们看起来是一个整体。如果使用GridView+ListView来实现的话，就不能保证一致的滑动效果，因为它们的滚动效果是分离的，所以这时就需要一个"胶水"，把这些彼此独立的可滚动组件"粘"起来，而CustomScrollView的功能就相当于“胶水”。

### 可滚动组件的Sliver版
`Sliver`在前面讲过，有细片、薄片之意，在Flutter中，`Sliver`通常指可滚动组件子元素（就像一个个薄片一样）。但是在`CustomScrollView`中，需要粘起来的可滚动组件就是`CustomScrollView`的`Sliver`了，如果直接将`ListView、GridView`作为`CustomScrollView`是不行的，因为它们本身是可滚动组件而并不是`Sliver`！因此，为了能让可滚动组件能和`CustomScrollView`配合使用，`Flutter`提供了一些可滚动组件的`Sliver`版，如`SliverList、SliverGrid`等。实际上`Sliver`版的可滚动组件和非`Sliver`版的可滚动组件最大的区别就是前者不包含滚动模型（自身不能再滚动），而后者包含滚动模型 ，也正因如此，`CustomScrollView`才可以将多个`Sliver`"粘"在一起，这些`Sliver`共用`CustomScrollView`的`Scrollable`，所以最终才实现了统一的滑动效果。

>Sliver系列Widget比较多，我们不会一一介绍，读者只需记住它的特点，需要时再去查看文档即可。上面之所以说“大多数”Sliver都和可滚动组件对应，是由于还有一些如SliverPadding、SliverAppBar等是和可滚动组件无关的，它们主要是为了结合CustomScrollView一起使用，这是因为CustomScrollView的子组件必须都是Sliver。
### 示例
```dart
import 'package:flutter/material.dart';

class CustomScrollViewTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    //因为本路由没有使用Scaffold，为了让子级Widget(如Text)使用
    //Material Design 默认的样式风格,我们使用Material作为本路由的根。
    return Material(
      child: CustomScrollView(
        slivers: <Widget>[
          //AppBar，包含一个导航栏
          SliverAppBar(
            pinned: true,
            expandedHeight: 250.0,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('Demo'),
              background: Image.asset(
                "images/avatar.jpg", fit: BoxFit.cover,),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(8.0),
            sliver: new SliverGrid( //Grid
              gridDelegate: new SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, //Grid按两列显示
                mainAxisSpacing: 10.0,
                crossAxisSpacing: 10.0,
                childAspectRatio: 4.0,
              ),
              delegate: new SliverChildBuilderDelegate(
                    (BuildContext context, int index) {
                  //创建子widget      
                  return new Container(
                    alignment: Alignment.center,
                    color: Colors.cyan[100 * (index % 9)],
                    child: new Text('grid item $index'),
                  );
                },
                childCount: 20,
              ),
            ),
          ),
          //List
          new SliverFixedExtentList(
            itemExtent: 50.0,
            delegate: new SliverChildBuilderDelegate(
                    (BuildContext context, int index) {
                  //创建列表项      
                  return new Container(
                    alignment: Alignment.center,
                    color: Colors.lightBlue[100 * (index % 9)],
                    child: new Text('list item $index'),
                  );
                },
                childCount: 50 //50个列表项
            ),
          ),
        ],
      ),
    );
  }
}
```
代码分为三部分：

- 头部SliverAppBar：`SliverAppBar`对应`AppBar`，两者不同之处在于`SliverAppBar`可以集成到`CustomScrollView`。`SliverAppBar`可以结合`FlexibleSpaceBar`实现Material Design中头部伸缩的模型，具体效果，读者可以运行该示例查看。
- 中间的`SliverGrid`：它用`SliverPadding`包裹以给SliverGrid添加补白。SliverGrid是一个两列，宽高比为4的网格，它有20个子组件。
- 底部`SliverFixedExtentList`：它是一个所有子元素高度都为50像素的列表。
## 滚动监听及控制
在前几节中，我们介绍了Flutter中常用的可滚动组件，也说过可以用`ScrollController`来控制可滚动组件的滚动位置，本节先介绍一下`ScrollController`，然后以`ListView`为例，展示一下`ScrollController`的具体用法。最后，再介绍一下路由切换时如何来保存滚动位置。

### ScrollController
ScrollController构造函数如下：
```dart
ScrollController({
  double initialScrollOffset = 0.0, //初始滚动位置
  this.keepScrollOffset = true,//是否保存滚动位置
  ...
})
```
我们介绍一下ScrollController常用的属性和方法：

- `offset`：可滚动组件当前的滚动位置。
- `jumpTo(double offset)、animateTo(double offset,...)`：这两个方法用于跳转到指定的位置，它们不同之处在于，后者在跳转时会执行一个动画，而前者不会。  

ScrollController还有一些属性和方法，我们将在后面原理部分解释。

### 滚动监听
`ScrollController`间接继承自`Listenable`，我们可以根据`ScrollController`来监听滚动事件，如：
```dart
controller.addListener(()=>print(controller.offset))
```

### 示例
我们创建一个`ListView`，当滚动位置发生变化时，我们先打印出当前滚动位置，然后判断当前位置是否超过1000像素，如果超过则在屏幕右下角显示一个“返回顶部”的按钮，该按钮点击后可以使ListView`恢复到初始位置；如果没有超过1000像素，则隐藏“返回顶部”按钮。代码如下：

```dart
class ScrollControllerTestRoute extends StatefulWidget {
  @override
  ScrollControllerTestRouteState createState() {
    return new ScrollControllerTestRouteState();
  }
}

class ScrollControllerTestRouteState extends State<ScrollControllerTestRoute> {
  ScrollController _controller = new ScrollController();
  bool showToTopBtn = false; //是否显示“返回到顶部”按钮

  @override
  void initState() {
    super.initState();
    //监听滚动事件，打印滚动位置
    _controller.addListener(() {
      print(_controller.offset); //打印滚动位置
      if (_controller.offset < 1000 && showToTopBtn) {
        setState(() {
          showToTopBtn = false;
        });
      } else if (_controller.offset >= 1000 && showToTopBtn == false) {
        setState(() {
          showToTopBtn = true;
        });
      }
    });
  }

  @override
  void dispose() {
    //为了避免内存泄露，需要调用_controller.dispose
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("滚动控制")),
      body: Scrollbar(
        child: ListView.builder(
            itemCount: 100,
            itemExtent: 50.0, //列表项高度固定时，显式指定高度是一个好习惯(性能消耗小)
            controller: _controller,
            itemBuilder: (context, index) {
              return ListTile(title: Text("$index"),);
            }
        ),
      ),
      floatingActionButton: !showToTopBtn ? null : FloatingActionButton(
          child: Icon(Icons.arrow_upward),
          onPressed: () {
            //返回到顶部时执行动画
            _controller.animateTo(.0,
                duration: Duration(milliseconds: 200),
                curve: Curves.ease
            );
          }
      ),
    );
  }
}
```
由于列表项高度为50像素，当滑动到第20个列表项后，右下角“返回顶部”按钮会显示，点击该按钮，`ListView`会在返回顶部的过程中执行一个滚动动画，动画时间是200毫秒，动画曲线是`Curves.ease`  

### 滚动位置恢复
`PageStorage`是一个用于保存页面(路由)相关数据的组件，它并不会影响子树的UI外观，其实，`PageStorage`是一个功能型组件，它拥有一个存储桶（bucket），子树中的`Widget`可以通过指定不同的`PageStorageKey`来存储各自的数据或状态。  

每次滚动结束，可滚动组件都会将滚动位置`offset`存储到`PageStorage`中，当可滚动组件重新创建时再恢复。如果`ScrollController.keepScrollOffset`为`false`，则滚动位置将不会被存储，可滚动组件重新创建时会使用`ScrollController.initialScrollOffset`；`ScrollController.keepScrollOffset`为`true`时，可滚动组件在第一次创建时，会滚动到`initialScrollOffset`处，因为这时还没有存储过滚动位置。在接下来的滚动中就会存储、恢复滚动位置，而`initialScrollOffset`会被忽略。  

当一个路由中包含多个可滚动组件时，如果你发现在进行一些跳转或切换操作后，滚动位置不能正确恢复，这时你可以通过显式指定`PageStorageKey`来分别跟踪不同的可滚动组件的位置，如：
```dart
ListView(key: PageStorageKey(1), ... );
...
ListView(key: PageStorageKey(2), ... );
```
不同的`PageStorageKey`，需要不同的值，这样才可以为不同可滚动组件保存其滚动位置。

>注意：一个路由中包含多个可滚动组件时，如果要分别跟踪它们的滚动位置，并非一定就得给他们分别提供PageStorageKey。这是因为Scrollable本身是一个StatefulWidget，它的状态中也会保存当前滚动位置，所以，只要可滚动组件本身没有被从树上detach掉，那么其State就不会销毁(dispose)，滚动位置就不会丢失。只有当Widget发生结构变化，导致可滚动组件的State销毁或重新构建时才会丢失状态，这种情况就需要显式指定PageStorageKey，通过PageStorage来存储滚动位置，一个典型的场景是在使用TabBarView时，在Tab发生切换时，Tab页中的可滚动组件的State就会销毁，这时如果想恢复滚动位置就需要指定PageStorageKey。

### ScrollPosition
`ScrollPosition`是用来保存可滚动组件的滚动位置的。一个`ScrollController`对象可以同时被多个可滚动组件使用，`ScrollController`会为每一个可滚动组件创建一个`ScrollPosition`对象，这些`ScrollPosition`保存在`ScrollController`的`positions`属性中（`List<ScrollPosition>`）。`ScrollPosition`是真正保存滑动位置信息的对象，`offset`只是一个便捷属性：
```dart
double get offset => position.pixels;
```
一个`ScrollController`虽然可以对应多个可滚动组件，但是有一些操作，如读取滚动位置`offset`，则需要一对一！但是我们仍然可以在一对多的情况下，通过其它方法读取滚动位置，举个例子，假设一个`ScrollController`同时被两个可滚动组件使用，那么我们可以通过如下方式分别读取他们的滚动位置：
```dart
...
controller.positions.elementAt(0).pixels
controller.positions.elementAt(1).pixels
...
```
我们可以通过`controller.positions.length`来确定`controller`被几个可滚动组件使用。
#### ScrollPosition的方法
`ScrollPosition`有两个常用方法：`animateTo()` 和` jumpTo()`，它们是真正来控制跳转滚动位置的方法，`ScrollController`的这两个同名方法，内部最终都会调用`ScrollPosition`的。
### ScrollController控制原理
我们来介绍一下`ScrollController`的另外三个方法：
```dart
ScrollPosition createScrollPosition(
    ScrollPhysics physics,
    ScrollContext context,
    ScrollPosition oldPosition);
void attach(ScrollPosition position) ;
void detach(ScrollPosition position) ;
```
当`ScrollController`和可滚动组件关联时，可滚动组件首先会调用`ScrollController`的`createScrollPosition()`方法来创建一个`ScrollPosition`来存储滚动位置信息，接着，可滚动组件会调用`attach()`方法，将创建的`ScrollPosition`添加到`ScrollController`的`positions`属性中，这一步称为“注册位置”，只有注册后`animateTo()` 和 `jumpTo()`才可以被调用。  

当可滚动组件销毁时，会调用`ScrollController`的`detach()`方法，将其`ScrollPosition`对象从`ScrollController`的`positions`属性中移除，这一步称为“注销位置”，注销后`animateTo()` 和 `jumpTo()` 将不能再被调用。

需要注意的是，`ScrollController`的`animateTo() `和` jumpTo()`内部会调用所有`ScrollPosition`的`animateTo() `和 `jumpTo()`，以实现所有和该`ScrollController`关联的可滚动组件都滚动到指定的位置。

### 滚动监听
`Flutter Widget`树中子`Widget`可以通过发送通知（`Notification`）与父(包括祖先)Widget通信。父级组件可以通过`NotificationListener`组件来监听自己关注的通知，这种通信方式类似于Web开发中浏览器的事件冒泡，我们在Flutter中沿用“冒泡”这个术语  

可滚动组件在滚动时会发送`ScrollNotification`类型的通知，`ScrollBar`正是通过监听滚动通知来实现的。通过`NotificationListener`监听滚动事件和通过`ScrollController`有两个主要的不同：

- 通过`NotificationListener`可以在从可滚动组件到`widget`树根之间任意位置都能监听。而`ScrollController`只能和具体的可滚动组件关联后才可以。
- 收到滚动事件后获得的信息不同；`NotificationListener`在收到滚动事件时，通知中会携带当前滚动位置和`ViewPort`的一些信息，而`ScrollController`只能获取当前滚动位置。

### 示例
下面，我们监听ListView的滚动通知，然后显示当前滚动进度百分比：
```dart
import 'package:flutter/material.dart';

class ScrollNotificationTestRoute extends StatefulWidget {
  @override
  _ScrollNotificationTestRouteState createState() =>
      new _ScrollNotificationTestRouteState();
}

class _ScrollNotificationTestRouteState
    extends State<ScrollNotificationTestRoute> {
  String _progress = "0%"; //保存进度百分比

  @override
  Widget build(BuildContext context) {
    return Scrollbar( //进度条
      // 监听滚动通知
      child: NotificationListener<ScrollNotification>(
        onNotification: (ScrollNotification notification) {
          double progress = notification.metrics.pixels /
              notification.metrics.maxScrollExtent;
          //重新构建
          setState(() {
            _progress = "${(progress * 100).toInt()}%";
          });
          print("BottomEdge: ${notification.metrics.extentAfter == 0}");
          //return true; //放开此行注释后，进度条将失效
        },
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            ListView.builder(
                itemCount: 100,
                itemExtent: 50.0,
                itemBuilder: (context, index) {
                  return ListTile(title: Text("$index"));
                }
            ),
            CircleAvatar(  //显示进度百分比
              radius: 30.0,
              child: Text(_progress),
              backgroundColor: Colors.black54,
            )
          ],
        ),
      ),
    );
  }
}
```

在接收到滚动事件时，参数类型为`ScrollNotification`，它包括一个`metrics`属性，它的类型是`ScrollMetrics`，该属性包含当前`ViewPort`及滚动位置等信息：

- `pixels`：当前滚动位置。
- `maxScrollExtent`：最大可滚动长度。
- `extentBefore`：滑出ViewPort顶部的长度；此示例中相当于顶部滑出屏幕上方的列表长度。
- `extentInside`：ViewPort内部长度；此示例中屏幕显示的列表部分的长度。
- `extentAfter`：列表中未滑入ViewPort部分的长度；此示例中列表底部未显示到屏幕范围部分的长度。
- `atEdge`：是否滑到了可滚动组件的边界（此示例中相当于列表顶或底部）。