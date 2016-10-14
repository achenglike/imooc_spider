var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://pl.appstore.vivo.com.cn/port/comments/?page_index=1&app_version=615&id=54710";

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
			if (json.value && json.value.length > 0) {
				var comments = json.value;
				comments.forEach(function (comment) {
					var writeTime = comment.comment_date;
					// writeTIme:2016-10-12 12:23:57
					var converTime = new Date(Date.parse(writeTime.replace(/-/g,"/")));
					if (Utils.isToday(converTime)) {
						sampleComments.push(new Comment(comment.appversion, comment.comment, converTime.getTime(), comment.model, comment.score, 'vivo'));
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