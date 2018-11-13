var accessToken = '7ff5247b8d884a37a9c255a78ddd9366';
var userName = localStorage.getItem("username");
var passWord = localStorage.getItem("password");
//var projectId = localStorage.getItem('projectId');
var projectName = localStorage.getItem('projectName');
var userPhone = localStorage.getItem('phone');
var userRemark = localStorage.getItem('remark');
var userEmail = localStorage.getItem('email');
var userTrueName = localStorage.getItem('name');
var userOrgName = localStorage.getItem('orgName');
var userPositionName = localStorage.getItem('positionName');
var userRole = localStorage.getItem('role');
//var commonPram = '"accessToken":"'+accessToken+'","username":"'+userName+'","password":"'+passWord+'","projectId":"'+projectId+'"';
var _prams = '?username=' + userName + '&password=' + passWord;
var noData = '<div class="no-info"><div class="no-info-icon"><svg class="icon" aria-hidden="true" ><use xlink:href="#icon-sousuowujieguo"></use></svg></div>暂无数据</div>';
var file_url = '';

//登出
function logout(){
	app.dialog.confirm('确定要退出登录吗？', '提示', function(){
		localStorage.setItem('username', '');
		localStorage.setItem('password', '');
		localStorage.setItem('projectId', '');
		localStorage.setItem('projectName', '');
		localStorage.setItem('phone', '');
		localStorage.setItem('remark', '');
		localStorage.setItem('email', '');
		localStorage.setItem('name', '');
		localStorage.setItem('orgName', '');
		localStorage.setItem('positionName', '');
		localStorage.setItem('role', '');
		historyBack(0);
		window.location.href = 'login.html';
	}, function(){});
}

//提示语
function tips(content,callback) {
    var html = '';
    html += '<div id="tips" class="tips tipin">' + content + '</div>';
    html += '<div id="tipsBg" class="tipsBg fadein"></div>';
    $("body").append(html);
    setTimeout(function () {
        $("#tips").removeClass("tipin").addClass("tipout");
        $("#tipsBg").removeClass("fadein").addClass("fadeOut");
        setTimeout(function () { 
        	$("#tips,#tipsBg").remove(); 
            if(callback){
            	var _callback = eval(callback);
            	_callback.apply();
            }
        }, 500);
    }, 1000);//3s后消失
}
//获取当前时间
function getTime(time){
    var date = new Date(time);
    var y = date.getFullYear();
    var m = parseInt(date.getMonth()) + 1;
    m = m > 9 ? m : '0' + m;
    var d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    var hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    var mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    var ss = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
}
function getDate(time) {
	if(time != '' && time != null){
		var date= new Date(time),
		year = date.getFullYear(),
		m = parseInt(date.getMonth()) + 1;
	    m = m > 9 ? m : '0' + m;
		var d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
		return (year+"-"+m+"-"+d);
	}else{
		return '';
	}
}
//返回当前时间
function getCurrTime(type, t){
	var date = new Date();
	if(t != '' && t != undefined && t != null){
		date = new Date(t);
	}else if(t == ''){
		return '';
	}
	var y = date.getFullYear();
	var m = parseInt(date.getMonth()) + 1;
	m = m > 9 ? m : '0' + m;
	var d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
	var hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
	var mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
	var ss = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
	if(type){
		return y + '-' + m + '-' + d;
	}else{
		return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
	}
}
//页面跳转时执行pushHistory
function pushHistory(url) {
    var state = {
            title: "title",
            url: url
        };
    window.history.pushState(state, "title", "");
}

if (typeof window.addEventListener != "undefined") {
    window.addEventListener("popstate", function (e) {
        mainView.router.back();//执行framework7回退
    }, false);
} else {
    window.attachEvent("popstate", function (e) {
        mainView.router.back();//执行framework7回退
    });
}
//删除重复page
function removeRepeatPage(page){
    var _oldPage,_listNo = 0;;
    $(".pages .page").each(function(){
        if($(this).data("page")==page){
            _listNo++;
            if(_listNo==1){
                _oldPage = $(this);
            }else if(_listNo>1){
               _oldPage.remove();
            }
        }
    });
}
//获取字段在数组中的下标
function getArrayIndex(array,t){
    for(var i=0;i<array.length;i++){
        if(array[i]==t){
            return i;
        }
    }
}
//function proposer(n){
//  if(n=='admin') return '我';
//  else return n;
//}
function gtime(a){
    var n=getTime(a);
    return n.slice(5,-3);
}
function wait(n){
    var $n=n+'';
    if(n<60000) return '';
    else if(n<3600000) return '已等待'+parseInt($n.slice(0,-3)/60)+'分钟';
    else if(n<86400000) return $n.slice(0,-3)%3600!=0? '已等待'+parseInt($n.slice(0,-3)/3600)+'小时'+parseInt($n.slice(0,-3)%3600/60)+'分钟':'已等待'+parseInt($n.slice(0,-3)/3600)+'小时';
    else return $n.slice(0,-3)%86400!=0?'已等待'+parseInt($n.slice(0,-3)/86400)+'天'+parseInt($n.slice(0,-3)%86400/3600)+'小时':'已等待'+parseInt($n.slice(0,-3)/86400)+'天';
}
//选中状态和选中人数
function selectState(){
	$("input:checked").parent().find('.yuan').css({backgroundColor: "#40A9FF", border: "2px solid #40A9FF"});
	$('input:not(:checked)').parent().find('.yuan').css({backgroundColor: "#ffffff", border: "2px solid #888888"});
	$('.footer>p>span').text($('.list-block input:checked').length);
}
//固定头像文字长度
function fixedName(a){
	if(a.length<=2)return a;
	else return a.slice(-2);
}

