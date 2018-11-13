var destinationType;
var $file = '',
	$files = new Array();
var uploadSuccess = 0;
var USERID = localStorage.getItem("userId"); //用户id
var UserName = localStorage.getItem("username"); //用户名称
var ipconfig = window.location.href.split('/')[0] + '//' + window.location.href.split('/')[2];
var registrationid = ''; //存放设备id
var alertContent = ''; //存放通知栏点击返回值
var deptmentId,personID;//通讯录部门Id,人员ID
var noticeId = '', newsId = ''; //公告id，图片新闻id
document.addEventListener("deviceready", onDeviceReady, false);
var version = '1.0.11';

function onDeviceReady() {
	//Cordove加载完成后会触发
	destinationType = navigator.camera.DestinationType;
    //获取设备id
    window.JPush.getRegistrationID(onGetRegistrationID);
    
    window.JPush.setApplicationIconBadgeNumber(0);
    //通知栏点击监听
    document.addEventListener("jpush.openNotification", onOpenNotification, false);
    //返回键系统最小化
    document.addEventListener("backbutton", function() {
        window.plugins.appMinimize.minimize();
 }, false);
}
//获取设备id
var onGetRegistrationID = function(data) {
  try {
  	registrationid = data;
  } catch (exception) {
    console.log(exception);
  }
};
//通知栏点击监听
var onOpenNotification = function(event) {
	try {
		alertContent = event.extras;
		if(alertContent.type == 1){
			window.location.href = 'shouwen/list.html?id='+alertContent.id+'&procInsId='+alertContent.procInsId+'&taskId='+alertContent.taskId;
		}else if(alertContent.type == 2){
			window.location.href = 'fawen/list.html?id='+alertContent.id+'&procInsId='+alertContent.procInsId+'&taskId='+alertContent.taskId;
		}else{
			window.location.href = 'index.html';
		}
		console.log("open Notification:" + alertContent);
	} catch (exception) {
		console.log("JPushPlugin:onOpenNotification" + exception);
	}
};


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
	// App root element
	root: '#app',
	// App Name
	name: 'My App',
	// App id
	id: 'com.myapp.test',
	// Enable swipe panel
	panel: {
		swipe: 'left',
	},
	dialog: {
	    title: '提示',
	    buttonOk: '确定',
	    buttonCancel: '取消'
	},
	photoBrowser: {
	    theme: 'dark',
	    type: 'standalone',
	    backLinkText: '关闭',
	    navbarOfText: '/'
	},
	on: {
		init: function(){
			pushHistory('index.html');
			//判断版本更新
			var u = navigator.userAgent, app = navigator.appVersion;  
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
			if(isAndroid){
				$.getJSON('http://api.fir.im/apps/latest/5a7bec3dca87a8130da11354?api_token=62331ebfae3d1d542d6b6b91b4372345', function(data) {
					if(version != data.versionShort){
						app.dialog.confirm('检查到新版本，是否立即更新？', '提示', function(){
							tips('正在跳转更新...', function(){
								window.location.href = data.update_url;
							});
						}, function(){});
					}
				});
			}else{
				$.getJSON('http://api.fir.im/apps/latest/5a7bebdd959d693f50f10a61?api_token=62331ebfae3d1d542d6b6b91b4372345', function(data) {
					if(version != data.versionShort){
						app.dialog.confirm('检查到新版本，是否立即更新？', '提示', function(){
							tips('正在跳转更新...', function(){
								window.location.href = data.update_url;
							});
						}, function(){});
					}
				});
			}
			
		  	//页面跳转
			$$('.custom-functionalArea td a').off('click').on('click', function(){
				var $url = $(this).data('url');
				if($url != '' && $url != null && $url != undefined){
					window.location.href = $url;
				}
			});
			
			//获取用户信息
			new Vue({
				el: '.custom-person-info',
				data: {
					trueName: userTrueName,
					email: userEmail,
					phone: userPhone,
					projectName: projectName,
					orgName: userOrgName,
					positionName: userPositionName,
					remark: userRemark
				},
				methods: {
					isNull: function(n){
						if(n == 'null' || n == null){
							return '';
						}else{
							return n;
						}
					}
				}
			});
			
			//获取图片新闻
			$.ajax({
				type: "post",
				url: _url + "newsPictureList" + _prams,
				data: {
					'pageNum': 0,
					'pageSize': 3
				},
				dataType: "jsonp",
				success: function(json){
					var data = handleData(json);
					if(data != ''){
						var newsArr = new Array();
						var len = data.length > 3 ? 3 : data.length;
						for(var i = 0; i < len; i ++){
							newsArr.push(data[i]);
						}
						new Vue({
							el: '#custom-picNews',
							data: {
								newslist: newsArr
							},
							methods: {
								getpic: function(path){
									return _ipconfig + path;
								}
							}
						});
					}
				},
				complete: function(){
					$('.custom-picNews').off('click').on('click', function(){
						newsId = $(this).attr('id');
					})
				}
			});
			//获取通知公告
			$.ajax({
				type: "post",
				url: _url + "pubContentList" + _prams,
				data: {
					'pageNum': 0,
					'pageSize': 1,
					'typeCode': 14,
					'publishNotice': 1, //发布公告选项为“是”
					'reportState': 2 //上报状态为“审核完毕”
				},
				dataType: "jsonp",
				success: function(json){
					var data = handleData(json);
					if(data != ''){
						new Vue({
							el: '.custom-notification',
							data: data[0]
						});
					}
				},
				complete: function(){
					$('.custom-notification a').off('click').on('click', function(){
						noticeId = $(this).attr('id');
					})
				}
			});
		},
		pageReinit: function(){
			pushHistory('index.html');
			
			//页面跳转
			$$('.custom-functionalArea td a').off('click').on('click', function(){
				var $url = $(this).data('url');
				if($url != '' && $url != null && $url != undefined){
					window.location.href = $url;
				}
			});
			
			//获取用户信息
			new Vue({
				el: '.custom-person-info',
				data: {
					trueName: userTrueName,
					email: userEmail,
					phone: userPhone,
					projectName: projectName,
					orgName: userOrgName,
					positionName: userPositionName,
					remark: userRemark
				},
				methods: {
					isNull: function(n){
						if(n == 'null' || n == null){
							return '';
						}else{
							return n;
						}
					}
				}
			});
			
			//获取图片新闻及公告
			if($('.custom-notification').length > 0){
				//获取图片新闻
				$.ajax({
					type: "post",
					url: _url + "newsPictureList" + _prams,
					data: {
						'pageNum': 0,
						'pageSize': 3
					},
					dataType: "jsonp",
					success: function(json){
						var data = handleData(json);
						if(data != ''){
							var newsArr = new Array();
							var len = data.length > 3 ? 3 : data.length;
							for(var i = 0; i < len; i ++){
								newsArr.push(data[i]);
							}
							new Vue({
								el: '#custom-picNews',
								data: {
									newslist: newsArr
								},
								methods: {
									getpic: function(path){
										return _ipconfig + path;
									}
								}
							});
						}
					},
					complete: function(){
						$('.custom-picNews').off('click').on('click', function(){
							newsId = $(this).attr('id');
						})
					}
				});
				//获取通知公告
				$.ajax({
					type: "post",
					url: _url + "pubContentList" + _prams,
					data: {
						'pageNum': 0,
						'pageSize': 1,
						'typeCode': 14,
						'publishNotice': 1, //发布公告选项为“是”
						'reportState': 2 //上报状态为“审核完毕”
					},
					dataType: "jsonp",
					success: function(json){
						var data = handleData(json);
						if(data != ''){
							new Vue({
								el: '.custom-notification',
								data: data[0]
							});
						}
					},
					complete: function(){
						$('.custom-notification a').off('click').on('click', function(){
							noticeId = $(this).attr('id');
						})
					}
				});
			}
		}
	},
	// Add default routes
	routes: [{
		path: '/news/',
		url: 'news.html',
		on: {
			pageInit: function(e, page) {
				//获取图片新闻详情
				$.ajax({
					type: "post",
					url: _url + "newsPictureView" + _prams,
					data: {
						'id': newsId
					},
					dataType: "jsonp",
					success: function(json){
						var data = handleData(json);
						if(data != ''){
							var picsArr = new Array();
							for(var i = 0; i < data.files.length; i ++){
								picsArr.push(data.files[i]);
							}
							new Vue({
								el: '#newsView',
								data: {
									items: picsArr,
									content: data
								},
								methods: {
									tranboolean: function(t){
										if(t){
											return '是'
										}else{
											return '否'
										}
									},
									getu: function(u){
										return _ipconfig + u;
									}
								}
							});
						}
					},
					complete: function(){
						var swiper = app.swiper.create('.swiper-container', {
					        autoplay: 3000,
					        pagination: {
					        	el:'.swiper-pagination'
					        }
						});
						
						var $silders = $('.banner .swiper-slide img');
						var _photos = [];
						for(var i=0; i<$silders.length; i++){
							var obj = new Object();
							obj.url = $silders.eq(i).attr('src');
							obj.caption = $silders.eq(i).attr('alt');
							_photos.push(obj);
						}
						
						var myPhotoBrowserPopupDark = app.photoBrowser.create({
						    photos : _photos
						});
						$('.banner .swiper-slide').on('click', function () {
							var _index = $(this).index();
						    myPhotoBrowserPopupDark.open(_index);
						});
					}
				});
			}
		}
	}, {
		path: '/notice/',
		url: 'notice/view.html',
		on: {
			pageInit: function(e, page) {
				$.ajax({
					type: "get",
					url: _url + "pubContentView" + _prams,
					data: {
						'id': noticeId
					},
					dataType: 'jsonp',
					jsonp: "callback",
			        jsonpCallback:"callback_view" + new Date().getTime(),
			        success: function (json) {
						var data = handleData(json);
						if(data != ''){
							new Vue({
								el: '#zcView',
								data: data,
								methods: {
									gState: function(t){
										switch (t) {
											case 0:
												return '未审核';
												break;
											case 1:
												return '审核中';
												break;		
											case 2:
												return '终审';
												break;
										}
									},
									tranboolean: function(b){
										if(b){
											return '是';
										}else{
											return '否';
										}
									}
								}
							});
							getFilesForVue(noticeId, '#fileList', data.files);
						}
					}
				});
			}
		}
	}, {
		path: '/address-list/',
		url: 'address/list.html',
		on: {
			pageInit: function(e, page) {			
				pushHistory('address/list.html');
				$("#addressdeptlist").empty();
				$("#addresspersonlist").empty();
				refreshDept(deptmentId);
				deptBanner(deptmentId);
				$("#addressdeptlist").on("click","li a",function(){
					deptmentId = $(this).attr("id");
					refreshDept(deptmentId);
					deptBanner(deptmentId);
				});
				
				$("#dept-banner .item-title").on("click","a",function(){
					deptmentId = $(this).attr("id");
					refreshDept(deptmentId);
					deptBanner(deptmentId);
				});
			}
		}
	},{
		path: '/address-txl/',
		url: 'address/txl.html',
		on: {
			pageInit: function(e, page) {			
				pushHistory('address/txl.html');
				//通讯录首页-部门联系人
				$.ajax({
					type: "get",
					url: _url + "addressBookList" + _prams,
					data: {"deptId": "8ae482b0570c60c201573fdd2b47018f"},
					dataType: "jsonp",
					success: function(data){
						var json = handleData(data);
						if(json != ''){
							var Html = '', deptList = json.deptlist;
							for(var i=0;i<deptList.length;i++){
								Html += '<li><a href="/address-list/" id="'+deptList[i].deptId+'">'+deptList[i].deptName+"("+deptList[i].userNum+")"+'</a></li>';
							}
							$("#addressDept").append(Html);
						}
					},
					complete: function(){
						$("#addressDept li a").click(function(){
							deptmentId = $(this).attr("id");
						});
					},
					error: function(e){
						console.info(e)
					}
				}); 
				
				$('#backToIndex').off('click').on('click', function(){
					historyBack(1);
				});
				
				//通讯录首页-常用联系人
				/*$.ajax({
					type: "post",
					url: _url + "oa/SmsPhoneBook/getUsedPersons",
					data: {"userId":USERID},
					dataType: "jsonp",
					success: function(data){
						var personList = data.data;
						if(personList.length>0){
							var html = '';
							for(var i=0;i<personList.length;i++){
								html += '<li><a href="/address-message/" id="'+personList[i].personId+'">';
								html += '<div class="item-content"><div class="item-media"><i class="icon-lianxiren"></i></div>';
								html += '<div class="item-inner"><div class="item-title">'+personList[i].trueName+'</div>';
								html += '</div></div></a></li>';
							}
							$("#addressPersonlist").append(html);
						}else{
							$("#addressPersonlist .list-group-title").text("暂无常用联系人");
						}
					},
					"complete": function(){
						$("#addressPersonlist li a").click(function(){
							personID = $(this).attr("id");
						});
					}
				});*/
			}
		}
	},{
		path: '/address-zzjg/',
		url: 'address/list.html',
		on: {
			pageInit: function(e, page) {	
				pushHistory('address/list.html');

				$('#backToIndex').off('click').on('click', function(){
					historyBack(1);
				});
				
				$("#addressdeptlist").empty();
				$("#addresspersonlist").empty();
				$.ajax({
					type: "post",
					url: _url + "addressBookList" + _prams,
					data: {"deptId":"8ae482b0570c60c201573fdd2b47018f"},
					dataType: "jsonp",
					success: function(data){
						var deptList = data.data.deptlist;
						var Html = '<li class="list-group-title">组织架构</li>';
						for(var i=0;i<deptList.length;i++){
							Html += '<li><a href="javascript:void(0);" id="'+deptList[i].deptId+'">'+deptList[i].deptName+"("+deptList[i].userNum+")"+'</a></li>';
						}
						$("#addressdeptlist").html(Html);
					},
					"complete": function(){
						$("#addressdeptlist").on("click","li a",function(){
							deptmentId = $(this).attr("id");
							refreshDept(deptmentId);
							deptBanner(deptmentId);
						});
						
						$("#dept-banner .item-title").on("click","a",function(){
							deptmentId = $(this).attr("id");
							refreshDept(deptmentId);
							deptBanner(deptmentId);
						});
					}
				});
			}
		}
	},{
		path: '/address-message/',
		url: 'address/message.html',
		on: {
			pageInit: function(e, page) {
				pushHistory('address/message.html');
				$.ajax({
					type: "post",
					url: _url + "addressBookView" + _prams,
					data: {"id": personID},
					dataType: "jsonp",
					success: function(json){
						var data = handleData(json);
						if(data != ''){
							new Vue({
								el: '#geren',
								data: data,
								methods: {
									isNull: function(i){
										if(i != null){
											return i;
										}else{
											return '无';
										}
									}
								}
							});
						}
					},
					"complete": function(){
						$('.deptment').off('click').on('click', function(){
							deptmentId = $(this).attr("id");
							refreshDept(deptmentId);
						});
						$('.appduan').off('click').on('click', function(){
							if($('.appduan-tel').text() != ''){
								window.location.href = "tel:" + $('.appduan-tel').text();
							}
						});
					}
				});
			}
		}
	},{
		path: '/address-search/',
		url: 'address/search.html',
		on: {
			pageInit: function(e, page) {			
				pushHistory('address/search.html');
				
				searchPerson();
				searchDept();

				var searchbar = app.searchbar.create({
					el : '#searchBar',
					searchContainer : '.searchtml',
					searchIn : '.item-title'
				});
				/*$("input.searchname").on("keyup",function(){
					searchPerson();
					searchDept();
				});
				$('form.searchbar').submit(function(e){
                    if (e && e.preventDefault) {
                        //阻止默认浏览器动作(W3C)
                        e.preventDefault();
                    }
                    searchPerson();
                    searchDept();
                });*/
			}
		}
	}],
	init: false
});

