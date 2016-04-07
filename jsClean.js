var beautify = require('js-beautify').js_beautify,
    fs = require('fs');

/**
 * The inputFile path can be hardcoded if needed
 * @const {string}
 */
var inputFile = "";

/**
 * The regular expression to locate the array with the codebase strings
 * @const {RegExp}
 */
var arrayRegex = /^.*var (.+?) = (\[([^\]])*\]?.*)/m; // we take the whole line because of a possible "a[href=mylink]" item in the strings array
var matches = [];

/**
 * Object for setting the optional arguments status
 * @enum {bool}
 */
var options = {
    expandArray: false
};
var OUTPUT = "";

/**
 * Checks for valid input path strings and optional arguments in the ARGVs
 */
process.argv.forEach(function(val, index, array) {
    if (val.substring(val.length - 8, val.length) !== "jsClean.js" &&
        val.substring(val.length - 4, val.length) !== "node" &&
        val.substring(0, 2) !== "--")
        inputFile = val;

    switch (val) {
        case "--expandArray":
            options.expandArray = true;
            break;
    }

    if (array.length === index + 1)
        if (inputFile === "")
            throwError("Missing input file.");
        else
            fs.readFile(inputFile, 'utf8', function(err, data) {
                if (err)
                    throwError(err.message);
                else {
                    OUTPUT = beautify(data, {
                        indent_size: 2,
                        unescape_strings: true,
                        keep_array_indentation: false,
                        preserve_newlines: false
                    });
                    if (options.expandArray) //dirty hack: the .exec to get the array pointers seems to be buggy so we iterate the function two times
                        expandArray(OUTPUT, function(javascriptSource) {
                        expandArray(javascriptSource, function(javascriptSource) {
                            OUTPUT = javascriptSource;
                        });
                    });

                    console.log(OUTPUT);
                }
            });
});

/**
 * Expand the string array 
 * @params {string} javascriptSource The target source to unpack
 * @function linecallback Callback function to return the result
 */
function expandArray(javascriptSource, callback) {

    var matchedArray = arrayRegex.exec(javascriptSource);
    var stringsArray = eval(matchedArray[2]); //should be safe
    var stringsArrayVarName = matchedArray[1];
    var varNameRegex = new RegExp(stringsArrayVarName + "(\\[([[\\d\\]]*?)\\])", "g");

    var notEOF = true;
    while (notEOF) {
        matches = varNameRegex.exec(javascriptSource);
        if (matches == null) {
            notEOF = false;
            callback(javascriptSource);
            break;
        }
        javascriptSource = javascriptSource.replace(new RegExp(escapeRegExp(matches[0]), 'g'), "\"" + stringsArray[matches[2]] + "\"");

    }

}

/**
 * Escape a string to RegExp
 * @params {string} str The target string
 */
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Throws formatted errors and quit the process
 * @params {string} errormessage The designed error message to display
 */
function throwError(errormessage) {
    console.error("[!] " + errormessage);
    process.exit(1);
}