//全选
function selectAll(Input){
	var isCheckAll = function (){
		for (var i = 1, n = 0; i < Input.length; i++){
			Input[i].checked && n++;
		}
		Input[0].checked = n == Input.length - 1;
	};
	Input[0].onclick = function (){
		for (var i = 1; i < Input.length; i++){
			Input[i].checked = this.checked;
		}
		isCheckAll();
	};
	for (var i = 1; i < Input.length; i++){
		Input[i].onclick = function (){
			isCheckAll();
		}
	}
}
//	清除姓名头像
function clearNameTx(){
	sessionStorage.clear();
    personVue.listName = '';
	//$('#add-name>li').not('.add').remove();
}
//查看图片
function showPic(_id){
    var url = _url + 'common/attachfiles/downFile?id=' + _id;
    var _html = '<div onclick="removePic(this)" class="showPic"><span></span><img src="'+url+'"/></div>';
    $("body").append(_html);
}
//查看图片
function showPicByPath(path){
    var url = _ipconfig + path;
    var _html = '<div onclick="removePic(this)" class="showPic"><span></span><img src="'+url+'"/></div>';
    $("body").append(_html);
}
function showPicByBase(obj){
	var _src = $(obj).attr('src');
    var _html = '<div onclick="removePic(this)" class="showPic"><span></span><img src="'+_src+'"/></div>';
    $("body").append(_html);
}
//查看视频
function showVideoByPath(path){
	var url = _ipconfig + path;
    var _html = '<div onclick="removePic(this)" class="showPic"><span></span><video src="' + url + '" controls="controls">您的浏览器不支持 video播放。</video></div>';
    $("body").append(_html);
}
function removePic(obj){
    $(obj).remove();
}
function fileDownload(_id, _fname){
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
	myApp.showPreloader();
    var url = _url + 'common/attachfiles/downFile?id=' + _id;
    var _downloadName = _id + '.' + _fname.split('.')[1];
    fs.root.getFile(_downloadName, { create: true, exclusive: false },
    function (fileEntry) {
        download(_downloadName, fileEntry, url);
    }, function(error){
    	myApp.hidePreloader();
        myApp.alert("文件创建失败", "提示");
        console.log("文件创建失败！", "提示")
    });
  }, function(error){
	  	myApp.hidePreloader();
	    myApp.alert("文件系统加载失败", "提示");
	    console.log("文件系统加载失败！", "提示")
  });
}
//下载文件
function download(_fname, fileEntry, uri) {
  var fileTransfer = new FileTransfer();
  var fileURL = fileEntry.toURL();
  /*fileTransfer.onprogress = function (e) {  
    console.info(e);  
    if (e.lengthComputable) {  
      console.log('当前进度：' + e.loaded / e.total);  
    }  
  }*/
  fileTransfer.download(
    uri,
    fileURL,
    function (entry) {
        myApp.hidePreloader();
        var _fileType = _fname.split('.')[1].toLowerCase();
        if(_fileType == 'png' || _fileType == 'jpg' || _fileType == 'jpeg' || _fileType == 'bmp' || _fileType == 'gif'){
            
        }else if(_fileType == 'doc' || _fileType == 'docx' || _fileType == 'xls' || _fileType == 'xlsx' || _fileType == 'pdf'){
            cordova.plugins.fileOpener2.showOpenWithDialog(
                entry.toURL(),
                'application/kswps', 
                { 
                  error : function(e) { 
                    console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                  },
                  success : function () {
                    console.log('file opened successfully');        
                  }
                }
             );
        }else{
            myApp.alert('文件无法打开', '提示');
        }
    },
    function (error) {
        myApp.hidePreloader();
        myApp.alert("下载失败", "提示");
    },
    null, // or, pass false
    {
      //headers: {
      //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //}
    }
  );
}