var mainView = app.views.create('.view-main', {
  dynamicNavbar: false,
});

app.init();

/*function callphone(phone,Name,personId){    
	$.ajax({
		type: "post",
		url: _url + "oa/SmsPhoneBook/getUsedPersons",
		data: {"userId":USERID,"personId":personId,"trueName":Name},
		dataType: "jsonp",
		success: function(data){
			window.location.href = "tel:"+phone;
		}
	});
}*/

function searchPerson(){
	var searchTxt = $("input.searchname").val();
	$.ajax({
		type: "post",
		url: _url + "addressBookPerosnList" + _prams,
		data: {"keyword":searchTxt},
		dataType: "jsonp",
		success: function(data){
			var personList = data.data.personList;
			var Html = '';
			if(personList.length<1){
				Html = '<li class="list-group-title">没有搜索到联系人</li>';
			}else{
				Html = '<li class="list-group-title">搜索到的联系人</li>';
				for(var j=0;j<personList.length;j++){
					Html += '<li class="searchlist"><a href="/address-message/" id="'+personList[j].personId+'">';
					Html += '<div class="item-content" style="padding-left:0"><div class="item-media"><i class="icon-lianxiren"></i></div>';
					Html += '<div class="item-inner"><div class="item-title-row"><div class="item-title">'+personList[j].personName+'</div></div>';
					Html += '<div class="item-subtitle">'+personList[j].deptname+'</div>';
					Html += '</div></div></a></li>';
				}
			}
			$("#searchPerson").html(Html);
		},
		complete: function(){
			$("#searchPerson li a").click(function(){
				personID = $(this).attr("id");
			});
		}
	});
}

