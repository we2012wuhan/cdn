/**
 * DWZ 自定义扩展方法
 * @author shegj
 * @date 2015-05-29
 */

/**
 * 后台管理横向菜单切换提示
 * 目前只针对课件上传 编辑 页面进行控制
 * 默认 false 不提示，true 提示。
 * @author shegj
 * @date 2015-08-11
 */
var ostcmsDwzPageSwitchFlag = false;

/**
 * 设置ostcmsDwzPageSwitchFlag 标志，针对点击标签页X关闭时的调用。
 * @author shegj
 * @date 2015-08-11
 * @param curTabId
 */
function setDwzPageSwitchFlag(curTabId){
	var newCurNavTabId = curNavTabId();
	if(curTabId == newCurNavTabId){
		ostcmsDwzPageSwitchFlag = true;
	}else{
		ostcmsDwzPageSwitchFlag = false;
	}
//	console.info("ostcmsDwzPageSwitchFlag  == "+ostcmsDwzPageSwitchFlag);
	if(ostcmsDwzPageSwitchFlag){
		setTimeout(function(){
			setDwzPageSwitchFlag(curTabId);
		},1000);
	}
}

/**
 * 针对上传大文件时，预防会话断开，空请求后台保持会话
 * @author shegj
 * @date 2015-08-06
 */
var uploadSesssionFlag = true;
function uploadSesssionSubmit(basePath,curTabId){
//	console.info("curTabId===="+curTabId);
	var url = basePath+"/requestSes?_="+new Date().getTime();
	url += "&curJsSessionId="+curJsSessionId;
	$.ajax({
		type:"POST",
		async:false,
		url:url,
		data:{},
		cache:false,
		success:function(response){},
		error: function(xhr, ajaxOptions, thrownError){}
	});
	setTimeout(function(){
		if(uploadSesssionFlag){
			var newCurNavTabId = curNavTabId();
//			console.info("newCurNavTabId===="+newCurNavTabId);
			if(curTabId == newCurNavTabId){
				uploadSesssionSubmit(basePath,curTabId);
			}
		}
	},1000*60*5);//5分钟执行一次
}

function setUploadSesssionFlag(){
	uploadSesssionFlag = false;
	ostcmsDwzPageSwitchFlag = false;
}

/**
 * 初始化加载 JbsxBox 
 * @author shegj
 * @date 2015-05-29
 */
function initJbsxBoxLoad(rel,url){
	if(rel){
		var $rel = $("#"+rel);
		$rel.loadUrl(url, {}, function(){
			$rel.find("[layoutH]").layoutH();
		});
	}
}

/**
 * 获取当前
 * @author shegj
 * @date 2015-05-29
 * @returns tabId
 */
function curNavTabId(){
	var tabId = $("ul.navTab-tab li.selected").attr("tabid");
	return tabId;
}


/**
 * 自定义扩展DWZ
 * 普通ajax表单提交
 * @param {Object} form
 * @param {Object} callback
 * @param {String} confirmMsg 提示确认信息
 * @author shegj
 * @date 2015-05-29
 */
function validateCallbackCustom(form, url, confirmMsg) {
	var $form = $(form);
	if (!$form.valid()) {
		return false;
	}
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	var _submitFn = function(){
		$.ajax({
			type: form.method || 'POST',
			url:action,
			data:$form.serializeArray(),
			dataType:"json",
			cache: false,
			success: function(json){
				navTabAjaxDoneCustom(json,url);
			} || DWZ.ajaxDone,
			error: DWZ.ajaxError
		});
	}
	if (confirmMsg) {
		alertMsg.confirm(confirmMsg, {okCall: _submitFn});
	} else {
		_submitFn();
	}
	return false;
}

/**
 * 自定义扩展DWZ方法 表单提交回调函数．
 * @param json
 * @param url
 * @author shegj
 * @date 2015-05-29
 */
function navTabAjaxDoneCustom(json,url){
	DWZ.ajaxDone(json);
	if (json.statusCode == DWZ.statusCode.ok){
		var navTabId = json.navTabId;
		if(!navTabId){
			navTabId = navTab._getTabId(url);
			//把指定navTab页面标记为需要“重新载入”。注意navTabId不能是当前navTab页面的
			navTab.reloadFlag(navTabId);
		}
		if ("closeCurrent" == json.callbackType) {
			setTimeout(function(){navTab.closeCurrentTab(navTabId);}, 100);
		} 
	}
}


/**
 * 带文件上传的ajax表单提交并返回导入结果
 * @param {Object} form
 * @param {Object} callback
 * @author shegj
 * @date 2015-06-11
 */