function fileDownload2(_id, old_fname){
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
	app.preloader.show();
    //var url = _url + 'common/attachfiles/downFile?id=' + _id;
	var url = _ipconfig + '/kingeeanc-common/kingeeanc/fileDownloadAction.action?fileId=' + _id;
	
	var arr = old_fname.lastIndexOf(".");
	var _fileType = old_fname.substring(arr+1).toLowerCase();
	var _fname = new Date().getTime() + '.' + _fileType;
    fs.root.getFile(_fname, { create: true, exclusive: false },
    function (fileEntry) {
        download2(_fname, fileEntry, url);
    }, function(error){
    	app.preloader.hide();
        app.dialog.alert("文件创建失败", "提示");
        console.log("文件创建失败！", "提示")
    });
  }, function(error){
	  	app.preloader.hide();
	    app.dialog.alert("文件系统加载失败", "提示");
	    console.log("文件系统加载失败！", "提示")
  });
}
//下载文件
function download2(_fname, fileEntry, uri) {
  var fileTransfer = new FileTransfer();
  var fileURL = fileEntry.toURL();
  /*fileTransfer.onprogress = function (e) {  
    console.info(e);  
    if (e.lengthComputable) {  
      console.log('当前进度：' + e.loaded / e.total);  
    }  
  }*/
  fileTransfer.download(
    uri,
    fileURL,
    function (entry) {
    	app.preloader.hide();
    	var arr = _fname.lastIndexOf(".");
		var _fileType = _fname.substring(arr+1).toLowerCase();
        //var _fileType = _fname.split('.')[1].toLowerCase();
        if(_fileType == 'png' || _fileType == 'jpg' || _fileType == 'jpeg' || _fileType == 'bmp' || _fileType == 'gif' || _fileType == 'mp4'){
            
        }else if(_fileType == 'doc' || _fileType == 'docx' || _fileType == 'xls' || _fileType == 'xlsx' || _fileType == 'pdf'){
            cordova.plugins.fileOpener2.showOpenWithDialog(
                entry.toURL(),
                'application/kswps', 
                { 
                  error : function(e) { 
                    console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                  },
                  success : function () {
                    console.log('file opened successfully');        
                  }
                }
             );
        }else{
            app.dialog.alert('文件无法打开', '提示');
        }
    },
    function (error) {
    	app.preloader.hide();
    	 app.dialog.alert("下载失败", "提示");
    },
    null, // or, pass false
    {
      //headers: {
      //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //}
    }
  );
}
 
//文件创建失败回调
function  onErrorCreateFile(error){
    myApp.hidePreloader();
    myApp.alert("文件创建失败", "提示");
  console.log("文件创建失败！", "提示")
}

//FileSystem加载失败回调
function  onErrorLoadFs(error){
    myApp.hidePreloader();
    myApp.alert("文件系统加载失败", "提示");
  console.log("文件系统加载失败！", "提示")
}

//文件读取失败回调
function  onErrorReadFile(error){
    myApp.hidePreloader();
    myApp.alert("文件读取失败", "提示");
  console.log("文件读取失败！", "提示")
}
//附件图标
function fileIcon(_fileType){
    var _fileIcon;
    if(_fileType == 'png'){
        _fileIcon = 'icon-png';
    }else if(_fileType == 'mp4'){
        _fileIcon = 'icon-shipin1';
    }else if(_fileType == 'jpg' || _fileType == 'jpeg' || _fileType == 'bmp' || _fileType == 'gif'){
        _fileIcon = 'icon-jpg';
    }else if(_fileType == 'doc' || _fileType == 'docx'){
        _fileIcon = 'icon-word1';
    }else if(_fileType == 'ppt' || _fileType == 'pptx'){
        _fileIcon = 'icon-ppt';
    }else if(_fileType == 'xls' || _fileType == 'xlsx'){
        _fileIcon = 'icon-excel';
    }else if(_fileType == 'zip' || _fileType == 'rar'){
        _fileIcon = 'icon-zip';
    }else if(_fileType == 'pdf'){
        _fileIcon = 'icon-pdf1';
    }else{
        _fileIcon = 'icon-qita';
    }
    return _fileIcon;
}
//返回
function historyBack(index){
    var _length = history.length-1-index;
    window.history.go(-_length);
}
//获取url参数
function GetRequestArray() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
	    var str = url.substr(1);
	    strs = str.split("&");
	    for(var i = 0; i < strs.length; i ++) {
	        //theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]); 
	    }
	}
	return theRequest;
}
function onDeviceReady() {
    //通知栏点击监听
    document.addEventListener("jpush.openNotification", onOpenNotification, false);
}
//通知栏点击监听
var onOpenNotification = function(event) {
	try {
		alertContent = event.extras;
		var url = window.location.href;
		var url_fexx = '';
		if(url.indexOf('shouwen') == -1 && url.indexOf('fawen') == -1){
			if(alertContent.type == 1){
				url_fexx = '../shouwen/'
			}else if(alertContent.type == 2){
				url_fexx = '../fawen/'
			}else{
				url_fexx = '../'
			}
		}
		if(alertContent.type == 1){
			window.location.href = url_fexx + 'list.html?id='+alertContent.id+'&procInsId='+alertContent.procInsId+'&taskId='+alertContent.taskId;
		}else if(alertContent.type == 2){
			window.location.href = url_fexx + 'list.html?id='+alertContent.id+'&procInsId='+alertContent.procInsId+'&taskId='+alertContent.taskId;
		}else{
			window.location.href = url_fexx + '../index.html';
		}
		console.log("open Notification:" + alertContent);
	} catch (exception) {
		console.log("JPushPlugin:onOpenNotification" + exception);
	}
};
//生成uuid
function uuid(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
			.split('');
	var uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++)
			uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data. At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
}
//Arraycontains
Array.prototype.contains = function(needle) {
	for (i in this) {
		if (this[i] == needle)
			return true;
	}
	return false;
}