function searchDept(){
	var searchTxt = $("input.searchname").val();
	$.ajax({
		type: "post",
		url: _url + "addressBookDeptList" + _prams,
		data: {"keyword":searchTxt},
		dataType: "jsonp",
		success: function(data){
			var deptList = data.data.deptlist;
			var Html = '';
			if(deptList.length<1){
				Html = '<li class="list-group-title rrr">没有搜索到部门</li>';
			}else{
				Html = '<li class="list-group-title">搜索到的部门</li>';
				for(var j=0;j<deptList.length;j++){
					Html += '<li class="searchlist"><a href="/address-list/" id="'+deptList[j].deptId+'">';
					Html += '<div class="item-content" style="padding-left:0"><div class="item-media"><i class="icon-bumen1"></i></div>';
					Html += '<div class="item-inner"><div class="item-title-row"><div class="item-title">'+deptList[j].deptName+'('+deptList[j].userNum+")"+'</div></div>';
					Html += '</div></div></a></li>';
				}
			}
			$("#searchDept").html(Html);
		},
		complete: function(){
			$("#searchDept li a").click(function(){
				deptmentId = $(this).attr("id");
			});
		}
	});
}

//部门信息页面刷新
function refreshDept(Id){
	$("#addressdeptlist").empty();
	$("#addresspersonlist").empty();
	$.ajax({
		type: "post",
		url: _url + "addressBookList" + _prams,
		data: {"deptId":Id},
		dataType: "jsonp",
		success: function(data){
			var deptList = data.data.deptlist,personList = data.data.personList;
			var Html = '',html = '';
			for(var i=0;i<deptList.length;i++){
				Html += '<li><a href="javascript:void(0);" id="'+deptList[i].deptId+'">'+deptList[i].deptName+"("+deptList[i].userNum+")"+'</a></li>';
			}
			$("#addressdeptlist").html(Html);
			for(var j=0;j<personList.length;j++){
				html += '<li>'
					    + '<a id="'+personList[j].personId+'" href="/address-message/" class="item-link item-content">'
					      + '<div class="item-media"><i class="icon-lianxiren"></i></div>'
					      + '<div class="item-inner">'
					        + '<div class="item-title">' + personList[j].personName + '</div>'
					      + '</div>'
					    + '</a>'
					  + '</li>';
			}
			$("#addresspersonlist").html(html);
		},
		complete:function(){
			$("#addresspersonlist li a").click(function(){
				personID = $(this).attr("id");
			});
		}
	});
}

