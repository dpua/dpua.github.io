'use strict';
var id = 0;
var boxes = new Array();
var highestZ = 0;
var notes = new Array();
var d_pos,l_pos,r_pos;
let captured,i,eles,form,input,opt,row,label;

function hexToRgbA(hex, opacity){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)&&(opacity!==isNaN)){
        c= hex.substring(1).split('');
        if(c.length===3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+(opacity/100)+')';
    }else{
		return hex;
	}
    //throw new Error('Bad Hex');
}//hexToRgbA('#fbafff', 90);


function alertText(a){
	$('.settings-alert .closebutton').click();
	let e = newNoteBox('alert',r_pos);
	let el = $(boxes[e].note);
	console.log(el);
	console.log($(boxes[e].closeBtn));
	el.addClass('settings-alert');
	el.removeClass('big');
	el.css({"left":"0","top":"49%"});
	$(boxes[e].editField).append(a);

	setTimeout(()=>{$(boxes[e].closeBtn).click();}, 5000);
}

function getHighestZindex(){
   var highestIndex = 0;
   var currentIndex = 0;
   var elArray = Array();
   elArray = document.getElementsByTagName('*');
   for(var i=0; i < elArray.length; i++){
      if (elArray[i].currentStyle){
         currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);
      }else if(window.getComputedStyle){
         currentIndex = parseFloat(document.defaultView.getComputedStyle(elArray[i],null).getPropertyValue('z-index'));
      }
      if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex; }
   }
   return(highestIndex);
}

highestZ = getHighestZindex();

function NoteBox()
{
    var self = this;

    var note = document.createElement('div');
    note.className = 'edi-notes big';
    //note.addEventListener('mousedown', function(e) { return self.onMouseDown(e); }, false);
    note.addEventListener('click', function() { return self.onNoteClick(); }, false);
    this.note = note;

    var ts = document.createElement('div');
    ts.className = 'timestamp';
    ts.addEventListener('mousedown', function(e) { return self.onMouseDown(e); }, false);
    note.appendChild(ts);
    this.lastModified = ts;

    var close = document.createElement('div');
    close.className = 'closebutton';
    close.addEventListener('click', function(event) { return self.close(event); }, false);
    note.appendChild(close);
    this.closeBtn = close;

    var edit = document.createElement('div');
    edit.className = 'edit';
    note.appendChild(edit);
    this.editField = edit;

    document.body.appendChild(note);
    return this;
}

