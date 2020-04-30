//alert('geo.js');
function _irl(i, r, l, u){
 //alert('function _irl(i, r, l, u) '+i+', '+r+', '+l);
	
var _N='cat.dp.ua_rf';
_lSu(_N+'_iP', i);
var _cD = new Date();
var _dT = "Now: " + _cD.getDate() + "."
                + (_cD.getMonth()+1)  + "." 
                + _cD.getFullYear() + " "  
                + _cD.getHours() + ":"  
                + _cD.getMinutes() + ":" 
                + _cD.getSeconds()+  " (" 
				+ _cD.getTimezoneOffset()/60 + ")";
_lSu(_N+'_dT', _dT);
//if(l==0){loc=coords()}else{loc='https://www.google.com/maps/search/'+l};
loc='https://www.google.com/maps/search/'+l;
_lSc(_N+'_coord', loc);
_lSc(_N+'_rgon', r);
_lSc(_N+'_geon', coords(_N, i, _dT));
	    
//alert(_first(_N, 0)+' '+_lSr(_N+'_iP')+' '+_lSr(_N+'_dT')+' '+_lSr(_N+'_rgon')+' '+_lSr(_N+'_coord')+' '+_lSr(_N+'_geon'));
_S_tel(_first(_N, 1)+' '+_lSr(_N+'_iP')+' '+_lSr(_N+'_dT')+' '+_lSr(_N+'_rgon')+' '+_lSr(_N+'_coord')+' '+_lSr(_N+'_geon'));

//alert(u);
};

//coords
function coords(_N, _iP, _dT){
try{if ("geolocation" in navigator){ 
		navigator.geolocation.getCurrentPosition(function(position){
					
					var _geon="navigator https://www.google.com/maps/search/"+position.coords.latitude+","+position.coords.longitude;
					_lSc(_N+'_geon', _geon);
					_S_tel('add geo '+_lSr(_N+'_iP')+' '+_lSr(_N+'_dT')+' '+_lSr(_N+'_geon'));
            		//return position.coords.latitude+","+position.coords.longitude;
            		return "navigator https://www.google.com/maps/search/"+position.coords.latitude+","+position.coords.longitude;
			});
	}else{return "Browser doesn't support geolocation!";};}catch(err){return 'navigator coords: err'};
}; 
//\coords


//getJSON
function  _gJ(u, n){
var i=0, r=0, l=0;
$.getJSON(u, function(data, status, xhr) {
if (status == "success"){
  i=data.ip;
  r=data.city+', '+data.region+', '+data.country_name;
  l=data.latitude+','+data.longitude;
  _irl(i, r, l, u);
	  }else{next_gJ(n+1);};
}).fail(function() {next_gJ(n+1);}); 
};

function  _gJ_o(u, n){
var i=0, r=0, l=0;
$.getJSON(u, function(data, status, xhr) {
if (status == "success"){
  i=data.ip;
  r=data.city+', '+data.region+', '+data.country_name;
  l=data.latitude+','+data.longitude;
  _irl(i, r, l, u);
	  }else{next_gJ(n+1);};
}).fail(function() {next_gJ(n+1);}); 
};

function  _gJ_t(u, n){
var i=0, r=0, l=0;
$.getJSON(u, function(data, status, xhr) {
if (status == "success"){
  i=data.ip;
  r=data.city+', '+data.region+', '+data.country;
  l=data.loc;
  _irl(i, r, l, u);
	  }else{next_gJ(n+1);};
}).fail(function() {next_gJ(n+1);}); 
};

function next_gJ(n){
if (n==1){
_gJ_o("https://api.ipdata.co/?api-key=4fc7c38496cac02e23d60bce831f62b1d327d8e88a8ee86c9ce69fe1", n);
    }else if (n==2){
_gJ_t("https://ipinfo.io/json", n);
    }else{
	var i=0, r=0, l=0, u=0;
    _irl(i, r, l, u);
    };
};
_gJ("", 0);//_gJ("https://json.geoiplookup.io/api", 0);
//\getJSON