function deptBanner(ID){
	$("#dept-banner .item-title").empty();
	$.ajax({
		type: "post",
		url: _url + "addressBookOrgNavigation" + _prams,
		data: {"deptId":ID},
		dataType: "jsonp",
		success: function(data){
			var _json = data.data.deptlist;
			var _html = '', i = 0;
			for(i; i < _json.length - 1; i ++){
				_html += '<a id="'+_json[i].deptId+'">'+_json[i].deptName+'</a><span>></span>';
			}
			_html += '<span style="margin:0">'+_json[i].deptName+'</span>';
			$("#dept-banner .item-title").html(_html);
		},
		complete: function(){
			var _w = $('#dept-banner .item-title').width();
			$('#dept-banner .item-title *').each(function(){
				_w += $(this).outerWidth(true);
			});
			$('#dept-banner .item-title').scrollLeft(_w);
		}
	});
}

//选择照片
function imagepicker(target) {
	var num = $(target + ' .custom-photos img').length;
	ImagePicker.getPictures(function(result) {
		var pics = '',
			html = '';
		for(var i=0;i<result.length;i++){
			html += '<div class="custom-photo"><img alt="" src="data:image/jpg;base64,' + result[i].src.toString() + '" onclick="showPic(this);"><div class="custom-photo-delete" onclick="delPic(this);"><i class="icon-guano"></i></div></div>';
			$(target + ' #uploadFile').append('<input type="hidden" name="list['+i+']" value="' + result[i].src.toString() + '">');
			$files.push(result[i].src.toString());
		}
		$(target + ' #addPhoto').before(html);
		$file = result;
	}, function(err) {
		app.dialog.alert(err, '提示');
	}, {
		maximumImagesCount: 9 - num,
		width: 720,
		height: 960,
		quality: 100
	});
}

