# Flutter — 功能型组件
##  导航返回拦截（WillPopScope）
为了避免用户误触返回按钮而导致APP退出，在很多APP中都拦截了用户点击返回键的按钮，然后进行一些防误触判断，比如当用户在某一个时间段内点击两次时，才会认为用户是要退出（而非误触）。Flutter中可以通过`WillPopScope`来实现返回按钮拦截，我们看看`WillPopScope`的默认构造函数：
```dart
const WillPopScope({
  ...
  @required WillPopCallback onWillPop,
  @required Widget child
})
```
- `onWillPop`是一个回调函数，当用户点击返回按钮时被调用（包括导航返回按钮及Android物理返回按钮）。该回调需要返回一个`Future`对象，如果返回的`Future`最终值为`false`时，则当前路由不出栈(不会返回)；最终值为true时，当前路由出栈退出。我们需要提供这个回调来决定是否退出。

### 示例
为了防止用户误触返回键退出，我们拦截返回事件。当用户在1秒内点击两次返回按钮时，则退出；如果间隔超过1秒则不退出，并重新记时。代码如下：
```dart
import 'package:flutter/material.dart';

class WillPopScopeTestRoute extends StatefulWidget {
  @override
  WillPopScopeTestRouteState createState() {
    return new WillPopScopeTestRouteState();
  }
}

class WillPopScopeTestRouteState extends State<WillPopScopeTestRoute> {
  DateTime _lastPressedAt; //上次点击时间

  @override
  Widget build(BuildContext context) {
    return new WillPopScope(
        onWillPop: () async {
          if (_lastPressedAt == null ||
              DateTime.now().difference(_lastPressedAt) > Duration(seconds: 1)) {
            //两次点击间隔超过1秒则重新计时
            _lastPressedAt = DateTime.now();
            return false;
          }
          return true;
        },
        child: Container(
          alignment: Alignment.center,
          child: Text("1秒内连续按两次返回键退出"),
        )
    );
  }
}
```

## 数据共享（InheritedWidget）
`InheritedWidget`是`Flutter`中非常重要的一个功能型组件，它提供了一种数据在`widget`树中从上到下传递、共享的方式，比如我们在应用的根widget中通过`InheritedWidget`共享了一个数据，那么我们便可以在任意子widget中来获取该共享的数据！这个特性在一些需要在widget树中共享数据的场景中非常方便！如Flutter SDK中正是通过`InheritedWidget`来共享应用主题（Theme）和Locale (当前语言环境)信息的。

`InheritedWidget`和React中的`context`功能类似，和逐级传递数据相比，它们能实现组件跨级传递数据。`InheritedWidget`的在widget树中数据传递方向是**从上到下的**，这和通知`Notification`（将在下一章中介绍）的传递方向正好相反。

### didChangeDependencies
在之前介绍`StatefulWidget`时，我们提到`State`对象有一个`didChangeDependencies`回调，它会在“依赖”发生变化时被`Flutter Framework`调用。而这个“依赖”指的就是子**widget是否使用了父widget中`InheritedWidget`的数据**！如果使用了，则代表子widget依赖有依赖InheritedWidget；如果没有使用则代表没有依赖。这种机制可以使子组件在所依赖的InheritedWidget变化时来更新自身！比如当主题、locale(语言)等发生变化时，依赖其的子widget的didChangeDependencies方法将会被调用。

下面我们看一下之前“计数器”示例应用程序的`InheritedWidget`版本。需要说明的是，本示例主要是为了演示`InheritedWidget`的功能特性，并不是计数器的推荐实现方式。

