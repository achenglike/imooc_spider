var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://comment.wandoujia.com/comment/comment!getCommentSummary.action?pageSize=30&target=cn.com.open.mooc&pageNum=0";

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
			if (json.comments && json.comments.length > 0) {
				var comments = json.comments;
				comments.forEach(function (comment) {
					var writeTime = comment.date;
					// writeTIme:2016-09-21
					var convertTime = new Date(writeTime);
					if (Utils.isToday(convertTime)) {
						var score = comment.enjoy ? 5 : (comment.enjoy == '' ? 3:2)
						sampleComments.push(new Comment('', comment.content, convertTime.getTime(), '', score, 'wandoujia'));
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