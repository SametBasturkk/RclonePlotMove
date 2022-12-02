const fs = require('fs');
loopCount = 0;
const { exec, execSync } = require('child_process');


source = "/mnt/m2"
sourceOfJson = "/root/accountservers/"
uploadInProgress = [];

function getAccountsJson(sourceOfJson) {
    fileListOfSource = fs.readdirSync(sourceOfJson);
    jsonFiltered = fileListOfSource.filter(file => file.includes(".json"));
    return jsonFiltered;
}


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

function rcloneUpload(file, account) {
    rclone = "rclone move /mnt/m2/" + file + " --transfers=4 server1: --no-traverse   --ignore-existing --min-size 101G --drive-chunk-size 1G --progress --fast-list --drive-service-account-file " + account;
    execSync('sleep 5');
    console.log(rclone);
    filelimit++;
    exec(rclone, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    uploadInProgress.push(file);

}

function uploadIsDone() {
    var fileList = getFiles(source);
    console.log(uploadInProgress);
    console.log(fileList);
    var whichFile = 0;

    while (uploadInProgress.length > 0) {
        for (var i = 0; i < 1;) {
            fileList = getFiles(source);
            if (fileList.includes(uploadInProgress[whichFile])) {
                console.log("upload is not done");
                execSync('sleep 60');
                console.log(uploadInProgress[whichFile]);
            } else {
                console.log("upload is done");
                console.log("done ", uploadInProgress[whichFile]);
                uploadInProgress.splice(whichFile, 1);
                i++;

            }
        }
    }
}

var lastJsonAccount = 0;


while (true) {
    var filecount = getFiles(source).length;
    console.log(filecount)
    if (filecount > 0) {
        loopCount++;

        console.log("Loop " + loopCount);
        console.log(getFiles(source));
        console.log("Number of Plots: " + getFiles(source).length);
        filelimit = 0;
        currentFileList = getFiles(source);
        jsonList = getAccountsJson(sourceOfJson);
        for (var i = 0; i < jsonList.length; i++) {
            if (filelimit < 1) {
                if (lastJsonAccount == jsonList.length) {
                    lastJsonAccount = 0;
                }
                rcloneUpload(currentFileList[i], sourceOfJson + jsonList[lastJsonAccount]);
                lastJsonAccount++;
            }
        }
        while (uploadIsDone(uploadInProgress)) {
            console.log("Waiting for uploads to finish");
        }
        console.log("Uploads finished");
    }
    else {
        console.log("No Plots found");
        execSync('sleep 120');
    }
}
