/**
 * mp4layout
 * ver 1.0   2017/04/18   Initial draft
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
        function parseBox(currBox, boxes, buf, cb) {
            // Add found box to boxes array
            boxes.push(currBox);

            // According to paragraph "1.5 Exercise", only moof and traf box have inner boxes               
            if (currBox.name == "moof" || currBox.name == "traf") {

                currBox.next = currBox.offset + 8;
                // Read boxes with inner boxes
                readBox(currBox.next, boxes, function(err, boxes) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, boxes);
                    }
                }); // end of readBox() call
            } else {
                if (currBox.name == "mdat") {

                   
                    cb(null, boxes); // exit of readBox                      
                } else {
                    // Read boxes without inner boxes
                    readBox(currBox.offset + currBox.length, boxes, function(err, boxes) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, boxes);
                        }
                    }); // end of readBox() call
                }
            }
        } // end of parseBox() definition

        // Read length and box code from given offset
        httpGetFct(mp4uri, 8, offset, function(err, buf) {
            if (err) {
                cb(err);
            } else {
                var currBox = {};
                var dv = new DataView(buf);
                // Read in (BE) box length at offset 0
                currBox.length = dv.getUint32(0, false);
                currBox.offset = offset;
                var boxCode = [];
                // Read in 4CC box code, which is following the box length field
                for (var i = 4; i < 8; i++) {
                    boxCode.push(String.fromCharCode(dv.getUint8(i)));
                }
                currBox.name = boxCode.join("");

                parseBox(currBox, boxes, buf, cb);
            }
        }); // endof httpGetFct() call
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



