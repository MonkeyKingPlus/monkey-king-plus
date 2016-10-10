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
router使用的是［react-native-router］(https://github.com/MonkeyKingPlus/react-native-router.git)
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