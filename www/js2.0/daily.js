//全局变量
var _listId = '', conNumId = '', conNumName = '', pickerDevice = '', monType = 1, conType = 11; //monType:日报类型（1：施工；2：监理）;conType:标段类型（11：施工；12：监理）
var arr_weather = new Array();
arr_weather[0] = '天晴', arr_weather[1] = '多云', arr_weather[2] = '多云转睛', arr_weather[3] = '小雨', arr_weather[4] = '中雨', arr_weather[5] = '大雨', arr_weather[6] = '暴雪', arr_weather[7] = '下雪', arr_weather[8] = '其它';
var duringSearch = false; //是否正在搜索中，true则无法再次搜索，搜索完成后，转为false；
//分页参数
var pageNum = 0, pageSize = 20, keyword = '';
//接口变量
var url_list = 'constructionLogList', url_view = 'constructionLogView', url_add = 'constructionLogAdd', url_edit = 'constructionLogModify', url_delete = 'constructionLogDrop';

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

document.addEventListener("deviceready", onDeviceReady, false);

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
	calendar: {
		monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
		dayNames: ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		openIn: 'customModal',
		header: false,
	  	footer: false,
	  	dateFormat: 'yyyy-mm-dd',
	  	closeOnSelect: true
	},
	on: {
		init: function(){
			pushHistory('list.html');
			
			if(userRole == 4){ //施工角色
				$('#carListTab').hide();
			}else{
				$('#carListTab').show();
			}
			//切换tab
			$('#carListTab li').off('click').on('click', function(){
				var $this = $(this);
				if(!$this.hasClass('active')){
					conNumId = '';
					conNumName = '';
					monType = $this.data('state');
					$this.addClass('active').siblings().removeClass('active');
					pickerDevice.destroy();
					if(monType == 1){ //施工
						conType = 11;
						url_list = 'constructionLogList';
						url_view = 'constructionLogView';
						url_add = 'constructionLogAdd';
						url_edit = 'constructionLogModify';
						url_delete = 'constructionLogDrop';
					}else{ //监理
						conType = 12;
						url_list = 'worklogManagerList';
						url_view = 'worklogManagerView';
						url_add = 'worklogManagerAdd';
						url_edit = 'worklogManagerModify';
						url_delete = 'worklogManagerDrop';
					}
					getContract(conNumId, function(){
						emptyList('#list');
						getList();
					});
				}
			});
			
			//获取标段
			getContract(conNumId, function(){
				getList();
			});
			$('.custom-contract-select').off('click').on('click', function(){
				pickerDevice.setValue(conNumId);
			});
			
			//搜索
			$('.searchbar-search-button').off('click').on('click', function(){
				pageNum = 0;
				keyword = $.trim($('form.searchbar input[name=search]').val());
				emptyList('#list');
				getList();
			});
			$('.input-clear-button').off('click').on('click', function(){
				pageNum = 0;
				keyword = '';
				emptyList('#list');
				getList();
			});
			$('form.searchbar').submit(function(e){
                if (e && e.preventDefault) {
                    //阻止默认浏览器动作(W3C)
                    e.preventDefault();
                }
				pageNum = 0;
				keyword = $.trim($('form.searchbar input[name=search]').val());
				emptyList('#list');
				getList();
			});
			
			// 返回首页
			$$('#backToIndex').click(function(){
				historyBack(1)
			});
		},
		pageReinit: function() {
			pushHistory('list.html');
			
			if(userRole == 4){ //施工角色
				$('#carListTab').hide();
			}else{
				$('#carListTab').show();
			}
			emptyList('#list');
			getList();
			//切换tab
			$('#carListTab li').off('click').on('click', function(){
				var $this = $(this);
				if(!$this.hasClass('active')){
					conNumId = '';
					conNumName = '';
					monType = $this.data('state');
					$this.addClass('active').siblings().removeClass('active');
					pickerDevice.destroy();
					if(monType == 1){ //施工
						conType = 11;
						url_list =   'constructionLogList';
						url_view =   'constructionLogView';
						url_add =    'constructionLogAdd';
						url_edit =   'constructionLogModify';
						url_delete = 'constructionLogDrop';
					}else{ //监理
						conType = 12;
						url_list =   'worklogManagerList';
						url_view =   'worklogManagerView';
						url_add =    'worklogManagerAdd';
						url_edit =   'worklogManagerModify';
						url_delete = 'worklogManagerDrop';
					}
					getContract(conNumId, function(){
						emptyList('#list');
						getList();
					});
				}
			});
			$('.custom-contract-select').off('click').on('click', function(){
				pickerDevice.setValue(conNumId);
			});
			//搜索
			$('.searchbar-search-button').off('click').on('click', function(){
				pageNum = 0;
				keyword = $.trim($('form.searchbar input[name=search]').val());
				emptyList('#list');
				getList();
			});
			$('.input-clear-button').off('click').on('click', function(){
				pageNum = 0;
				keyword = '';
				emptyList('#list');
				getList();
			});
			$('form.searchbar').submit(function(e){
                if (e && e.preventDefault) {
                    //阻止默认浏览器动作(W3C)
                    e.preventDefault();
                }
				pageNum = 0;
				keyword = $.trim($('form.searchbar input[name=search]').val());
				emptyList('#list');
				getList();
			});
			//返回首页
			$$('#backToIndex').click(function(){
				historyBack(1)
			});
		},
		pageInit: function() {
			//判断是否登录
			if(userName == '' || userName == undefined){
				tips('登录失效，正在跳转登录', function(){
					window.location.href = '../login.html';
				})
			}
		}
	},
	// Add default routes
	routes: [{
		path: '/view-jl/',
		url: 'view_jl.html',
		on: {
			pageInit: function(e, page) {
				$.ajax({
					type: "get",
					url: _url + "worklogManagerView" + _prams,
					data: {
						'id': _listId
					},
					dataType: 'jsonp',
					jsonp: "callback",
			        jsonpCallback:"callback_view" + new Date().getTime(),
					success: function (json) {
						var data = handleData(json);
						if(data != ''){
							new Vue({
								el: '#view',
								data: data,
								methods: {
									getw: function(w){
										return arr_weather[w];
									}
								}
							});
							getFilesForVue(_listId, '#fileList', data.files);
						}
					}
				});
			}
		}
	}, {
		path: '/view-sg/',
		url: 'view_sg.html',
		on: {
			pageInit: function(e, page) {
				$.ajax({
					type: "get",
					url: _url + "constructionLogView" + _prams,
					data: {
						'id': _listId
					},
					dataType: 'jsonp',
					jsonp: "callback",
			        jsonpCallback:"callback_view" + new Date().getTime(),
					success: function (json) {
						var data = handleData(json);
						if(data != ''){
							new Vue({
								el: '#view',
								data: data
							});
							getFilesForVue(_listId, '#fileList', data.files);
						}
					}
				});
			}
		}
	}, {
		path: '/add/',
		url: 'add.html',
		on: {
			pageInit: function(e, page) {
				$('input[name=section]').val(conNumName);
				$('input[name=section_id]').val(conNumId);
				if(monType == 1){ //施工
					$('#jlAdd').addClass('hide');
					$('#sgAdd').removeClass('hide');
					createDatePicker2('#workTime', 'yyyy-MM-dd');
					
					//上传照片/视频
					$('#sgAdd #addPhoto').off('click').on('click', function(){
						app.dialog.create({
						    title: '您想要...',
						    text: '',
						    buttons: [
						      {
						        text: '拍照',
						        onClick: function(){
						        	imagepicker('#sgAdd');
								}
						      },
						      {
						        text: '摄像',
						        onClick: function(){
						        	captureVideo('#sgAdd');
								}
						      }
						    ],
						    verticalButtons: true,
						    closeByBackdropClick: true
						  }).open();
					});
					
					//保存
					$('#save').off('click').on('click', function(){
						var r = validateForm('#sgAdd');
						if(r){
							app.preloader.show();
							$.ajax({
								type: "get",
								url: _url + "constructionLogAdd" + _prams,
								data: {
									'entity.section_id': $('#section_id').val(),
									'entity.quality_name': $('#quality_name').val(),
									'entity.workTime': $('#workTime').val()
								},
								dataType: 'jsonp',
								jsonp: "callback",
						        jsonpCallback:"callback_addsg" + new Date().getTime(),
								success: function (json) {
									if(json.flag){
										uploadFile(json.data, '#sgAdd');
									}else{
										app.preloader.hide();
										tips('基础信息保存失败', function(){
											mainView.router.back();
										});
									}
								},
								error: function(e){
									app.preloader.hide();
									tips('基础信息保存失败', function(){
										mainView.router.back();
									});
								}
							});
						}
					});
				}else{ //监理
					$('#sgAdd').addClass('hide');
					$('#jlAdd').removeClass('hide');
					createDatePicker2('#workDate', 'yyyy-MM-dd');
					
					var weather_html = '';
					for(var i=0; i<arr_weather.length; i++){
						weather_html += '<option value="' + i + '">' + arr_weather[i] + '</option>';
					}
					$('#weather').html(weather_html);
					
					$('#crtName').val(userTrueName);
					
					//上传照片/视频
					$('#jlAdd #addPhoto').off('click').on('click', function(){
						app.dialog.create({
						    title: '您想要...',
						    text: '',
						    buttons: [
						      {
						        text: '拍照',
						        onClick: function(){
						        	imagepicker('#jlAdd');
								}
						      },
						      {
						        text: '摄像',
						        onClick: function(){
						        	captureVideo('#jlAdd');
								}
						      }
						    ],
						    verticalButtons: true,
						    closeByBackdropClick: true
						  }).open();
					});
					
					//保存
					$('#save').off('click').on('click', function(){
						var r = validateForm('#jlAdd');
						if(r){
							app.preloader.show();
							$.ajax({
								type: "post",
								url: _url + "worklogManagerAdd" + _prams,
								data: {
									'entity.section_id': $('#section_id').val(),
									'entity.isEmphasis': $('#isEmphasis').val(),
									'entity.weather': $('#weather').val(),
									'entity.workDate': $('#workDate').val(),
									'entity.content': $('#content').val(),
									'entity.problemsSolutions': $('#problemsSolutions').val(),
									'entity.other': $('#other').val(),
									'entity.typeCode': 4
								},
								dataType: 'json',
								//jsonp: "callback",
						        //jsonpCallback:"callback_addjl" + new Date().getTime(),
								success: function (json) {
									if(json.flag){
										uploadFile(json.data, '#jlAdd');
									}else{
										app.preloader.hide();
										tips('基础信息保存失败', function(){
											mainView.router.back();
										});
									}
								},
								error: function(e){
									app.preloader.hide();
									tips('基础信息保存失败', function(){
										mainView.router.back();
									});
								}
							});
						}
					});
				}
			}
		}
	}, {
		path: '/edit/',
		url: 'edit.html',
		on: {
			pageInit: function(e, page) {
				$('input[name=section]').val(conNumName);
				$('input[name=section_id]').val(conNumId);
				if(monType == 1){ //施工
					$('#jlEdit').addClass('hide');
					$('#sgEdit').removeClass('hide');
					
					//回填详情
					$.ajax({
						type: "get",
						url: _url + "constructionLogView" + _prams,
						data: {
							'id': _listId
						},
						dataType: 'jsonp',
						jsonp: "callback",
				        jsonpCallback:"callback_view" + new Date().getTime(),
				        success: function (json) {
							var data = handleData(json);
							if(data != ''){
								$('#quality_name').val(data.qualityName);
								$('#workTime').val(data.workTime);
								getFilesForVue(_listId, '#sgEdit #fileList', data.files, true);
							}
						},
						complete: function(){
							var $workTime = $('#workTime').val() == '' ? '' : $('#workTime').val().split('-');
							if($workTime != ''){
								var _t = [$workTime[0], $workTime[1], $workTime[2]];
								createDatePicker2('#workTime', 'yyyy-MM-dd', _t);
							}else{
								createDatePicker2('#workTime', 'yyyy-MM-dd');
							}
						}
					});
					
					//上传照片/视频
					$('#sgEdit #addPhoto').off('click').on('click', function(){
						app.dialog.create({
						    title: '您想要...',
						    text: '',
						    buttons: [
						      {
						        text: '拍照',
						        onClick: function(){
						        	imagepicker('#sgEdit');
								}
						      },
						      {
						        text: '摄像',
						        onClick: function(){
						        	captureVideo('#sgEdit');
								}
						      }
						    ],
						    verticalButtons: true,
						    closeByBackdropClick: true
						  }).open();
					});
					
					//保存
					$('#save').off('click').on('click', function(){
						var r = validateForm('#sgEdit');
						if(r){
							app.preloader.show();
							$.ajax({
								type: "get",
								url: _url + "constructionLogModify" + _prams,
								data: {
									'entity.id': _listId,
									'entity.section_id': $('#section_id').val(),
									'entity.quality_name': $('#quality_name').val(),
									'entity.workTime': $('#workTime').val()
								},
								dataType: 'jsonp',
								jsonp: "callback",
						        jsonpCallback:"callback_editsg" + new Date().getTime(),
								success: function (json) {
									if(json.flag){
										uploadFile(_listId, '#sgEdit');
									}else{
										app.preloader.hide();
										tips('基础信息保存失败', function(){
											mainView.router.back();
										});
									}
								},
								error: function(e){
									app.preloader.hide();
									tips('基础信息保存失败', function(){
										mainView.router.back();
									});
								}
							});
						}
					});
				}else{ //监理
					$('#sgEdit').addClass('hide');
					$('#jlEdit').removeClass('hide');
					
					var weather_html = '';
					for(var i=0; i<arr_weather.length; i++){
						weather_html += '<option value="' + i + '">' + arr_weather[i] + '</option>';
					}
					$('#weather').html(weather_html);
					
					//回填详情
					$.ajax({
						type: "get",
						url: _url + "worklogManagerView" + _prams,
						data: {
							'id': _listId
						},
						dataType: 'jsonp',
						jsonp: "callback",
				        jsonpCallback:"callback_view" + new Date().getTime(),
						success: function (json) {
							var data = handleData(json);
							if(data != ''){
								if(data.isEmphasis){
									$('#isEmphasis').val('true');
								}
								$('#weather').val(data.weather);
								$('#crtName').val(data.crtUserName);
								$('#workDate').val(data.workDate);
								$('#content').val(data.content);
								$('#problemsSolutions').val(data.problemsSolutions);
								$('#other').val(data.other);
								getFilesForVue(_listId, '#jlEdit #fileList', data.files, true);
							}
						},
						complete: function(){
							var $workDate = $('#workDate').val() == '' ? '' : $('#workDate').val().split('-');
							if($workDate != ''){
								var _t = [$workDate[0], $workDate[1], $workDate[2]];
								createDatePicker2('#workDate', 'yyyy-MM-dd', _t);
							}else{
								createDatePicker2('#workDate', 'yyyy-MM-dd');
							}
						}
					});
					
					//上传照片/视频
					$('#jlEdit #addPhoto').off('click').on('click', function(){
						app.dialog.create({
						    title: '您想要...',
						    text: '',
						    buttons: [
						      {
						        text: '拍照',
						        onClick: function(){
						        	imagepicker('#jlEdit');
								}
						      },
						      {
						        text: '摄像',
						        onClick: function(){
						        	captureVideo('#jlEdit');
								}
						      }
						    ],
						    verticalButtons: true,
						    closeByBackdropClick: true
						  }).open();
					});
					
					//保存
					$('#save').off('click').on('click', function(){
						var r = validateForm('#jlEdit');
						if(r){
							app.preloader.show();
							$.ajax({
								type: "post",
								url: _url + "worklogManagerModify" + _prams,
								data: {
									'entity.id': _listId,
									'entity.section_id': $('#section_id').val(),
									'entity.isEmphasis': $('#isEmphasis').val(),
									'entity.weather': $('#weather').val(),
									'entity.workDate': $('#workDate').val(),
									'entity.content': $('#content').val(),
									'entity.problemsSolutions': $('#problemsSolutions').val(),
									'entity.other': $('#other').val(),
									'entity.typeCode': 4
								},
								dataType: 'json',
								//jsonp: "callback",
						        //jsonpCallback:"callback_editjl" + new Date().getTime(),
								success: function (json) {
									if(json.flag){
										uploadFile(_listId, '#jlEdit');
									}else{
										app.preloader.hide();
										tips('基础信息保存失败', function(){
											mainView.router.back();
										});
									}
								},
								error: function(e){
									app.preloader.hide();
									tips('基础信息保存失败', function(){
										mainView.router.back();
									});
								}
							});
						}
					});
				}
			}
		}
	}],
	init: false
});