首先，我们通过继承`InheritedWidget`，将当前计数器点击次数保存在`ShareDataWidge`t的data属性中：
```dart
class ShareDataWidget extends InheritedWidget {
  ShareDataWidget({
    @required this.data,
    Widget child
  }) :super(child: child);

  final int data; //需要在子树中共享的数据，保存点击次数

  //定义一个便捷方法，方便子树中的widget获取共享数据  
  static ShareDataWidget of(BuildContext context) {
    return context.inheritFromWidgetOfExactType(ShareDataWidget);
  }

  //该回调决定当data发生变化时，是否通知子树中依赖data的Widget  
  @override
  bool updateShouldNotify(ShareDataWidget old) {
    //如果返回true，则子树中依赖(build函数中有调用)本widget
    //的子widget的`state.didChangeDependencies`会被调用
    return old.data != data;
  }
}
```
然后我们实现一个子组件_TestWidget，在其build方法中引用ShareDataWidget中的数据。同时，在其didChangeDependencies() 回调中打印日志：
```dart
class _TestWidget extends StatefulWidget {
  @override
  __TestWidgetState createState() => new __TestWidgetState();
}

class __TestWidgetState extends State<_TestWidget> {
  @override
  Widget build(BuildContext context) {
    //使用InheritedWidget中的共享数据
    return Text(ShareDataWidget
        .of(context)
        .data
        .toString());
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    //父或祖先widget中的InheritedWidget改变(updateShouldNotify返回true)时会被调用。
    //如果build中没有依赖InheritedWidget，则此回调不会被调用。
    print("Dependencies change");
  }
}
```
最后，我们创建一个按钮，每点击一次，就将ShareDataWidget的值自增：
```dart
class InheritedWidgetTestRoute extends StatefulWidget {
  @override
  _InheritedWidgetTestRouteState createState() => new _InheritedWidgetTestRouteState();
}

class _InheritedWidgetTestRouteState extends State<InheritedWidgetTestRoute> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return  Center(
      child: ShareDataWidget( //使用ShareDataWidget
        data: count,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: _TestWidget(),//子widget中依赖ShareDataWidget
            ),
            RaisedButton(
              child: Text("Increment"),
              //每点击一次，将count自增，然后重新build,ShareDataWidget的data将被更新  
              onPressed: () => setState(() => ++count),
            )
          ],
        ),
      ),
    );
  }
}
```
每点击一次按钮，计数器就会自增，控制台就会打印一句日志：
```
I/flutter ( 8513): Dependencies change
```
可见依赖发生变化后，其d`idChangeDependencies()`会被调用。但是读者要注意，如果`_TestWidget`的build方法中没有使用`ShareDataWidget`的数据，那么它的`didChangeDependencies()`将不会被调用，因为它并没有依赖`ShareDataWidget`。例如，我们将`__TestWidgetState`代码该为下面这样，`didChangeDependencies()`将不会被调用:
```dart
class __TestWidgetState extends State<_TestWidget> {
  @override
  Widget build(BuildContext context) {
    // 使用InheritedWidget中的共享数据
    //    return Text(ShareDataWidget
    //        .of(context)
    //        .data
    //        .toString());
     return Text("text");
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // build方法中没有依赖InheritedWidget，此回调不会被调用。
    print("Dependencies change");
  }
}
```
上面的代码中，我们将`build()`方法中依赖`ShareDataWidget`的代码注释掉了，然后返回一个固定Text，这样一来，当点击Increment按钮后，`ShareDataWidget`的data虽然发生变化，但由于`__TestWidgetState`并未依赖`ShareDataWidget`，所以`__TestWidgetState`的`didChangeDependencies`方法不会被调用。其实，这个机制很好理解，因为在数据发生变化时只对使用该数据的`Widget`更新是合理并且性能友好的。
#### 应该在didChangeDependencies()中做什么？
一般来说，子widget很少会重写此方法，因为在依赖改变后`framework`也都会调用`build()`方法。但是，如果你需要在依赖改变后执行一些昂贵的操作，比如网络请求，这时最好的方式就是在此方法中执行，这样可以避免每次`build()`都执行这些昂贵操作。
### 深入了解InheritedWidget
现在来思考一下，如果我们只想在`__TestWidgetState`中引用`ShareDataWidget`数据，但却不希望在`ShareDataWidget`发生变化时调用`__TestWidgetState`的`didChangeDependencies()`方法应该怎么办？其实答案很简单，我们只需要将`ShareDataWidget.of()`的实现改一下即可：
```dart
//定义一个便捷方法，方便子树中的widget获取共享数据
static ShareDataWidget of(BuildContext context) {
  //return context.inheritFromWidgetOfExactType(ShareDataWidget);
  return context.ancestorInheritedElementForWidgetOfExactType(ShareDataWidget).widget;
}
```
唯一的改动就是获取`ShareDataWidget`对象的方式，把`inheritFromWidgetOfExactType()`方法换成了`context.ancestorInheritedElementForWidgetOfExactType(ShareDataWidget).widget`，那么他们到底有什么区别呢，我们看一下这两个方法的源码（实现代码在Element类中，Context和Element的关系我们将在后面专门介绍）：
```dart
@override
InheritedElement ancestorInheritedElementForWidgetOfExactType(Type targetType) {
  final InheritedElement ancestor = _inheritedWidgets == null ? null :  _inheritedWidgets[targetType];
  return ancestor;
}

@override
InheritedWidget inheritFromWidgetOfExactType(Type targetType, { Object aspect }) {
  final InheritedElement ancestor = _inheritedWidgets == null ? null :   _inheritedWidgets[targetType];
  //多出的部分
  if (ancestor != null) {
    assert(ancestor is InheritedElement);
    return inheritFromElement(ancestor, aspect: aspect);
  }
  _hadUnsatisfiedDependencies = true;
  return null;
}
```
我们可以看到，`inheritFromWidgetOfExactType()` 比 `ancestorInheritedElementForWidgetOfExactType()`多调了`inheritFromElement`方法，`inheritFromElement`源码如下：
```dart
@override
InheritedWidget inheritFromElement(InheritedElement ancestor, { Object aspect }) {
  //注册依赖关系
  _dependencies ??= HashSet<InheritedElement>();
  _dependencies.add(ancestor);
  ancestor.updateDependencies(this, aspect);
  return ancestor.widget;
}
```
可以看到`inheritFromElement`方法中主要是注册了依赖关系！看到这里也就清晰了，调用`inheritFromWidgetOfExactType()` 和 `ancestorInheritedElementForWidgetOfExactType()`的区别就是**前者会注册依赖关系**，而后者不会，所以在调用`inheritFromWidgetOfExactType()`时，`InheritedWidget`和依赖它的子孙组件关系便完成了注册，之后当`InheritedWidget`发生变化时，就会更新依赖它的子孙组件，也就是会调这些子孙组件的`didChangeDependencies()`方法和`build()`方法。而当调用的是 `ancestorInheritedElementForWidgetOfExactType()`时，由于没有注册依赖关系，所以之后当`InheritedWidget`发生变化时，就不会更新相应的子孙`Widget`。

