/**
 * mp4layout
 * ver 1.0   2017/04/22   Initial draft
 *
 */
"use strict";

var httpGetFct = function(mp4uri, length, offset, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200 && xhr.status !== 206) {
            return cb('HTTP response status (' + xhr.status + ') not ok');
        }
        cb(null, xhr.response, xhr);
    };
	
    xhr.open("GET", mp4uri, true);
    xhr.responseType = "arraybuffer"; 	
    xhr.setRequestHeader('Range', 'bytes=' + offset + '-' + ( offset + length - 1 ) );
	
    xhr.send();
};

var mp4layoutFct = function(mp4uri, cb) {  
function readBox(offset, boxes, cb) {      
        cb(null, boxes); // exit of readBox
    }  // end of readBox() definition

    // boxes stores each box found
    var boxes = [];

    // Read first box
    readBox(0, boxes, function(err, boxes) {
        if (err) {
            cb("file can't be read", null);
        } else {
            cb(null, boxes);
        }
    }); // end of readBox() call
}; // end of mp4layoutFct() definition



