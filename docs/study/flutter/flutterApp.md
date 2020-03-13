# Flutter - 第一个应用
搭建环境什么的 就不写了也踩很多坑 忘记录了 现在忘了
## 计数器应用示例
用Android Studio和VS Code创建的Flutter应用模板默认是一个简单的计数器示例。
### 创建Flutter应用模板 
通过Android Studio或VS Code创建一个新的Flutter工程，命名为"first_flutter_app"。创建好后，就会得到一个计数器应用的Demo。  
在这个示例中，主要Dart代码是在 lib/main.dart 文件中，下面是它的源码：
```dart
import 'package:flutter/material.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Flutter Demo',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title),
      ),
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            new Text(
              'You have pushed the button this many times:',
            ),
            new Text(
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: new Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
```
### 分析
 - 导入包。  
 ```dart
import 'package:flutter/material.dart';
```
此行代码作用是导入了`Material` UI组件库。Material是一种标准的移动端和web端的视觉设计语言， Flutter默认提供了一套丰富的Material风格的UI组件。
 - 应用入口.
 ```dart
 void main() => runApp(MyApp());
 ```
1. 与C/C++、Java类似，Flutter 应用中main函数为应用程序的入口。main函数中调用了runApp 方法，它的功能是启动Flutter应用。runApp它接受一个Widget参数，在本示例中它是一个MyApp对象，`MyApp()`是Flutter应用的根组件。  
2. main函数使用了(=>)符号，这是Dart中单行函数或方法的简写。
- 应用结构
```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      //应用名称  
      title: 'Flutter Demo', 
      theme: new ThemeData(
        //蓝色主题  
        primarySwatch: Colors.blue,
      ),
      //应用首页路由  
      home: new MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
```
1. MyApp类代表Flutter应用，它继承了 StatelessWidget类，这也就意味着应用本身也是一个widget。
2. 在Flutter中，大多数东西都是widget（后同“组件”或“部件”），包括对齐(alignment)、填充(padding)和布局(layout)等，它们都是以widget的形式提供。
3. Flutter在构建页面时，会调用组件的build方法，widget的主要工作是提供一个`build()`方法来描述如何构建UI界面（通常是通过组合、拼装其它基础widget）。
4. `MaterialApp` 是Material库中提供的Flutter APP框架，通过它可以设置应用的名称、主题、语言、首页及路由列表等。MaterialApp也是一个widget。
5. home 为Flutter应用的首页，它也是一个widget。
- 首页
```dart
class MyHomePage extends StatefulWidget {
    MyHomePage({Key key, this.title}) : super(key: key);
    final String title;
    @override
    _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
...
}
```
**MyHomePage** 是Flutter应用的首页，它继承自StatefulWidget类，表示它是一个有状态的组件（Stateful widget）。现在我们只需简单认为有状态的组件（Stateful widget） 和无状态的组件（Stateless widget）有两点不同：
1. `Stateful widget`可以拥有状态，这些状态在widget生命周期中是可以变的，而Stateless widget是不可变的。
2. Stateful widget至少由两个类组成：
    - 一个StatefulWidget类。
    - 一个 State类； StatefulWidget类本身是不变的，但是State类中持有的状态在widget生命周期中可能会发生变化。 