function createDatePicker(target, flag){ //f7 1.x写法
	var today = new Date();
	if(flag){ //不带时分秒
		myApp.picker({
		    input: target,
		    rotateEffect: true,
		    toolbarTemplate: 
		        '<div class="toolbar">' +
		            '<div class="toolbar-inner">' +
		                '<div class="left">' +
		                '</div>' +
		                '<div class="right">' +
		                    '<a href="#" class="link close-picker">确定</a>' +
		                '</div>' +
		            '</div>' +
		        '</div>',
		    value: [today.getFullYear(), ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)), (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())],
		    onChange: function (picker, values, displayValues) {
		        var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
		        if (values[2] > daysInMonth) {
		            picker.cols[2].setValue(daysInMonth);
		        }
		    },
		    formatValue: function (p, values, displayValues) {
		        return values[0] + '-' + values[1] + '-' + values[2];
		    },
		    cols: [{ //Years
			    values: (function () {
			    	var arr = [];
			        for (var i = 2014; i <= 2050; i++) { arr.push(i); }
			        return arr;
			    })(),
			}, { // Months
				values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
	        }, { // Days
	            values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
	        }]
		});
	}else{ //带时分秒
		myApp.picker({
		    input: target,
		    rotateEffect: true,
		    toolbarTemplate: 
		        '<div class="toolbar">' +
		            '<div class="toolbar-inner">' +
		                '<div class="left">' +
		                '</div>' +
		                '<div class="right">' +
		                    '<a href="#" class="link close-picker">确定</a>' +
		                '</div>' +
		            '</div>' +
		        '</div>',
		    value: [today.getFullYear(), ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)), (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()), (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()), (today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds())],
		    onChange: function (picker, values, displayValues) {
		        var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
		        if (values[2] > daysInMonth) {
		            picker.cols[2].setValue(daysInMonth);
		        }
		    },
		    formatValue: function (p, values, displayValues) {
		        return values[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4] + ':' + values[5];
		    },
		    cols: [{ //Years
			    values: (function () {
			    	var arr = [];
			        for (var i = 2014; i <= 2050; i++) { arr.push(i); }
			        return arr;
			    })(),
			}, { // Months
				values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
	        }, { // Days
	            values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
	        }, { // Space divider
	            divider: true,
	            content: '  '
	        }, { // Hours
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }, { // Minutes
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }, { // Second
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }]
		});
	}
}