注意，如果将上面示例中`ShareDataWidget.of()`方法实现改成调用`ancestorInheritedElementForWidgetOfExactType()`，运行示例后，点击"Increment"按钮，会发现`__TestWidgetState`的`didChangeDependencies()`方法确实不会再被调用，但是其build()仍然会被调用！造成这个的原因其实是，点击"`Increment`"按钮后，会调用`_InheritedWidgetTestRouteState`的`setState()`方法，此时会重新构建整个页面，由于示例中，`__TestWidget `并没有任何缓存，所以它也都会被重新构建，所以也会调用`build()`方法。  

那么，现在就带来了一个问题：实际上，我们只想更新子树中依赖了`ShareDataWidget`的组件，而现在只要调用`_InheritedWidgetTestRouteState`的`setState()`方法，所有子节点都会被重新build，这很没必要，那么有什么办法可以避免呢？答案是缓存！一个简单的做法就是通过封装一个`StatefulWidget`，将子Widget树缓存起来

## 跨组件状态共享（Provider）
在`Flutter`开发中，状态管理是一个永恒的话题。一般的原则是：如果状态是组件私有的，则应该由组件自己管理；如果状态要跨组件共享，则该状态应该由各个组件共同的父元素来管理。对于组件私有的状态管理很好理解，但对于跨组件共享的状态，管理的方式就比较多了，如使用全局事件总线`EventBus`，它是一个观察者模式的实现，通过它就可以实现跨组件状态同步：状态持有方（发布者）负责更新、发布状态，状态使用方（观察者）监听状态改变事件来执行一些操作。下面我们看一个登陆状态同步的简单示例：  

