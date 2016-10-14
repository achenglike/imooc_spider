var tszSpider = require('./tszSpider.js');
var huaweiSpider = require('./huaweiSpider.js');
var vivoSpider = require('./vivoSpider.js');
var meizuSpider = require('./meizuSpider.js');
var wandoujiaSpider = require('./wandoujiaSpider.js');
var xiaomiSpider = require('./xiaomiSpider.js');
var oppoSpider = require('./oppoSpider.js');
var yingyongbaoSpider = require('./yingyongbaoSpider.js');
var schedule = require("node-schedule");

var scheduleTask = function () {

	var rule = new schedule.RecurrenceRule();
　　 rule.dayOfWeek = [0, new schedule.Range(1, 6)];
　　 rule.hour = 23;
　　 rule.minute = 55;
　　 var j = schedule.scheduleJob(rule, function(){
　　　　	console.log("执行任务");
		tszSpider.start();
		huaweiSpider.start(); 
		vivoSpider.start(); 
		meizuSpider.start(); 
		wandoujiaSpider.start();
		xiaomiSpider.start(); 
		oppoSpider.start(); 
		yingyongbaoSpider.start(); 
　　});
}

exports.start = function () {
	scheduleTask();
};