function createDatePicker2(target, flag, time){ //f7 2.x写法
	var default_time = new Array();
	if(time != '' && time != undefined){
		default_time = time;
	}else{
		var today = new Date(), datePicker;
		if(flag == 'yyyy-MM-dd'){
			default_time = [today.getFullYear(), ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)), (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())];
		}else if(flag == 'yyyy-MM-dd hh:mm'){ 
			default_time = [today.getFullYear(), ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)), (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()), (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())];
		}else if(flag == 'yyyy-MM-dd hh:m:ss'){
			default_time = [today.getFullYear(), ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)), (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()), (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()), (today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds())];
		}
	}
	if(flag == 'yyyy-MM-dd'){ //不带时分秒
		datePicker = app.picker.create({
			inputEl: target,
		    rotateEffect: true,
		    renderToolbar: function () {
		        return '<div class="toolbar">'
					+ '<div class="toolbar-inner">'
					+ '<div class="left">'
					+ '</div>'
					+ '<div class="right">'
					+ '<a href="#" class="link sheet-close popover-close">确定</a>'
					+ '</div>' + '</div>' + '</div>';
		    },
		    value: default_time,
		    on: {
		    	change: function (picker, values, displayValues) {
			        var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
			        if (values[2] > daysInMonth) {
			            picker.cols[2].setValue(daysInMonth);
			        }
			    }
		    },
		    formatValue: function (p, values, displayValues) {
		        return values[0] + '-' + values[1] + '-' + values[2];
		    },
		    cols: [{ //Years
			    values: (function () {
			    	var arr = [];
			        for (var i = 2014; i <= 2050; i++) { arr.push(i); }
			        return arr;
			    })(),
			}, { // Months
				values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
	        }, { // Days
	            values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
	        }]
		});
	}else if(flag == 'yyyy-MM-dd hh:mm'){ //年月日-时分
		datePicker = app.picker.create({
			inputEl : target,
			rotateEffect : true,
			renderToolbar: function () {
		        return '<div class="toolbar">'
					+ '<div class="toolbar-inner">'
					+ '<div class="left">'
					+ '</div>'
					+ '<div class="right">'
					+ '<a href="#" class="link sheet-close popover-close">确定</a>'
					+ '</div>' + '</div>' + '</div>';
		    },
		    value: default_time,
		    on: {
		    	change: function (picker, values, displayValues) {
		    		var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
		    		if (values[2] > daysInMonth) {
		    			picker.cols[2].setValue(daysInMonth);
		    		}
			   }
		    },
		    formatValue : function(values, displayValues) {
				return values[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4];
			},
			cols : [{ //Years
			    values: (function () {
			    	var arr = [];
			        for (var i = 2014; i <= 2050; i++) { arr.push(i); }
			        return arr;
			    })(),
			}, { // Months
				values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
	        }, { // Days
	            values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
	        }, { // Space divider
	            divider: true,
	            content: '  '
	        }, { // Hours
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }, { // Minutes
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }]
		});
	}else if(flag == 'yyyy-MM-dd hh:m:ss'){ //带时分秒
		datePicker = app.picker.create({
			inputEl : target,
			rotateEffect : true,
			renderToolbar: function () {
		        return '<div class="toolbar">'
					+ '<div class="toolbar-inner">'
					+ '<div class="left">'
					+ '</div>'
					+ '<div class="right">'
					+ '<a href="#" class="link sheet-close popover-close">确定</a>'
					+ '</div>' + '</div>' + '</div>';
		    },
		    value: default_time,
		    on: {
		    	change: function (picker, values, displayValues) {
			    	var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
			        if (values[2] > daysInMonth) {
			            picker.cols[2].setValue(daysInMonth);
			        }
			    }
		    },
		    formatValue : function(values, displayValues) {
				return values[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3] + ':' + values[4] + ':' + values[5];
			},
			cols : [{ //Years
			    values: (function () {
			    	var arr = [];
			        for (var i = 2014; i <= 2050; i++) { arr.push(i); }
			        return arr;
			    })(),
			}, { // Months
				values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
	        }, { // Days
	            values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
	        }, { // Space divider
	            divider: true,
	            content: '  '
	        }, { // Hours
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }, { // Minutes
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }, { // Second
	            values: (function () {
	                var arr = [];
	                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
	                return arr;
	            })(),
	        }]
		});
	}
	if(time == ''){ //time传空，则input无默认值
		$(target).val('');
	}
}

