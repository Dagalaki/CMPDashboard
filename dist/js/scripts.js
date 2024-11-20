/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    populateVendorSelect();
    populatePurposeSelect();

});


function createHttpRequest(url, callback, options) {
    var req = new XMLHttpRequest();
    //req.timeout = 500;
    if (callback) {
        req.onreadystatechange = function () {
            if (req.readyState !== 4) {
                return;
            }
            if (callback) {
                try {
                    if (req.status >= 200 && req.status < 300) {
                        callback(req.responseText);
                    } else {
                        callback(null);
                    }
                } catch (e) {
                    if (console && console.log) {
                        console.log('Error while processing URL ' + url + ': ' + e + ' - Result was: ' + req.status + '/' + req.responseText);
                        console.log(e);
                    }
                }
            }
            req.onreadystatechange = null;
            req = null;
        };
    }
    
    try {
        req.open((options ? options.method : null) || 'GET', url, true);
        if (!options || !options.dosend) {
            req.send(null);
        } else {
            options.dosend(req);
        }
    } catch (e) {
        req.onreadystatechange = null;
        try {
            callback(null);
        } catch (e2) {}
        req = null;
    }
    return req;
}


function populatePurposeSelect(){
    var url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/retrieveVendorlist.php?action=purposes";
    createHttpRequest(url, function(ret){
        var d = JSON.parse(ret);
        var htmlStr = "";
        var purposes = d["purposes"];
        for(var i =0; i< Object.keys(purposes).length; i++){
            htmlStr += "<option value='"+(i+1)+"'>" + purposes[i+1].name + "</option>";
        }
        
        document.getElementById("purpose").innerHTML += htmlStr;
    });
}

function populateVendorSelect(){
    var url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/retrieveVendorlist.php?action=vendors";
    createHttpRequest(url, function(ret){
        var d = JSON.parse(ret);
        var htmlStr = "";
        var vendors = d["vendors"];
        for(var i =0; i< Object.keys(vendors).length; i++){
            htmlStr += "<option value='"+vendors[i].TCFv2_ID+"'>" + vendors[i].Vendor + "</option>";
        }
        
        document.getElementById("vendor").innerHTML += htmlStr;
    });
}

function getAllowedVendorList(){
    var allowedVendors = "40,50,39,128,78,758,755,98,278,812,373,140,68,32,76,52,285,293,70,21,788,126,394,707,1126,136,1057,16,264,25,565,156,24,11,793,202,1127,985,115,1019,1206,758";
    return allowedVendors;
}

function getSelectedValues(elemName){
     var selectElement = document.getElementById(elemName);
     if(document.getElementById("vendor").value == "0"){
        var selectedOptions = Array.from(selectElement.options);
     }else{
        var selectedOptions = Array.from(selectElement.selectedOptions);
     }
     var selectedValues = selectedOptions.map(function(option) {
                return option.value;
              });
     return selectedValues;
}

function processRequestToFeedCharts(url){
    createHttpRequest(url, function(ret){
        console.log(ret);
            var d = JSON.parse(ret);
            labels = d.labels;
            if(d.pr_data) {
                pr_data = d.pr_data;
                createPartiallyRefusedChart(labels, pr_data);
            }
            if(d.a_data) {
                a_data = d.a_data;
                createAcceptedChart(labels, a_data);
            }
            if(d.r_data) {
                r_data = d.r_data;
                createRefusedChart(labels, r_data);
            }

            if(d.total) {
                total = d.total;
                createTotalsChart(labels, total);
            }


             });
}

function populateCharts(selCase){
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
var url = null; 
//alert(selCase);
   if(selCase == "vendorstats"){
        var selectedValues = getSelectedValues("vendor");
	selectedValues = selectedValues.join('", "');
	console.log("Selected Vendors:");
	console.log(selectedValues);
        if(document.getElementById("vendor").value == "0"){
            url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getOverallStats&table=VendorConsentStatistics&from="+from+"&to="+to;
        }else {
            urlTotal = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=total&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            urlAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=accepted&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            urlRefused = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=refused&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            urlPartiallyAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=partially_accepted&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
        }
    }else if (selCase == "purposestats"){
        var selectedValues = getSelectedValues("purpose");
	selectedValues = selectedValues.join('", "');
	console.log("Selected Purposes: ");
	console.log(selectedValues);
        if(document.getElementById("purpose").value == "0"){
            url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getOverallStats&table=PurposeConsentStatistics&from="+from+"&to="+to;
        }else {
            urlTotal = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=total&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            urlAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=accepted&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            urlRefused = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=refused&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            urlPartiallyAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=partially_accepted&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url1);
            return ;
        }
    }
    //alert(url);
    processRequestToFeedChart(url);
}
