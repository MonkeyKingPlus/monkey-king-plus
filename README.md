# monkey-king-plus

# app 目录结构说明
--------------
    |--actions          actions
    |--android          android工程
    |--components
    |  |--elements      自定义组件
    |  |--pages         页面
    |--config           app配置
    |--ios              ios工程
    |--reducers         reducer数据
    |--themes           样式
    |--utility          工具
    |--bootstrap.js     启动页，做了很多初始化工作
    |--routes.js        router配置

# route 配置
router使用的是[react-native-router](https://github.com/MonkeyKingPlus/react-native-router.git)
```javascript
const routes=[{
	path: "home",
	title: "Home",
	component: <Home/>
}, {
	path: "register",
	title: "Register-Step1",
	component: <Register/>,
	routes: [{
		path: "step2",
		title: "Register-Step2",
		component: <RegisterStep2/>
	}]
}, {
	path: "demo",
	title: "Demo",
	component: <Demo/>
}];
export default routes;
```

# elements 自定义组件
## Error 处理错误消息
## NetworkStatus 网络请求状态

# 全局变量
* $config:对应app.config.js,根据env的值把对应的配置合并到$config中.
* React

# BaseComponent
所有的页面和组件都会继承至BaseComponent.这里提供了一些快捷操作.所有的方法名都以$开头
* $cleanError():清空errors
* $throwBusinessError(message[,ops]):抛出一个业务异常,将由Error组件进行处理.如果页面上没有添加Error组件,business error将被忽略.参数如下:
```javascript
//@params message {string} : required
//@params ops {object} : optional
//@return void
$throwBusinessError(message,ops={
	code:0,
	stack:"",
	delay:5000
})
```

# 规范

## actions 规范
* 所有的文件必须以.action.js结尾
* 所有定义的action.type必须在文件的开头
* 相同的业务类型的action定义在同一个文件中

## RESTful Client 规范
* 需要保存到reducer上的数据,设置canAbort=false.rest默认这个配置就是false,
所以不需要关心.对于页面级数据需要设置canAbort=true.

## reducer 规范
* 所有的文件必须以.reducer.js结尾
* reducer只能保存需要持久化/共享的数据,对于页面级/临时数据禁止保存在reducer上
* 一个reducer尽量只做一件事情,如果一个reducer比较复杂,
简单的结构无法满足请以嵌套的方式进行拆分,同时对应的组件也应该进行拆分.
* 一个文件只能定义一个reducer,禁止定义多个reducer
* 所有的reducer都需要在index.js中进行引用

## element 规范
* 所有的element都必须继承BaseElement
* 所有的element必须定义propTypes和defaultProps

## page 规范
* 所有的页面必须继承BasePage