//带时段的时间控件
function createDatePickerWithPeriod(target, calculate){ //f7 2.x写法
	var today = new Date();
	$$('#leaveNum').val(1); //默认请假天数1天
	app.picker.create({
		inputEl: target,
	    rotateEffect: true,
	    renderToolbar: function () {
	        return '<div class="toolbar">'
				+ '<div class="toolbar-inner">'
				+ '<div class="left">'
				+ '</div>'
				+ '<div class="right">'
				+ '<a href="#" class="link sheet-close popover-close">确定</a>'
				+ '</div>' + '</div>' + '</div>';
	    },
	    value: [today.getFullYear(), ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)), (today.getDate() < 10 ? '0' + today.getDate() : today.getDate()), '整天'],
	    formatValue: function (p, values, displayValues) {
	        return values[0] + '-' + values[1] + '-' + values[2] + ' ' + values[3];
	    },
	    cols: [{ //Years
		    values: (function () {
		    	var arr = [];
		        for (var i = 2014; i <= 2050; i++) { arr.push(i); }
		        return arr;
		    })(),
		}, { // Months
			values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
        }, { // Days
            values: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
        }, { // Period
            values: ['整天', '上午', '下午'],
        }],
        on: {
        	change: function (picker, values, displayValues) {
    	        var daysInMonth = new Date(picker.value[0], picker.value[1], 0).getDate();
    	        if (values[2] > daysInMonth) {
    	            picker.cols[2].setValue(daysInMonth);
    	        }
    	    },
        	close: function(piker){
        		var _bt = $$('#beginTime').val();
				var _et = $$('#endTime').val();
        		if(calculate == 'calculate' && _bt != '' && _et != ''){
        			var b_d = $$('#beginTime').val().split(' ')[0];
					var b_p = $$('#beginTime').val().split(' ')[1];
					var e_d = $$('#endTime').val().split(' ')[0];
					var e_p = $$('#endTime').val().split(' ')[1];
					var r = b_p + ' ' + e_p;
					var delta = new Date(e_d).getTime() - new Date(b_d).getTime();
					if(delta >= 0){
						var days = parseInt(delta / 86400000);
						switch (r) {
							case '上午 上午':
								days = days + 0.5; break;
							case '下午 下午':
								days = days + 0.5; break;
							case '下午 整天':
								days = days + 0.5; break;	
							case '整天 上午':
								days = days + 0.5; break;	
							case '上午 下午':
								days = days + 1; break;	
							case '上午 整天':
								days = days + 1; break;	
							case '整天 下午':
								days = days + 1; break;
							case '整天 整天':
								days = days + 1; break;
							default:
								days = days; break;
						}
						$$('#leaveNum').val(days);
					}else{
						tips('开始时间不能大于结束时间...');
						$$('#leaveNum').val('');
					}
        		}
            }
        }
	});
}

//获取附件信息
function getFilesForVue(id, content, files, isEdit){
	if(files != undefined){
		var json = files;
		var lists = [];
		var detClass;
		var _num = 0;
		if(json.length>0){
			//_num = json.length;
			for(var i=0;i<json.length;i++){
				var _fileSize = '';
				if(json[i].fileSize){
					_fileSize = json[i].fileSize > 1000 ? parseInt(json[i].fileSize/1000) + 'MB' : json[i].fileSize + 'KB';
				}
				var arr = json[i].fileName.lastIndexOf(".");
				var _fileType = json[i].fileName.substring(arr+1).toLowerCase();
				var _fileIcon = fileIcon(_fileType);
				if(isEdit){ //编辑状态下，照片附件放在拍照位置
					var photos_html = '';
					if(_fileType == 'jpg' || _fileType == 'jpeg' || _fileType == 'png' || _fileType == 'gif' || _fileType == 'mp4'){
						if(_fileType == 'mp4'){
							photos_html = '<div class="custom-photo video" onclick="showVideoByPath(&quot;' + json[i].fileOriginalPath + '&quot;);"><i id="' + json[i].fileId + '" class="icon-shipin"></i><div class="custom-photo-delete" onclick="delPic(this);"><i class="icon-guano"></i></div></div>';
						}else{
							photos_html = '<div class="custom-photo"><img id="' + json[i].fileId + '" alt="" src="' + _ipconfig + json[i].filePath + '" onclick="showPicByPath(&quot;' + json[i].fileOriginalPath + '&quot;);"><div class="custom-photo-delete" onclick="delPic(this);"><i class="icon-guano"></i></div></div>';
						}
						$(content).prev().find('#addPhoto').before(photos_html);
					}else{
						_num ++;
						lists.push({"id":json[i].fileId,"title":json[i].fileName,"size":_fileSize,"icon":"#"+_fileIcon,"type":_fileType,"url":json[i].fileOriginalPath});
					}
				}else{//非编辑状态下，所有附件统一位置
					_num ++;
					lists.push({"id":json[i].fileId,"title":json[i].fileName,"size":_fileSize,"icon":"#"+_fileIcon,"type":_fileType,"url":json[i].fileOriginalPath});
				}
			}
			detClass = 'content-det';
		}else{
			detClass = 'content-det no-title';
		}
		new Vue({
			el: content,
			data: {
				lists:lists,
				num:_num,
				detClass:detClass
			},
			methods: {  
				downLoad: function (id, name) {
					fileDownload2(id,name);
				},
				viewPic: function(path){
					var arr = path.lastIndexOf(".");
					var _fileType = path.substring(arr+1).toLowerCase();
					if(_fileType == 'mp4'){
						showVideoByPath(path);
					}else{
						showPicByPath(path);
					}
				},
				online: function(url, name){
					file_url = '/file' + url.split(':/upload')[1] + name;
					$.ajax({
						type: "get",
						url: "http://192.168.8.173:8080/WopiHost?mode=mobileView",
						data: {
							'fileName': _ipconfig + file_url
						},
						dataType: "jsonp",
						jsonp: "callback",
				        jsonpCallback: "callback_files" + new Date().getTime(),
						success: function (data) {
							$('iframe[name=online]').attr('src', data.data);
						},
						error: function(e){
							console.info(e)
						}
					});
				}
			}
		});
	}else{
		$.ajax({
			type: "post",
			url: _url + "common/attachfiles/getAttachFiles" + _prams,
			data: {
				'affilationId': id
			},
			dataType: 'jsonp',
			jsonp: "callback",
	        jsonpCallback:"callback_files" + new Date().getTime(),
			success: function (data) {
				var json = data.data;
				var lists = [];
				var detClass;
				var _num = 0;
				if(json.length>0){
					_num = json.length;
					for(var i=0;i<json.length;i++){
						var _fileSize = '';
						if(json[i].fileSize){
							_fileSize = json[i].fileSize.FILE_SIZE > 1000000 ? parseInt(json[i].fileSize/100000) + 'MB' : parseInt(json[i].fileSize/1000) + 'KB';
						}
						var arr = json[i].fileName.lastIndexOf(".");
						var _fileType = json[i].fileName.substring(arr+1).toLowerCase();
		    			var _fileIcon = fileIcon(_fileType);
						lists.push({"id":json[i].id,"title":json[i].fileName,"size":_fileSize,"icon":"#"+_fileIcon,"type":_fileType,"url":json[i].url});
					}
					detClass = 'content-det';
				}else{
					detClass = 'content-det no-title';
				}
				new Vue({
					el: content,
					data: {
						lists:lists,
						num:_num,
						detClass:detClass
					},
					methods: {  
						downLoad: function (id, name) {
							fileDownload2(id,name);
						},
						viewPic: function(id){
							showPic(id);
						},
						online: function(url, name){
							file_url = '/file' + url.split(':/upload')[1] + name;
							$.ajax({
								type: "get",
								url: "http://192.168.8.173:8080/WopiHost?mode=mobileView",
								data: {
									'fileName': _ipconfig + file_url
								},
								dataType: "jsonp",
								jsonp: "callback",
						        jsonpCallback: "callback_files" + new Date().getTime(),
								success: function (data) {
									$('iframe[name=online]').attr('src', data.data);
								},
								error: function(e){
									console.info(e)
								}
							});
						}
					}
				});
			},
			error:function(json){
			}
		});
	}
}