` _MyHomePageState`类是MyHomePage类对应的状态类。看到这里，读者可能已经发现：和MyApp 类不同， MyHomePage类中并没有build方法，取而代之的是，build方法被挪到了_MyHomePageState方法中，至于为什么这么做，先留个疑问，在分析完完整代码后再来解答。
### State类
接下来，我们看看_MyHomePageState中都包含哪些东西：
1. 该组件的状态。由于我们只需要维护一个点击次数计数器，所以定义一个_counter状态：
```dart
int _counter = 0; //用于记录按钮点击的总次数
//_counter 为保存屏幕右下角带“+”号按钮点击次数的状态。
```
2. 设置状态的自增函数。
```dart
void _incrementCounter() {
  setState(() {
     _counter++;
  });
}
```
当按钮点击时，会调用此函数，该函数的作用是先自增_counter，然后调用setState 方法。setState方法的作用是通知Flutter框架，有状态发生了改变，Flutter框架收到通知后，会执行build方法来根据新的状态重新构建界面， Flutter 对此方法做了优化，使重新执行变的很快，所以你可以重新构建任何需要更新的东西，而无需分别去修改各个widget。  
3. 构建UI界面
构建UI界面的逻辑在build方法中，当MyHomePage第一次创建时，`_MyHomePageState`类会被创建，当初始化完成后，Flutter框架会调用Widget的build方法来构建widget树，最终将widget树渲染到设备屏幕上。所以，我们看看_MyHomePageState的build方法中都干了什么事：
```dart
Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
            title: new Text(widget.title),
        ),
        body: new Center(
            child: new Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                    new Text(
                        'You have pushed the button this many times:',
                    ),
                    new Text(
                        '$_counter',
                        style: Theme.of(context).textTheme.display1,
                    ),
                ],
            ),
        ),
        floatingActionButton: new FloatingActionButton(
            onPressed: _incrementCounter,
            tooltip: 'Increment',
            child: new Icon(Icons.add),
        ),
    );
}
```
- `Scaffold` 是 Material 库中提供的页面脚手架，它提供了默认的导航栏、标题和包含主屏幕widget树（后同“组件树”或“部件树”）的body属性，
- `body`的组件树中包含了一个Center 组件，Center 可以将其子组件树对齐到屏幕中心。此例中， Center 子组件是一个Column 组件，Column的作用是将其所有子组件沿屏幕垂直方向依次排列； 此例中Column子组件是两个 Text，第一个Text 显示固定文本 “You have pushed the button this many times:”，第二个Text 显示_counter状态的数值。
- `floatingActionButton`是页面右下角的带“+”的悬浮按钮，它的onPressed属性接受一个回调函数，代表它被点击后的处理器，本例中直接将_incrementCounter方法作为其处理函数。  
现在，我们将整个计数器执行流程串起来：当右下角的floatingActionButton按钮被点击之后，会调用`_incrementCounter`方法。在`_incrementCounter`方法中，首先会自增`_counter`计数器（状态），然后setState会通知Flutter框架状态发生变化，接着，Flutter框架会调用build方法以新的状态重新构建UI，最终显示在设备屏幕上。
### 为什么要将build方法放在State中，而不是放在StatefulWidget中？
现在，我们回答之前提出的问题，为什么`build()`方法放在State（而不是StatefulWidget）中 ？这主要是为了提高开发的灵活性。如果将build()方法放在StatefulWidget中则会有两个问题：
- 状态访问不便  
试想一下，如果我们的`StatefulWidget`有很多状态，而每次状态改变都要调用build方法，所以状态是保存在State中的，如果build方法在StatefulWidget中，那么build方法和状态分别在两个类中，那么构建时读取状态将会很不方便！试想一下，如果真的将build方法放在StatefulWidget中的话，由于构建用户界面过程需要依赖State，所以build方法将必须加一个State参数，大概是下面这样：
```dart
Widget build(BuildContext context, State state){
    //state.counter
    ...
}
``` 
这样的话就只能将State的所有状态声明为公开的状态，这样才能在State类外部访问状态！但是，将状态设置为公开后，状态将不再具有私密性，这就会导致对状态的修改将会变的不可控。但如果将build()方法放在State中的话，构建过程不仅可以直接访问状态，而且也无需公开私有状态，这会非常方便。
- 继承StatefulWidget不便  
例如，Flutter中有一个动画widget的基类`AnimatedWidget`，它继承自StatefulWidget类。AnimatedWidget中引入了一个抽象方法build(BuildContext context)，继承自AnimatedWidget的动画widget都要实现这个build方法。现在设想一下，如果StatefulWidget 类中已经有了一个build方法，正如上面所述，此时build方法需要接收一个state对象，这就意味着AnimatedWidget必须将自己的State对象(记为_animatedWidgetState)提供给其子类，因为子类需要在其build方法中调用父类的build方法，代码可能如下：
```dart
class MyAnimationWidget extends AnimatedWidget{
    @override
    Widget build(BuildContext context, State state){
      //由于子类要用到AnimatedWidget的状态对象_animatedWidgetState，
      //所以AnimatedWidget必须通过某种方式将其状态对象_animatedWidgetState
      //暴露给其子类   
      super.build(context, _animatedWidgetState)
    }
}
```
这样很显然是不合理的，因为

