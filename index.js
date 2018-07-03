/**
 * @module
 * @description
 * @version 3.0.0
 * @author xuyuanxiang
 * @date 2018/7/3
 */
var url = require('url');
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
    throw new TypeError('not all of the required options were present！');
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
  compiler.hooks.emit.tapAsync('AliyunOSSPlugin',
    function (compilation, callback) {
      var publicPath = this.publicPath ? url.parse(this.publicPath) : url.parse(
        compiler.options.output.publicPath);
      if (!publicPath.protocol || !publicPath.hostname) {
        return callback(new Error(
          '"output.publicPath" should be a valid uri.'));
      }
      async.every(_.filter(_.keysIn(compilation.assets), function (asset) {
        return !/\.html$/.test(asset);
      }), function (file, done) {
        var target = url.resolve(url.format(publicPath), file);
        var key = url.parse(target).pathname;
        var source = compilation.assets[file].source();
        var body = Buffer.isBuffer(source) ? source : new Buffer(source,
          'utf8');
        co(function * () {
          if (_.isEmpty(this.headers)) {
            yield this.oss.put(key, body);
          } else {
            yield this.oss.put(key, body, {
              headers: this.headers,
            });
          }
          console.log(file + 'upload complete:', target);
          done();
        }.bind(this)).catch(callback);
      }.bind(this), callback);
    }.bind(this));
};

module.exports = AliyunOSSPlugin;