定义事件：
```dart
enum Event{
  login,
  ... //省略其它事件
}
```
登录页代码大致如下：
```dart
// 登录状态改变后发布状态改变事件
bus.emit(Event.login);
```
依赖登录状态的页面：
```dart
void onLoginChanged(e){
  //登录状态变化处理逻辑
}

@override
void initState() {
  //订阅登录状态改变事件
  bus.on(Event.login,onLogin);
  super.initState();
}

@override
void dispose() {
  //取消订阅
  bus.off(Event.login,onLogin);
  super.dispose();
}
```
我们可以发现，通过观察者模式来实现跨组件状态共享有一些明显的缺点：

- 必须显式定义各种事件，不好管理
- 订阅者必须需显式注册状态改变回调，也必须在组件销毁时手动去解绑回调以避免内存泄露。  

在`Flutter`当中有没有更好的跨组件状态管理方式了呢？答案是肯定的，那怎么做的？我们想想前面介绍的`InheritedWidget`，它的天生特性就是能绑定`InheritedWidget`与依赖它的子孙组件的依赖关系，并且当`InheritedWidget`数据发生变化时，可以自动更新依赖的子孙组件！利用这个特性，我们可以将需要跨组件共享的状态保存在`InheritedWidget`中，然后在子组件中引用`InheritedWidget`即可，`Flutter`社区著名的`Provider`包正是基于这个思想实现的一套跨组件状态共享解决方案，接下来我们便详细介绍一下`Provider`的用法及原理。

### Provider
我们不直接去看Provider包的源代码，通过InheritedWidget实现的思路来一步一步地实现一个最小功能的Provider。

首先，我们需要一个保存需要共享的数据`InheritedWidget`，由于具体业务数据类型不可预期，为了通用性，我们使用泛型，定义一个通用的`InheritedProvider`类，它继承自`InheritedWidget`：
```dart
// 一个通用的InheritedWidget，保存任需要跨组件共享的状态
class InheritedProvider<T> extends InheritedWidget {
  InheritedProvider({@required this.data, Widget child}) : super(child: child);

  //共享状态使用泛型
  final T data;

  @override
  bool updateShouldNotify(InheritedProvider<T> old) {
    //在此简单返回true，则每次更新都会调用依赖其的子孙节点的`didChangeDependencies`。
    return true;
  }
}
```
数据保存的地方有了，那么接下来我们需要做的就是在数据发生变化的时候来重新构建InheritedProvider，那么现在就面临两个问题：

- 数据发生变化怎么通知？
- 谁来重新构建InheritedProvider？  

第一个问题其实很好解决，我们当然可以使用之前介绍的eventBus来进行事件通知，但是为了更贴近Flutter开发，我们使用Flutter中SDK中提供的`ChangeNotifier`类 ，它继承自`Listenable`，也实现了一个Flutter风格的发布者-订阅者模式，`ChangeNotifier`定义大致如下：
```dart
class ChangeNotifier implements Listenable {

  @override
  void addListener(VoidCallback listener) {
     //添加监听器
  }
  @override
  void removeListener(VoidCallback listener) {
    //移除监听器
  }

  void notifyListeners() {
    //通知所有监听器，触发监听器回调   
  }

  ... //省略无关代码
}
```
我们可以通过调用`addListener()`和`removeListener()`来添加、移除监听器（订阅者）；通过调用`notifyListeners() `可以触发所有监听器回调。  