function iframeCallbackRefreshDiv(form, divId,callback){
	var $form = $(form), $iframe = $("#callbackframeOrg");
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	$form.attr({action:action});
	if(!$form.valid()) {return false;}
	
	if ($iframe.size() == 0) {
		$iframe = $("<iframe id='callbackframeOrg' name='callbackframeOrg' src='about:blank' style='display:none'></iframe>").appendTo("body");
	}
	if(!form.ajax) {
		$form.append('<input type="hidden" name="ajax" value="1" />');
	}
	form.target = "callbackframeOrg";
	
	_iframeResponseCustomDiv($iframe[0], divId,callback);
}
/**
 * 带文件上传的表单提交
 * @author shegj
 * @date 2015-06-08
 */
function _iframeResponseCustomDiv(iframe, divId,callback){
	var $iframe = $(iframe), $document = $(document);
	$document.trigger("ajaxStart");
	$iframe.bind("load", function(event){
		$iframe.unbind("load");
		$document.trigger("ajaxStop");
		if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
			iframe.src == "javascript:'<html></html>';") { // For FF, IE
			return;
		}
		var doc = iframe.contentDocument || iframe.document;
		// fixing Opera 9.26,10.00
		if (doc.readyState && doc.readyState != 'complete') return; 
		// fixing Opera 9.64
		if (doc.body && doc.body.innerHTML == "false") return;
		var response;
		if (doc.XMLDocument) {
			// response is a xml document Internet Explorer property
			response = doc.XMLDocument;
		} else if (doc.body){
			try{
				response = $iframe.contents().find("body").text();
				response = jQuery.parseJSON(response);
			} catch (e){ // response is html document or plain text
				response = doc.body.innerHTML;
			}
		} else {
			// response is a xml document
			response = doc;
		}
		DWZ.ajaxDone(response);
		$("#"+divId).find("[layoutH]").layoutH();
		$("#"+divId).empty();
		$("#"+divId).append(response).initUI();
		if(callback){
			callback();
		}
	});
}

/**
 * 带文件上传的ajax表单提交
 * @param {Object} form
 * @param {Object} callback
 */
function iframeCallbackCustom(form, url){
	var $form = $(form), $iframe = $("#callbackframe");
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	$form.attr({action:action});
	if(!$form.valid()) {return false;}
	
	if ($iframe.size() == 0) {
		$iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
	}
	if(!form.ajax) {
		$form.append('<input type="hidden" name="ajax" value="1" />');
	}
	form.target = "callbackframe";
	
	_iframeResponseCustom($iframe[0], url);
}
/**
 * 带文件上传的表单提交
 * @author shegj
 * @date 2015-06-08
 */
function _iframeResponseCustom(iframe, url){
	var $iframe = $(iframe), $document = $(document);
	
	$document.trigger("ajaxStart");
	
	$iframe.bind("load", function(event){
		$iframe.unbind("load");
		$document.trigger("ajaxStop");
		
		if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
			iframe.src == "javascript:'<html></html>';") { // For FF, IE
			return;
		}

		var doc = iframe.contentDocument || iframe.document;

		// fixing Opera 9.26,10.00
		if (doc.readyState && doc.readyState != 'complete') return; 
		// fixing Opera 9.64
		if (doc.body && doc.body.innerHTML == "false") return;
	   
		var response;
		
		if (doc.XMLDocument) {
			// response is a xml document Internet Explorer property
			response = doc.XMLDocument;
		} else if (doc.body){
			try{
				response = $iframe.contents().find("body").text();
				response = jQuery.parseJSON(response);
			} catch (e){ // response is html document or plain text
				response = doc.body.innerHTML;
			}
		} else {
			// response is a xml document
			response = doc;
		}
		
		navTabAjaxDoneCustom(response,url);
	});
}
/**
 * 带文件上传的表单提交之局部刷新
 * @author shegj
 * @date 2015-06-08
 * 
 * 增加参数判断是否弹出页 zxf
 */
function iframePartCallbackCustom(form,url, searchFormName,rel,dialog){
	var $form = $(form), $iframe = $("#callbackframe");
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	$form.attr({action:action});
	if(!$form.valid()) {return false;}
	if ($iframe.size() == 0) {
		$iframe = $("<iframe id='callbackframe' name='callbackframe' src='about:blank' style='display:none'></iframe>").appendTo("body");
	}
	if(!form.ajax) {
		$form.append('<input type="hidden" name="ajax" value="1" />');
	}
	form.target = "callbackframe";
	
	_iframePartResponseCustom($iframe[0],url, searchFormName,rel,dialog);
}
/**
 * 带文件上传的表单提交之局部刷新
 * @author shegj
 * @date 2015-06-08
 * 
 * 增加参数判断是否弹出页 zxf
 */