1. AnimatedWidget的状态对象是AnimatedWidget内部实现细节，不应该暴露给外部。
2. 如果要将父类状态暴露给子类，那么必须得有一种传递机制，而做这一套传递机制是无意义的，因为父子类之间状态的传递和子类本身逻辑是无关的。  
综上所述，可以发现，对于StatefulWidget，将build方法放在State中，可以给开发带来很大的灵活性。
##  路由管理
路由(Route)在移动开发中通常指页面（Page），这跟web开发中单页应用的Route概念意义是相同的，Route在Android中通常指一个Activity，在iOS中指一个ViewController。所谓路由管理，就是管理页面之间如何跳转，通常也可被称为导航管理。Flutter中的路由管理和原生开发类似，无论是Android还是iOS，导航管理都会维护一个路由栈，路由入栈(push)操作对应打开一个新页面，路由出栈(pop)操作对应页面关闭操作，而路由管理主要是指如何来管理路由栈。
### 一个简单示例
1. 创建一个新路由，命名“NewRoute”
```dart
class NewRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("New route"),
      ),
      body: Center(
        child: Text("This is new route"),
      ),
    );
  }
}
```
新路由继承自StatelessWidget，界面很简单，在页面中间显示一句"This is new route"。
2. 在_MyHomePageState.build方法中的Column的子widget中添加一个按钮（FlatButton） :
```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: <Widget>[
  ... //省略无关代码
  FlatButton(
    child: Text("open new route"),
    textColor: Colors.blue,
    onPressed: () {
    //导航到新路由   
    Navigator.push( context,
      MaterialPageRoute(builder: (context) {
        return NewRoute();
      }));
    },
    ),
  ],
)
```
我们添加了一个打开新路由的按钮，并将按钮文字颜色设置为蓝色，点击该按钮后就会打开新的路由页面
### MaterialPageRoute
`MaterialPageRoute`继承自PageRoute类，`PageRoute`类是一个抽象类，表示占有整个屏幕空间的一个模态路由页面，它还定义了路由构建及切换时过渡动画的相关接口及属性。`MaterialPageRoute` 是Material组件库提供的组件，它可以针对不同平台，实现与平台页面切换动画风格一致的路由切换动画：  
下面我们介绍一下`MaterialPageRoute `构造函数的各个参数的意义：
```dart
MaterialPageRoute({
  WidgetBuilder builder,
  RouteSettings settings,
  bool maintainState = true,
  bool fullscreenDialog = false,
})
```
- builder: 是一个`WidgetBuilder`类型的回调函数，它的作用是构建路由页面的具体内容，返回值是一个widget。我们通常要实现此回调，返回新路由的实例。
- settings: 包含路由的配置信息，如路由名称、是否初始路由（首页）。
- maintainState：默认情况下，当入栈一个新路由时，原来的路由仍然会被保存在内存中，如果想在路由没用的时候释放其所占用的所有资源，可以设置maintainState为`false`。
- fullscreenDialog: 表示新的路由页面是否是一个全屏的模态对话框，在iOS中，如果fullscreenDialog为true，新页面将会从屏幕底部滑入（而不是水平方向）。
>如果想自定义路由切换动画，可以自己继承PageRoute来实现，我们将在后面介绍动画时，实现一个自定义的路由组件。
### Navigator
Navigator是一个路由管理的组件，它提供了打开和退出路由页方法。Navigator通过一个栈来管理活动路由集合。通常当前屏幕显示的页面就是栈顶的路由。Navigator提供了一系列方法来管理路由栈，在此我们只介绍其最常用的两个方法：
- **Future push(BuildContext context, Route route)**   
将给定的路由入栈（即打开新的页面），返回值是一个Future对象，用以接收新路由出栈（即关闭）时的返回数据。
- **bool pop(BuildContext context, [ result ])**  
将栈顶路由出栈，result为页面关闭时返回给上一个页面的数据。
- **实例方法**  
`Navigator`类中第一个参数为`context`的**静态方法**都对应一个Navigator的**实例方法**， 比如`Navigator.push(BuildContext context, Route route)`等价于`Navigator.of(context).push(Route route)` ，下面命名路由相关的方法也是一样的。
### 路由传值
很多时候，在路由跳转时我们需要带一些参数，比如打开商品详情页时，我们需要带一个商品id，这样商品详情页才知道展示哪个商品信息；又比如我们在填写订单时需要选择收货地址，打开地址选择页并选择地址后，可以将用户选择的地址返回到订单页等等。下面我们通过一个简单的示例来演示新旧路由如何传参。  
我们创建一个`TipRoute`路由，它接受一个提示文本参数，负责将传入它的文本显示在页面上，另外`TipRoute`中我们添加一个“返回”按钮，点击后在返回上一个路由的同时会带上一个返回参数，下面我们看一下实现代码。
```dart
class TipRoute extends StatelessWidget {
  TipRoute({
    Key key,
    @required this.text,  // 接收一个text参数
  }) : super(key: key);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("提示"),
      ),
      body: Padding(
        padding: EdgeInsets.all(18),
        child: Center(
          child: Column(
            children: <Widget>[
              Text(text),
              RaisedButton(
                onPressed: () => Navigator.pop(context, "我是返回值"),
                child: Text("返回"),
              )
            ],
          ),
        ),
      ),
    );
  }
}

//下面是打开新路由TipRoute的代码：

class RouterTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: RaisedButton(
        onPressed: () async {
          // 打开`TipRoute`，并等待返回结果
          var result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) {
                return TipRoute(
                  // 路由参数
                  text: "我是提示xxxx",
                );
              },
            ),
          );
          //输出`TipRoute`路由返回结果
          print("路由返回值: $result");
        },
        child: Text("打开提示页"),
      ),
    );
  }
}
```
1. 提示文案“我是提示xxxx”是通过`TipRoute`的text参数传递给新路由页的。我们可以通过等待`Navigator.push(…)`返回的Future来获取新路由的返回数据。  
2. 在`TipRoute`页中有两种方式可以返回到上一页；第一种方式时直接点击导航栏返回箭头，第二种方式是点击页面中的“返回”按钮。这两种返回方式的区别是前者不会返回数据给上一个路由，而后者会。下面是分别点击页面中的返回按钮和导航栏返回箭头后，RouterTestRoute页中print方法在控制台输出的内容：  
```
I/flutter (15164): 路由返回值: 我是返回值
I/flutter (15164): 路由返回值: null
```
上面介绍的是非命名路由的传值方式，命名路由的传值方式会有所不同，
### 命名路由
所谓“命名路由”（Named Route）即有名字的路由，我们可以先给路由起一个名字，然后就可以通过路由名字直接打开新的路由了，这为路由管理带来了一种直观、简单的方式。
- **路由表**   
要想使用命名路由，我们必须先提供并注册一个路由表（`routing table`），这样应用程序才知道哪个名字与哪个路由组件相对应。其实注册路由表就是给路由起名字，路由表的定义如下：  
`Map<String, WidgetBuilder> routes;`  
它是一个Map，`key`为路由的名字，是个字符串；`value`是个builder回调函数，用于生成相应的路由widget。我们在通过路由名字打开新路由时，应用会根据路由名字在路由表中查找到对应的WidgetBuilder回调函数，然后调用该回调函数生成路由widget并返回。
- **注册路由表**  
路由表的注册方式很简单，我们回到之前“计数器”的示例，然后在MyApp类的build方法中找到MaterialApp，添加routes属性，代码如下：
```dart
MaterialApp(
  title: 'Flutter Demo',
  theme: ThemeData(
    primarySwatch: Colors.blue,
  ),
  //注册路由表
  routes:{
   "new_page":(context) => NewRoute(),
    ... // 省略其它路由注册信息
  } ,
  home: MyHomePage(title: 'Flutter Demo Home Page'),
);
```
现在我们就完成了路由表的注册。上面的代码中home路由并没有使用命名路由，如果我们也想将home注册为命名路由应该怎么做呢？其实很简单，直接看代码：
```dart
MaterialApp(
  title: 'Flutter Demo',
  initialRoute:"/", //名为"/"的路由作为应用的home(首页)
  theme: ThemeData(
    primarySwatch: Colors.blue,
  ),
  //注册路由表
  routes:{
   "new_page":(context) => NewRoute(),
   "/":(context) => MyHomePage(title: 'Flutter Demo Home Page'), //注册首页路由
  } 
);
```
可以看到，我们只需在路由表中注册一下`MyHomePage`路由，然后将其名字作为`MaterialApp`的`initialRoute`属性值即可，该属性决定应用的初始路由页是哪一个命名路由
- **通过路由名打开新路由页**  
要通过路由名称来打开新路由，可以使用Navigator 的pushNamed方法：
```dart
Future pushNamed(BuildContext context, String routeName,{Object arguments})
```
Navigator 除了`pushNamed`方法，还有`pushReplacementNamed`等其他管理命名路由的方法。接下来我们通过路由名来打开新的路由页，修改FlatButton的onPressed回调代码，改为：
```dart
onPressed: () {
  Navigator.pushNamed(context, "new_page");
  //Navigator.push(context,
  //  MaterialPageRoute(builder: (context) {
  //  return NewRoute();
  //}));  
},
```
热重载应用，再次点击“`open new route`”按钮，依然可以打开新的路由页。

