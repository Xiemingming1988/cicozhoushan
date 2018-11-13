//全局变量
var _listId = '', conNumId = '', conNumName = '', pickerDevice = '', pageType = 1, conUrl = 'contractList'; //pageType:整改督办类型（1：安全；2：质量）;conUrl:标段接口地址（'contractList'：安全；'contractCompetList'：质量）
var duringSearch = false; //是否正在搜索中，true则无法再次搜索，搜索完成后，转为false；
//分页参数
var pageNum = 0, pageSize = 20, keyword = '';

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
			
			//切换tab
			$('#carListTab li').off('click').on('click', function(){
				var $this = $(this);
				if(!$this.hasClass('active')){
					conNumId = '';
					conNumName = '';
					pageType = $this.data('state');
					$this.addClass('active').siblings().removeClass('active');
					pickerDevice.destroy();
					if(pageType == 1){ //安全
						conUrl = 'contractList';
					}else{ //质量
						conUrl = 'contractCompetList';
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
			
			//返回首页
			$$('#backToIndex').click(function(){
				historyBack(1)
			});
		},
		pageReinit: function() {
			pushHistory('list.html');
			
			emptyList('#list');
			getList();
			
			//切换tab
			$('#carListTab li').off('click').on('click', function(){
				var $this = $(this);
				if(!$this.hasClass('active')){
					conNumId = '';
					conNumName = '';
					pageType = $this.data('state');
					$this.addClass('active').siblings().removeClass('active');
					pickerDevice.destroy();
					if(pageType == 1){ //安全
						conUrl = 'contractList';
					}else{ //质量
						conUrl = 'contractCompetList';
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
		path: '/view/',
		url: 'view.html',
		on: {
			pageInit: function(e, page) {
				$.ajax({
					type: "get",
					url: _url + "safetySupervisionView" + _prams,
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
							$('#content').html(data.content);
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
				$('input[name=sectionId]').val(conNumId);
				
				if(pageType == 1){ //安全
					$('.zl').addClass('hide');
				}else{ //质量
					$('.zl').removeClass('hide');
					$('#crtName').val(userTrueName);
					$('#crtTime').val(getCurrTime(true));
				}
				
				createDatePicker2('#planFinishTime', 'yyyy-MM-dd');
				createDatePicker2('#acturalFinishTime', 'yyyy-MM-dd', '');
				
				//上传照片/视频
				$('#dbAdd #addPhoto').off('click').on('click', function(){
					app.dialog.create({
					    title: '您想要...',
					    text: '',
					    buttons: [
					      {
					        text: '拍照',
					        onClick: function(){
					        	imagepicker('#dbAdd');
							}
					      },
					      {
					        text: '摄像',
					        onClick: function(){
					        	captureVideo('#dbAdd');
							}
					      }
					    ],
					    verticalButtons: true,
					    closeByBackdropClick: true
					  }).open();
				});
				
				//保存
				$('#save').off('click').on('click', function(){
					var r = validateForm('#dbAdd');
					if(r){
						app.preloader.show();
						$.ajax({
							type: "post",
							url: _url + "safetySupervisionAdd" + _prams,
							data: {
								'entity.pageType': pageType,
								'entity.sectionId': $('#sectionId').val(),
								'entity.title': $('#title').val(),
								'entity.dutyDept': $('#dutyDept').val(),
								'entity.dutyPerson': $('#dutyPerson').val(),
								'entity.supervisePerson': $('#supervisePerson').val(),
								'entity.timeLimit': $('#timeLimit').val(),
								'entity.finishStatus': $('#finishStatus').val(),
								'entity.planFinishTime': $('#planFinishTime').val(),
								'entity.acturalFinishTime': $('#acturalFinishTime').val(),
								'entity.finishContent': $('#finishContent').val(),
								'entity.content': $('#content').val(),
								'entity.crtName': $('#crtName').val(),
								'entity.crtTime': $('#crtTime').val()
							},
							dataType: 'json',
							//jsonp: "callback",
					        //jsonpCallback:"callback_adddb" + new Date().getTime(),
							success: function (json) {
								if(json.flag){
									uploadFile(json.data, '#dbAdd');
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
	}, {
		path: '/edit/',
		url: 'edit.html',
		on: {
			pageInit: function(e, page) {
				$('input[name=section]').val(conNumName);
				$('input[name=sectionId]').val(conNumId);
				
				if(pageType == 1){ //安全
					$('.zl').addClass('hide');
				}else{ //质量
					$('.zl').removeClass('hide');
				}
				//回填详情
				$.ajax({
					type: "get",
					url: _url + "safetySupervisionView" + _prams,
					data: {
						'id': _listId
					},
					dataType: 'jsonp',
					jsonp: "callback",
			        jsonpCallback:"callback_view" + new Date().getTime(),
			        success: function (json) {
						var data = handleData(json);
						if(data != ''){
							$('#title').val(data.title);
							$('#dutyDept').val(data.dutyDept);
							$('#dutyPerson').val(data.dutyPerson);
							$('#supervisePerson').val(data.supervisePerson);
							$('#timeLimit').val(data.timeLimit);
							$("#finishStatus").find('option:contains("' + data.finishStatus + '")').attr('selected', 'selected');
							$('#planFinishTime').val(data.planFinishTime);
							$('#acturalFinishTime').val(data.acturalFinishTime);
							$('#finishContent').val(data.finishContent);
							$('#content-Tran').html(data.content);
							$('#content').text($('#content-Tran').html().replace(/<\/?.+?>/g,"").replace(/ /g, '').replace(/&nbsp;/g, ' '));
							$('#crtName').val(data.crtUserName);
							$('#crtTime').val(data.crtTime);
							getFilesForVue(_listId, '#dbEdit #fileList', data.files, true);
						}
					},
					complete: function(){
						var $planFinishTime = $('#planFinishTime').val() == '' ? '' : $('#planFinishTime').val().split('-');
						var $acturalFinishTime = $('#acturalFinishTime').val() == '' ? '' : $('#acturalFinishTime').val().split('-');
						if($planFinishTime != ''){
							var _t = [$planFinishTime[0], $planFinishTime[1], $planFinishTime[2]];
							createDatePicker2('#planFinishTime', 'yyyy-MM-dd', _t);
						}else{
							createDatePicker2('#planFinishTime', 'yyyy-MM-dd');
						}
						if($acturalFinishTime != ''){
							var _t = [$acturalFinishTime[0], $acturalFinishTime[1], $acturalFinishTime[2]];
							createDatePicker2('#acturalFinishTime', 'yyyy-MM-dd', _t);
						}else{
							createDatePicker2('#acturalFinishTime', 'yyyy-MM-dd');
						}
					}
				});
				
				//上传照片/视频
				$('#dbEdit #addPhoto').off('click').on('click', function(){
					app.dialog.create({
					    title: '您想要...',
					    text: '',
					    buttons: [
					      {
					        text: '拍照',
					        onClick: function(){
					        	imagepicker('#dbEdit');
							}
					      },
					      {
					        text: '摄像',
					        onClick: function(){
					        	captureVideo('#dbEdit');
							}
					      }
					    ],
					    verticalButtons: true,
					    closeByBackdropClick: true
					  }).open();
				});
				
				//保存
				$('#save').off('click').on('click', function(){
					var r = validateForm('#dbEdit');
					if(r){
						app.preloader.show();
						$.ajax({
							type: "post",
							url: _url + "safetySupervisionModify" + _prams,
							data: {
								'entity.id': _listId,
								'entity.pageType': pageType,
								'entity.sectionId': $('#sectionId').val(),
								'entity.title': $('#title').val(),
								'entity.dutyDept': $('#dutyDept').val(),
								'entity.dutyPerson': $('#dutyPerson').val(),
								'entity.supervisePerson': $('#supervisePerson').val(),
								'entity.timeLimit': $('#timeLimit').val(),
								'entity.finishStatus': $('#finishStatus').val(),
								'entity.planFinishTime': $('#planFinishTime').val(),
								'entity.acturalFinishTime': $('#acturalFinishTime').val(),
								'entity.finishContent': $('#finishContent').val(),
								'entity.content': $.trim($('#content').val()),
								'entity.crtName': $('#crtName').val(),
								'entity.crtTime': $('#crtTime').val()
							},
							dataType: 'json',
							//jsonp: "callback",
					        //jsonpCallback:"callback_editdb" + new Date().getTime(),
							success: function (json) {
								if(json.flag){
									uploadFile(_listId, '#dbEdit');
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
		$.ajax({
			type: "get",
			url: _url + 'safetySupervisionList' + _prams,
			data: {
				'pageNum': pageNum,
				'pageSize': pageSize,
				'keyword': keyword,
				'sectionId': conNum_id,
				'pageType': pageType
			},
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
						_html += '<li class="swipeout" id="' + json[i].id + '">'
							+ '<a href="/view/" class="item-link item-content">'
								+ '<div class="item-inner">'
									+ '<div class="item-title-row">'
										+ '<div class="item-title">' + json[i].title + '</div>'
										if(json[i].finishStatus == '已解决'){
											_html += '<div class="item-after"><span class="badge color-blue">' + json[i].finishStatus + '</span></div>'
										}else if(json[i].finishStatus == '进行中'){
											_html += '<div class="item-after"><span class="badge color-green">' + json[i].finishStatus + '</span></div>'
										}else{
											_html += '<div class="item-after"><span class="badge color-orange">' + json[i].finishStatus + '</span></div>'
										}
								_html += '</div>'
									+ '<div class="item-subtitle">' + json[i].dutyDept + '</div>'
								+ '</div>'
							+ '</a>'
							+ '<div class="swipeout-actions-right">'
								+ '<a href="/edit/" class="swipeout-edit">编辑</a>'
								+ '<a href="#" class="swipeout-delete-callback">删除</a>'
							+ '</div>'
						+ '</li>'
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
							url: _url + 'safetySupervisionDrop' + _prams,
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
		url: _url + conUrl + _prams,
		data: {
			'conType': '11,12,1'
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