function _iframePartResponseCustom(iframe,url, searchFormName,rel,dialog){
	var $iframe = $(iframe), $document = $(document);
	
	$document.trigger("ajaxStart");
	
	$iframe.bind("load", function(event){
		$iframe.unbind("load");
		$document.trigger("ajaxStop");
		
		if (iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" || // For Safari
			iframe.src == "javascript:'<html></html>';") { // For FF, IE
			return;
		}

		var doc = iframe.contentDocument || iframe.document;

		// fixing Opera 9.26,10.00
		if (doc.readyState && doc.readyState != 'complete') return; 
		// fixing Opera 9.64
		if (doc.body && doc.body.innerHTML == "false") return;
	   
		var response;
		
		if (doc.XMLDocument) {
			// response is a xml document Internet Explorer property
			response = doc.XMLDocument;
		} else if (doc.body){
			try{
				response = $iframe.contents().find("body").text();
				response = jQuery.parseJSON(response);
			} catch (e){ // response is html document or plain text
				response = doc.body.innerHTML;
			}
		} else {
			// response is a xml document
			response = doc;
		}
		
		navTabAjaxPartDoneCustom(response,url,searchFormName,rel,dialog);
	});
}

/**
 * 带文件上传的表单提交之局部刷新
 * @author shegj
 * @date 2015-06-08
 * 
 * 增加参数判断是否弹出页 zxf
 */
function navTabAjaxPartDoneCustom(json,url,searchFormName,rel,dialog){
	DWZ.ajaxDone(json);
	if (json.statusCode == DWZ.statusCode.ok){
		var navTabId = json.navTabId;
		if(!navTabId){
			navTabId = navTab._getTabId(url);
			//把指定navTab页面标记为需要“重新载入”。注意navTabId不能是当前navTab页面的
			//navTab.reloadFlag(navTabId);
		}
		if ("closeCurrent" == json.callbackType) {
			if(dialog == "dialog"){
				$.pdialog.closeCurrent();//如果是弹出页，关闭弹出页
			}else{
				setTimeout(function(){navTab.closeCurrentTab(navTabId);}, 100);
			}
		} else if ("forward" == json.callbackType) {
			navTab.reload(json.forwardUrl);
		} else if ("forwardConfirm" == json.callbackType) {
			alertMsg.confirm(json.confirmMsg || DWZ.msg("forwardConfirmMsg"), {
				okCall: function(){
					navTab.reload(json.forwardUrl);
				},
				cancelCall: function(){
					navTab.closeCurrentTab(navTabId);
				}
			});
		} else {
			navTab.getCurrentPanel().find(":input[initValue]").each(function(){
				var initVal = $(this).attr("initValue");
				$(this).val(initVal);
			});
		}
		var $searchForm = $("form[name="+searchFormName+"]");
		if ($searchForm[DWZ.pageInfo.pageNum]) $searchForm[DWZ.pageInfo.pageNum].value = 1;
		if (rel) {
			var $box = $("#" + rel);
			setTimeout(function(){
				$box.ajaxUrl({
					type:"POST", url:$searchForm.attr("action"), data: $searchForm.serializeArray(), callback:function(){
						$box.find("[layoutH]").layoutH();
					}
				});
			},100);
		}
	}
}


/**
 * Dialog表单提交后自定义回调函数处理
 * @param form
 * @param callback
 * @param confirmMsg
 * @returns {Boolean}
 * @author shegj
 * @date 2015-06-08
 */
function validateCallbackDialog(form, callback, confirmMsg) {
	var $form = $(form);
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	$form.attr({action:action});
	if (!$form.valid()) {
		return false;
	}
	var _submitFn = function(){
		$.ajax({
			type: form.method || 'POST',
			url:action,
			data:$form.serializeArray(),
			dataType:"json",
			cache: false,
			success: function(json){
				DWZ.ajaxDone(json);
				if (json.statusCode == DWZ.statusCode.ok){
					if (json.navTabId){
						navTab.reload(json.forwardUrl, {navTabId: json.navTabId});
					} else if (json.rel) {
						var $pagerForm = $("#pagerForm", navTab.getCurrentPanel());
						var args = $pagerForm.size()>0 ? $pagerForm.serializeArray() : {}
						navTabPageBreak(args, json.rel);
					}
					if(callback){
						callback(json.datas);
					}
					if ("closeCurrent" == json.callbackType) {
						$.pdialog.closeCurrent();
					}
				}
			} ,
			error: DWZ.ajaxError
		});
	}
	
	if (confirmMsg) {
		alertMsg.confirm(confirmMsg, {okCall: _submitFn});
	} else {
		_submitFn();
	}
	
	return false;
}