现在，我们将要共享的状态放到一个`Model`类中，然后让它继承自`ChangeNotifier`，这样当共享的状态改变时，我们只需要调用`notifyListeners()` 来通知订阅者，然后由订阅者来重新构建`InheritedProvider`，这也是第二个问题的答案！接下来我们便实现这个订阅者类：
```dart
// 该方法用于在Dart中获取模板类型
Type _typeOf<T>() => T;

class ChangeNotifierProvider<T extends ChangeNotifier> extends StatefulWidget {
  ChangeNotifierProvider({
    Key key,
    this.data,
    this.child,
  });

  final Widget child;
  final T data;

  //定义一个便捷方法，方便子树中的widget获取共享数据
  static T of<T>(BuildContext context) {
    final type = _typeOf<InheritedProvider<T>>();
    final provider =  context.inheritFromWidgetOfExactType(type) as InheritedProvider<T>；
    return provider.data;
  }

  @override
  _ChangeNotifierProviderState<T> createState() => _ChangeNotifierProviderState<T>();
}
```
该类继承`StatefulWidget`，然后定义了一个`of()`静态方法供子类方便获取`Widget`树中的`InheritedProvider`中保存的共享状态`(model)`，下面我们实现该类对应的`_ChangeNotifierProviderState`类：
```dart
class _ChangeNotifierProviderState<T extends ChangeNotifier> extends State<ChangeNotifierProvider<T>> {
  void update() {
    //如果数据发生变化（model类调用了notifyListeners），重新构建InheritedProvider
    setState(() => {});
  }

  @override
  void didUpdateWidget(ChangeNotifierProvider<T> oldWidget) {
    //当Provider更新时，如果新旧数据不"=="，则解绑旧数据监听，同时添加新数据监听
    if (widget.data != oldWidget.data) {
      oldWidget.data.removeListener(update);
      widget.data.addListener(update);
    }
    super.didUpdateWidget(oldWidget);
  }

  @override
  void initState() {
    // 给model添加监听器
    widget.data.addListener(update);
    super.initState();
  }

  @override
  void dispose() {
    // 移除model的监听器
    widget.data.removeListener(update);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return InheritedProvider<T>(
      data: widget.data,
      child: widget.child,
    );
  }
}
```
可以看到`_ChangeNotifierProviderState`类的主要作用就是监听到共享状态（model）改变时重新构建Widget树。注意，在`_ChangeNotifierProviderState`类中调用`setState()`方法，`widget.child`始终是同一个，所以执行`build`时，`InheritedProvider`的`child`引用的始终是同一个子`widget`，所以`widget.child`并不会重新`build`，这也就相当于对`child`进行了缓存！当然如果`ChangeNotifierProvider`父级`Widget`重新`build`时，则其传入的child便有可能会发生变化。  

现在我们所需要的各个工具类都已完成，下面我们通过一个购物车的例子来看看怎么使用上面的这些类。
### 购物车示例
我们需要实现一个显示购物车中所有商品总价的功能：  

向购物车中添加新商品时总价更新
定义一个Item类，用于表示商品信息：
```dart
class Item {
  Item(this.price, this.count);
  double price; //商品单价
  int count; // 商品份数
  //... 省略其它属性
}
```
定义一个保存购物车内商品数据的CartModel类:
```dart
class CartModel extends ChangeNotifier {
  // 用于保存购物车中商品列表
  final List<Item> _items = [];

  // 禁止改变购物车里的商品信息
  UnmodifiableListView<Item> get items => UnmodifiableListView(_items);

  // 购物车中商品的总价
  double get totalPrice =>
      _items.fold(0, (value, item) => value + item.count * item.price);

  // 将 [item] 添加到购物车。这是唯一一种能从外部改变购物车的方法。
  void add(Item item) {
    _items.add(item);
    // 通知监听器（订阅者），重新构建InheritedProvider， 更新状态。
    notifyListeners();
  }
}
```
`CartModel`即要跨组件共享的`model`类。最后我们构建示例页面：
```dart
class ProviderRoute extends StatefulWidget {
  @override
  _ProviderRouteState createState() => _ProviderRouteState();
}

class _ProviderRouteState extends State<ProviderRoute> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ChangeNotifierProvider<CartModel>(
        data: CartModel(),
        child: Builder(builder: (context) {
          return Column(
            children: <Widget>[
              Builder(builder: (context){
                var cart=ChangeNotifierProvider.of<CartModel>(context);
                return Text("总价: ${cart.totalPrice}");
              }),
              Builder(builder: (context){
                print("RaisedButton build"); //在后面优化部分会用到
                return RaisedButton(
                  child: Text("添加商品"),
                  onPressed: () {
                    //给购物车中添加商品，添加后总价会更新
                    ChangeNotifierProvider.of<CartModel>(context).add(Item(20.0, 1));
                  },
                );
              }),
            ],
          );
        }),
      ),
    );
  }
}
```

