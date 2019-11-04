(function ($) {
	var cX, cY, pN, indexId = 0, removeId, removeInPage, Data = [], DOM, changeSignColor = false, signColor, theViewUpSelectPageNumber = 0;
	var changeBodyColor = false, bodyColor, changeFontColor = false, fontColor, changeTextAreaColor = false, textAreaColor;
	var Rleft, Rtop;//需要删除的坐标
	jQuery.sign = {
		//初始化，绑定元素
		bindSign: function (dom) {
			DOM = dom;
			defined(dom);
		},
		//设定标记框的颜色
		setSignColor: function (color) {
			changeSignColor = true;
			signColor = color;
		},
		//设定提示框颜色
		setBodyColor: function (color) {
			changeBodyColor = true;
			bodyColor = color;
		},
		//设定字体颜色
		setFontColor: function (color) {
			changeFontColor = true;
			fontColor = color;
		},
		//设定弹出输入框的颜色 和背景
		setTextAreaColor: function (color) {
			changeTextAreaColor = true;
			textAreaColor = color;
		},
		loadingSign: function (data) {
			loading(data);
		}
	};
	function getViewport() {
		var m = document.compatMode == 'CSS1Compat';
		return {
			l: window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
			w: window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth)
		};
	};
	//阻止鼠标右键默认事件
	document.oncontextmenu = function (e) {
		e.preventDefault();
	};
	function defined(dom) {
		// dom是page-----所点击的当前页
		$(document).on("click", dom, function (e) {
			$('.chooseBox').remove();
			if ($("#viewer").hasClass("cursorMarked")) {
				$('.pop_edit_div').remove();
				pN = $(this).attr("data-page-number");//所点击的页码1,2,3,4,5
				//alert(pN);
				var h = $(this).height();
				$(this).attr("id", pN);
				$(this).append('<div class="commentAll ">' +
					'<div class="reviewArea clearfix ">' +
					'<textarea class="content comment-input" placeholder="" onkeyup="keyUP(this)"></textarea>' +
					'<a href="javascript:;" class="plBtn">注释</a><a href="javascript:;" class="sureSign">保存</a><a href="javascript:;" class="close_png">关闭</a>' +
					'</div>' +
					'<div class="comment-show"></div><div style="color:red;font-size:12px;margin-top: 10px;">注：删除之后不可恢复。</div>' +
					'</div>');

				var l = e.pageX - $(dom + "[data-page-number='" + pN + "']").offset().left;
				//弹出的标注框离顶部距离
				var top = e.pageY - $(dom + "[data-page-number='" + pN + "']").offset().top;
				if (changeTextAreaColor) { $(".commentAll").css({ "border": textAreaColor + " 1px solid" }); }

				var viewPort = getViewport();
				// console.dir(viewPort)
				var calW = $(".commentAll").width();
				// console.dir("e.pageX:"+e.pageX+" === "+$(dom+"[data-page-number='"+pN+"']").offset().left)
				$(".commentAll").css({ "left": l + calW + $(dom + "[data-page-number='" + pN + "']").offset().left * 1.2 > viewPort.l + viewPort.w ? l - calW : l, "top": top });
				cX = l
				cY = top - 15;

				$("#viewer").removeClass("cursorMarked");
				setCookie("PL_HF", JSON.stringify([]))
				$('.content').flexText();
			}
		});
		// $(document).on('click',".textLayer div",function(e){
		// 	e.stopPropagation();
		// 	alert($(this).attr("style"));
		// });
		//输入框获取焦点显示提交按钮
		// $(document).on('focus',"#inputText",function(e){
		// 	e.stopPropagation();
		// 	$(".publish_word a").css("display","inline-block");
		// });
		// $(document).on('keyup',"#inputText",function(e){
		// 	e.stopPropagation();
		// 	if($(this).val().length>0){
		// 		$(".publish_word a").css("display","inline-block").addClass("sureSign1");
		// 	}else{
		// 		$(".publish_word a").removeClass("sureSign1");
		// 	}
		// });
		//点击关闭 X  移除添加的输入框

	}
	$(document).on('click', '.close_png', function (e) {
		e.stopPropagation();
		$('.commentAll').remove();
	});
	//点击确定按钮
	$(document).on('click', '.sureSign', function (e) {
		e.stopPropagation();

		var PL_HF_data = getCookie("PL_HF");
		if (PL_HF_data == null) { PL_HF_data = new Array(); } else { PL_HF_data = JSON.parse(PL_HF_data); }
		console.dir("进行保存:" + PL_HF_data)
		if (PL_HF_data.length > 0) {
			$('.commentAll').remove();
			if ($(this).attr("id") == undefined) {
				// PL_HF_data = JSON.parse(PL_HF_data);
				$("#viewer .page").eq(pN - 1).append("<div class='signIndex' id='Ts" + indexId + "' theSignDate='" + JSON.stringify(PL_HF_data) + "' theSign='" + PL_HF_data[0]._content + "' thePageNum='" + pN + "'></div>");
				$('#Ts' + indexId).css({ "left": cX - 5, "top": cY - 5 });
				//改变了颜色
				if (changeSignColor) {
					$('#Ts' + indexId).css("border", signColor + " 2px solid");
				}
				theViewUpSelectPageNumber = pN;
				indexId++;
				Data.push({
					left: cX - 5,//lef坐标
					top: cY - 5,//top坐标
					message: PL_HF_data[0]._content,//提示内容
					_commentPl: PL_HF_data,//当前标注全部内容
					pageNum: pN,//当前页
					_sscs: scaleSelectCustomScale//在什么缩放页面进行标注
				});
				// console.log("------保存---添加--------------");
				// console.log(Data);
			} else {
				$("#" + $(this).attr("id")).attr("theSignDate", JSON.stringify(PL_HF_data));
				$("#" + $(this).attr("id")).attr("theSign", PL_HF_data[0]._content);

				var left = $("#" + $(this).attr("id")).css("left").replace(/[^0-9.]/ig, "");
				var top = $("#" + $(this).attr("id")).css("top").replace(/[^0-9.]/ig, "");
				var thePageNum = $("#" + $(this).attr("id")).attr("thePageNum");
				theViewUpSelectPageNumber = thePageNum;
				// console.dir("left:"+left+"---top:"+top+"---thePageNum:"+thePageNum)
				for (var i = 0; i < Data.length; i++) {
					if (Data[i].left == left && Data[i].top == top && Data[i].pageNum == thePageNum) {
						Data[i].message = PL_HF_data[0]._content;
						Data[i]._commentPl = PL_HF_data;
						break;
					} else {
						continue;
					}
				}
				// console.log("------保存---修改--------------");
				// console.log(Data);
			}
			setCookie("sureSign", JSON.stringify(Data));
			delCookie("PL_HF");

			$.sign.loadingSign(Data);
		} else {
			alert("请先进行添加注释，在进行保存")
		}
	});

	// //删除标记
	// $(document).on('click','.deleteSign',function(e){
	//     var left = 	$("#"+$(this).attr("id")).css("left").replace(/[^0-9.]/ig, "");
	// 		alert(left+" --- "+($("#"+$(this).attr("id")).css("left"))+"---"+$(this).attr("id"))
	//     var top = 	$("#"+$(this).attr("id")).css("top").replace(/[^0-9.]/ig, "");
	//     var thePageNum = 	$("#"+$(this).attr("id")).attr("thePageNum");
	//     $('#'+$(this).attr("id")).remove();
	//     $(".hintBox").remove();
	// 		$('.commentAll').remove();
	//     deleteData(left,top,thePageNum,true);
	// });
	//显示提示
	$(document).on('mouseover', '[id*=Ts]', function () {
		var l = $(this).offset().left, T = $(this).offset().top;
		$('.hintBox').remove();
		var t = $(this).attr("theSign");
		$('body').append("<div class='hintBox'>" + t + "</div>");
		var Hw = $('.hintBox').width(), Hh = $('.hintBox').height();
		$('.hintBox').append("<div class='triangle-down'></div>");
		$('.triangle-down').css({ "left": Hw / 2 - 10, "top": Hh });
		$('.hintBox').css({ "left": l - Hw / 2 + 20, "top": T - Hh - 10 });
		if (changeBodyColor) {
			$('.hintBox').css("background", bodyColor);
			$('.triangle-down').css("border-top", "10px solid " + bodyColor);
		}
		if (changeFontColor) {
			$('.hintBox').css("color", fontColor);
		}
	});
	//左击标记后的标识出现输入框带出之前标记内容，list
	$(document).on('click', '[id*=Ts]', function (e) {
		// showSureSignView(this)
		var _left = parseInt($(this).css("left").replace(/[^0-9.]/ig, ""));
		var l = _left;
		var _top = parseInt($(this).css("top").replace(/[^0-9.]/ig, ""));
		var t = _top;
		e.stopPropagation();
		$(".commentAll").remove();
		$(".hintBox").remove();
		$(this).parent().append('<div class="commentAll">' +
			'<div class="reviewArea clearfix ">' +
			'<textarea class="content comment-input" placeholder="" onkeyup="keyUP(this)"></textarea>' +
			'<a href="javascript:;" class="plBtn">注释</a><a href="javascript:;" id=' + $(this).attr("id") + ' class="sureSign">保存</a><a href="javascript:;" class="close_png">关闭</a><a href="javascript:;" id=' + $(this).attr("id") + ' class="deleteSign">删除标记</a>' +
			'</div>' +
			'<div class="comment-show"></div><div style="color:red;font-size:12px;margin-top: 10px;">注：删除之后不可恢复。</div>' +
			'</div>');
		if (changeTextAreaColor) {
			$(".pop_edit_div").css({ "border": textAreaColor + " 1px solid" });
		}

		var viewPort = getViewport();
		var calW = $(".commentAll").width();
		//$(".commentAll").css({"left":l + calW > viewPort.l + viewPort.w?l = calW:l,"top":t});

		$(".commentAll").css({ "left": l + calW + $(DOM + "[data-page-number='" + $("#" + $(this).attr("id")).attr("thepagenum") + "']").offset().left * 1.2 > viewPort.l + viewPort.w ? l - calW : l, "top": t });
		$('.content').flexText();
		initPL_HF($(this).attr("theSignDate"))
	});
	$(document).on('mouseleave', '[id*=Ts]', function () {
		$('.hintBox').remove();
	});


	//删除数据
	function deleteData(left, top, pageNum) {
		// console.dir("---删除--------")
		// console.dir(left+"--"+top+"--"+pageNum)
		for (var i = 0; i < Data.length; i++) {
			// var sscs = sscsFlag?scaleSelectCustomScale/Data[i]._sscs:1;
			// console.dir((Data[i].left)+"-+-"+(Data[i].top)+"-+-"+Data[i].pageNum)
			if (Data[i].left == left && Data[i].top == top && Data[i].pageNum == pageNum) {
				Data.splice(i, 1);
				break;
			} else {
				continue;
			}
		}
		// console.dir("---删除pdf-----")
		// console.dir(Data)
		//console.dir(JSON.stringify(Data))
		setCookie("sureSign", JSON.stringify(Data));

		//保存更新menu
		setTimeout($.sign.loadingSign(Data), 1000)
	}
	//载入数据
	function loading(data) {
		Data = [];
		$(".signIndex").remove();
		$("#sureSignView").html("");
		var colId = "pageNum";
		var asc = function (x, y) { return (x[colId] > y[colId]) ? 1 : -1; }
		data = data.sort(asc);

		for (const i in data) {
			if ($(".page_sureSign_" + data[i].pageNum + "_content").length == 0) {
				// $("#sureSignView").append("<div class='page' onclick='($(\"#viewer .page\")["+(Number(data[i].pageNum)-1)+"]).scrollIntoView();' pageIndex='"+data[i].pageNum+"'>页码"+data[i].pageNum+"</div><div class='page_sureSign_"+data[i].pageNum+"_content'></div>");

				$("#sureSignView").append("<div class='styleCssViewCont pageIndex_" + data[i].pageNum + "'><div class='styleCssViewPage' onclick='($(\"#viewer .page\")[" + (Number(data[i].pageNum) - 1) + "]).scrollIntoView();' pageIndex='" + data[i].pageNum + "'>第" + data[i].pageNum + "页</div><div class='styleCssViewBoxs page_sureSign_" + data[i].pageNum + "_content'></div></div>");

			}
		}

		colId = "top";
		data = data.sort(asc);
		// console.dir("----------data-data-----data-data---------------")
		// console.dir(data)
		Data = data;
		for (var i = 0; i < data.length; i++) {
			// console.dir(data[i])
			$("#viewer .page").eq(data[i].pageNum - 1).append("<div class='signIndex iconfont icon-duihua' id='Ts" + i + "' theSignDate='" + JSON.stringify(data[i]._commentPl) + "' theSign='" + data[i].message + "' thePageNum='" + data[i].pageNum + "'></div>");

			var sscs = scaleSelectCustomScale / data[i]._sscs;
			// console.dir(sscs)
			$('#Ts' + i).css({ "left": data[i].left * sscs, "top": data[i].top * sscs, "font-size": "30px", "color": "rgb(52, 152, 219)" });
			$('#Ts' + i).attr("data", JSON.stringify({ "left": data[i].left, "top": data[i].top, "pageNum": data[i].pageNum, "_pageNumIndex": i }))
			//改变了颜色
			// if(changeSignColor){
			// 	$('#Ts'+i).css("border",signColor+" 2px solid");
			// }

			// var sureSignViewHtml = "<div class='ellipsis' onclick=' document.querySelector(\"#Ts"+i+"\").scrollIntoView();'>"+data[i].message+"</div>";
			// $(".page_sureSign_"+data[i].pageNum+"_content").append(sureSignViewHtml);
			data[i]._pageNumIndex = i;
			var _now = data[i]._commentPl[0]._now;
			if (_now.indexOf(" ") > -1) { _now = _now.substring(0, _now.indexOf(" ")); }
			var sureSignViewHtml = "<div class='styleCssViewBox'><div class='iconfont xiahua icon-duihua' onclick='document.querySelector(\"#Ts" + i + "\").scrollIntoView();'></div><p onclick='document.querySelector(\"#Ts" + i + "\").scrollIntoView();'>" + data[i].message + "</p><p onclick='document.querySelector(\"#Ts" + i + "\").scrollIntoView();'>" + _now + "</p><div class='styleCssViewDeleteBtn iconfont icon-shanchu' data='" + JSON.stringify(data[i]) + "'></div></div>";
			$(".page_sureSign_" + data[i].pageNum + "_content").append(sureSignViewHtml);

		}
		indexId = data.length;

		if (theViewUpSelectPageNumber != 0) {
			scrollViewUpSelectPageNumber = theViewUpSelectPageNumber;
			theViewUpSelectPageNumber = 0;
			scrollViewUpSelectIntoView(scrollViewUpSelectPageNumber);
		}

	}
	//删除标记
	$(document).on('click', '#sureSignView .icon-shanchu,.deleteSign', function (e) {
		var data = JSON.parse($($(this).attr("class") == "deleteSign" ? '#' + $(this).attr("id") : this).attr("data"));
		$('#Ts' + data._pageNumIndex).remove();
		$(".hintBox").remove();
		$('.commentAll').remove();
		deleteData(data.left, data.top, data.pageNum);
	});

	//2019.07.30
	$(document).on('click', '.commentAll .plBtn', function (e) {
		e.stopPropagation();
		var myDate = new Date();
		//获取当前年
		var year = myDate.getFullYear();
		//获取当前月
		var month = myDate.getMonth() + 1;
		if (month < 10) month = '0' + month;
		//获取当前日
		var date = myDate.getDate();
		if (date < 10) date = '0' + date;
		var h = myDate.getHours();       //获取当前小时数(0-23)
		var m = myDate.getMinutes();     //获取当前分钟数(0-59)
		if (m < 10) m = '0' + m;
		var s = myDate.getSeconds();
		if (s < 10) s = '0' + s;
		var now = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
		//获取输入内容
		var oSize = $(this).parents('.reviewArea').find('.comment-input').val();
		console.log(oSize);
		//动态创建评论模块
		var plData = {
			_now: now,
			_content: oSize,
			_name: 'PL',//_user._userInfo.nickname,
			_id: 'pl_' + myDate.getTime(),
			_userId: 0,//_user._userInfo.id,
			_commentHf: []
		}
		oHtml = '<div class="comment-show-con clearfix"><div class="comment-show-con-list pull-left clearfix"><div class="pl-text clearfix"> <a href="#" class="comment-size-name">' + plData._name + ' : </a> <span class="my-pl-con">&nbsp;' + plData._content + '</span> </div> <div class="date-dz"> <span class="date-dz-left pull-left comment-time">' + plData._now + '</span> <div class="date-dz-right pull-right comment-pl-block"><a href="javascript:;" id="' + plData._id + '" class="removeBlock">删除</a> <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left" id="' + plData._id + '">回复</a> </div> </div><div class="hf-list-con"></div></div> </div>';
		if (oSize.replace(/(^\s*)|(\s*$)/g, "") != '') {
			$(this).parents('.reviewArea').siblings('.comment-show').prepend(oHtml);
			$(this).siblings('.flex-text-wrap').find('.comment-input').prop('value', '').siblings('pre').find('span').text('');
			console.dir(plData);
			var PL_HF_data = getCookie("PL_HF");
			if (PL_HF_data == null)
				PL_HF_data = new Array();
			else
				PL_HF_data = JSON.parse(PL_HF_data);
			PL_HF_data.push(plData);

			setCookie("PL_HF", JSON.stringify(PL_HF_data));
		}
		//else{$('.commentAll').remove();}

	});


	$(document).on('click', '.comment-show .pl-hf', function (e) {
		e.stopPropagation();
		//获取回复人的名字
		var fhName = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.pl-text').find('.comment-size-name').html();
		//回复@
		var fhN = '回复@' + fhName;
		//var oInput = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.hf-con');
		var fhHtml = '<div class="hf-con pull-left"> <textarea class="content comment-input hf-input" placeholder="" onkeyup="keyUP(this)"></textarea> <a href="javascript:;" id="' + $(this).attr("id") + '" class="hf-pl">回复</a></div>';
		//显示回复
		if ($(this).is('.hf-con-block')) {
			$(this).parents('.date-dz-right').parents('.date-dz').append(fhHtml);
			$(this).removeClass('hf-con-block');
			$('.content').flexText();
			$(this).parents('.date-dz-right').siblings('.hf-con').find('.pre').css('padding', '6px 15px');
			//console.log($(this).parents('.date-dz-right').siblings('.hf-con').find('.pre'))
			//input框自动聚焦
			$(this).parents('.date-dz-right').siblings('.hf-con').find('.hf-input').val('').focus().val(fhN);
		} else {
			$(this).addClass('hf-con-block');
			$(this).parents('.date-dz-right').siblings('.hf-con').remove();
		}
	});

	$(document).on('click', '.comment-show .hf-pl', function (e) {
		e.stopPropagation();
		var oThis = $(this);
		var myDate = new Date();
		//获取当前年
		var year = myDate.getFullYear();
		//获取当前月
		var month = myDate.getMonth() + 1;
		if (month < 10) month = '0' + month;
		//获取当前日
		var date = myDate.getDate();
		if (date < 10) date = '0' + date;
		var h = myDate.getHours();       //获取当前小时数(0-23)
		var m = myDate.getMinutes();     //获取当前分钟数(0-59)
		if (m < 10) m = '0' + m;
		var s = myDate.getSeconds();
		if (s < 10) s = '0' + s;
		var now = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
		//获取输入内容
		var oHfVal = $(this).siblings('.flex-text-wrap').find('.hf-input').val();
		// console.log(oHfVal)
		var oHfName = $(this).parents('.hf-con').parents('.date-dz').siblings('.pl-text').find('.comment-size-name').html();
		var oAllVal = '回复@' + oHfName;
		if (oHfVal.replace(/^ +| +$/g, '') == '' || oHfVal == oAllVal) {

		} else {
			var oAt = oHfVal;
			var oHf = '';

			var arr;
			var ohfNameArr;
			if (oHfVal.indexOf("@") != -1) {
				arr = oHfVal.split(':');
				ohfNameArr = arr[0].split('@');

				oAt = arr[1];
				oHf = ohfNameArr[1];
			}

			var hfData = {
				_now: now,
				_content: oAt,
				_name: 'HF',//_user._userInfo.nickname,
				_id: 'hf_' + myDate.getTime(),
				_userId: 0//_user._userInfo.id
			}

			var oHtml = '<div class="all-pl-con"><div class="pl-text hfpl-text clearfix"><a href="#" class="comment-size-name">' + hfData._name + ' : </a><span class="my-pl-con">' + hfData._content + '</span></div><div class="date-dz"> <span class="date-dz-left pull-left comment-time">' + hfData._now + '</span> <div class="date-dz-right pull-right comment-pl-block"> <a href="javascript:;" id="' + hfData._id + '" class="removeBlock">删除</a> <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left" id="' + $(this).attr("id") + '">回复</a> </div> </div></div>';
			oThis.parents('.hf-con').parents('.comment-show-con-list').find('.hf-list-con').css('display', 'block').prepend(oHtml) && oThis.parents('.hf-con').siblings('.date-dz-right').find('.pl-hf').addClass('hf-con-block') && oThis.parents('.hf-con').remove();

			var PL_HF_data = getCookie("PL_HF");
			if (PL_HF_data == null)
				PL_HF_data = new Array();
			else
				PL_HF_data = JSON.parse(PL_HF_data);
			for (var i = 0; i < PL_HF_data.length; i++) {
				var plData = PL_HF_data[i];
				if (plData._id == $(this).attr("id")) {
					// console.dir($(this).attr("id")+"==添加回复。。。。。。。。。。")
					plData._commentHf.push(hfData);
					break;
				}
			}
			// console.dir("--cookie--增加回复----");
			// console.dir(PL_HF_data);
			setCookie("PL_HF", JSON.stringify(PL_HF_data));
		}
	});

	$(document).on('click', '.commentAll .removeBlock', function (e) {
		e.stopPropagation();
		var oT = $(this).parents('.date-dz-right').parents('.date-dz').parents('.all-pl-con');
		if (oT.siblings('.all-pl-con').length >= 1) {
			oT.remove();
		} else {
			$(this).parents('.date-dz-right').parents('.date-dz').parents('.all-pl-con').parents('.hf-list-con').css('display', 'none')
			oT.remove();
		}
		$(this).parents('.date-dz-right').parents('.date-dz').parents('.comment-show-con-list').parents('.comment-show-con').remove();

		var PL_HF_data = getCookie("PL_HF");
		if (PL_HF_data == null)
			PL_HF_data = new Array();
		else
			PL_HF_data = JSON.parse(PL_HF_data);

		var removeFlag = false;
		for (var i = 0; i < PL_HF_data.length; i++) {
			var plData = PL_HF_data[i];
			if (plData._id == $(this).attr("id")) {
				PL_HF_data.splice(i, 1);
				removeFlag = true;
				break;
			} else {
				for (var j = 0; j < plData._commentHf.length; j++) {
					if (plData._commentHf[j]._id == $(this).attr("id")) {
						PL_HF_data[i]._commentHf.splice(j, 1);
						removeFlag = true;
						break;
					}
				}
			}
			if (removeFlag) { break; }
		}
		if (removeFlag && !isNaN(Number($(this).attr("id")))) {
			//从数据中删除
			// _pdf_del._requestPath = _pdf_del._model._delManager;
			// _pdf_del._params = {managerId:Number($(this).attr("id"))};
			// _pdf_del._get();
		}
		console.dir("--cookie--删除评论或回复----");
		console.dir(PL_HF_data);
		setCookie("PL_HF", JSON.stringify(PL_HF_data));
	});
})(jQuery);

