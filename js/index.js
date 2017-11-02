var list = new iScroll("list");
var searchList = new iScroll("searchList");
var home = new iScroll("home",{

	onBeforeScrollStart:function(e){

		/*	除了input  除了img  这些元素,
			其他阻止*/

		var targets = e.target.nodeName; //获取到的节点名称

		if(targets!="IMG" && targets!="INPUT"){

			e.preventDefault();

		}

		home.refresh();
	}

});
DATAS = null;
ls = localStorage;
//ls.clear();
function bindEvent(e){

	$.ajax({

		url:"data/data.json",
		type:"get",
	 	async: false,
		dataType:"json",
		success:function(e){
			DATAS=e;
		}

	})
	if(!ls.getItem("fav")){

		ls.setItem("fav","[]");

	}
	//如果没有key===>fav的内容 ，设置



	$(".container").on("click","a",function(e){

		e.preventDefault();

		var that = $(this).attr("href");
		var id = $(this).attr("id");
		$(that).css({
			transition:"all 0.4s",
			transform: "translate3d(0,0,0)"

		}).siblings().css({

			transform: "translate3d(100%,0,0)"

		})

		if(e.target.parentNode.nodeName=="NAV"){

			var index = $(this).index();

			$(".mark").animate({

				left:index*25+"%"

			})

		}

		resetHade($(this));


		if( that == "#list"){
			//确定进入列表页
			getDataId(id);
		}else if(that =="#article"){
			//确定进入内容页

			getContentId($(this));

		}else if(that=="#searchList"){
			//进入搜索页面

		}

	})

	$("#gosearch").click(function(){

		var keywords =  $.trim( $("#srarchInp").val() );
		//用户输入的内容
		if(keywords.length  > 0 ){
		
			searchKeywords(keywords);		    

		}

	})
	$("#fav").on("click",function(){
 		
		var favTit = $(this).attr("title");
		//文章标题

		var favArr = JSON.parse( ls.getItem("fav") );

		//获取localStorage的key值 (value)

		if($.inArray(favTit,favArr) > -1 ){

			alert("已经收藏");
		}else{

			addFavLocalStorage(favTit);
			//添加

		}


 		//如果favTit 在 favArr存在(提示)   否则添加

	})
}

function addFavLocalStorage(favTit){ //文章标题

	//往一个数组里面添加  内容(文章标题)

	/*faArr.push(  favTit )*/

	var faArr = JSON.parse(ls.getItem("fav"));	

	faArr.push( favTit );

 	ls.setItem("fav", JSON.stringify(faArr) );






	/*faArr.push( favTit );

	setLocalStorage("fav",JSON.stringify(faArr) );*/
	
	

}



/*function getLocalStorage(item){
	//获取本地存储

	return JSON.parse(ls.getItem(item));

}


function setLocalStorage(key,value){
	//设置本地存储
	ls.setItem(key,value);

}
*/




function searchKeywords(key){
	var crr = [];

	var drr=[];
	$.each(DATAS,function(i,v){

		$.each(v.fenlei,function(k,val){
	 		
			// val.title ===》所有的title
			// console.log(val.title)
			 //key用户输入的val值
			
			 if( val.title.indexOf(key)>-1){

			 		crr.push(val.title);
			 		drr.push(i+"_"+k);
			 }	
		})
	})

	$(".searchList").empty();
	
		$.each(drr,function(index,value){
 
		$(".searchList").append("<li><a href='#article' data-content='"+value+"'>"+crr[index]+"</a></li>");
			
	})

	searchList.refresh();



}

var arr = ["yunqian","yunzhong","chanqian","chanhou","chengzhang","fangzhi"];
var brr = ["孕前准备","孕中知识","产前知识","分娩产后","幼儿成长指标","幼儿常见病防治"];

function getContentId(el){


	var con = el.data("content");
	var arrs = con.split("_");  //返回数组
 	$("#article").html(  DATAS[arrs[0]].fenlei[arrs[1]].content  );
 	$("#label").text(   DATAS[arrs[0]].fenlei[arrs[1]].title   );


}

function getDataId(id){
//如果有这个值  发送请求
	if($.inArray(id,arr) > -1 ){

		getDataLoad(id);

	}

}


function getDataLoad(type){
//获取json数据

	getDateContent(DATAS,type);

	/*$.ajax({

		url:"data/data.json",
		type:"get",
		dataType:"json",
		success:function(e){
			DATAS=e;
			getDateContent(e,type);

		}

	})*/
}

function getDateContent(e,type){
//遍历json数据,  输出页面
 	var brr = e[type]["fenlei"];
 	var str = "";
	$.each(brr,function(idx,val){

		str+="<a href='#article' data-content="+type+"_"+idx+"><dl><dt><img src='img/tu/"+val.img+"'></dt><dd><p>"+val.title+"</p></dd></dl></a>"


	})

	$("#iscroll_r").html(str);

	list.refresh();

}


function resetHade(element){

	var href = element.attr("href");
	var returnBtn = $("#return");
	var label = $("#label");
	var title = element.attr("title");

	if(href=="#list"){

		label.html(title);
		returnBtn.show();
		returnBtn.attr("href",'#home');
		$("#fav").hide();
		$('#search').show();
	}else if(href=="#home"){
		$("#searchBox").hide();
		$("header").show();
		label.html("孕育宝典");
		returnBtn.hide();
		$("#fav").hide();
		$('#search').show();
	}else if(href=="#article"){

		var favText = element.find("p").text();
		$("#fav").attr("title",favText);


		$("#searchBox").hide();
		$("header").show();
		$("#search").hide();
		$("#return").show();
		$("#fav").show();
		returnBtn.attr("href","#list");
		//返回当前列表

		var splits = element.data("content").split("_")[0]
		var idxs = brr[$.inArray(splits,arr)];
		//获取title
		returnBtn.attr("title",idxs);
	}else if(href=="#searchList"){
		$("header").hide();
		$("#searchBox").show();

	}else if(href=="#favorite"){

		var list = JSON.parse(ls.getItem("fav"));

		$(".favorite").empty();
		$.each(list,function(i,val){

			 $(".favorite").append("<li>"+val+"</li>");

		})

		//把数据   添加到收藏的li里面
	}


}

//改变列表页面的 title  返回按钮

bindEvent();



//收藏模块

//本地存储===》localStorage

//1、key====》fav     value ====》arr = []
/*2、key   value
fav   转换为数组(原本是字符串)====>[xx,yy,zz]*/
//3、收藏标题     判断收藏标题 在arr是否存在 
//4、读取localStorage    ===》getItem( arr[index] )
