# aliyun-oss-webpack-plugin


## 安装

webpack 4.x:
```npm
npm install aliyun-oss-webpack-plugin --save
```

webpack 2.x || 3.x:
```npm
npm install aliyun-oss-webpack-plugin@"^2.0.1" --save
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