- **命名路由参数传递**  
在Flutter最初的版本中，命名路由是不能传递参数的，后来才支持了参数；下面展示命名路由如何传递并获取路由参数：

我们先注册一个路由：
```dart
 routes:{
   "new_page":(context) => EchoRoute(),
  } ,
//在路由页通过RouteSetting对象获取路由参数：

class EchoRoute extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    //获取路由参数  
    var args=ModalRoute.of(context).settings.arguments;
    //...省略无关代码
  }
}
//在打开路由时传递参数

Navigator.of(context).pushNamed("new_page", arguments: "hi");
```
- **适配**  
假设我们也想将上面路由传参示例中的TipRoute路由页注册到路由表中，以便也可以通过路由名来打开它。但是，由于TipRoute接受一个text 参数，我们如何在不改变TipRoute源码的前提下适配这种情况？其实很简单：
```dart
MaterialApp(
  ... //省略无关代码
  routes: {
   "tip2": (context){
     return TipRoute(text: ModalRoute.of(context).settings.arguments);
   },
 }, 
);
```
### 路由生成钩子
假设我们要开发一个电商APP，当用户没有登录时可以看店铺、商品等信息，但交易记录、购物车、用户个人信息等页面需要登录后才能看。为了实现上述功能，我们需要在打开每一个路由页前判断用户登录状态！如果每次打开路由前我们都需要去判断一下将会非常麻烦，那有什么更好的办法吗？答案是有！  
`MaterialApp`有一个`onGenerateRoute`属性，它在打开命名路由时可能会被调用，之所以说可能，是因为当调用`Navigator.pushNamed(...)`打开命名路由时，如果指定的路由名在路由表中已注册，则会调用路由表中的builder函数来生成路由组件；如果路由表中没有注册，才会调用`onGenerateRoute`来生成路由。`onGenerateRoute`回调签名如下：
```dart
Route<dynamic> Function(RouteSettings settings)
```
有了`onGenerateRoute`回调，要实现上面控制页面权限的功能就非常容易：我们放弃使用路由表，取而代之的是提供一个`onGenerateRoute`回调，然后在该回调中进行统一的权限控制，如：
```dart
MaterialApp(
  ... //省略无关代码
  onGenerateRoute:(RouteSettings settings){
      return MaterialPageRoute(builder: (context){
           String routeName = settings.name;
       // 如果访问的路由页需要登录，但当前未登录，则直接返回登录页路由，
       // 引导用户登录；其它情况则正常打开路由。
     }
   );
  }
);
```
>注意，onGenerateRoute只会对命名路由生效。

