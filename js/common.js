function $$(id) {
	if (document.getElementById) {
		return document.getElementById(id);
	} else if (document.layers) {
		return document.layers[id];
	} else {
		return false;
	}
}
/**
 * 判断导入文件是否是Excel文档
 * @author vitoshu
 * @date 2015-12-16
 */
function checkFileType(id){
	var url = $("#"+id);
	if(url.val()=="" || url.val()==null){
		alertMsg.error("请选择文件!");
		return false;
	} 
	var strTemp = url.val().split(".");
	var ext = strTemp[strTemp.length-1];
	ext = ext.toUpperCase();
	if(ext == "XLS"){
		return true;
	}else{
		alertMsg.error("上传文件非Excel类型!");
		//清空File类型框
		url.after(url.clone().val(""));
		url.remove();
		return false;
	}
}
//jxc start 
/**
 * uploadify 错误中文
 */
var uploadifyChineselang={
	errorMsgPrefix : "文件不能添加到队列中:",		//信息提示前缀
	QUEUE_LIMIT_EXCEEDED_NUMBER:"选定的文件数量超过剩余的上传限制({0}).",		//文件个数超过限制 {0} 为文件个数参数
	QUEUE_LIMIT_EXCEEDED_SIZE:"选定的文件总大小超过了队列的大小限制({0}).",			//文件的总大小超过限制  {0}文件总大小
	FILE_EXCEEDS_SIZE_LIMIT:"文件{0}超过单文件限制({1}KB)",		//单文件大小限制
	ZERO_BYTE_FILE:"文件大小为0",			//文件大小为0
	INVALID_FILETYPE:"文件格式不对,仅限:{0}",
	HTTP_ERROR:"HTTP 错误\n{0}",			//HTT错误
	MISSING_UPLOAD_URL:"上传路径失效.",//
	IO_ERROR:"IO错误.",
	SECURITY_ERROR:"安全性错误.",
	UPLOAD_LIMIT_EXCEEDED:"每次最多上传{0}个.",
	UPLOAD_FAILED:"上传失败.",
	SPECIFIED_FILE_ID_NOT_FOUND:"找不到指定文件.",
	FILE_VALIDATION_FAILED:"参数错误",
	FILE_CANCELLED:"取消文件",
	UPLOAD_STOPPED:"停止上传",
	FILE_ALERADY_EXISTS_SERVER:"文件{0}已存在于服务端,您想替换掉服务器端的文件吗？",
	FILE_ALERADY_EXISTS_QUEUE:"文件{0}已存在于上传队列中,您想替换掉服务器端的文件吗？",
    METHOD_NOT_FOUND:"在$.uploadify中，方法（{0}）未找到。"
};

//后台图片验证 checkUpPictireFile(fileurl,pictureformat)
function checkUpPictireFile(fileurl,pictureformat){ 
	
	if(fileurl=="" || fileurl==null){
//		alertMsg.error("请选择文件!");
		return false;
	}else{  
		var strTemp = fileurl.split(".");
		var  pictures =pictureformat.split(";");
		var ext=strTemp[strTemp.length-1];
		if(ext=="" || ext==null){
		    alertMsg.error("上传文件类型错误！");
			return false;
		}
		ext=ext.toUpperCase();
		var check = false;
		for(var i=0;i<pictures.length;i++){
		   var picture = pictures[i].split(".");
		   pic =picture[picture.length-1].toUpperCase();
		   if(ext == pic){
		       check = true; 
		   }
		}
		if(check){
			return true;
		}else{
			alertMsg.error("上传文件类型错误！");
			return false;
		} 
	}
	return true;
}
//前台图片验证  frontCheckUpPictireFile(fileurl,pictureformat)
function frontCheckUpPictireFile(fileurl,pictureformat){ 
	
	if(fileurl=="" || fileurl==null){
	    layer.alert("请选择文件!",{icon: 2,title:'消息提示'});
	    return false;
	}else{  
		var strTemp = fileurl.split(".");
		var  pictures =pictureformat.split(";");
		var ext=strTemp[strTemp.length-1];
		if(ext=="" || ext==null){
		    layer.alert("上传文件类型错误！",{icon: 2,title:'消息提示'});
		    return false;
		}
		ext=ext.toUpperCase();
		var check = false;
		for(var i=0;i<pictures.length;i++){
		   var picture = pictures[i].split(".");
		   pic =picture[picture.length-1].toUpperCase();
		   if(ext == pic){
		       check = true; 
		   }
		}
		if(check){
		    return true;
		}else{
		    layer.alert("上传文件类型错误！",{icon: 2,title:'消息提示'});
		    return false;
		} 
	}
	return true;
}


