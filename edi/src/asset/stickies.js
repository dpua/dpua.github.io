'use strict';
console.log("add stickies");
var captured = null;
var highestZ = 0;
var notes = new Array();
let localstorage;


// function getCursorPosition(parent) {
//     let selection = document.getSelection();
//     let range = new Range;
//     range.setStart(parent, 0);
//     range.setEnd(selection.anchorNode, selection.anchorOffset);
//     return range.toString().length;
//   }
  
//   function setCursorPosition(child, position) {
//     //let child = parent;//parent.firstChild;
//       let length = child.text.length;
//     while(position > 0) {
//      // let length = child.text.length;//child.textContent.length|
//       console.log("length: "+length);
//       if(position > length) {
//         position -= length;
//         child = child.nextSibling;
//       }
//       else {
//         //if(child.nodeType === 3) 
//         return document.getSelection().collapse(child, position);
//         //child = child.firstChild;
//       }
//     }
//   }


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

function Note()
{
    var self = this;
    console.log("add Note");
    var note = document.createElement('div');
    note.className = 'edi-notes';
    //note.addEventListener('mousedown', function(e) { return self.onMouseDown(e); }, false);
    //note.addEventListener('click', function() { return self.onNoteClick(); }, false);
    this.note = note;

    var ts = document.createElement('div');
    ts.className = 'timestamp';
    ts.addEventListener('mousedown', function(e) { return self.onMouseDown(e); }, false);
    ts.addEventListener('click', function() { return self.onNoteClick(); }, false);
    note.appendChild(ts);

    var close = document.createElement('div');
    close.className = 'closebutton';
    close.addEventListener('click', function(event) { return self.close(event); }, false);
    note.appendChild(close);

    var edit = document.createElement('div');
    edit.className = 'edit';
    edit.setAttribute('contenteditable', true);
    // edit.addEventListener('keyup', function() { return self.onKeyUp('keyup'); }, false);
    // edit.addEventListener('paste', function() { return self.onKeyUp('paste'); }, false);
    // edit.addEventListener('keyup', function() { return self.onKeyUp(); }, false);
    edit.oninput=function() { 

        this.querySelectorAll('*').forEach(function(node, i) {	
            if(node.tagName){
                node.removeAttribute('class');
                node.removeAttribute('style');
                node.removeAttribute('id');
            }
                console.log("*** node: "+i);
                console.log(node.tagName);
            });
        return self.onKeyUp("oninput"); 
    };
    //edit.addEventListener("resize", function(e){ console.log("*** resize"); return self.onNoteResize(e);});
    //edit.onresize = function(e){ console.log("*** onresize"); return self.onNoteResize(e);};
    new ResizeObserver(function(e){ console.log("*** ResizeObserver"); return self.onNoteResize(e);}).observe(edit);
    // edit.ondrop=function() { return self.onKeyUp(2); };
    note.appendChild(edit);
    this.editField = edit;

    this.lastModified = ts;

    document.body.appendChild(note);
    return this;
}

