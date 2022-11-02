const fs = require('fs');
loopCount = 0;
var result;
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

function uploadIsDone(currentFileList) {
    newList = getFiles(source);
    if (loopCount == 0) {
        return true;
    }
    else {
        for (var i = 0; i <= newList.length; i++) {
            if (newList.includes(currentFileList[i])) {
                console.log("File " + currentFileList[i] + " is still there");
                execSync('sleep 300');
                return false;

            }
            else {
                currentFileList.splice(i);
                return true;
            }
        }
    }

}


while (true) {
    accounts = getAccountsJson(sourceOfJson);
    accountsCount = accounts.length;
    console.log("Starting loop: " + loopCount);
    uploadCheck = getFiles(source);
    howManyFiles = uploadCheck.length;
    console.log(uploadCheck);
    console.log("Number of plots: " + howManyFiles);
    willUpload = uploadCheck;
    if (howManyFiles > 1) {
        if (uploadIsDone(uploadInProgress)) {
            for (var i = 0; i < willUpload.length; i++) {
                upload = "rclone move /mnt/m2/" + uploadCheck[i] + " --transfers=12 server1: --no-traverse   --ignore-existing --min-size 101G --progress --drive-chunk-size 4G --fast-list --drive-service-account-file " + sourceOfJson + accounts[i % accountsCount];
                uploadInProgress.push(uploadCheck[i]);
                exec(upload);
                execSync('sleep 5');
                console.log(upload);

            }
            loopCount++;

        }
    } else {
        console.log("No files to upload");
        execSync('sleep 120');
    }
}

