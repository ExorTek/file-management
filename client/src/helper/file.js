export const bytesToSize = (bytes, decimalPoint = 3) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1000
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPoint)) + ' ' + sizes[i];
}
