var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://a.vmall.com/detail/commentaction.action?sign=undefined&appId=C10109127&reqPageNum=1";

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
			if (json.commentList && json.commentList.list && json.commentList.list.length > 0) {
				var comments = json.commentList.list;
				comments.forEach(function (comment) {
					var writeTime = comment.commmentTime;
					// writeTIme:2016-10-12 12:23:57
					var converTime = new Date(Date.parse(writeTime.replace(/-/g,"/")));
					if (Utils.isToday(converTime)) {
						var score = comment.rating/2;
						sampleComments.push(new Comment('', comment.content, converTime.getTime(), comment.phoneType, score, 'huawei'));
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