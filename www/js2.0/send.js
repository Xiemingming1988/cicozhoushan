//全局变量
var _listId = '', conNumId = '', pickerDevice = '';
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
				pushHistory('view.html');
				
				$.ajax({
					type: "get",
					url: _url + "sendFileView" + _prams,
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
									gTime: function(t){
										return getDate(t);
									}
								}
							});
							getFilesForVue(_listId, '#fileList', data.files);
						}
					}
				});
				
				$.ajax({
					type: "get",
					url: _url + "getSendFileSignedUsers" + _prams,
					data: {
						'id': _listId
					},
					dataType: 'jsonp',
					jsonp: "callback",
			        jsonpCallback:"callback_detail" + new Date().getTime(),
					success: function (json) {
						var data = handleData(json);
						if(data != ''){
							new Vue({
								el: '#detail',
								data: {
									items: data
								}
							});
						}
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
			url: _url + "sendFileList" + _prams,
			data: {
				'pageNum': pageNum,
				'pageSize': pageSize,
				'keyword': keyword,
				'sectionId': conNum_id,
				'pageType': 1
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
						json[i].fileNum = json[i].fileNum == null ? '' : json[i].fileNum;
						var _isSign = '';
						if(json[i].isSign == 0){
							_isSign = '未签收'
						}else if(json[i].isSign == 1){
							_isSign = '签收中'
						}else{
							_isSign = '已签收'
						}
						_html += '<li id="' + json[i].id + '">'
							+ '<a href="/view/" class="item-link item-content">'
								+ '<div class="item-inner">'
									+ '<div class="item-title-row">'
										+ '<div class="item-title">(' + json[i].fileNum + ')' + json[i].title + '</div>'
									+ '</div>'
									+ '<div class="item-subtitle">'
										+ '<p style="margin-top: 10px;">移交人：' + json[i].sendUserName + '</p>'
										+ '<p>签收状态：' + _isSign + '</p>'
									+ '</div>'
									+ '<div class="item-text custom-text-right">' + json[i].sendTime + '</div>'
								+ '</div>'
							+ '</a>'
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
			if(callback){
            	var _callback = eval(callback);
            	_callback.apply();
            }
			pickerDevice.on('open', function(){
				$('.custom-sheet-modal-cover').show();
			});
			pickerDevice.on('close', function(){
				emptyList('#list');
				conNumId = this.value;
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
