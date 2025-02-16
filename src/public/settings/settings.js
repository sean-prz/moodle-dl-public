

document.getElementById('openDirectoryButton').addEventListener('click', () => {
    window.electron.send('e', 'open-directory-dialog');
});