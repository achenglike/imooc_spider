var http = require('http');
var Utils = require('./Utils.js');
var Comment = require('./Comment.js');

var targetUrl = "http://42.62.48.182/apm/comment/list/61431?channel=market_100_1_android&clientId=d4a75bfbeef30f1ad49e827f0fdd6ade&co=CN&densityScaleFactor=4.0&imei=379dae9c62158f1f796819ff0e83a7a6&la=zh&marketVersion=144&model=vivo+Xplay3S&os=eng.compiler.20160809.174647&page=0&resolution=1440*2560&sdk=19&session=2jmj7l5rSw0yVb_v";

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
					var writeTime = comment.updateTime;
					// writeTIme:1476294741666
					var converTime = new Date(writeTime);
					if (Utils.isToday(converTime)) {
						sampleComments.push(new Comment(comment.versionName, comment.commentValue, converTime.getTime(), '', comment.pointValue, 'xiaomi'));
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