### 总结
Flutter中路由管理、传参的方式，然后又着重介绍了命名路由相关内容。在此需要说明一点，由于命名路由只是一种可选的路由管理方式，在实际开发中，读者可能心中会犹豫到底使用哪种路由管理方式。建议读者最好统一使用命名路由的管理方式，这将会带来如下好处：
- 1. 语义化更明确。
- 2. 代码更好维护；如果使用匿名路由，则必须在调用Navigator.push的地方创建新路由页，这样不仅需要import新路由页的dart文件，而且这样的代码将会非常分散。
- 3. 可以通过onGenerateRoute做一些全局的路由跳转前置处理逻辑。
## 包管理
在软件开发中，很多时候有一些公共的库或SDK可能会被很多项目用到，因此，将这些代码单独抽到一个独立模块，然后哪个项目需要使用时再直接集成这个模块，便可大大提高开发效率。很多编程语言或开发工具都支持这种“模块共享”机制，如Java语言中这种独立模块会被打成一个jar包，Android中的aar包，Web开发中的npm包等。为了方便表述，我们将这种可共享的独立模块统一称为“包”（ Package）。
  
一个APP在实际开发中往往会依赖很多包，而这些包通常都有交叉依赖关系、版本依赖等，如果由开发者手动来管理应用中的依赖包将会非常麻烦。因此，各种开发生态或编程语言官方通常都会提供一些包管理工具，比如在Android提供了Gradle来管理依赖，iOS用Cocoapods或Carthage来管理依赖，Node中通过npm等。而在Flutter开发中也有自己的包管理工具。本节我们主要介绍一下flutter如何使用配置文件`pubspec.yaml`（位于项目根目录）来管理第三方依赖包。  

