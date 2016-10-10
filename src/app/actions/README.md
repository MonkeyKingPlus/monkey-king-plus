# actions 规范
* 所有定义的action.type必须在文件的开头
* 相同的业务类型的action定义在同一个文件中

# rest 规范
* 需要保存到reducer上的数据,设置canAbort=false.rest默认这个配置就是false,
所以不需要关心.对于页面级数据需要设置canAbort=true.