/**
 * 自定义表单提交，提交成功后不做任何初始化处理，
 * @param form				必选
 * @param callback			可选
 * @param confirmMsg		可选
 * @returns {Boolean}
 * @author shegj
 * @date 2015-06-09
 */
function validateCallbackCustomNoOperat(form, callback, confirmMsg) {
	var $form = $(form);
	if (!$form.valid()) {
		return false;
	}
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	$form.attr({action:action});
	var _submitFn = function(){
		$.ajax({
			type: form.method || 'POST',
			url:action,
			data:$form.serializeArray(),
			dataType:"json",
			cache: false,
			success: function(json){
				DWZ.ajaxDone(json);
				if(callback){
					eval(callback+"(json)");
				}
			} ,
			error: DWZ.ajaxError
		});
	}
	
	if (confirmMsg) {
		alertMsg.confirm(confirmMsg, {okCall: _submitFn});
	} else {
		_submitFn();
	}
	
	return false;
}

/**
 * Dialog 表单提交扩展 支持局部刷新
 * @param form
 * @param searchFormName
 * @param rel
 * @param callback
 * @param confirmMsg
 * @returns {Boolean}
 * @author shegj
 * @date 2015-06-09
 */
function validateCallbackDialogRefresh(form,searchFormName,rel, callback, confirmMsg) {
	var $form = $(form);
	if (!$form.valid()) {
		return false;
	}
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	var _submitFn = function(){
		$.ajax({
			type: form.method || 'POST',
			url:action,
			data:$form.serializeArray(),
			dataType:"json",
			cache: false,
			success: function(json){
				DWZ.ajaxDone(json);
				if (json.statusCode == DWZ.statusCode.ok){
					if (json.navTabId){
						navTab.reload(json.forwardUrl, {navTabId: json.navTabId});
					} else if (json.rel) {
						var $pagerForm = $("#pagerForm", navTab.getCurrentPanel());
						var args = $pagerForm.size()>0 ? $pagerForm.serializeArray() : {}
						navTabPageBreak(args, json.rel);
						
						
						
					}
					if(callback){
						callback(json.datas);
					}
					if ("closeCurrent" == json.callbackType) {
						$.pdialog.closeCurrent();
					}
					
					var $searchForm = $("form[name="+searchFormName+"]");
					if ($searchForm[DWZ.pageInfo.pageNum]) $searchForm[DWZ.pageInfo.pageNum].value = 1;
					if (rel) {
						var $box = $("#" + rel);
						setTimeout(function(){
							$box.ajaxUrl({
								type:"POST", url:$searchForm.attr("action"), data: $searchForm.serializeArray(), callback:function(){
									$box.find("[layoutH]").layoutH();
								}
							});
						},100);
					}
				}
			} ,
			error: DWZ.ajaxError
		});
	}
	
	if (confirmMsg) {
		alertMsg.confirm(confirmMsg, {okCall: _submitFn});
	} else {
		_submitFn();
	}
	
	return false;
}

/**
 * dialog 修改密码成功后弹出dialog登录页面
 * @param form
 * @param confirmMsg
 * @returns {Boolean}
 * @author shegj
 * @date 2015-07-03
 */
function validatePasswdCallback(form,confirmMsg) {
	var $form = $(form);
	if (!$form.valid()) {
		return false;
	}
	var action = $form.attr("action");
	action += action.indexOf("?") == -1 ? "?" : "&";
	action += "curJsSessionId="+curJsSessionId;
	var _submitFn = function(){
		$.ajax({
			type: form.method || 'POST',
			url:action,
			data:$form.serializeArray(),
			dataType:"json",
			cache: false,
			success: function(json){
				DWZ.ajaxDone(json);
				if (json.statusCode == DWZ.statusCode.ok){
					if ("closeCurrent" == json.callbackType) {
						$.pdialog.closeCurrent();
					}
					if(json.message){
						alertMsg.correct(json.message);
						DWZ.loadLogin();
					}
				}
			},
			error: DWZ.ajaxError
		});
	}
	if (confirmMsg) {
		alertMsg.confirm(confirmMsg, {okCall: _submitFn});
	} else {
		_submitFn();
	}
	return false;
}