##  颜色和主题
### 颜色
在介绍主题前我们先了解一些Flutter中的`Color`类。Color类中颜色以一个int值保存，我们知道显示器颜色是由红、绿、蓝三基色组成，每种颜色占8比特，存储结构如下：

| Bit（位） |	颜色 |
| :---: | :---: |
| 0-7 |	蓝色 |
| 8-15 |	绿色 |
| 16-23 |	红色 |
| 24-31 |	Alpha (不透明度) |
上面表格中的的字段在Color类中都有对应的属性，而Color中的众多方法也就是操作这些属性的，由于大多比较简单，读者可以查看类定义了解。在此我们主要讨论两点：色值转换和亮度。

### 如何将颜色字符串转成Color对象
如Web开发中的色值通常是一个字符串如`"#dc380d"`，它是一个RGB值，我们可以通过下面这些方法将其转为Color类：
```dart
Color(0xffdc380d); //如果颜色固定可以直接使用整数值
//颜色是一个字符串变量
var c = "dc380d";
Color(int.parse(c,radix:16)|0xFF000000) //通过位运算符将Alpha设置为FF
Color(int.parse(c,radix:16)).withAlpha(255)  //通过方法将Alpha设置为FF
```
### 颜色亮度
假如，我们要实现一个背景颜色和Title可以自定义的导航栏，并且背景色为深色时我们应该让Title显示为浅色；背景色为浅色时，Title显示为深色。要实现这个功能，我们就需要来计算背景色的亮度，然后动态来确定Title的颜色。`Color`类中提供了一个`computeLuminance()`方法，它可以返回一个[0-1]的一个值，数字越大颜色就越浅，我们可以根据它来动态确定Title的颜色，下面是导航栏NavBar的简单实现：
```dart
class NavBar extends StatelessWidget {
  final String title;
  final Color color; //背景颜色

  NavBar({
    Key key,
    this.color,
    this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        minHeight: 52,
        minWidth: double.infinity,
      ),
      decoration: BoxDecoration(
        color: color,
        boxShadow: [
          //阴影
          BoxShadow(
            color: Colors.black26,
            offset: Offset(0, 3),
            blurRadius: 3,
          ),
        ],
      ),
      child: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          //根据背景色亮度来确定Title颜色
          color: color.computeLuminance() < 0.5 ? Colors.white : Colors.black,
        ),
      ),
      alignment: Alignment.center,
    );
  }
}
```
### MaterialColor
`MaterialColor`是实现`Material Design`中的颜色的类，它包含一种颜色的10个级别的渐变色。MaterialColor通过"[]"运算符的索引值来代表颜色的深度，有效的索引有：50，100，200，…，900，数字越大，颜色越深。MaterialColor的默认值为索引等于500的颜色。举个例子，Colors.blue是预定义的一个MaterialColor类对象，定义如下：
```dart
static const MaterialColor blue = MaterialColor(
  _bluePrimaryValue,
  <int, Color>{
     50: Color(0xFFE3F2FD),
    100: Color(0xFFBBDEFB),
    200: Color(0xFF90CAF9),
    300: Color(0xFF64B5F6),
    400: Color(0xFF42A5F5),
    500: Color(_bluePrimaryValue),
    600: Color(0xFF1E88E5),
    700: Color(0xFF1976D2),
    800: Color(0xFF1565C0),
    900: Color(0xFF0D47A1),
  },
);
static const int _bluePrimaryValue = 0xFF2196F3;
```
`Colors.blue[50]到Colors.blue[100]`的色值从浅蓝到深蓝渐变，