`YAML`是一种直观、可读性高并且容易被人类阅读的文件格式，它和xml或Json相比，它语法简单并非常容易解析，所以YAML常用于配置文件，Flutter也是用yaml文件作为其配置文件。Flutter项目默认的配置文件是pubspec.yaml，我们看一个简单的示例：
```yaml
name: flutter_in_action
description: First Flutter application.

version: 1.0.0+1

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^0.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
```
下面，我们逐一解释一下各个字段的意义：

- name：应用或包名称。
- description: 应用或包的描述、简介。
- version：应用或包的版本号。
- dependencies：应用或包依赖的其它包或插件。
- dev_dependencies：开发环境依赖的工具包（而不是flutter应用本身依赖的包）。
- flutter：flutter相关的配置选项。  
如果我们的Flutter应用本身依赖某个包，我们需要将所依赖的包添加到dependencies 下，接下来我们通过一个例子来演示一下如何添加、下载并使用第三方包。
### Pub仓库
[Pub](https://pub.dev/)是Google官方的Dart Packages仓库，类似于node中的npm仓库，android中的jcenter。我们可以在Pub上面查找我们需要的包和插件，也可以向Pub发布我们的包和插件。

### 示例
接下来，我们实现一个显示随机字符串的widget。有一个名为“english_words”的开源软件包，其中包含数千个常用的英文单词以及一些实用功能。我们首先在pub上找到english_words这个包，确定其最新的版本号和是否支持Flutter。
1. 将“english_words”（3.1.3版本）添加到依赖项列表，如下：
```yaml
dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^0.1.0
  # 新添加的依赖
  english_words: ^3.1.3
 ``` 
 2. 下载包。  
 在控制台，定位到当前工程目录，然后手动运行`flutter packages get `命令来下载依赖包。  
 另外，需要注意`dependencies`和`dev_dependencies`的区别，前者的依赖包将作为APP的源码的一部分参与编译，生成最终的安装包。而后者的依赖包只是作为开发阶段的一些工具包，主要是用于帮助我们提高开发、测试效率，比如flutter的自动化测试包等。
 3. 引入english_words包。  
 `import 'package:english_words/english_words.dart';`
 4. 使用english_words包来生成随机字符串。
```dart
class RandomWordsWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
   // 生成随机字符串
    final wordPair = new WordPair.random();
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: new Text(wordPair.toString()),
    );
  }
}
//我们将RandomWordsWidget 添加到 _MyHomePageState.build 的Column的子widget中。

Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: <Widget>[
    ... //省略无关代码
    RandomWordsWidget(),
  ],
)
```
### 其它依赖方式
上文所述的依赖方式是依赖Pub仓库的。但我们还可以依赖本地包和git仓库。
依赖本地包

如果我们正在本地开发一个包，包名为pkg1，我们可以通过下面方式依赖：
```yaml
dependencies:
    pkg1:
        path: ../../code/pkg1
#路径可以是相对的，也可以是绝对的。

#依赖Git：你也可以依赖存储在Git仓库中的包。如果软件包位于仓库的根目录中，请使用以下语法

dependencies:
  pkg1:
    git:
      url: git://github.com/xxx/pkg1.git
#上面假定包位于Git存储库的根目录中。如果不是这种情况，可以使用path参数指定相对位置，例如：

dependencies:
  package1:
    git:
      url: git://github.com/flutter/packages.git
      path: packages/package1
```
## 资源管理
Flutter APP安装包中会包含代码和 assets（资源）两部分。Assets是会打包到程序安装包中的，可在运行时访问。常见类型的assets包括静态数据（例如JSON文件）、配置文件、图标和图片（JPEG，WebP，GIF，动画WebP / GIF，PNG，BMP和WBMP）等。
### 指定 assets
和包管理一样，Flutter也使用pubspec.yaml文件来管理应用程序所需的资源，举个例子:
```yaml
flutter:
  assets:
    - assets/my_icon.png
    - assets/background.png
```    
`assets`指定应包含在应用程序中的文件， 每个asset都通过相对于`pubspec.yaml`文件所在的文件系统路径来标识自身的路径。asset的声明顺序是无关紧要的，asset的实际目录可以是任意文件夹（在本示例中是assets文件夹）。  

在构建期间，Flutter将asset放置到称为 asset bundle 的特殊存档中，应用程序可以在运行时读取它们（但不能修改）。
### Asset 变体（variant）
构建过程支持“asset变体”的概念：不同版本的asset可能会显示在不同的上下文中。 在`pubspec.yaml`的assets部分中指定asset路径时，构建过程中，会在相邻子目录中查找具有相同名称的任何文件。这些文件随后会与指定的asset一起被包含在asset bundle中。  

例如，如果应用程序目录中有以下文件:

- …/pubspec.yaml
- …/graphics/my_icon.png
- …/graphics/background.png
- …/graphics/dark/background.png
- …etc.
然后pubspec.yaml文件中只需包含:
```yaml
flutter:
  assets:
    - graphics/background.png
```
那么这两个`graphics/background.png`和`graphics/dark/background.png `都将包含在您的asset bundle中。前者被认为是main asset （主资源），后者被认为是一种变体（variant）。

在选择匹配当前设备分辨率的图片时，Flutter会使用到asset变体（见下文），将来，Flutter可能会将这种机制扩展到本地化、阅读提示等方面。
### 加载 assets
您的应用可以通过`AssetBundle`对象访问其asset 。有两种主要方法允许从Asset bundle中加载字符串或图片（二进制）文件。
### 加载文本assets
- 通过`rootBundle` 对象加载：每个Flutter应用程序都有一个`rootBundle`对象， 通过它可以轻松访问主资源包，直接使用`package:flutter/services.dart`中全局静态的`rootBundle`对象来加载asset即可。
- 通过 `DefaultAssetBundle` 加载：建议使用 `DefaultAssetBundle` 来获取当前BuildContext的`AssetBundle`。 这种方法不是使用应用程序构建的默认asset bundle，而是使父级widget在运行时动态替换的不同的AssetBundle，这对于本地化或测试场景很有用。
通常，可以使用`DefaultAssetBundle.of()`在应用运行时来间接加载asset（例如JSON文件），而在widget上下文之外，或其它AssetBundle句柄不可用时，可以使用rootBundle直接加载这些asset，例如：
```dart
import 'dart:async' show Future;
import 'package:flutter/services.dart' show rootBundle;

Future<String> loadAsset() async {
  return await rootBundle.loadString('assets/config.json');
}
```
### 加载图片
类似于原生开发，Flutter也可以为当前设备加载适合其分辨率的图像。
#### 声明分辨率相关的图片 assets
`AssetImage` 可以将asset的请求逻辑映射到最接近当前设备像素比例（dpi）的asset。为了使这种映射起作用，必须根据特定的目录结构来保存asset：

- …/image.png
- …/Mx/image.png
- …/Nx/image.png
- …etc.  
其中M和N是数字标识符，对应于其中包含的图像的分辨率，也就是说，它们指定不同设备像素比例的图片。  

主资源默认对应于1.0倍的分辨率图片。看一个例子：

- …/my_icon.png
- …/2.0x/my_icon.png
- …/3.0x/my_icon.png
在设备像素比率为1.8的设备上，`.../2.0x/my_icon.png` 将被选择。对于2.7的设备像素比率，`.../3.0x/my_icon.png`将被选择。  

如果未在Image widget上指定渲染图像的宽度和高度，那么Image widget将占用与主资源相同的屏幕空间大小。 也就是说，如果`.../my_icon.png`是72px乘72px，那么`.../3.0x/my_icon.png`应该是216px乘216px; 但如果未指定宽度和高度，它们都将渲染为72像素×72像素（以逻辑像素为单位）。

`pubspec.yaml`中asset部分中的每一项都应与实际文件相对应，但主资源项除外。当主资源缺少某个资源时，会按分辨率从低到高的顺序去选择 ，也就是说1x中没有的话会在2x中找，2x中还没有的话就在3x中找。
#### 加载图片
要加载图片，可以使用 AssetImage类。例如，我们可以从上面的asset声明中加载背景图片：
```dart
Widget build(BuildContext context) {
  return new DecoratedBox(
    decoration: new BoxDecoration(
      image: new DecorationImage(
        image: new AssetImage('graphics/background.png'),
      ),
    ),
  );
}
```
注意，AssetImage 并非是一个`widget`， 它实际上是一个`ImageProvider`,有些时候你可能期望直接得到一个显示图片的widget，那么你可以使用Image.asset()方法，如：
```dart
Widget build(BuildContext context) {
  return Image.asset('graphics/background.png');
}
```
使用默认的 asset bundle 加载资源时，内部会自动处理分辨率等，这些处理对开发者来说是无感知的。 (如果使用一些更低级别的类，如 ImageStream或 ImageCache 时你会注意到有与缩放相关的参数)
#### 依赖包中的资源图片
要加载依赖包中的图像，必须给AssetImage提供package参数。
  
例如，假设您的应用程序依赖于一个名为“my_icons”的包，它具有如下目录结构：

- …/pubspec.yaml
- …/icons/heart.png
- …/icons/1.5x/heart.png
- …/icons/2.0x/heart.png
- …etc.
然后加载图像，使用:
```dart
 new AssetImage('icons/heart.png', package: 'my_icons')
//或

new Image.asset('icons/heart.png', package: 'my_icons')
```
注意：包在使用本身的资源时也应该加上package参数来获取。  

##### 打包包中的 assets
如果在`pubspec.yaml`文件中声明了期望的资源，它将会打包到相应的package中。特别是，包本身使用的资源必须在`pubspec.yaml`中指定。

包也可以选择在其`lib/`文件夹中包含未在其`pubspec.yaml`文件中声明的资源。在这种情况下，对于要打包的图片，应用程序必须在`pubspec.yaml`中指定包含哪些图像。 例如，一个名为“fancy_backgrounds”的包，可能包含以下文件：

- …/lib/backgrounds/background1.png
- …/lib/backgrounds/background2.png
- …/lib/backgrounds/background3.png
要包含第一张图像，必须在pubspec.yaml的assets部分中声明它：
```yaml
flutter:
  assets:
    - packages/fancy_backgrounds/backgrounds/background1.png
```    
lib/是隐含的，所以它不应该包含在资产路径中。
### 特定平台 assets
上面的资源都是flutter应用中的，这些资源只有在Flutter框架运行之后才能使用，如果要给我们的应用设置APP图标或者添加启动图，那我们必须使用特定平台的assets。
#### 设置APP图标
更新Flutter应用程序启动图标的方式与在本机Android或iOS应用程序中更新启动图标的方式相同。
- Android  

在Flutter项目的根目录中，导航到`.../android/app/src/main/res`目录，里面包含了各种资源文件夹（如mipmap-hdpi已包含占位符图像“ic_launcher.png”）。 只需按照Android开发人员指南中的说明， 将其替换为所需的资源，并遵守每种屏幕密度（dpi）的建议图标大小标准。
>注意: 如果您重命名.png文件，则还必须在您AndroidManifest.xml的`<application>`标签的android:icon属性中更新名称。
- iOS  

在Flutter项目的根目录中，导航到`.../ios/Runner`。该目录中`Assets.xcassets/AppIcon.appiconset`已经包含占位符图片， 只需将它们替换为适当大小的图片，保留原始文件名称。
#### 更新启动页
在Flutter框架加载时，Flutter会使用本地平台机制绘制启动页。此启动页将持续到Flutter渲染应用程序的第一帧时。
>注意: 这意味着如果您不在应用程序的main()方法中调用runApp 函数 （或者更具体地说，如果您不调用window.render去响应window.onDrawFrame）的话， 启动屏幕将永远持续显示。
- Android  

要将启动屏幕（splash screen）添加到您的Flutter应用程序， 请导航至`.../android/app/src/main`。在`res/drawable/launch_background.xml`，通过自定义drawable来实现自定义启动界面（你也可以直接换一张图片）。
- Ios  

要将图片添加到启动屏幕（splash screen）的中心，请导航至`.../ios/Runner`。在`Assets.xcassets/LaunchImage.imageset`， 拖入图片，并命名为`LaunchImage.png、LaunchImage@2x.png、LaunchImage@3x.png`。 如果你使用不同的文件名，那您还必须更新同一目录中的`Contents.json`文件，图片的具体尺寸可以查看苹果官方的标准。