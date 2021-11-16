var OSTCMSJS = {
	statusCode: {ok:200, error:300, timeout:301},
	jsonEval:function(data) {
		try{
			if ($.type(data) == 'string')
				return eval('(' + data + ')');
			else return data;
		} catch (e){
			return {};
		}
	},
	ajaxError:function(xhr, ajaxOptions, thrownError){

		alert("Http status: " + xhr.status + " " + xhr.statusText + "\najaxOptions: " + ajaxOptions + "\nthrownError:"+thrownError + "\n" +xhr.responseText);
	},
	ajaxDone:function(json){
		if(json.statusCode == OSTCMSJS.statusCode.error) {
			if(json.message) layer.alert(json.message,{icon: 2,title:'消息提示'});
		} else if (json.statusCode == OSTCMSJS.statusCode.timeout) {
//			if(alertMsg) alertMsg.error(json.message || DWZ.msg("sessionTimout"), {okCall:DWZ.loadLogin});
//			else DWZ.loadLogin();
		} else {
			if(json.message) layer.alert(json.message,{icon: 1,title:'消息提示'});
		}
	}
};

/**
 * ajax扩展-ostcms主方法
 * @param url
 * @param divId
 * @author shegj
 * @date 2015-06-30
 */
function switchPage(url,divId){
	setFrontSesssionFlag(false);
	url += url.indexOf("?") == -1 ? "?" : "&";
	url += "_="+new Date().getTime();
	url += "&curJsSessionId="+curJsSessionId;

	var ostcmsDivId = divId ? divId : "ostcmsMainDiv";
	$ostcmsMainDiv = $("#"+ostcmsDivId);
	$.ajax({
		type:"POST",
		async:false,
		url:url,
		data:{},
		cache:false,
		success:function(response){
			var json = OSTCMSJS.jsonEval(response);
			if (json.statusCode){
				if(OSTCMSJS.statusCode.ok==json.statusCode){
					if (json.message) layer.alert(json.message,{icon: 1,title:'消息提示'});
				}else {
					if(OSTCMSJS.statusCode.timeout==json.statusCode){
						if (json.message) {
							layer.alert(json.message,{icon: 2,title:'错误信息'},function(index){
//								window.location = json.forwardUrl;
								layer.close(index);
							});
						}else{
							window.location = json.forwardUrl;
						}
					}else{
						if (json.message) layer.alert(json.message,{icon: 2,title:'错误信息'});
					}
				}
				
			} else {
				$ostcmsMainDiv.html(response);
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			if(xhr.status == 500){
				$ostcmsMainDiv.html(xhr.responseText);
			}else if(xhr.status == 404){
//				var  str ="<script>";
//				str += " function switchPageCustom(url){";
//				str += " ostcmsSetTimeOut = false; ";
//				str += ' changeSelectOneLevelMenuUrl(url);';
//				str += " switchPage('/ostcms'+url);}";
//				str += " </script>";
				var str = ' <div class="g-404bg">';
				str += ' <div class="g-404txt">';
				str += ' <h2>抱歉，你访问的页面地址有误，或者该页面不存在</h2>';
				str += ' <p>请检查输入的网址是否正确，或者联系管理员<br>1) ';
				str += " <a href='javascript:void(0)' onclick=toMenujs('/portal/homenotice/home');>返回首页</a><br>2) 去其它地方逛逛：";
				str += " <a href='javascript:void(0)' onclick=toMenujs('/front/resourcecenter/listResourceCenter');>资源中心</a>";
				str += ' <a href="javascript:void(0)" onclick=toMenujs("/front/newscenter/newsn/findNewsandNoticeList");>资讯中心</a>';
				str += ' <a href="javascript:void(0)" onclick=toMenujs("/front/trainingprogram/leftright");>培训项目</a> ';
				str += ' <a href="javascript:void(0)" onclick=toMenujs("/front/personalcenter/center/toPersonalCenter");>个人中心</a></p></div></div>';
				$ostcmsMainDiv.html(str);
			}else{
				var msg = "<div>Http status: " + xhr.status + " " + xhr.statusText + "</div>" 
				+ "<div>ajaxOptions: "+ajaxOptions + "</div>"
				+ "<div>thrownError: "+thrownError + "</div>";
				layer.alert(msg,{icon: 2,title:'错误信息'});
			}
		}
	});
}

/**
 * ajax 提交form表单
 * @param form
 * @param divId
 * @param callback
 * @returns {Boolean}
 * @author shegj
 * @date 2015-06-30
 */
function ajaxSearchOrSubmitDiv(form,divId,callback){
	var $form = $(form);
	var url = $form.attr("action");
	url += url.indexOf("?") == -1 ? "?" : "&";
	url += "_="+new Date().getTime();
	url += "&curJsSessionId="+curJsSessionId;
	var ostcmsDivId = divId ? divId : "ostcmsMainDiv";
	$ostcmsMainDiv = $("#"+ostcmsDivId);
	var $form = $(form);
	$.ajax({
		type:"POST",
		async:false,
		url:url,
		data:$form.serializeArray(),
		cache:false,
		success:function(response){
			var json = OSTCMSJS.jsonEval(response);
			if (json.statusCode){
				if(OSTCMSJS.statusCode.ok==json.statusCode){
					if (json.message) {
						layer.alert(json.message,{icon: 1,title:'消息提示'},function(index){
							layer.close(index);
							if(callback){
								callback();
							}
						});
					}
				}else {
					if(OSTCMSJS.statusCode.timeout==json.statusCode){
						if (json.message) {
							layer.alert(json.message,{icon: 2,title:'错误信息'},function(index){
//								window.location = json.forwardUrl;
								layer.close(index);
							});
						}else{
							window.location = json.forwardUrl;
						}
					}else{
						if (json.message) layer.alert(json.message,{icon: 2,title:'错误信息'});
					}
				}
			} else {
				$ostcmsMainDiv.html(response);
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			if(xhr.status == 500){
				$ostcmsMainDiv.html(xhr.responseText);
			}else{
				var msg = "<div>Http status: " + xhr.status + " " + xhr.statusText + "</div>" 
						+ "<div>ajaxOptions: "+ajaxOptions + "</div>"
						+ "<div>thrownError: "+thrownError + "</div>"
						+ "<div>"+xhr.responseText+"</div>";
				layer.alert(msg,{icon: 2,title:'错误信息'});
			}
		}
	});
	return false;
}

/**
 * Dialog 模态窗口
 * @param url url地址
 * @param params 参数
 * @param title 标题
 * @param dw	宽 px
 * @param dh	高 px
 * @author shegj
 * @date 2015-07-02
 */
function ostcmsDialog(url,params,title,dw,dh){
	url += url.indexOf("?") == -1 ? "?" : "&";
	url += "_="+new Date().getTime();
	url += "&curJsSessionId="+curJsSessionId;

	var index="";
	var param = params ? params : {};
	$.ajax({
		type:"POST",
		async:false,
		url:url,
		data:param,
		cache:false,
		success:function(response){
			var json = OSTCMSJS.jsonEval(response);
			if (json.statusCode){
				if(OSTCMSJS.statusCode.timeout==json.statusCode){
					if (json.message) {
						layer.alert(json.message,{icon: 2,title:'错误信息'},function(index){
//							window.location = json.forwardUrl;
							layer.close(index);
						});
					}else{
						window.location = json.forwardUrl;
					} 
				}else{
					if (json.message)
						layer.alert(json.message,{icon: 0,title:'警告'});
				}
			} else {
				 index=layer.open({
				    type: 1,
				    title: title,
				    skin: 'layui-layer-rim', //加上边框
				    area: [dw ? dw :'600px', dh ? dh :'400px'], //宽高
				    content: response
				});
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			layer.alert(xhr.responseText,{icon: 2,title:'错误信息'});
		}
	});
	return index;
}

/**
 * Dialog 模态窗口
 * @param url url地址
 * @param params 参数
 * @param title 标题
 * @param dw	宽 px
 * @param dh	高 px
 * @param cancelCallBack	是否有关闭回调函数 true/false
 * @author shegj
 * @date 2015-07-02
 */
function ostcmsDialogCallBack(url,params,title,dw,dh,cancelCallBack){
	url += url.indexOf("?") == -1 ? "?" : "&";
	url += "_="+new Date().getTime();
	url += "&curJsSessionId="+curJsSessionId;
	var index="";
	var param = params ? params : {};
	$.ajax({
		type:"POST",
		async:false,
		url:url,
		data:param,
		cache:false,
		success:function(response){
			var json = OSTCMSJS.jsonEval(response);
			if (json.statusCode){
				if(OSTCMSJS.statusCode.timeout==json.statusCode){
					if (json.message) {
						layer.alert(json.message,{icon: 2,title:'错误信息'},function(index){
//							window.location = json.forwardUrl;
							layer.close(index);
						});
					}else{
						window.location = json.forwardUrl;
					} 
				}else{
					if (json.message)
						layer.alert(json.message,{icon: 0,title:'警告'});
				}
			} else {
				if(cancelCallBack){
					index=layer.open({
					    type: 1,
					    title: title,
					    skin: 'layui-layer-rim', //加上边框
					    area: [dw ? dw :'600px', dh ? dh :'400px'], //宽高
					    content: response,
					    cancel:callBackEvent
					});
				}else{
					index=layer.open({
					    type: 1,
					    title: title,
					    skin: 'layui-layer-rim', //加上边框
					    area: [dw ? dw :'600px', dh ? dh :'400px'], //宽高
					    content: response
					});
				}
				 
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			layer.alert(xhr.responseText,{icon: 2,title:'错误信息'});
		}
	});
	return index;
}

/**
 * 学员端播放课件时，预防会话断开，空请求后台保持会话
 * @author shegj
 * @date 2015-08-24
 */
var frontSesssionFlag = true;
function frontSesssionSubmit(basePath){
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
		if(frontSesssionFlag){
			frontSesssionSubmit(basePath);
		}
	},1000*60*5);//5分钟执行一次
}

function setFrontSesssionFlag(flag){
	frontSesssionFlag = flag;
}



function toMenujs(url){
    $(".hf_er_nav .hf_nav ul li a").each(function(index, element) {

        var name=  $(this).attr("name");
        if(name==url){
            switchPage('/ostcms'+name);
            changeSelectOneLevelMenu($(this).attr("id"));
        }
    });
 }
 