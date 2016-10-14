var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://sj.qq.com/myapp/app/comment.htm?apkName=cn.com.open.mooc&apkCode=5000&p=0";

var sampleComments = [];

function startRequest(url) {
	http.get(url, function (res) {
		var resultData = "";
		res.setEncoding('utf-8');
		res.on('error', function (e) {
			console.log(e);
			Utils.saveError(e);
		});
		res.on('data', function (chunk) {
			resultData += chunk;
		});

		res.on('end', function () {
			// String to data
			var json = JSON.parse(resultData);
			if (json.obj && json.obj.commentDetails && json.obj.commentDetails.length > 0) {
				var comments = json.obj.commentDetails;
				comments.forEach(function (comment) {
					var writeTime = comment.createdTime;
					// writeTIme:1448704058
					var converTime = new Date(writeTime*1000);
					if (Utils.isToday(converTime)) {
						sampleComments.push(new Comment(comment.versionCode, comment.content, converTime.getTime(), comment.phoneMode+commentphoneBrand, comment.score, 'yingyongbao'));
					}
				});
				Utils.saveComments(sampleComments);
			} else {
				Utils.saveError('UnSupportResult:'+resultData);
			}
			// console.log(resultData);
		})
	});
}

exports.start = function () {
	startRequest(targetUrl); 
}