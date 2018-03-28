/**
 * @module
 * @description
 * @version 1.0.0
 * @author xuyuanxiang
 * @date 2017/1/6
 */
var url = require('url');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var createOSS = require('ali-oss');
var co = require('co');

function AliyunOSSPlugin (options) {
  if (!_.isPlainObject(options)
    || _.isEmpty(options)
    || _.isEmpty(options.region)
    || _.isEmpty(options.accessKeyId)
    || _.isEmpty(options.accessKeySecret)
    || _.isEmpty(options.bucket)
  ) {
    throw new TypeError('缺少参数！');
  }
  this.oss = createOSS({
    region: options.region,
    accessKeyId: options.accessKeyId,
    accessKeySecret: options.accessKeySecret,
    bucket: options.bucket,
  });
  this.headers = _.isPlainObject(options.headers)
    ? _.merge({}, options.headers)
    : {};
  this.publicPath = options.publicPath;
}

AliyunOSSPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    var publicPath = this.publicPath ? url.parse(this.publicPath) : url.parse(
      compiler.options.output.publicPath);
    if (!publicPath.protocol || !publicPath.hostname) {
      return callback(new Error(
        'Webpack配置文件中: "publicPath"必须设置为域名，例如： https://domain.com/p/a/t/h'));
    }
    async.every(_.filter(_.keysIn(compilation.assets), function (asset) {
      return !/\.html$/.test(asset);
    }), function (file, done) {
      var target = url.resolve(url.format(publicPath), file);
      var key = url.parse(target).pathname;
      var source = compilation.assets[file].source();
      var body = Buffer.isBuffer(source) ? source : new Buffer(source, 'utf8');
      co(function * () {
        if (_.isEmpty(this.headers)) {
          yield this.oss.put(key, body);
        } else {
          yield this.oss.put(key, body, {
            headers: this.headers,
          });
        }
        console.log(file + '上传成功：', target);
        done();
      }.bind(this)).catch(callback);
    }.bind(this), callback);
  }.bind(this));
};

module.exports = AliyunOSSPlugin;
