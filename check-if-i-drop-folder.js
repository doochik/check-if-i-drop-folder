/**
 * Check whetever drop target is directory or file. This function tries to read file with FileReader.
 * I've checked this on Linux/Mac/Windows in latest version of Chrome, Firefox, IE and Opera.
 * @author Alexey Androsov <doochik@ya.ru>
 * @licence MIT
 * @param {File} file File from Event.dataTrasfer.files
 * @param {Function} callback(result) Result is true if File is a regular file.
 */
function isRegularFile(file, callback) {
    // Chrome/Mac and IE10/Win8 ignores directory in dataTrasfer.files
    
    // if size is bigger than 4kb it is regular file
    if (file.size > 4096) {
        callback(true);
        return;
    }

    if (
        // for example, Safari 5 supports dnd but not FileReader
        !window['FileReader'] ||
        // FileReader doesn't work in Opera 12.00/Mac, it always returns error
        (window['opera'] && navigator.platform.toLowerCase().indexOf('mac') > -1 && window['opera'].version() === '12.00')
    ) {
        // sorry, can't check
        callback(null);

    } else {
        try {
            var reader = new FileReader();
            reader.onerror = function() {
                reader.onloadend = reader.onprogress = reader.onerror = null;
                // Chrome (Linux/Win), Firefox (Linux/Mac), Opera 12.01 (Linux/Mac/Win)
                callback(false);
            };
            reader.onloadend = reader.onprogress = function() {
                reader.onloadend = reader.onprogress = reader.onerror = null;
                // We can't abort reading after loadend event.
                // @see https://developer.mozilla.org/en/DOM/FileReader#abort()
                // @see https://bugzilla.mozilla.org/show_bug.cgi?id=657964
                if (e.type != 'loadend') {
                    // abort reading immediately after first success event
                    reader.abort();
                }
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