/**
 * 验证是否安装flash插件
 * @returns
 */
function flashChecker() {  
    var hasFlash=false;　　　　//是否安装了flash  
    var flashVersion=0;　　//flash版本  
    if((navigator.userAgent.indexOf('MSIE') >= 0) 
	    && (navigator.userAgent.indexOf('Opera') < 0)) {  //判断是否是IE
        
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');  
    
        if(swf) {  
            hasFlash=true;  
            var VSwf=swf.GetVariable("$version");  
            flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]);  
        }  
    }else{  
        if (navigator.plugins && navigator.plugins.length > 0){  
        var swf=navigator.plugins["Shockwave Flash"];  
        if (swf)  {  
            hasFlash=true;  
                   var words = swf.description.split(" ");  
                   for (var i = 0; i < words.length; ++i) {  
                         if (isNaN(parseInt(words[i]))) continue;  
                         flashVersion = parseInt(words[i]);  
                }  
            }  
        }  
    } 
    return {f:hasFlash,v:flashVersion};  
}  
/**
 * 下载flash插件
 * @param fls
 * @returns
 */
function downloadFlash(fls){
    if(!fls.f){  
	    alertMsg.confirm("您的浏览器还没有安装Flash插件，现在安装？",{okCall:function(){
		window.location.href = "http://get.adobe.com/cn/flashplayer/";  
	    }});
    }  
}
/**
 * uploadify 错误提示
 * @param file
 * @param errorCode
 * @param errorMsg
 * @returns
 */
function onUploadError(file, errorCode, errorMsg) {
	// Load the swfupload settings
	var settings = this.settings;
	var errorString = uploadifyChineselang.UPLOAD_FAILED;
	switch(errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
    var _t=uploadifyChineselang.HTTP_ERROR;
    var _o=[errorMsg];
    _t=_t.replace(/\{(\d+)\}/ig, function (p1,p2) {
        return _o[p2];
    });
    errorString= _t;
			break;
		case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
    errorString= '\n'+uploadifyChineselang.MISSING_UPLOAD_URL;
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			errorString = uploadifyChineselang.IO_ERROR;
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			errorString = uploadifyChineselang.SECURITY_ERROR;
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
    var _t=uploadifyChineselang.UPLOAD_LIMIT_EXCEEDED;
    var _o=[errorMsg];
    _t=_t.replace(/\{(\d+)\}/ig, function (p1,p2) {
        return _o[p2];
    });
			errorString = _t;
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			errorString = uploadifyChineselang.UPLOAD_FAILED;
			break;
		case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
		    errorString=uploadifyChineselang.SPECIFIED_FILE_ID_NOT_FOUND;
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			errorString = uploadifyChineselang.FILE_VALIDATION_FAILED;
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			errorString = uploadifyChineselang.FILE_CANCELLED;
			this.queueData.queueSize   -= file.size;
			this.queueData.queueLength -= 1;
			if (file.status == SWFUpload.FILE_STATUS.IN_PROGRESS || $.inArray(file.id, this.queueData.uploadQueue) >= 0) {
				this.queueData.uploadSize -= file.size;
			}
			// Trigger the onCancel event
			if (settings.onCancel) settings.onCancel.call(this, file);
			delete this.queueData.files[file.id];
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			errorString = uploadifyChineselang.UPLOAD_STOPPED;
			break;
	}

    
	alertMsg.error(errorString);
}

/**
 * post方式打开新页面
 *@param name _blank 新标签页 newwindow 新窗口  _self 当前页面  
 *@param data json字符串
 *@param url 地址
 */
