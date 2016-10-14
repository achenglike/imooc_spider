var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://comment.mobilem.360.cn/comment/getComments?baike=%E6%85%95%E8%AF%BE%E7%BD%91+Android_cn.com.open.mooc&start=0&count=30";

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
			if (json.data && json.data.messages && json.data.messages.length > 0) {
				var comments = json.data.messages;
				comments.forEach(function (comment) {
					var writeTime = comment.create_time;
					// writeTIme:2016-10-12 12:23:57
					var converTime = new Date(Date.parse(writeTime.replace(/-/g,"/")));
					if (Utils.isToday(converTime)) {
						sampleComments.push(new Comment(comment.version_name, comment.content, converTime.getTime(), comment.model, comment.score, '360'));
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