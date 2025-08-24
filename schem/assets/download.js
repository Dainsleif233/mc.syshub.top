export async function handleDownload(key) {
    const fileDownloader = document.getElementsByClassName('file-downloader')[0];
    const fileDownloaded = document.getElementsByClassName('file-downloaded')[0];
    const fileDownFailed = document.getElementsByClassName('file-down-failed')[0];
    const errorText = document.getElementById('errorText');

    try {
        const response = await fetch(
            `${siteConfig['api_url']}/download/${key}`,
            { method: 'HEAD' }
        );
        if (response.status === 200 || response.status === 302) {
            const link = document.createElement('a');
            link.href = `${siteConfig['api_url']}/download/${key}`;
            link.click();
            link.remove();
            fileDownloader.classList.add('hidden');
            fileDownloaded.classList.remove('hidden');
        } else {
            fileDownloader.classList.add('hidden');
            fileDownFailed.classList.remove('hidden');
            if (response.status === 404)
                errorText.innerText = '文件不存在';
            if (response.status === 410)
                errorText.innerText = '文件已过期';
            if (response.status === 500)
                errorText.innerText = '内部错误';
        }

    } catch (e) {
        console.error('Failed to check file:', e);
        fileDownloader.classList.add('hidden');
        fileDownFailed.classList.remove('hidden');
        errorText.innerText = '网络错误';
    }
}