//初始化评论
function initPL_HF(PL_HF_data) {
	if (PL_HF_data == null)
		PL_HF_data = new Array();
	else
		PL_HF_data = JSON.parse(PL_HF_data);

	setCookie("PL_HF", JSON.stringify(PL_HF_data))
	console.dir(PL_HF_data)
	for (var i = 0; i < PL_HF_data.length; i++) {
		var plData = PL_HF_data[i];
		var oHtml = '<div id="pl' + plData._id + '" class="comment-show-con clearfix"><div class="comment-show-con-list pull-left clearfix"><div class="pl-text clearfix"> <a href="#" class="comment-size-name">' + plData._name + ' : </a> <span class="my-pl-con">&nbsp;' + plData._content + '</span> </div> <div class="date-dz"> <span class="date-dz-left pull-left comment-time">' + plData._now + '</span> <div class="date-dz-right pull-right comment-pl-block"><a id="' + plData._id + '" href="javascript:;" class="removeBlock">删除</a> <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left" id="' + plData._id + '">回复</a> </div> </div><div class="hf-list-con"></div></div> </div>';

		$('.comment-show').prepend(oHtml);
		var commentHf = PL_HF_data[i]._commentHf;
		for (var j = 0; j < commentHf.length; j++) {
			var hfData = commentHf[j];
			var oHtml = '<div class="all-pl-con"><div class="pl-text hfpl-text clearfix"><a href="#" class="comment-size-name">' + hfData._name + ' : </a><span class="my-pl-con">' + hfData._content + '</span></div><div class="date-dz"> <span class="date-dz-left pull-left comment-time">' + hfData._now + '</span> <div class="date-dz-right pull-right comment-pl-block"> <a href="javascript:;" id="' + hfData._id + '" class="removeBlock">删除</a> <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left" id="' + plData._id + '">回复</a> </div> </div></div>';
			$('#pl' + plData._id).find('.hf-list-con').css('display', 'block').prepend(oHtml);
		}
	}
}

function keyUP(t) {
	var len = $(t).val().length;
	if (len > 139) {
		$(t).val($(t).val().substring(0, 140));
	}
}


//在文档中显示标注
var interval = null;// setInterval('loadPdf()', 1000);

function loadPdf(scrollViewUpSelectPageNumber) {
	if (PDFViewerApplication.pdfDocument == null) {
		//alert('Loading...');
	} else {
		clearInterval(interval);
		$.sign.bindSign('.page');//初始化
		$.sign.setSignColor('#3498DB'); //设置标记框颜色
		$.sign.setBodyColor('#3498DB'); //设置提示背景颜色
		$.sign.setFontColor('#fff');//设置提示字体颜色
		$.sign.setTextAreaColor('#3498DB');//设置弹出输入框的颜色
		var data = [];
		var sureSign = getCookie("sureSign");
		if (sureSign != null) { data = JSON.parse(sureSign); }
		// console.dir("--data--")
		// console.dir(data)
		$.sign.loadingSign(data);//载入标记数据
	}
}
