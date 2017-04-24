# mp4layout

Parses MP4 layout of http://demo.castlabs.com/tmp/text0.mp4 and prints ID and length of each MP4 box found.

Tested with Chrome version 57.0.2987.133 and IE version 11.0.14393.0.

Bonus 1: Which problem can occur if the content of the MDAT box is very large?

The MDAT box typically contains the actual audio samples and video frames of the media content. The size of MDAT box can grow very large depending on content duration and quality. 

- Considerations about how the media format (MP4) stores size information in designated fields. Or how media content files of long duration and high quality may require a length extension of these fields (32 to 64 bits)   
ISO/IEC 14496-12 Standard says the following: "Boxes start with a header which gives both size and type. The header permits compact or extended size (32 or 64 bits) ... Typically only the Media Data Box(es) need the 64bit size."
Large content with very large MDAT boxes may require encapsulation with extended sizes (64 bits). As a consequence, format aware functionality requires support for extended sizes.

* Fragmented MP4 (fMP4) avoids the problem of very large MDAT box by chunking the content into segments of (typically) 5-10s. Each segment is stored in seperate MDAT box.

- Considerations with regards to memory constraints of media rendering devices.
Client devices streaming the media content may be resource constraint and may not be capable of storing an entire MDAT box in memory all at once.

- Considerations with regards to HTTP server handling very large transfer requests.
Transfering very large amounts of data over HTTP (such as entire MDAT box) typically needs to be broken up into smaller transfers or a chunked one.

* Option A: Have client issue multiple HTTP range requests (requires HTTP ver 1.1 support). For better performance, make sure that underlying TCP socket connection stays alive in between requests.
* Option B: Have client setup a single HTTP request with "chunked transfer-encoding" to receive multiples sequential chunks optimized in size for consumption by resource constrained device.   
 

Bonus 2: The MDAT box contains base64­encoded images. Extract those images to files

Image file locations:
https://github.com/obstsalad/mp4layout/blob/master/image001.png
https://github.com/obstsalad/mp4layout/blob/master/image002.png
https://github.com/obstsalad/mp4layout/blob/master/image003.png