const fs = require('fs');
count = 0;
loopCount = 0;
var result;
const { exec, execSync } = require('child_process');



source = "/mnt/m2"
uploadInProgress = [];


function getFiles(source) {
    fileListOfSource = fs.readdirSync(source);
    plotFiltered = fileListOfSource.filter(file => file.includes(".plot"));
    for (var i = 0; i < plotFiltered.length; i++) {
        if (plotFiltered[i].includes(".plot.tmp")) {
            plotFiltered.splice(i);
        }
    }
    return plotFiltered;
}

function uploadIsDone(currentFileList) {
    newList = getFiles(source);
    if (loopCount == 0) {
        console.log("First loop");
        return true;
    }
    else {
        for (var i = 0; i < newList.length; i++) {
            console.log("CurrentFile= ", currentFileList)
            console.log("New List =", newList)
            if (newList.includes(currentFileList[i])) {
                console.log("File " + currentFileList[i] + " is still there");
                result = false;
                execSync('sleep 120');
                break;
            }
            else {
                console.log("File " + currentFileList[i] + " is gone");
                uploadInProgress.splice(currentFileList[i]);
                result = true;
            }
        }
    }

}


while (true) {
    console.log("Starting loop " + loopCount);
    uploadCheck = getFiles(source);
    howManyFiles = uploadCheck.length;
    console.log(uploadCheck);
    console.log("Number of plots: " + howManyFiles);
    willUpload = uploadCheck;
    if (uploadIsDone(uploadInProgress)) {
        console.log("Upload Starts")
        if (howManyFiles > 0) {
            for (var i = 0; i < willUpload.length; i++) {
                upload = "rclone move /mnt/m2/" + uploadCheck[i] + " --transfers=12 server1: --no-traverse   --ignore-existing --min-size 101G --progress --drive-chunk-size 4G --fast-list --drive-service-account-file " + "/root/accountservers/" + [count] + ".json"
                uploadInProgress.push(uploadCheck[i]);
                exec(upload);
                execSync('sleep 5');
                console.log(upload);
                count++;
                if (count == 10) {
                    count = 0;
                }
            }
            loopCount++;

        }
        else {
            console.log("No files to upload");
            execSync('sleep 120');
        }
    }
}