//初始化列表
function emptyList(id){
	pageNum = 0;
	if($(id + ' ul').length > 0){ //清空列表
		$(id + ' ul').empty();
	}else{
		$(id).html('<ul></ul><div class="block-footer"><p></p></div>');
	}
}
//处理数据
function handleData(data){
	if(data.flag){
		if(data.data.length == 0){
			return '';
		}else{
			return data.data;
		}
	}else{
		tips('数据加载失败');
		return '';
	}
}
//列表返回顶部
function backToTop(){
    $('.page-current .page-content').animate({
        'scrollTop': '1px'
    });
}
//必填项验证
function validateForm(target){
	var result = true;
	var $target = $(target).find('*[validate]');
	for(var i=0; i<$target.length; i++){
		if($target.eq(i).attr('required')){
			if($.trim($target.eq(i).val()) == '' && $.trim($target.eq(i).text()) == ''){
				var _tips = $.trim($target.eq(i).parents('.item-content').find('.item-title').text().replace('*', ''));
				tips('请填写' + _tips);
				result = false;
				break;
			}
		}
		if($target.eq(i).data('length')){
			var _len = $target.eq(i).data('length');
			if($target.eq(i).val().length > _len/2 || $target.eq(i).text().length > _len/2){
				var _tips = $.trim($target.eq(i).parents('.item-content').find('.item-title').text().replace('*', ''));
				tips(_tips + '字数超长');
				result = false;
				break;
			}
		}
	}
	return result;
}

//选择照片
function imagepicker(target) {
	var num = $(target + ' .custom-photos img.photo-item').length;
	ImagePicker.getPictures(function(result) {
		var html = '';
		for(var i=0;i<result.images.length;i++){
		    html += '<div class="custom-photo"><img class="photo-item" alt="" src="data:image/png;base64,' + result.images[i].base + '" onclick="showPicByBase(this);"><div class="custom-photo-delete" onclick="delPic(this);"><i class="icon-guano"></i></div></div>';
			$(target + ' #uploadFile').append('<input type="hidden" name="list['+i+']" value="' + result.images[i].base + '">');
		}
		$(target + ' #addPhoto').before(html);
		//$file = result;
	}, function(err) {
		app.dialog.alert(err, '提示');
	}, {
		maximumImagesCount: 9 - num,
		width: 720,
		height: 960,
		quality: 100
	});
}
function getBase64Image(img) {
     var canvas = document.createElement("canvas");
     canvas.width = img.width;
     canvas.height = img.height;
     var ctx = canvas.getContext("2d");
     ctx.drawImage(img, 0, 0, img.width, img.height);
     var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
     var dataURL = canvas.toDataURL("image/"+ext);
     return dataURL;
}