var mainView = app.views.create('.view-main');


app.init();

function getList(){
	if(!duringSearch){
		duringSearch = true;
		app.preloader.show();
		var conNum_id = $('.custom-contract-select-value').val();
		var datas = {}
		if(monType == 1){
			$('#list').removeClass('media-list');
			datas = {
				'pageNum': pageNum,
				'pageSize': pageSize,
				'keyword': keyword,
				'sectionId': conNum_id
			}
		}else{
			$('#list').addClass('media-list');
			datas = {
				'pageNum': pageNum,
				'pageSize': pageSize,
				'keyword': keyword,
				'sectionId': conNum_id,
				'typeCode': 4
			}
		}
		$.ajax({
			type: "get",
			url: _url + url_list + _prams,
			data: datas,
			dataType: 'jsonp',
			jsonp: "callback",
	        jsonpCallback:"callback_list" + new Date().getTime(),
			success: function (data) {
				var json = handleData(data);
				var _html = '';
				if(json.length == 0){
					if(pageNum == 0){
						$('#list').html(noData);
					}else{
						$('#list .block-footer p').addClass('no-more').text('没有更多数据了');
					}
				}else{
					for(var i=0;i<json.length;i++){
						if(monType == 1){ //施工
							_html += '<li class="swipeout" id="' + json[i].id + '">'
								+ '<a href="/view-sg/" class="item-link item-content">'
									+ '<div class="item-inner">'
										+ '<div class="item-title">' + json[i].qualityName + '</div>'
										+ '<div class="item-after">' + json[i].workTime + '</div>'
									+ '</div>'
								+ '</a>'
								+ '<div class="swipeout-actions-right">'
									+ '<a href="/edit/" class="swipeout-edit">编辑</a>'
									+ '<a href="#" class="swipeout-delete-callback">删除</a>'
								+ '</div>'
							+ '</li>'
						}else{ //监理
							_html += '<li class="swipeout" id="' + json[i].id + '">'
								+ '<a href="/view-jl/" class="item-link item-content">'
									+ '<div class="item-inner">'
										+ '<div class="item-title-row">'
											+ '<div class="item-title">' + json[i].content + '</div>'
											+ '<div class="item-after">' + json[i].workDate + '</div>'
										+ '</div>'
										+ '<div class="item-text custom-text-right">'
											+ '<p>' + json[i].orgName + '</p>'
											+ '<p>' + json[i].crtUserName + '</p>'
										+ '</div>'
									+ '</div>'
								+ '</a>'
								+ '<div class="swipeout-actions-right">'
									+ '<a href="/edit/" class="swipeout-edit">编辑</a>'
									+ '<a href="#" class="swipeout-delete-callback">删除</a>'
								+ '</div>'
							+ '</li>'
						}
						
					}
					$("#list ul").append(_html);
					if(json.length < pageSize){
						$('#list .block-footer p').addClass('no-more').text('没有更多数据了');
					}else{
						$('#list .block-footer p').removeClass('no-more').text('点击加载更多');
					}
				}
				app.preloader.hide();
				duringSearch = false;
			},
			complete: function(){
				//点击加载更多
				$('#list .block-footer p').off('click').on('click', function(){
					if(!$(this).hasClass('no-more')){
						pageNum ++;
						getList();
					}
				});
				
				$('.list li').off('click').on('click', function(){
					_listId = $(this).attr('id');
				});
				
				$('.swipeout-delete-callback').off('click').on('click', function(){
					var _id = $(this).parents('li').attr('id');
					app.dialog.confirm('删除后电脑端将同步删除，确定要删除吗？', '提示', function(){
						$.ajax({
							type: "get",
							url: _url + url_delete + _prams,
							data: {
								'entity.id': _id 
							},
							dataType: 'jsonp',
							jsonp: "callback",
					        jsonpCallback:"callback_drop" + new Date().getTime(),
							success: function (json) {
								if(json.flag){
									tips('删除成功', function(){
										$('#' + _id).remove();
									});
								}else{
									tips(json.msg);
								}
							},
							error: function(e){
								tips('删除失败');
								console.log(e);
							}
						});
					}, function(){})
				});
			},
			error:function(json){
				app.preloader.hide();
				$('#list').html(noData);
				duringSearch = false;
			}
		});
	}
}

