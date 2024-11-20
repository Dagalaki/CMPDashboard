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

   // populateVendorSelect();
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

/*function populateVendorSelect(){
    var url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/retrieveVendorlist.php?action=vendors;
    createHttpRequest(url, function(ret){
        var d = JSON.parse(ret);
        var vendors = ;
    });
}*/

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

function getAllowedVendorList(){
    var allowedVendors = "40,50,39,128,78,758,755,98,278,812,373,140,68,32,76,52,285,293,70,21,788,126,394,707,1126,136,1057,16,264,25,565,156,24,11,793,202,1127,985,115,1019,1206,758";
    return allowedVendors;
}

function populateCharts(){
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    if(document.getElementById("vendor").value == "0"){
        allowedVendors = getAllowedVendorList();
    }else allowedVendors = document.getElementById("vendor").value;

    /*var pr_labels = ["01/04/2021", "03/04/2021", "05/04/2021", "07/04/2021", "09/04/2021", "11/04/2021", "13/04/2021", "15/04/2021", "17/04/2021", "19/04/2021", "21/04/2021", "23/04/2021", "25/04/2021", "27/04/2021", "29/04/2021", "31/04/2021", "02/05/2021", "04/05/2021",  "06/05/2021", "08/05/2021", "10/05/2021", "12/05/2021"];
    var pr_data = [30, 34, 60, 78, 54, 56, 45, 32, 55, 99, 89, 93, 43, 54, 56, 45, 32, 55, 99, 89, 93, 43];
    createPartiallyRefused(pr_labels, pr_data);
    */

    if(document.getElementById("vendor").value){
        url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?action=getOverallStats_Vendors&from="+from+"&to="+to;
    }else url = "http://smarttv.anixa.tv/CMPDashboard/dist/assets/demo/requestDBData.php?mode=partially_accepted&vendorlist="+allowedVendors+"&from="+from+"&to="+to;
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
