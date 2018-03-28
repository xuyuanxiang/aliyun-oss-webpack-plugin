# aliyun-oss-webpack-plugin

`webpack`插件，用于将静态资源打包上传阿里云OSS。

上传失败则终止`webpack`构建流程，为解决现在市面上另一个同类型插件在Docker构建中，上传失败无感的问题。

## 安装

```npm
npm install aliyun-oss-webpack-plugin --save
```

## 使用

`webpack`配置文件：

```javascript
var AliyunOSSPlugin = require("aliyun-oss-webpack-plugin");
module.exports = {
    output: {
        publicPath: "https://domain.com/p/a/t/h" // 域名或域名+路径
    },
    plugins: [
        // 其他插件
        new AliyunOSSPlugin({
            accessKeyId: '*****',
            accessKeySecret: '*****',
            region: 'oss-cn-hangzhou',
            bucket: '*****',
            headers: {
              'Cache-Control': 'max-age=3600'
            }
        })
        // 其他插件
    ]
}
```