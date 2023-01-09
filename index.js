var fs = require("fs"); //Load the filesystem module
var orgFile = process.cwd() + "/" + process.argv[2]; //Grab the video filename from the command line
var stats = fs.statSync(orgFile);//Get stats of video file
var fileSizeInBytes = stats["size"];//Get video file size from stats
var fdata = new Buffer.alloc(fileSizeInBytes);//Create a new buffer to hold the video data
var i = 0;
var fStart = 0;
var fStop = 0;
var fCount = 0;
fdata = fs.readFileSync(orgFile);//Read the video file into the buffer
//This section looks for the markers at the begining and end of each jpg image
//records their positions and then writes them as separate files.
while (i < fileSizeInBytes) {

  if (fdata[i] == 0xFF) {
    //console.log("Found FF at "+i.toString);
    if (fdata[i + 1] == 0xD8) {
      //console.log("Found D8 at "+(i+1).toString);

      if (fdata[i + 2] == 0xFF) {
        //console.log("Found FF at "+(i+2).toString);
        fStart = i;
      }
    }
  }
  if (fStart > 0) {
    if (fdata[i] == 0xFF) {
      if (fdata[i + 1] == 0xD9) {
        fStop = i + 1;

      }
    }
    if (fStart > 0) {
      if (fStop > 0) {
        fCount++;
        fs.writeFileSync(orgFile + "." + fCount.toString() + ".jpg", fdata.slice(fStart, fStop));
        console.log(orgFile + "." + fCount.toString() + ".jpg");
        fStart = 0;
        fStop = 0;
      }
    }
  }

  i++;
}

console.log("Wrote " + fCount.toString() + " frames.");