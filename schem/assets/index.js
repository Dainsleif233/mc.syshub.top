export async function handleFile(file) {
    const fileSelector = document.getElementsByClassName('file-selector')[0];
    const fileUploading = document.getElementsByClassName('file-uploading')[0];
    const fileUploaded = document.getElementsByClassName('file-uploaded')[0];
    const fileFailed = document.getElementsByClassName('file-failed')[0];
    const errorText = document.getElementById('errorText');
    const command = document.getElementById('command');
    fileSelector.classList.add('hidden');
    fileUploading.classList.remove('hidden');
    
    try {
        const formData = new FormData();
        formData.append('schematic', file);
        
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                updateProgress(percentComplete);
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                window.result = result;
                command.value = `//schem load url:${result['download_key']}`;
                
                fileUploading.classList.add('hidden');
                fileUploaded.classList.remove('hidden');
            } else {
                if (xhr.status === 400)
                    errorText.innerText = '上传错误: ' + JSON.parse(xhr.responseText).error;
                else if (xhr.status === 413)
                    errorText.innerText = '文件过大或格式错误: ' + JSON.parse(xhr.responseText).error;
                else
                    errorText.innerText = JSON.parse(xhr.responseText).error;
            
                fileUploading.classList.add('hidden');
                fileFailed.classList.remove('hidden');
            }
        });
        
        xhr.addEventListener('error', () => {
            errorText.innerText = '网络错误';
            fileUploading.classList.add('hidden');
            fileFailed.classList.remove('hidden');
        });
        
        // 开始上传
        xhr.open('POST', `${siteConfig['api_url']}/upload`);
        xhr.send(formData);
        
    } catch (error) {
        errorText.innerText = '网络错误或其他异常';
        fileUploading.classList.add('hidden');
        fileFailed.classList.remove('hidden');
    }
}

// 更新进度条函数
function updateProgress(percent) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        progressFill.style.width = percent + '%';
        progressText.textContent = percent + '%';
    }
}