Note.prototype = {
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

    get width()
    {
        console.log("=get w: "+this.editField.style.width);
        return this.editField.style.width;
    },

    set width(x)
    {
        console.log("=set w: "+x);
        this.editField.style.width = x;
    },

    get height()
    {
        console.log("=get h: "+this.editField.style.height);
        return this.editField.style.height;
    },

    set height(x)
    {
        console.log("=set h: "+x);
        this.editField.style.height = x;
    },

    get zIndex()
    {
        return this.note.style.zIndex;
    },

    set zIndex(x)
    {
        this.note.style.zIndex = x;
    },

    close: function(event)
    {
        this.cancelPendingSave();

        var note = this;
		chrome.extension.sendRequest({command:"close",data:{id:note.id}},function(response){console.log(response.message+response.id);});
       
        var duration = event.shiftKey ? 2 : .25;
        this.note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
        this.note.offsetTop; // Force style recalc
        this.note.style.webkitTransformOrigin = "0 0";
        this.note.style.webkitTransform = 'skew(30deg, 0deg) scale(0)';
        this.note.style.opacity = '0';
		notes.splice(notes.indexOf(note.id), 1);
		chrome.extension.sendRequest({command:"updateCount",data:notes.length});

        var self = this;
        setTimeout(function() { document.body.removeChild(self.note); }, duration * 1000);
    },

    saveSoon: function()
    {
        this.cancelPendingSave();
        var self = this;
        this._saveTimer = setTimeout(function() { self.save(); }, 200);
    },

    cancelPendingSave: function()
    {
        if (!("_saveTimer" in this))
            return;
        clearTimeout(this._saveTimer);
        delete this._saveTimer;
    },

    save: function()
    {
        this.cancelPendingSave();

        


        console.log("note.text");
        //console.log(this.text);
        let text = this.text;
        text = text.replace(/(<\/?(?:a|img|br|div)[^>]*>)|<[^>]+>/ig, '$1');
        
        console.log("this.width: "+this.width+" this.height: "+this.height);

        if ("dirty" in this) {
            this.timestamp = new Date().getTime();
            delete this.dirty;
        }

        var note = this;
  

		chrome.extension.sendRequest({command:"save",data:{id:note.id, text:text, timestamp:note.timestamp, left:note.left, top:note.top, width:note.width, height:note.height, zindex:note.zIndex, url:window.location.href}},function(response){console.log(response.message+response.id);});
       

    },

    saveAsNew: function()
    {
        this.timestamp = new Date().getTime();
        
        var note = this;
		chrome.extension.sendRequest({command:"saveAsNew",data:{id:note.id, text:note.text, timestamp:note.timestamp, left:note.left, top:note.top, width:note.width, height:note.height, zindex:note.zIndex, url:window.location.href}},function(response){console.log(response.message+response.id);});

    },

    onMouseDown: function(e)
    {
        captured = this;
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++highestZ;

        var self = this;
        if (!("mouseMoveHandler" in this)) {
            this.mouseMoveHandler = function(e) { return self.onMouseMove(e); };
            this.mouseUpHandler = function(e) { return self.onMouseUp(e); };
        }

        document.addEventListener('mousemove', this.mouseMoveHandler, true);
        document.addEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onNoteResize: function(e)
    {
        this.width = e.offsetWidth;
        this.height = e.offsetHeight;
        console.log("this.width: "+this.width+" this.height: "+this.height);
        this.save();
        return false;
    },

    onMouseMove: function(e)
    {
        if (this !== captured)
            return true;

        this.left = e.clientX - this.startX + 'px';
        this.top = e.clientY - this.startY + 'px';
        return false;
    },

    onMouseUp: function(e)
    {
        document.removeEventListener('mousemove', this.mouseMoveHandler, true);
        document.removeEventListener('mouseup', this.mouseUpHandler, true);

        this.save();
        return false;
    },

    onNoteClick: function(e)
    {
        console.log("onNoteClick");
        this.editField.focus();
        getSelection().collapseToEnd();
    },

    onKeyUp: function(e)
    {
        console.log("onKeyUp: "+e);
        console.log(this);
        this.dirty = true;
        this.saveSoon();
        
    },
};


function loadNotes(data)
{
	data = eval(data);
	for (var i = 0; i < data.length; ++i) {
		var row = data[i];
		if(notes.indexOf(row.id) === -1){
			var note = new Note();
			note.id = row.id;
			note.text = row.note;
			note.timestamp = row.timestamp;
			note.left = row.left;
			note.top = row.top;
			note.editField.style.width = row.width;
			note.editField.style.height = row.height;
			note.zIndex = row.zindex;
			if(note.zIndex === ''){
				note.zIndex = highestZ;
			}

			if (row.zindex > highestZ)
				highestZ = row['zindex'];
			notes[notes.length] = note.id;
		}
	}
}

function modifiedString(date)
{
    return  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

function newNote(id)
{
    var note = new Note();
    note.id = id;
    note.timestamp = new Date().getTime();
    note.left = (window.pageXOffset + Math.round(Math.random() * (window.innerWidth - 150))) + 'px';
    note.top = (window.pageYOffset + Math.round(Math.random() * (window.innerHeight - 200))) + 'px';
    note.editField.style.width = '290px';
    note.editField.style.height = '170px';
    note.zIndex = ++highestZ;
    note.saveAsNew();
	notes[notes.length] = note.id;
	chrome.extension.sendRequest({command:"updateCount",data:notes.length});
	note.editField.focus();
}
function applyCSS(localstorage){
	var newline=unescape("%"+"0A");
	var deleteButton = chrome.extension.getURL("asset/deleteButton.png");
	if(document.getElementById('noteanywherecss') === null){
		var headID = document.getElementsByTagName("head")[0];         
		var cssNode = document.createElement('link');
		cssNode.setAttribute('id','noteanywherecss');
		cssNode.media = 'screen';
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		headID.appendChild(cssNode);
	}
	let css = '.edi-notes .closebutton{background-image: url('+deleteButton+');}' + newline;

	if(localstorage !== undefined){
		if(localstorage['bg_color']!==undefined)
			css += '.edi-notes {background-color: '+hexToRgbA(localstorage['bg_color'], localstorage['bg_opacity'])+';}'+ newline;
        if(localstorage['bg_blur'] !== undefined)
            css += '.edi-notes {backdrop-filter: blur('+ localstorage['bg_blur'] +'px);}'+ newline;
        if(localstorage['t_color'] !== undefined)
            css += '.edi-notes {color: '+localstorage['t_color']+';}'+ newline;
		if(localstorage['font'] !== undefined)
			css += '.edi-notes  .edit {font-family: '+localstorage['font']+';}' +newline;
		if(localstorage['font_size'] !== undefined)
			css += '.edi-notes  .edit {font-size: '+localstorage['font_size']+';}' +  newline;
		if(localstorage['bb_color'] !== undefined)
			css += '.edi-notes .timestamp {background-color: '+ localstorage['bb_color'] +';}'+ newline;
		if(localstorage['bt_color'] !== undefined)
			css += '.edi-notes .timestamp {color: '+ localstorage['bt_color'] +';}';
	}
	document.getElementById('noteanywherecss').href = 'data:text/css,'+escape(css);
	
}

function loadCSS(json){
    console.log("loadCSS");
    console.log(json);
	localstorage = eval(json);
	applyCSS(localstorage);
}

applyCSS();

