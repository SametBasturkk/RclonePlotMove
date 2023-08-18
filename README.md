# Chia Plot Upload Automation - README

## Description
Welcome to the **Chia Plot Upload Automation** project! This script automates the upload of Chia plots using the rclone tool. It continuously monitors a source directory for new plot files and uploads them to a remote server using multiple Google Drive service accounts. The script ensures efficient parallel uploads and monitors their completion.

## Functionality
The script performs the following tasks:

1. Lists Chia plot files (`.plot`) in the specified source directory, excluding temporary `.plot.tmp` files.

2. Retrieves Google Drive service account JSON files (`.json`) from the source directory.

3. Initiates parallel uploads of plot files to the remote server using rclone and Google Drive service accounts.

4. Monitors the completion of uploads and waits until all uploads are done.

5. Repeats the process in a loop, ensuring continuous monitoring and uploading.
