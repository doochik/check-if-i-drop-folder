/**
 * Check whetever file is directory. This function tries to read file with FileReader.
 * I've checked this on Linux/Mac/Windows in Chrome 20, Firefox 13.0.1, Opera 12.01.
 * @author Alexey Androsov <doochik@ya.ru>
 * @licence MIT
 * @param {File} file File from Event.dataTrasfer.files
 * @param {Function} callback(result) Result is true if File is a regular file.
 */
function isRegularFile(file, callback) {
    // Chrome/Mac and IE10/Win8 ignores directory in dataTrasfer.files

    if (
        // for example, Safari supports dnd but not FileReader
        !window['FileReader'] ||
        // FileReader doesn't work in Opera 12.00, it always returns error
        (window['opera'] && window['opera'].version() === '12.00')
    ) {
        // sorry, can't check
        callback(null);

    } else {
        try {
            var reader = new FileReader();
            reader.onerror = function() {
                reader.onloadend = reader.onerror = null;
                // Chrome (Linux/Win), Firefox (Linux/Mac), Opera 12.01 (Linux/Mac/Win)
                callback(false);
            };
            reader.onloadend = function() {
                reader.onloadend = reader.onerror = null;
                // this is regular file
                callback(true);
            };
            reader.readAsDataURL(file);
        } catch(e) {
            // Firefox 13.0.1/Win throws exception if I drop folder
            callback(false);
        }
    }
}