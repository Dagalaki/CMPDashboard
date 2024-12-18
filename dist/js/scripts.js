/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

let allVendors;
let allPurposes;
let allFeatures;

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
    
    //populatePurposeSelect();
   
    populateSelectBox("purpose", "purposes");
    populateSelectBox("leg-int-purposes", "purposes");
    //populateSelectBox("leg-int-vendors");
    populateSelectBox("special-features", "specialFeatures");


    loadAllowedVendors();

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

function populateSelectBox(selBoxId, section){
    var url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/retrieveVendorlist.php?action=purposes";
    createHttpRequest(url, function(ret){
        var d = JSON.parse(ret);
        var htmlStr = "";
        var entries = d[""+section+""];
        console.log("Response from retrieveVendorlist");
        console.log(entries);
        for(var i =0; i< Object.keys(entries).length; i++){
            htmlStr += "<option value='"+(i+1)+"'>" + entries[i+1].name + "</option>";
        
        }
        
        document.getElementById(selBoxId).innerHTML += htmlStr;
        $('#purpose').amsifySelect({
                type: 'amsify'
            });
        $('#leg-int-purposes').amsifySelect({
                type: 'amsify'
            });
        $('#leg-int-vendors').amsifySelect({
                type: 'amsify'
            });
        $('#special-features').amsifySelect({
                type: 'amsify'
            });
        var selectElement = document.getElementById("purpose");
        allPurposes = Array.from(selectElement.options);
        var selectElement = document.getElementById("special-features");
        allFeatures = Array.from(selectElement.options);
    });
}

function populatePurposeSelect(){
    /*if(!document.getElementById("purpose")) return true;*/
    var url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/retrieveVendorlist.php?action=purposes";
    createHttpRequest(url, function(ret){
        var d = JSON.parse(ret);
        var htmlStr = "";
        var purposes = d["purposes"];
        console.log("Response from retrieveVendorlist");
        console.log(purposes);
        for(var i =0; i< Object.keys(purposes).length; i++){
            htmlStr += "<option value='"+(i+1)+"'>" + purposes[i+1].name + "</option>";
            console.log(htmlStr);        
        }
        
        document.getElementById("purpose").innerHTML += htmlStr;
        $('#purpose').amsifySelect({
                type: 'amsify'
            });
        var selectElement = document.getElementById("purpose");
        allPurposes = Array.from(selectElement.options);
    });
}

function populateVendorSelect(){
    if(!document.getElementById("vendor")) return true;
    createHttpRequest("http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getAllowedVendors", function(ret){
        var data = JSON.parse(ret);
        
        var htmlStr = "";
        data.forEach(item => {
            htmlStr += "<option value='"+item.TCFv2_ID+"'>" + item.Vendor + "</option>";
       
         });
    document.getElementById("vendor").innerHTML += htmlStr;
    document.getElementById("leg-int-vendors").innerHTML += htmlStr;
    $('#vendor').amsifySelect({
                type: 'amsify'
            }); 
    $('#leg-int-vendors').amsifySelect({
                type: 'amsify'
            });        
    var selectElement = document.getElementById("vendor");
    allVendors = Array.from(selectElement.options);
    populateCharts("vendorstats");
  });


}

function getAllowedVendorList(){
    var allowedVendors = "40,50,39,128,78,758,755,98,278,812,373,140,68,32,76,52,285,293,70,21,788,126,394,707,1126,136,1057,16,264,25,565,156,24,11,793,202,1127,985,115,1019,1206,758";
    return allowedVendors;
}

function isDefaultSelected(elemName){
    var selectElement = document.getElementById(elemName);
   
    var selOptions = $('#vendor').amsifySelect('getSelectedOptions');
   console.log("selOptions");
   console.log(selOptions);

   var selectedIds = selOptions.map(function (option) {
            return option.value; // 'value' holds the ID of the selected option
        });

  
   console.log("selected ids");
   console.log(selectedIds.prevObject);
    if(selectedIds.prevObject.length == 1){
        alert();
    }
}

function getSelectedValues(elemName){
     var selectElement = document.getElementById(elemName);
     const initialSelectedOptions = Array.from(selectElement.selectedOptions);
     var selectedValues = initialSelectedOptions.map(function(option) {
            return option.value;
        }).filter(function(value) {
            return value !== undefined;
        });

     if(initialSelectedOptions.length === 0 || (selectedValues.length === 1 && selectedValues[0] === "0" )  ){
       if(elemName == "vendor" || elemName == "leg-int-vendors") var selectedOptions = allVendors;
        else if(elemName == "purpose" || elemName == "leg-int-purposes") var selectedOptions = allPurposes;
        else if(elemName == "special-features") var selectedOptions = allFeatures;
     }else{
        var selectedOptions = Array.from(selectElement.selectedOptions);
     }
     var selectedValues = selectedOptions.map(function(option) {
                if (option.value !== "0") {
                    return option.value;
                }
              });
     return selectedValues;
}

