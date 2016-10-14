var fs = require('fs');
var moment = require('moment')
var util = {
	isToday: function (date) {
		var todaysDate = new Date();
    	if(date.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
        	return true;
    	} else {
        	return false;
    	}
	},

	saveComments: function (data) {
		if (data && data.length > 0) {
			console.log(data);
		}
		var today = new Date();
		var datFoloder = "./data";
		if (!fs.existsSync(datFoloder)){
    		fs.mkdirSync(datFoloder);
		}
		var folder = datFoloder+'/'+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		if (!fs.existsSync(folder)){
    		fs.mkdirSync(folder);
		}
		var now = new Date().getTime();
		fs.writeFile(folder+'/'+now+'.json', JSON.stringify(data), function (err) {
     		if (err) throw err ;
     		console.log("File Saved !"); //文件被保存
 		}) ;
	},

	saveError: function (error) {
		var timeNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		fs.appendFile('error.log', timeNow+":"+error+"\n", function (error) {
			console.log(error);
		});
	}
}

Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

module.exports = util;