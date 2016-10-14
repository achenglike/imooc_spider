var fs = require('fs');

var Data = {
	getAllDate: function (callback) {
		getDataFiles(function (err, items) {
			if (err) {
				callback(err);
				return;
			}
			var dates = [];
			var nums = items.length;
			if (nums.length == 0) {
				callback(null, dates);
				return;
			}
			items.forEach(function (item) {
				fs.readFile(item,'utf-8', function(err,data){ 
 					if(err){ 
  						console.log(err); 
 					}else{ 
 						dates = dates.concat(JSON.parse(data));
  						// console.log(data); 
 					} 
 					nums -= 1;
 					if (nums == 0) {
 						callback(null, dates);
 					}
				})
			});
		});
	}
}

function getDataFiles(callback) {
	var basePath = "./data";
	fs.readdir(basePath, function(err, items) {
		if (err) {
			callback(err)
			return;
		}
		var backNum = 0;
		var basePathFile=[];
		var filePaths = [];
    	for (var i=0; i<items.length; i++) {
        	var file = basePath + '/' + items[i];

        	var stat = fs.lstatSync(file);
			if (stat.isDirectory()) {
				basePathFile.push(file);
			}
    	}
    	basePathFile.forEach(function (childDir) {
    		fs.readdir(childDir, function (err, items) {
    			for (var i=0; i<items.length; i++) {
        			var targetFile = childDir+"/"+ items[i];
        			if (targetFile.indexOf(".json",this.length - ".json".length)!==-1) {
        				filePaths.push(targetFile);
        			}
    			}
    			backNum += 1;
    			if (backNum == basePathFile.length) {
    				callback(null, filePaths)
    			}
    		});
    	});
	});
}

module.exports = Data;