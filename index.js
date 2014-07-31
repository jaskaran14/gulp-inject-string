/*
 * gulp-inject-html
 * https://github.com/Schmicko/gulp-inject-html
 *
 * Copyright (c) 2014 Michael Hazell
 * Licensed under the MIT license.
 */

var es = require('event-stream'),
    gutil = require('gulp-util');

var stream = function(injectMethod){
    return es.map(function (file, cb) {
        try {
            file.contents = new Buffer( injectMethod( String(file.contents) ));
        } catch (err) {
            return cb(new gutil.PluginError('gulp-inject-html', err));
        }
        cb(null, file);
    });
};

module.exports = {
    append: function(str){
        return stream(function(fileContents){
            // assume str is a string for now
            return fileContents + String(str);
        });
    },
    prepend: function(str){
        return stream(function(fileContents){
            // assume str is a string for now
            return String(str) + fileContents;
        });
    },
    wrap: function(start, end){
        return stream(function(fileContents){
            // assume start and end are strings
            return String(start) + fileContents + String(end);
        });
    },
    before: function(search, str){
        return stream(function(fileContents){
            var index, start, end;
            // the simplest thing ...
            index = fileContents.indexOf(search);
            if(index > -1){
                start = fileContents.substr(0, index);
                end = fileContents.substr(index);
                return start + str + end;
            } else {
                return fileContents;
            }
        });
    },
    after: function(search, str){
        return stream(function(fileContents){
            var index, start, end;
            index = fileContents.indexOf(search);
            if(index > -1){
                start = fileContents.substr(0, index + search.length);
                end = fileContents.substr(index + search.length);
                return start + str + end;
            } else {
                return fileContents;
            }
        });
    }
};

module.exports._stream = stream;