function openPostWindow(url,name,data){
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "post";
    tempForm.action = url;
    if((null!=name)&&(""!=name)){
    	name="_blank";
    }
    tempForm.target=name;
    if((null!=data)&&(""!=data)){
    	for (var int = 0; int < data.length; int++) {
			
    		for(var key in data[int]){
    			var hideInput = document.createElement("input");
    			hideInput.type = "hidden";
    			ke = key;
    			hideInput.name=key;
    			hideInput.id=key;
    			hideInput.value = data[int][key];
    			tempForm.appendChild(hideInput);
    		}
		}
    }
    var is_ie = isIE(); 
    if(is_ie){
    	var ieVs  = ieVersions(); 
    	if(ieVs=="ie8"){
    		tempForm.attachEvent("onsubmit",function(){});        //IE8
    	}else{
    		tempForm.addEventListener("onsubmit",function(){});        //IE9+
    	}
    	
    }else{
    	var subObj = tempForm.addEventListener("submit",function(){},false);    //firefox
    }
    document.body.appendChild(tempForm);
   
    if(is_ie){
    	var evt = document.createElement("onsubmit");
    	tempForm.appendChild(evt);
    }else{
    	tempForm.dispatchEvent(new Event("submit"));
    }
    tempForm.submit();
    document.body.removeChild(tempForm);
}


//jxc end 


//hanyh start
function isIE() { //ie? 
	if (!!window.ActiveXObject || "ActiveXObject" in window){
		return true;  
	}else{
		return false;
	}
}


//ie8版本判断
function ieVersions(){
	 var browser=navigator.appName 
	 var b_version=navigator.appVersion 
	 var version=b_version.split(";"); 
	 var trim_Version=version[1].replace(/[ ]/g,""); 
	 if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
		return "ie8"; 
	 }else{
		return "ie9+"; 
	 }
}
//hanyh end

//zhaoxf start

function getNowFormatDate() {//获取转换后面当前日期   返回 :　yyyy-MM-dd
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//格式化日期，使ie8及以下版本可以使用new Date属性
function getFormatDate(date){//参数date:yyyy-MM-dd  返回yyyy/MM/dd
	return date.replace(/-/g,'/').replace(/T|Z/g,' ').trim();
}

//后台蓝色弹出框  by zxf
function alertMess(txt){
    var shield = document.createElement("DIV");
    shield.id = "shield";
    shield.style.position = "absolute";
    shield.style.left = "0px";
    shield.style.top = "0px";
    shield.style.width = "100%";
    shield.style.height = document.body.scrollHeight+"px";
    shield.style.background = "#333";
    shield.style.textAlign = "left";
    shield.style.zIndex = "10000";
    shield.style.filter = "alpha(opacity=0)";
    var alertFram = document.createElement("DIV");
    alertFram.id="alertFram";
    alertFram.style.position = "absolute";
    alertFram.style.left = "50%";
    alertFram.style.top = "50%";
    alertFram.style.marginLeft = "-225px";
    alertFram.style.marginTop = "-75px";
    alertFram.style.width = "450px";
    alertFram.style.height = "auto";
    alertFram.style.background = "#fff";
    alertFram.style.textAlign = "left";
    alertFram.style.lineHeight = "150px";
    alertFram.style.zIndex = "10001";
    strHtml = "<ul style='list-style:none;margin:0px;padding:0px;width:100%'>";
    strHtml += " <li style='background:#005fb3;text-align:left;padding-left:15px;font-size:14px;font-weight:bold;height:25px;line-height:25px;border:1px solid #005fb3;color:#fff'>系统提示</li>";
    strHtml += " <li style='background:#fff;font-size:12px;line-height:22px;border-left:1px solid #005fb3;border-right:1px solid #005fb3;padding:5px 10px'>"+txt+"</li>";
    strHtml += " <li style='font-weight:bold;height:25px;line-height:25px; border:1px solid #005fb3;border-top:none;padding-top:10px;padding-bottom:20px'><input class='cmbc_wx_input4' type='button' value='确 定' onclick='doOk()' /></li>";
    strHtml += "</ul>";
    alertFram.innerHTML = strHtml;
    document.body.appendChild(alertFram);
    
    this.doOk = function(){
        alertFram.style.display = "none";
        shield.style.display = "none";
    }
    alertFram.focus();
    document.body.onselectstart = function(){return false;};
   }
   

//zhaoxf end

// xuyl start
function getBaseUrl(url) {
    var ishttps = 'https:' == document.location.protocol ? true : false;
    if (ishttps) {
                url = 'https://' + url;
    } else {
          url = 'http://' + url;
    }
    return url;
}

//xuyl end
 