// 删除照片
function delPic(obj) {
	var picId = $(obj).prev().attr('id');
	if(picId == null || picId == undefined || picId ==''){
		var _index = $(obj).parent().index();
		$(obj).parent().remove();
		$('input[name^=list]').eq(_index).remove();
		//$files.splice(_index, 1);
	}else{
		app.dialog.confirm('照片已上传，删除后电脑端将同步删除，确定要删除吗？', '提示', function() {
			var _index = $(obj).parent().index();
			$.ajax({
				type : 'post',  
			    url : _url + 'uploadDrop' + _prams,
			    data: {"id": picId},
			    dataType: 'jsonp',
				jsonp: "callback",
		        jsonpCallback:"callback_uploadDrop" + new Date().getTime(),
			    success: function (str) { 
			    	$(obj).parent().remove();
			    	app.dialog.alert('删除成功',"提示");
			    },
			    error: function(e){
			    	app.dialog.alert('删除失败',"提示");
			    }
			});
		}, function() {

		});
	}
	//阻止事件冒泡
	window.event.stopPropagation();
}

//录像视频
function captureVideo(target){
	var html = '';
	var options = { limit: 1, duration: 10 };
	navigator.device.capture.captureVideo(function(fileList){
		var len, i, path, name;
	    len = fileList.length;
	    if (len > 0) {
	        for (i = 0; i < len; i ++) {
	            path = fileList[i].fullPath;
	            name = path.substr(path.lastIndexOf('/') + 1);
	            html += '<div class="custom-photo video" onclick="showVideo(this);"><i data-url="' + path + '" class="icon-shipin"></i><div class="custom-photo-delete" onclick="delPic(this);"><i class="icon-guano"></i></div></div>';
	            $(target + ' #uploadFile').append('<input class="video" type="hidden" name="list['+i+']" value="' + path + '">');
	        }
	        $(target + ' #addPhoto').before(html);
			if($(target + ' #addPhoto').parent().find('.custom-photo').length == 10){
				$(target + ' #addPhoto').hide();
			}
	    } else {
	        console.log('未选择视频');
	    }
	}, function(error){
		console.log('Capture error: ' + error.code);
	}, options);
}

//上传图片/视频附件
function uploadFile(id, target){
	var $list = $(target + ' #uploadFile input[type=hidden]');
	var data = new Array();
	var _index = 0, len_video = $(target + ' #uploadFile input[type=hidden].video').length;
	for(var i=0;i<$list.length;i++){
		if($list.eq(i).hasClass('video')){
			uploadVideo(id, $list.eq(i).val());
			_index++;
		}else{
			data.push($list.eq(i).val());
		}
	}
	if(_index == len_video){ //视频上传完成，开始上传照片
		$.ajax({
			type : 'post',  
		    url : _url + 'uploadImg' + _prams,
		    data: {
		    	list: data,
		    	appId: id,
		    	type: 3
		    },
		    traditional: true,
		    dataType: 'json',	
			//jsonp: "callback",
		    //jsonpCallback:"callback_uploadDrop" + new Date().getTime(),
		    success: function (json) { 
		    	app.preloader.hide();
		    	if(json.flag){
		    		tips('保存成功', function(){
			    		mainView.router.back();
			    	});
		    	}else{
		    		tips('照片保存失败', function(){
			    		mainView.router.back();
			    	});
		    	}
		    },
		    error: function(e){
		        console.info(e);
		    	app.preloader.hide();
		    	tips('附件保存失败', function(){
		    		mainView.router.back();
		    	});
		    }
		});
	}
}

//上传文件处理
function uploadVideo(id, url) {
    var fileURL = url;
    var win = function (r) {
        console.info(r);
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }
    var fail = function (error) {
        console.info(error);
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
    //参数
    var options = new FileUploadOptions();
    options.fileKey = 'file';
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "video/mpeg";
    var params = {
    	username: userName,
    	password: passWord,
    	appId: id
    };
    options.params = params;
    //执行上传
    var ft = new FileTransfer();
    //绑定显示上传进度
    ft.onprogress = function (e) {
        if (e.lengthComputable) {
            console.log('当前进度：' + e.loaded / e.total);
        }
    }
    ft.upload(fileURL, encodeURI(_url + 'uploadVideo'), win, fail, options);
}