### Theme
Theme组件可以为`Material APP`定义主题数据（ThemeData）。Material组件库里很多组件都使用了主题数据，如导航栏颜色、标题字体、Icon样式等。Theme内会使用InheritedWidget来为其子树共享样式数据。

#### ThemeData
`ThemeData`用于保存是Material 组件库的主题数据，Material组件需要遵守相应的设计规范，而这些规范可自定义部分都定义在`ThemeData`中了，所以我们可以通过`ThemeData`来自定义应用主题。在子组件中，我们可以通过`Theme.of`方法来获取当前的`ThemeData`。

注意：`Material Design` 设计规范中有些是不能自定义的，如导航栏高度，ThemeData只包含了可自定义部分。

我们看看ThemeData部分数据定义：
```dart
ThemeData({
  Brightness brightness, //深色还是浅色
  MaterialColor primarySwatch, //主题颜色样本，见下面介绍
  Color primaryColor, //主色，决定导航栏颜色
  Color accentColor, //次级色，决定大多数Widget的颜色，如进度条、开关等。
  Color cardColor, //卡片颜色
  Color dividerColor, //分割线颜色
  ButtonThemeData buttonTheme, //按钮主题
  Color cursorColor, //输入框光标颜色
  Color dialogBackgroundColor,//对话框背景颜色
  String fontFamily, //文字字体
  TextTheme textTheme,// 字体主题，包括标题、body等文字样式
  IconThemeData iconTheme, // Icon的默认样式
  TargetPlatform platform, //指定平台，应用特定平台控件风格
  ...
})
```
上面只是ThemeData的一小部分属性，完整的数据定义读者可以查看SDK。上面属性中需要说明的是`primarySwatch`，它是主题颜色的一个"样本色"，通过这个样本色可以在一些条件下生成一些其它的属性，例如，如果没有指定`primaryColor`，并且当前主题不是深色主题，那么`primaryColor`就会默认为`primarySwatch`指定的颜色，还有一些相似的属性如`accentColor` 、`indicatorColor`等也会受primarySwatch影响。

#### 示例
我们实现一个路由换肤功能：
```dart
class ThemeTestRoute extends StatefulWidget {
  @override
  _ThemeTestRouteState createState() => new _ThemeTestRouteState();
}

class _ThemeTestRouteState extends State<ThemeTestRoute> {
  Color _themeColor = Colors.teal; //当前路由主题色

  @override
  Widget build(BuildContext context) {
    ThemeData themeData = Theme.of(context);
    return Theme(
      data: ThemeData(
          primarySwatch: _themeColor, //用于导航栏、FloatingActionButton的背景色等
          iconTheme: IconThemeData(color: _themeColor) //用于Icon颜色
      ),
      child: Scaffold(
        appBar: AppBar(title: Text("主题测试")),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            //第一行Icon使用主题中的iconTheme
            Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.favorite),
                  Icon(Icons.airport_shuttle),
                  Text("  颜色跟随主题")
                ]
            ),
            //为第二行Icon自定义颜色（固定为黑色)
            Theme(
              data: themeData.copyWith(
                iconTheme: themeData.iconTheme.copyWith(
                    color: Colors.black
                ),
              ),
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Icon(Icons.favorite),
                    Icon(Icons.airport_shuttle),
                    Text("  颜色固定黑色")
                  ]
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
            onPressed: () =>  //切换主题
                setState(() =>
                _themeColor =
                _themeColor == Colors.teal ? Colors.blue : Colors.teal
                ),
            child: Icon(Icons.palette)
        ),
      ),
    );
  }
}
```