function processRequestToFeedChart(url){
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

function fintSelectBoxId(extraTabs, tabName) {
    const found = extraTabs.find(tab => tab.tab === tabName);
    return found ? found.selectBox : null;
}

function findTableValue(extraTabs, tabName) {
    const found = extraTabs.find(tab => tab.tab === tabName);
    return found ? found.table : null;
}

function populateCharts(selCase){
    var extraTabs = [{"tab": "legIntPurposeStats", "table": "PurposeLegIntConsents", "selectBox":"leg-int-purposes"}, {"tab": "legIntVendorStats", "table": "VendorLegIntConsents", "selectBox":"leg-int-vendors"}, {"tab": "specialFeaturesStats", "table": "SpecialFeaturesOptIns", "selectBox":"special-features"}];

    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
var url = null; 

if (extraTabs.some(tab => tab.tab === selCase)){
    
        var actions = ["total", "accepted", "refused", "partially_accepted"];
        var url = null;

        var boxId = fintSelectBoxId(extraTabs, selCase);
        var selectedValues = getSelectedValues(boxId);
        selectedValues = selectedValues.join(",");
        if (selectedValues.startsWith(",")) {
            selectedValues = selectedValues.substring(1);
        }
        var table = findTableValue(extraTabs, selCase);
        
        for(var k = 0; k < actions.length; k++){
            action = actions[k];
            url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action="+action+"&table="+table+"&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(url);
        }
        return true;
}

   if(selCase == "vendorstats"){
        var selectedValues = getSelectedValues("vendor");
        selectedValues = selectedValues.join(",");
        if (selectedValues.startsWith(",")) {
            selectedValues = selectedValues.substring(1);
        }
	console.log("Selected Vendors:");
	console.log(selectedValues);
    //isDefaultSelected("vendor");
        if(document.getElementById("vendor").value == "0"){
            url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getOverallStats&table=VendorConsentStatistics&from="+from+"&to="+to;
        }else {
            urlTotal = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=total&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlTotal);
            urlAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=accepted&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlAccepted);
            urlRefused = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=refused&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlRefused);
            urlPartiallyAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=partially_accepted&table=VendorConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlPartiallyAccepted);
        }
    }else if (selCase == "purposestats"){
        var caseOnePurpose = false;
        var selectedValues = getSelectedValues("purpose");
        if(selectedValues.length == 1 && document.getElementById("purpose").value != "0"){
            caseOnePurpose = true;
        }
        console.log(selectedValues.length);
        console.log(document.getElementById("purpose"));
	selectedValues = selectedValues.join(",");
    if (selectedValues.startsWith(",")) {
        selectedValues = selectedValues.substring(1);
    }
	console.log("Selected Purposes: ");
	console.log(selectedValues);
        if(document.getElementById("purpose").value == "0"){
            url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getOverallStats&table=PurposeConsentStatistics&from="+from+"&to="+to;
        }else {
            urlTotal = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=total&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlTotal);
            urlAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=accepted&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlAccepted);
            urlRefused = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=refused&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
            processRequestToFeedChart(urlRefused);
           if(!caseOnePurpose){
                document.getElementById("partiallyColumn").style.display="block";
                urlPartiallyAccepted = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=partially_accepted&table=PurposeConsents&selected="+selectedValues+"&from="+from+"&to="+to;
                processRequestToFeedChart(urlPartiallyAccepted);
            }else {
                document.getElementById("partiallyColumn").style.display="none";
            }
            return ;
        }
    }
    //alert(url);
    processRequestToFeedChart(url);
}

function deleteVendor(tcfID){
   
   
    const userConfirmed = confirm(`Are you sure you want to delete the vendor with TCFv2.2 ID  ${tcfID}?`);

    if (userConfirmed) {
        console.log(`Vendor "${tcfID}" has been deleted.`);
        sendDeleteRequest(tcfID);
    } else {
        // User clicked "Cancel"
        console.log(`Deletion of vendor "${tcfID}" was canceled.`);
    }
}

function clearPrompt(input) {
    // Clear the prompt text when the input is focused
    if (input.value === "Type TCFv2.2 ID") {
        input.value = ""; // Clear the input
        input.style.color = "black"; // Change text color to normal
    }
    if (input.value === "Type Vendor name") {
        input.value = ""; // Clear the input
        input.style.color = "black"; // Change text color to normal
    }
}

function restorePrompt(input, id) {
   if (input.value.trim() === "") {
       if(id == "tcfId") input.value = "Type TCFv2.2 ID";
       else if(id == "vendorName") input.value = "Type Vendor name";
        input.style.color = "gray"; 
    }
}

function sendDeleteRequest(tcfID){
    createHttpRequest("http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=deleteVendor&TCFv2_ID=" + tcfID, function(ret){
        var d = JSON.parse(ret);
        if(d.status == "success") loadAllowedVendors();
        else if(d.status == "error") alert(d.message);
    });
}

function addNewVendor(){
    var tcfId = document.getElementById("tcfId").value;
    var vendorName = document.getElementById("vendorName").value;
    var url  = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=addVendor&TCFv2_ID=" + tcfId+"&vendorName=" + vendorName;
    createHttpRequest(url, function(ret){
        var d = JSON.parse(ret);
        if(d.status == "success") loadAllowedVendors();
        else if(d.status == "error") alert(d.message);
    });
}

function loadAllowedVendors(){
    if(!document.getElementById("tbodyOfAllowedVendors")) return true;
    createHttpRequest("http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getAllowedVendors", function(ret){
        var data = JSON.parse(ret);
        var str = "";
        data.forEach(item => {
            str += "<tr><td>"+item.TCFv2_ID+"</td><td>"+item.Vendor+"</td><td><button onClick='deleteVendor("+item.TCFv2_ID+");'>Remove</button></td></tr>";
        });
        document.getElementById("tbodyOfAllowedVendors").innerHTML= str;
    });
}
