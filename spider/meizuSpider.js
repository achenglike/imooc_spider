var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');
var Entities = require('html-entities').XmlEntities;

var targetUrl = "http://app.meizu.com/apps/public/evaluate/list?app_id=1663000&start=0&max=30";

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
			entities = new Entities();
			var json = JSON.parse(resultData);
			if (json.value && json.value.list && json.value.list.length > 0) {
				var comments = json.value.list;
				comments.forEach(function (comment) {
					var writeTime = comment.create_time;
					// writeTIme:2016-10-12
					var converTime = new Date(writeTime);
					if (Utils.isToday(converTime)) {
						var score = comment.score /10;
						sampleComments.push(new Comment(comment.version_name, entities.decode(comment.comment), converTime.getTime(), '', score, 'meizu'));
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
