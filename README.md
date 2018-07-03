# Installation

webpack 4.x:
```npm
npm install aliyun-oss-webpack-plugin --save
```

webpack 2.x || 3.x:
```npm
npm install aliyun-oss-webpack-plugin@"^2.0.1" --save
```

## Configuration

```javascript
const AliyunOSSPlugin = require("aliyun-oss-webpack-plugin");
module.exports = {
    output: {
        publicPath: "https://domain.com/p/a/t/h" // !required
    },
    plugins: [
        new AliyunOSSPlugin({
            accessKeyId: '*****',
            accessKeySecret: '*****',
            region: 'oss-cn-hangzhou',
            bucket: '*****',
            headers: {
              'Cache-Control': 'max-age=3600'
            }
        })
    ]
}
```

## Example

`webpack.config.js`:

```js
const path = require('path');
const AliyunOSSPlugin = require("aliyun-oss-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'index.js',
        publicPath: 'https://my.static.assets.domain/my-project/1.0.0/',
    },
    plugins: [
        new AliyunOSSPlugin({
            accessKeyId: '*****',
            accessKeySecret: '*****',
            region: 'oss-cn-hangzhou',
            bucket: '*****',
            headers: {
              'Cache-Control': 'max-age=3600',
            },
        })
    ]
}
```

`index.html`:

```bash
<script src="https://my.static.assets.domain/my-project/1.0.0/index.js"></script>
```