//删除照片
function delPic(obj) {
	var picId = $(obj).prev().attr('id');
	if(picId == null || picId == undefined || picId ==''){
		var _index = $(obj).parent().index();
		$(obj).parent().remove();
		$('input[name^=list]').eq(_index).remove();
		$files.splice(_index, 1);
	}else{
		app.dialog.confirm('这张照片已上传，确定要删除吗？', '提示', function() {
			var _index = $(obj).parent().index();
			$(obj).parent().remove();
			$.ajax({
				type : 'post',  
			    url : '/smartbiz/m?slb=structure/util/filedelete',
			    data: {"ID": picId},
			    //dataType: 'json',
			    success: function (str) { 
			    	app.dialog.alert('删除成功',"提示");
			    },
			    error: function(e){
			    	app.dialog.alert('删除失败',"提示");
			    }
			});
		}, function() {

		});
	}
}

//扫描

function scanCode() {
	cordova.plugins.barcodeScanner.scan(
		function(result) {
			if(result.text != '' && result.text != null && result.text != undefined){
				var _text = result.text.split(",");
				var _type = _text[0];
				var _id = _text[1];
				localStorage.setItem("scanType",_type);				
				localStorage.setItem("isLogin",true);
				if(_type==0){
					localStorage.setItem("subcontractId",_id);
					window.location.href = 'subcontract/content.html';
					localStorage.setItem("isList","1");
				}else if(_type==1){
					localStorage.setItem("conId",_id);
					window.location.href = 'subcontract/d-content0.html';
					localStorage.setItem("isList","2");
				}
			}
		},
		function(error) {
			app.dialog.alert("扫码失败： " + error, '提示');
		}, {
			prompt: "请将二维码放入扫描框中", // Android
			orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
		}
	);
}

function onBackKeyDown() {
	// 获取当前view  
	var currentView = myApp.getCurrentView();
	if(currentView.history.length > 1) {
		currentView.router.back({}); //非首页返回上一级  
	} else {
		navigator.app.exitApp(); //首页点返回键退出应用  
	}
}
