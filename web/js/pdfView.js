
var mouseDownEvt=null,mouseUpEvt=null;
// 按下与弹起记录当时的元素对象
function findSelectText(mDownEvt,mUpEvt){
  var selectionObj = window.getSelection();

  if(selectionObj.toString().length>0){    
    mouseDownEvt=mDownEvt;
    mouseUpEvt=mUpEvt;
    $(".button-group .style-bg").colpick();
    $('.colpick').css({'display':'none'});
    $(".button-group").show();
    $(".button-group").css({"top":mouseUpEvt.pageY,"left":mouseUpEvt.pageX});
    $(".button-group .style-u").click(function (){setSelectTextStyle('u',' style="text-decoration: underline;text-decoration-color: chartreuse;"');});
    $(".button-group .style-s").click(function (){setSelectTextStyle('s',' style="text-decoration: line-through;text-decoration-color: red;"');});
    $(".button-group .style-bg").click(function (){
      $(this).colpick().show(); $('.colpick').css({'display':'block','top':$(".button-group").height()+5+'px'});
    //  setSelectTextStyle(mouseDownEvt,mouseUpEvt,'span',' style="background-color:#0880d7;"');
    });
  }else{$(".button-group").hide();console.dir("暂无选中内容，不做处理");}

}

//根据文本编辑菜单提示修改文本样式
function setSelectTextStyle(lab,styles){
  var mouseDownDiv = mouseDownEvt.target
  var mouseUpDiv = mouseUpEvt.target
  var data_page_number = 0;
  $(".button-group").hide();
  $(".button-group .style-u").unbind("click");
  $(".button-group .style-s").unbind("click");
  $(".button-group .style-bg").unbind("click");
  var selectionObj = window.getSelection();
  var _selectText = selectionObj.toString();
  _selectText = _selectText.length>10?_selectText.substring(0,10)+"...":_selectText;

  var myDate = new Date();
  //获取当前年
  var year=myDate.getFullYear();
  //获取当前月
  var month=myDate.getMonth()+1;
  if(month<10) month = '0' + month;
  //获取当前日
  var date=myDate.getDate();
  if(date<10) date = '0' + date;
  var h=myDate.getHours();       //获取当前小时数(0-23)
  var m=myDate.getMinutes();     //获取当前分钟数(0-59)
  if(m<10) m = '0' + m;
  var s = myDate.getSeconds();
  if(s<10) s = '0' + s;
  var now = year+'-'+month+"-"+date+" "+h+':'+m+":"+s;

	// console.dir(selectionObj.toString())
	
	// console.dir(mouseDownDiv);
	// console.dir(mouseUpDiv);
    // var mouseDownClass = $(mouseDownDiv).attr("class");
    // var mouseUpclass = $(mouseUpDiv).attr("class");

    // if(mouseDownClass!=undefined || mouseUpclass!=undefined){
    //   var mouseDownDivP = $(mouseDownDiv);
    //   var mouseUpDivP = $(mouseUpDiv);
    //   if(mouseDownClass!=undefined){mouseDownDivP = $(mouseDownDiv).parent();}
    //   if(mouseUpclass!=undefined){mouseUpDivP = $(mouseUpDiv).parent();}

    //   // console.dir(mouseDownDivP);
    //   // console.dir(mouseUpDivP);
    //   console.dir(selectionObj.toString());
    //   var rangeObj = selectionObj.getRangeAt(0);
    //   console.dir(rangeObj)
    //   if(mouseDownDivP.is(mouseUpDivP)){//在自己设定span父级相同情况下处理情况
    //     if(mouseDownClass!=undefined && mouseUpclass==undefined){//按下在自己的设定span元素，弹起在span父级元素
    //       var mouseDownTextSelect = $(mouseDownDiv).text().substring(rangeObj.startOffset);
    //       var selectText = selectionObj.toString().substring(mouseDownTextSelect.length)
    //       console.dir(mouseDownTextSelect)
    //       console.dir(selectText)
    //       console.dir(1111111111111111)
    //       var selectdivhtml = $(rangeObj.commonAncestorContainer).html();
    //       console.dir(selectdivhtml)
    //       var nodes = rangeObj.commonAncestorContainer.childNodes;
    //       for(var i = 0; i < nodes.length; i++){
            
    //         if($(nodes[i]).prop("outerHTML")==undefined){
    //           console.dir(i+(typeof nodes[i])+"-text-"+$(nodes[i]).text());
    //         }else{
    //           console.dir(i+(typeof nodes[i])+"-html-"+$(nodes[i]).prop("outerHTML"));
    //           console.dir(i+(typeof nodes[i])+"-htmlObj-"+$(nodes[i]).html());
    //         }
            
    //       }
    //       var selectdowntext = rangeObj.endContainer.data;
    //       console.dir(selectdowntext.substring(0,rangeObj.endOffset))
          
    //     }else if(mouseDownClass==undefined && mouseUpclass!=undefined){//按下在span父级元素,弹起在自己的设定span元素
    //       console.dir(222222222)
    //     }else if(mouseDownClass!=undefined && mouseUpclass!=undefined){//按下弹起在自己的设定span元素
    //       console.dir(333333333)
    //     }
    //   }else{
    //     console.dir("父级元素不同............................")
    //   }

		// }else  
    if(mouseDownDiv==mouseUpDiv){//选中相同的元素内容
      var rangeObj = selectionObj.getRangeAt(0);
      var startOffset = rangeObj.startOffset;
      var endOffset = rangeObj.endOffset;
      var temp = $("<"+lab+styles+"></"+lab+">");
      rangeObj.surroundContents(temp[0]);
    // console.dir($(mouseDownDiv).prevAll().length)
    // console.dir("----cookie--save----")
      var pdfCookie = null;
      if(getCookie("pdfCookie")==null){pdfCookie = new Array();}else{pdfCookie = JSON.parse(getCookie("pdfCookie"));}
      data_page_number = $(mouseDownDiv).parents(".page").attr("data-page-number");
      var data_page = {
        _id:"style_"+new Date().getTime(),
        _now:now,
        _selectText:_selectText,
        _startIndex:$(mouseDownDiv).prevAll().length,
        _endIndex:$(mouseDownDiv).prevAll().length,
        _lab:lab,
        _data_page_number:Number(data_page_number),
        _key:[$(mouseDownDiv).prevAll().length],
        _styles:styles,
        _Offset:{_startOffset:startOffset,_endOffset:endOffset}};
      // console.dir(data_page);
      pdfCookie.push(data_page);
      setCookie("pdfCookie",JSON.stringify(pdfCookie));
    }else{//在不同的元素内（选中多行）

      // console.dir("按下坐标Y："+mouseDownEvt.pageY);
      // console.dir("弹起坐标Y："+mouseUpEvt.pageY);

      // console.dir("按下坐标X："+mouseDownEvt.pageX);
      // console.dir("弹起坐标X："+mouseUpEvt.pageX);
          
      var selectionObj = window.getSelection();
      var rangeObj = selectionObj.getRangeAt(0);
      // var selectdivhtml = $(rangeObj.commonAncestorContainer).html();
      var nodes = rangeObj.commonAncestorContainer.childNodes;
      var flag = false;

      var startDiv = mouseDownDiv;
      var endDiv = mouseUpDiv;
      var downleft = $(mouseDownDiv).css("left");
      downleft = Number(downleft.indexOf("px")>-1?downleft.substring(0,downleft.indexOf("px")):downleft);
      // console.dir("按下元素left："+downleft);
      var upleft = $(mouseUpDiv).css("left");
      upleft = Number(upleft.indexOf("px")>-1?upleft.substring(0,upleft.indexOf("px")):upleft);
      // console.dir("弹起元素left："+upleft);
      
      if((mouseDownEvt.pageY>mouseUpEvt.pageY && downleft==upleft) || (mouseDownEvt.pageX>mouseUpEvt.pageX && downleft!=upleft)){
        startDiv = mouseUpDiv;endDiv = mouseDownDiv;
      }      
      var startOffset = rangeObj.startOffset;
      var endOffset = rangeObj.endOffset;
      var startDivText = $(startDiv).text();
      var endDivText = $(endDiv).text();
      startDivText = startDivText.substring(0,startOffset);
      endDivText = endDivText.substring(endOffset);
      
      var cookieJson = Array();
      var startIndex = 0,endIndex = 0;
      for(var i = 0; i < nodes.length; i++){
        if(flag && endDiv!=nodes[i]){
          // $(nodes[i]).css({"text-decoration":"underline","text-decoration-color":"red","-moz-text-decoration-color":"red","background-color":"darkviolet"});
          // console.dir(i+(typeof nodes[i])+"-111-"+$(nodes[i]).prop("outerHTML"));
          $(nodes[i]).html("<"+lab+styles+">"+$(nodes[i]).text()+"</"+lab+">");
          cookieJson.push(i);
        }else if(startDiv==nodes[i] && !flag){      
          //处理按下是否是向上选中
          $(nodes[i]).html(startDivText+"<"+lab+styles+">"+$(nodes[i]).text().substring(startOffset)+"</"+lab+">");
          flag = true;
          startIndex = i;
          cookieJson.push(i);
          // console.dir(i+(typeof nodes[i])+"-000-"+$(nodes[i]).prop("outerHTML"));
        }else if(endDiv==nodes[i] && flag){  
          $(nodes[i]).html("<"+lab+styles+">"+$(nodes[i]).text().substring(0,endOffset)+"</"+lab+">"+endDivText);
          // console.dir(i+(typeof nodes[i])+"-222-"+$(nodes[i]).prop("outerHTML"));
          cookieJson.push(i);
          endIndex = i;
          flag = false; break;
        }
      }
      // console.dir("----cookie--save----")
      var pdfCookie = null;
      if(getCookie("pdfCookie")==null){pdfCookie = new Array();}else{pdfCookie = JSON.parse(getCookie("pdfCookie"));}
      data_page_number = $(startDiv).parents(".page").attr("data-page-number");
      var data_page = {
        _id:"style_"+new Date().getTime(),
        _now:now,
        _selectText:_selectText,
        _startIndex:startIndex,
        _endIndex:endIndex,
        _lab:lab,
        _data_page_number:Number(data_page_number),
        _key:cookieJson,
        _styles:styles,
        _Offset:{_startOffset:startOffset,_endOffset:endOffset}};
      // console.dir(data_page);
      pdfCookie.push(data_page);
      setCookie("pdfCookie",JSON.stringify(pdfCookie));
    }
    mouseDownEvt=null;
    mouseUpEvt=null;
    //初始化页面菜单
    cookieInitSet();
    scrollViewUpSelectIntoView(Number(data_page_number));
}
//删除标记
$(document).on('click','#styleCssView .icon-shanchu',function(e){
  e.stopPropagation();
  if(getCookie("pdfCookie")==null){return;}
  var data = JSON.parse($(this).attr("data"));
  var data_pdfCookie = JSON.parse(getCookie("pdfCookie"));
  for (const index in data_pdfCookie) {
    var data_page = data_pdfCookie[index];
    if (data_page._id == data._id) {
      data_pdfCookie.splice(index,1);
      var page_div = $(".page[data-page-number='"+data_page._data_page_number+"']").children(".textLayer").children("div");
      for(var i=data_page._startIndex;i<=data_page._endIndex;i++){$(page_div[i]).html($(page_div[i]).text());}
      $(this).parent().remove();
      if($(".pageIndex_"+data_page._data_page_number+" .styleCssViewBox").length==0){$(".pageIndex_"+data_page._data_page_number).remove();}
      setCookie("pdfCookie",JSON.stringify(data_pdfCookie));
      break;
    }
  }
  
});
/**从cookit 读取已标记的日志 */
var showSureSignViewPageNumber = -1;
var showSureSignViewPageLab = null;
function cookieInitSet(){
  // console.dir("cookie....get......")
  $("#styleCssView").html("")
  if(getCookie("pdfCookie")==null){return;}
  //对json进行升序排序函数
  var colId="_data_page_number"; 
  var asc = function(x,y) { return (x[colId] > y[colId]) ? 1 : -1;}  
  var data_pdfCookie = JSON.parse(getCookie("pdfCookie")).sort(asc);  
  // console.dir(data_pdfCookie)
  // console.dir("cookie....get...ssssssssssssss...")

  for (const index in data_pdfCookie) {
    var data_page = data_pdfCookie[index];
    
    if($(".page"+data_page._data_page_number+"_content").length==0){
      // $("#styleCssView").append("<div class='page' onclick='($(\"#viewer .page\")["+(Number(data_page._data_page_number)-1)+"]).scrollIntoView();' pageIndex='"+data_page._data_page_number+"'>页码"+data_page._data_page_number+"</div><div class='page"+data_page._data_page_number+"_content'></div>");

      $("#styleCssView").append("<div class='styleCssViewCont pageIndex_"+data_page._data_page_number+"'><div class='styleCssViewPage' onclick='($(\"#viewer .page\")["+(Number(data_page._data_page_number)-1)+"]).scrollIntoView();' pageIndex='"+data_page._data_page_number+"'>第"+data_page._data_page_number+"页</div><div class='styleCssViewBoxs page"+data_page._data_page_number+"_content'></div></div>");

    }
  }

  colId="_startIndex"; 
  data_pdfCookie = data_pdfCookie.sort(asc); 

  for (const index in data_pdfCookie) {
    var data_page = data_pdfCookie[index];
    // console.dir(data_page)
    var page_div = $(".page[data-page-number='"+data_page._data_page_number+"']").children(".textLayer").children("div");
    // console.dir(page_div);
    for(var i=data_page._startIndex;i<=data_page._endIndex;i++){
      if(i==data_page._startIndex&&i==data_page._endIndex){
        var text = $(page_div[i]).text();
        var startDivText = text.substring(0,data_page._Offset._startOffset); 
        var endDivText = text.substring(data_page._Offset._endOffset);
        var updateText = text.substring(data_page._Offset._startOffset,data_page._Offset._endOffset);
        $(page_div[i]).html(startDivText+"<"+data_page._lab+data_page._styles+" id='"+data_page._lab+data_page._startIndex+"'>"+updateText+"</"+data_page._lab+">"+endDivText);
      }else if(i==data_page._startIndex){     
        var startDivText = $(page_div[i]).text();
        startDivText = startDivText.substring(0,data_page._Offset._startOffset); 
        $(page_div[i]).html(startDivText+"<"+data_page._lab+data_page._styles+" id='"+data_page._lab+data_page._startIndex+"'>"+$(page_div[i]).text().substring(data_page._Offset._startOffset)+"</"+data_page._lab+">");
      }else if(i==data_page._endIndex){  
        var endDivText = $(page_div[i]).text();
        endDivText = endDivText.substring(data_page._Offset._endOffset);
        $(page_div[i]).html("<"+data_page._lab+data_page._styles+" >"+$(page_div[i]).text().substring(0,data_page._Offset._endOffset)+"</"+data_page._lab+">"+endDivText);
      }else {
        $(page_div[i]).html("<"+data_page._lab+data_page._styles+">"+$(page_div[i]).text()+"</"+data_page._lab+">");
      }

    }
    // var type = data_page._lab == "u"?"下划线":data_page._lab == "s"?"删除线":"背　景";
    // var styleCssViewHtml = "<div class='ellipsis'>"+type+"：<a onclick='showSureSignViewPageNumber = "+data_page._data_page_number+";showSureSignViewPageLab = \""+data_page._lab+data_page._startIndex+"\";if($(\"#\"+showSureSignViewPageLab).length>0){document.querySelector(\"#\"+showSureSignViewPageLab).scrollIntoView();}else if($($(\"#viewer .page\")["+(Number(data_page._data_page_number)-1)+"]).children(\".textLayer\").children(\"div\").length>0){showPageDataNumber();}else{ $(\"#viewer .page\")["+(Number(data_page._data_page_number)-1)+"].scrollIntoView();}'><"+data_page._lab+data_page._styles+">"+data_page._selectText+"</"+data_page._lab+"></a></div>";

    var labImg = data_page._lab == "u"?"icon-xiahuaxian":data_page._lab == "s"?"icon-shanchuxian":"icon-717bianjiqi_zitibeijingyanse";
    var _now = data_page._now;
		if(_now.indexOf(" ")>-1){_now = _now.substring(0,_now.indexOf(" "));}
    var styleCssViewHtml = "<div class='styleCssViewBox' onclick='showSureSignViewPageNumber = "+data_page._data_page_number+";showSureSignViewPageLab = \""+data_page._lab+data_page._startIndex+"\";if($(\"#\"+showSureSignViewPageLab).length>0){document.querySelector(\"#\"+showSureSignViewPageLab).scrollIntoView();}else if($($(\"#viewer .page\")["+(Number(data_page._data_page_number)-1)+"]).children(\".textLayer\").children(\"div\").length>0){showPageDataNumber();}else{ $(\"#viewer .page\")["+(Number(data_page._data_page_number)-1)+"].scrollIntoView();}'><div class='iconfont xiahua "+labImg+"' "+(data_page._lab == "span"?data_page._styles.replace('background-',''):'')+"></div><p>"+data_page._selectText+"</p><p>"+_now+"</p><div data='"+JSON.stringify(data_page)+"' class='styleCssViewDeleteBtn iconfont icon-shanchu'></div></div>";
    $(".page"+data_page._data_page_number+"_content").append(styleCssViewHtml);
    
  }
}
function showPageDataNumber(){
    // console.dir("cookie....get...pageNumber..."+showSureSignViewPageNumber)
    if(getCookie("pdfCookie")==null || showSureSignViewPageNumber==-1 ){return;}
    var data_pdfCookie = JSON.parse(getCookie("pdfCookie"));
    for (const index in data_pdfCookie) {
      var data_page = data_pdfCookie[index];
      if(data_page._data_page_number != showSureSignViewPageNumber){continue;}
      // console.dir(data_page)
      var page_div = $(".page[data-page-number='"+data_page._data_page_number+"']").children(".textLayer").children("div");
      // console.dir(page_div);
      for(var i=data_page._startIndex;i<=data_page._endIndex;i++){
        if(i==data_page._startIndex&&i==data_page._endIndex){
          var text = $(page_div[i]).text();
          var startDivText = text.substring(0,data_page._Offset._startOffset); 
          var endDivText = text.substring(data_page._Offset._endOffset);
          var updateText = text.substring(data_page._Offset._startOffset,data_page._Offset._endOffset);
          $(page_div[i]).html(startDivText+"<"+data_page._lab+data_page._styles+" id='"+data_page._lab+data_page._startIndex+"'>"+updateText+"</"+data_page._lab+">"+endDivText);
        }else if(i==data_page._startIndex){     
          var startDivText = $(page_div[i]).text();
          startDivText = startDivText.substring(0,data_page._Offset._startOffset); 
          $(page_div[i]).html(startDivText+"<"+data_page._lab+data_page._styles+" id='"+data_page._lab+data_page._startIndex+"'>"+$(page_div[i]).text().substring(data_page._Offset._startOffset)+"</"+data_page._lab+">");
        }else if(i==data_page._endIndex){  
          var endDivText = $(page_div[i]).text();
          endDivText = endDivText.substring(data_page._Offset._endOffset);
          $(page_div[i]).html("<"+data_page._lab+data_page._styles+" >"+$(page_div[i]).text().substring(0,data_page._Offset._endOffset)+"</"+data_page._lab+">"+endDivText);
        }else {
          $(page_div[i]).html("<"+data_page._lab+data_page._styles+">"+$(page_div[i]).text()+"</"+data_page._lab+">");
        }
  
      }
    }
    // alert(showSureSignViewPageLab)
    if(showSureSignViewPageLab!=null)
      document.querySelector("#"+showSureSignViewPageLab).scrollIntoView();
    showSureSignViewPageNumber = -1;
    showSureSignViewPageLab = null;
}
//window.onload = setTimeout(cookieInitSet, 3000);