NoteBox.prototype = {
    get id()
    {
        if (!("_id" in this))
            this._id = 0;
        return this._id;
    },

    set id(x)
    {
        this._id = x;
    },

    get text()
    {
        return this.editField.innerHTML;
    },

    set text(x)
    {
        this.editField.innerHTML = x;
    },

    get timestamp()
    {
        if (!("_timestamp" in this))
            this._timestamp = 0;
        return this._timestamp;
    },

    set stamp(x)
    {
        if (this._timestamp === x)
            return;

        this._timestamp = x;
		this.lastModified.textContent = x;
    },
	
    set timestamp(x)
    {
        if (this._timestamp === x)
            return;

        this._timestamp = x;
        var date = new Date();
        date.setTime(parseFloat(x));
        this.lastModified.textContent = modifiedString(date);
    },
	
    get left()
    {
        return this.note.style.left;
    },

    set left(x)
    {
        this.note.style.left = x;
    },

    get top()
    {
        return this.note.style.top;
    },

    set top(x)
    {
        this.note.style.top = x;
    },

    get zIndex()
    {
        return this.note.style.zIndex;
    },

    set zIndex(x)
    {
        this.note.style.zIndex = x;
    },
	
	set pos(pos){
		this.note.left = pos.left;
		this.note.top = pos.top;
	},

    close: function(event)
    {
        var note = this;
       
        var duration = event.shiftKey ? 2 : .25;
        this.note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
        this.note.offsetTop; // Force style recalc
        this.note.style.webkitTransformOrigin = "0 0";
        this.note.style.webkitTransform = 'skew(30deg, 0deg) scale(0)';
        this.note.style.opacity = '0';
		boxes[this._id] = false;
		
		if(this._id = settingboxid){$('#preview').hide();}

        var self = this;
        setTimeout(function() { document.body.removeChild(self.note); }, duration * 1000);
    },


    onMouseDown: function(e)
    {
        captured = this;
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++highestZ;

        var self = this;
        if (!("mouseMoveHandler" in this)) {
            this.mouseMoveHandler = function(e) { return self.onMouseMove(e) }
            this.mouseUpHandler = function(e) { return self.onMouseUp(e) }
        }

        document.addEventListener('mousemove', this.mouseMoveHandler, true);
        document.addEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onMouseMove: function(e)
    {
        if (this != captured)
            return true;

        this.left = e.clientX - this.startX + 'px';
        this.top = e.clientY - this.startY + 'px';
        return false;
    },

    onMouseUp: function(e)
    {
        document.removeEventListener('mousemove', this.mouseMoveHandler, true);
        document.removeEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onNoteClick: function(e)
    {
        //this.editField.focus();
    },
	
	promote: function(){
		this.note.style.zIndex = ++highestZ;
	}
	
}

function modifiedString(date)
{
    return  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}



function newNoteBox(stamp,pos)
{
    var note = new NoteBox();
    note.id = ++id;
	if(!stamp){
		note.timestamp = new Date().getTime();
	}else
		note.stamp = stamp;
    note.left = pos.left + 'px';
    note.top = pos.top + 'px';
    note.zIndex = ++highestZ;
	
	boxes[note.id] = note;
	return note.id;
}

var settingboxid = null;
var summaryboxid = null;

var options=['bg_color','t_color','bb_color','bt_color','bg_opacity','bg_blur','font','font_size'];
var titles=['Background Color','Text Color','Bar Background Color','Bar Text Color','Background opacity','Background blur','Font','Text Size'];

var defaults =['#FFF046','#2e2e2e','#debc00','#FFFFFF','70','5','Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif','14px'];
var font_options = {
	'Arial':'Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
	'Times':'Times, serif',
	'Georgia':'Georgia, Times, serif',
	'Geneva':'Geneva, Arial, Helvetica, sans-serif',
	'Helvetica':'Helvetica, Arial, Geneva',
	'Verdana':'Verdana, Arial, Helvetica',
	'Monospace':'monospace, courier'
};

var fz_options = {
	'Small':'12px',
	'Medium':'14px',
	'Large':'16px'
};

function load_options(){
	for(let i = 0; i < options.length; i++) {
		if(localStorage[options[i]]){
			$('#'+options[i]).val(localStorage[options[i]]);
			console.log("options["+i+"]"+defaults[i]);
		}else{
			$('#'+options[i]).val(defaults[i]);
			console.log("defaults["+i+"]"+defaults[i]);}
		//new jscolor.color(options[i]);
	}
	
}

function save_options(){
	for(let i = 0; i < options.length; i++) {
		localStorage[options[i]] = $('#'+options[i]).val();
		console.log('options: '+options[i]+' '+$('#'+options[i]).val());
	}
	applyCSS();
	alertText("Settings Saved!");
}

function reset_options(){
	load_options();
	updatePreview();
	applyCSS();
	alertText("Settings revert to last save!");
}

function default_options(){
	for(let i = 0; i < options.length; i++) {
		$('#'+options[i]).val(defaults[i]);
		localStorage[options[i]] = defaults[i];
		//new jscolor.color(options[i]);
	}
	updatePreview();
	applyCSS();
	alertText("Settings revert to default!");
}


function getSettingBox(){
	updatePos();
	let pos;
	if(boxes[summaryboxid]){
			if(boxes[summaryboxid].left == l_pos.left+'px')
			pos = r_pos;
		else
			pos = l_pos;
	}else
			pos = l_pos;
	if(!boxes[settingboxid]){
		settingboxid = newNoteBox('settings',pos);
		$(boxes[settingboxid].editField).append(getSettingForm());
		load_options();
		updateLabels();
		//jscolor.init();
	}else{
		boxes[settingboxid].pos = pos;
		boxes[settingboxid].promote();
	}
}
//'bg_opacity','bg_blur'  <input type="range" name="cowbell" min="0" max="100" value="90" step="5">
function getSettingForm(){
	form = $('<form>');
	form.submit(function(){return false;});
	$.each(options,function(i,option){
		row = $('<div class="form-row">');
		label = $('<label>');
		// label.text(titles[i]);
		if(option.indexOf('_color')>0){
			input = $('<input type="color" spellcheck="false" class="color {pickerPosition:\'right\'}">');
		}else if(option === 'bg_opacity'){
			input = $('<input type="range" name="bg_opacity" min="0" max="100" value="70" step="5" >');
		}else if(option === 'bg_blur'){
			input = $('<input type="range" name="bg_blur" min="0" max="100" value="5" step="1" >');
		}else if(option === 'font'){
			input = $('<select>');
			$.each(font_options,function(fi,font){
				opt = $('<option>');
				opt.attr('value',font);
				opt.text(fi)
				input.append(opt);
			});
		}else if(option == 'font_size'){
			input = $('<select>');
			$.each(fz_options,function(fzi,fz){
				opt = $('<option>');
				opt.attr('value',fz);
				opt.text(fzi)
				input.append(opt);
			});
		}
		input.attr('name',option);
		input.attr('id',option);
		input.change(function(){
			updatePreview();
			updateLabels();
		});
		let elemI=$('<i>');
		elemI.attr('id','label_'+option);
		label.html(titles[i]);
		label.attr('for',option);
		label.append(elemI);
		row.append(label);
		row.append(input);
		form.append(row);
	});
	let button_row = row = $('<div class="form-row">');
	let button_save = $('<input id="save" class="button" type="submit" value="Save">');
	let button_reset = $('<input id="reset" class="button" type="submit" value="Reset">');
	let button_default = $('<input id="setdefault" class="button" type="submit" value="Default">');
	button_save.click(function(){save_options();});
	button_reset.click(function(){reset_options();});
	button_default.click(function(){default_options();});
	button_row.append(button_save);
	button_row.append(button_reset);
	button_row.append(button_default);
	form.append(button_row);
	return form;
}

// function updatePreview(){
// 	$('#preview').show();
// 	$('#preview').css({'background-color':'#'+$('#bg_color').val(),color:'#'+$('#t_color').val()});
// 	$('#preview .edit').css({'font-family': $('#font').val(),'font-size':$('#font_size').val()});
// 	$('#preview .timestamp').css({'background-color':'#'+$('#bb_color').val(),color:'#'+$('#bt_color').val()});
// }


function updateLabels(){
	$('#label_bg_blur').html(' '+$('#bg_blur').val()+'%');
	$('#label_bg_opacity').html(' '+$('#bg_opacity').val()+'%');
}

function updatePreview(){
	$('#preview').show();
	$('#preview').css({'background-color':hexToRgbA($('#bg_color').val(), $('#bg_opacity').val()),'backdrop-filter': 'blur('+$('#bg_blur').val()+'px)',color:$('#t_color').val()});//($('#bg_opacity').val()===100)?$('#bg_opacity').val():''
	$('#preview .edit').css({'font-family': $('#font').val(),'font-size':$('#font_size').val()});
	$('#preview .timestamp').css({'background-color':$('#bb_color').val(),color:$('#bt_color').val()});
}

function getSummaryBox(){
	updatePos();
	let pos;
	if(boxes[settingboxid]){
		if(boxes[settingboxid].left === l_pos.left+'px')
			pos = r_pos;
		else
			pos = l_pos;
	}else
		pos = l_pos;
	if(!boxes[summaryboxid]){
		summaryboxid = newNoteBox('notes summary',pos);
		updateSummaryBox(1);
	}else{
		boxes[summaryboxid].pos = pos;
		boxes[summaryboxid].promote();
	}
}

function updateSummaryBox(page){
	chrome.extension.sendRequest({command:"summary",data:{page:page}},function(response){
				eles = sum2HTML(response.summary,page);
				$(boxes[summaryboxid].editField).empty();
				$.each(eles,function(i,x){$(boxes[summaryboxid].editField).append(x)});
			});
}

function refreshSummaryBox(){
	$(boxes[summaryboxid].editField).empty();
	setTimeout(function(){
		updateSummaryBox(window.page);
	},10);
}


function sum2HTML(notesum,page){
	window.page = page;
	if(page === 1)
		var hasPrev = false;
	else
		var hasPrev = true;
	if(notesum.length===13){
		var hasNext = true;
		notesum.splice(12,1);
	}else
		var hasNext = false;
	
		let ul = $('<ul class="sum-list">');
	$.each(notesum,function(i,x){
		let li = $('<li>');
			let cbox = $('<div class="cbox">');
			let cspan = $('<span>');
				cspan.text(x.count);
			cbox.append(cspan);
		li.append(cbox);
			let abox = $('<div class="abox">');
			let a = $('<a>');
					a.attr('href',x.url);
					a.attr('target','_blank');
					a.text(x.url);
				abox.append(a);
		cbox.after(abox);
		ul.append(li);
	});
	
	let bbox = $('<div class="bbox">');
		if(hasPrev){
			let b_prev = $('<a>');
			b_prev.attr('href','###');
			b_prev.click(function(){updateSummaryBox(window.page - 1);});
			b_prev.html('<img src="asset/rewind_mark.png" />');
			bbox.append(b_prev);
		}
		let b_refresh = $('<a>');
			b_refresh.attr('href','###');
			b_refresh.click(function(){refreshSummaryBox();});
			b_refresh.html('<img src="asset/refresh.png" />');
			bbox.append(b_refresh);
		if(hasNext){
			let b_next = $('<a>');
			b_next.attr('href','###');
			b_next.click(function(){updateSummaryBox(window.page + 1);});
			b_next.html('<img src="asset/forward_mark.png" />');
			bbox.append(b_next);
		}
	
	return new Array(ul,bbox);
}

function updatePos(){
	d_pos = $('#dashboard').position();
	l_pos = {left:d_pos.left+170+30,top:d_pos.top+15};
	r_pos = {left:d_pos.left+170+283+60,top:d_pos.top+15};
}

function applyCSS(){
	if($('#customcss').length === 0){
		var headID = $('head');         
		var cssNode =$('<link>');
		cssNode.attr('id','customcss');
		cssNode.attr('type','text/css');
		cssNode.attr('rel','stylesheet');
		cssNode.attr('media','screen');
		headID.append(cssNode);
	}
	var newline=unescape("%"+"0A");
	let css = '.edi-notes {background-color: '+hexToRgbA(localStorage['bg_color'], localStorage['bg_opacity'])+';color: '+localStorage['t_color']+';backdrop-filter: blur('+ localStorage['bg_blur'] +'px);}'+ newline;
	css += '.edi-notes  .edit {font-family: '+localStorage['font']+'; font-size: '+localStorage['font_size']+'; }' +  newline;
	css += '.edi-notes .timestamp {background-color: '+ localStorage['bb_color'] +';color: '+ localStorage['bt_color'] +';}';
	$('#customcss').attr('href','data:text/css,'+escape(css));

}

$(document).ready(function(){
	applyCSS();
});

