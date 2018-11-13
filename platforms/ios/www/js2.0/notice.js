//全局变量
var _listId = '';
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
			
			getList();
			
			//搜索
			$('.searchbar-search-button').off('click').on('click', function(){
				pageNum = 0;
				keyword = $.trim($('form.searchbar input[name=search]').val());
				emptyList('#zclist');
				getList();
			});
			$('.input-clear-button').off('click').on('click', function(){
				pageNum = 0;
				keyword = '';
				emptyList('#zclist');
				getList();
			});
			$('form.searchbar').submit(function(e){
                if (e && e.preventDefault) {
                    //阻止默认浏览器动作(W3C)
                    e.preventDefault();
                }
				pageNum = 0;
				keyword = $.trim($('form.searchbar input[name=search]').val());
				emptyList('#zclist');
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
					url: _url + "pubContentView" + _prams,
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
							$('#content').html(data.content);
							getFilesForVue(_listId, '#fileList', data.files);
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
		$.ajax({
			type: "get",
			url: _url + "pubContentList" + _prams,
			data: {
				'pageNum': pageNum,
				'pageSize': pageSize,
				'keyword': keyword,
				'typeCode': 14
			},
			dataType: 'jsonp',
			jsonp: "callback",
	        jsonpCallback:"callback_list" + new Date().getTime(),
			success: function (data) {
				var json = data.data;
				var _html = '';
				if(json.length == 0){
					if(pageNum == 0){
						$('#zclist').html(noData);
					}else{
						$('#zclist .block-footer p').addClass('no-more').text('没有更多数据了');
					}
				}else{
					for(var i=0;i<json.length;i++){
						_html += '<li id="' + json[i].id + '">'
							+ '<a href="/view/" class="item-link item-content">'
								+ '<div class="item-inner">'
									+ '<div class="item-title-row">'
										+ '<div class="item-title">' + json[i].title + '(' + json[i].source + ')</div>'
									+ '</div>'
									+ '<div class="item-text custom-text-right">' + json[i].bootDate + '</div>'
								+ '</div>'
							+ '</a>'
						+ '</li>'
					}
					$("#zclist ul").append(_html);
					if(json.length < pageSize){
						$('#zclist .block-footer p').addClass('no-more').text('没有更多数据了');
					}else{
						$('#zclist .block-footer p').removeClass('no-more').text('点击加载更多');
					}
				}
				app.preloader.hide();
				duringSearch = false;
			},
			complete: function(){
				//点击加载更多
				$('#zclist .block-footer p').off('click').on('click', function(){
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
				$('#zclist').html(noData);
				duringSearch = false;
			}
		});
	}
}
