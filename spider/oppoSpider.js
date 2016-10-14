var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://store.oppomobile.com/comment/list.json?id=10590859&page=1";

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
			if (json.commentsList && json.commentsList.length > 0) {
				var comments = json.commentsList;
				comments.forEach(function (comment) {
					var writeTime = comment.createDate;
					var convertTime = new Date(writeTime);
					// writeTime:"2016.10.07"
					if (Utils.isToday(convertTime)) {
						var score = comment.userGrade/10;
						sampleComments.push(new Comment(comment.version, comment.word, convertTime.getTime(), '', score, 'keke/oppo'));
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