document.addEventListener('DOMContentLoaded', async function() {
    const response = fetch('./assets/config.json')
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => window.siteConfig = data)
        .catch(error => console.error('Failed to load config:', error));

    if ((new URLSearchParams(window.location.search).has('key')) &&
            document.getElementById('file-download') !== null) {
        const download = await import('./download.js');
        await response;
        download.handleDownload((new URLSearchParams(window.location.search).get('key')));
    }

    if ((new URLSearchParams(window.location.search).has('key')) &&
            document.getElementById('file-delete') !== null) {
        const deleteJs = await import('./delete.js');
        await response;
        deleteJs.handleDelete((new URLSearchParams(window.location.search).get('key')));
    }
});

if (document.getElementById('fileInput') !== null)
    document.getElementById('fileInput').addEventListener('change', async e => {
        const files = Array.from(e.target.files);
        const index = await import('./index.js');
        await index.handleFile(files[0]);
        e.target.value = '';
    });

document.addEventListener('click', async function(e) {
    if (e.target.id === 'return')
        location.href = '/schem';

    if (e.target.id === 'file-download') {
        const key = document.getElementById('keyInput').value;
        const download = await import('./download.js');
        download.handleDownload(key);
    }

    if (e.target.id === 'file-delete') {
        const key = document.getElementById('keyInput').value;
        const deleteJs = await import('./delete.js');
        deleteJs.handleDelete(key);
    }
    
    if (e.target.id === 'delete')
        location.href = `/schem/delete.html?key=${window.result['delete_key']}`;
    
    if (e.target.id === 'download')
        location.href = `/schem/download.html?key=${window.result['download_key']}`;
    
    if (e.target.id === 'copy') {
        const commandInput = document.getElementById('command');
        if (commandInput && commandInput.value) {
            navigator.clipboard.writeText(commandInput.value).then(() => {
                e.target.textContent = 'Copied';
                
                setTimeout(() => {
                    e.target.textContent = 'Copy';
                }, 3000);
            }).catch(err => {
                console.error('复制失败:', err);
                try {
                    commandInput.select();
                    document.execCommand('copy');
                    e.target.textContent = 'Copied';
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                    }, 3000);
                } catch (fallbackErr) {
                    console.error('传统复制方法也失败:', fallbackErr);
                }
            });
        }
    }
});