//获取标段
function getContract(id, callback){
	$.ajax({
		type: "get",
		url: _url + "contractList" + _prams,
		data: {
			'conType': conType
		},
		dataType: "jsonp",
		jsonp: "callback",
        jsonpCallback: "callback_contract" + new Date().getTime(),
		success: function (json) {
			var arr_values = [], arr_ids = [];
			var data = handleData(json);
			
			if(data != ''){
				$('.custom-contract-select-value').val(data[0].id);
				$('.custom-contract-select a').text(data[0].conNum);	
				conNumId = data[0].id;
				conNumName = data[0].conNum;
				for(var i = 0; i < data.length; i ++){
					arr_ids.push(data[i].id);
					arr_values.push(data[i].conNum);
				}
				
				if(pickerDevice == '' || pickerDevice.destroyed == true){
					pickerDevice = app.picker.create({
						inputEl : '.custom-contract-select',
						toolbarCloseText: '确定',
						cols : [ {
							textAlign: 'center',
							values: arr_ids,
							displayValues: arr_values,
						} ]
					});
				}else{
					pickerDevice.cols[0].values = arr_ids;
					pickerDevice.cols[0].displayValues = arr_values;
				}
			}else{
				tips('请先关联标段');
			}
		},
		complete: function(){
			emptyList('#list');
			if(callback){
            	var _callback = eval(callback);
            	_callback.apply();
            }
			pickerDevice.on('open', function(){
				$('.custom-sheet-modal-cover').show();
			});
			pickerDevice.off('close').on('close', function(){
				emptyList('#list');
				conNumId = this.value;
				conNumName = this.displayValue;
				$('.custom-contract-select-value').val(this.value);
				$('.custom-contract-select a').text(this.displayValue);
				if(callback){
	            	var _callback = eval(callback);
	            	_callback.apply();
	            }
				$('.custom-sheet-modal-cover').hide();
			});
		},
		error: function(e){
			tips('数据加载失败');
			console.info(e)
		}
	});
}
