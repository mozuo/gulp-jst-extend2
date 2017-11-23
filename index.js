"use strict";
const jsdom = require("jsdom");

require('jsdom-global')()

const { JSDOM } = jsdom;
var gUtil = require('gulp-util'),
    PluginError = gUtil.PluginError,
    File = gUtil.File,
    through = require('through'),
    _ = require('lodash'),
    printf = require('util').format;

var outputTmpl = ";(function(root, factory) {\
  if (typeof module === 'object' && module.exports) module.exports = factory();\
  else if (typeof define === 'function') define(factory);\
  else root = factory();\
}(typeof window === 'object' ? window : this, function() {\
  return {%s}\
}));";


function pluginError(message) {
    return new PluginError('gulp-jst-extend', message)
}

function compile(file, renameKeys) {
    var path = file.path.replace(/\\/g, '/');
    var name = path.replace(new RegExp(renameKeys[0]), renameKeys[1]),
        contents = String(file.contents)
    document.body.innerHTML = contents
    const $ = require("jquery")
    if ($(document.body).find("img").length > 0) {
        $(document.body).find("img").each(function(i, item) {
            var src = $(this).attr("src")
            if (src.indexOf() > -1) {
                src = src.match(/^<%=(.*)%>*/)[1] + "?v=" + new Date().getTime()
            } else {
                src = src + "?v=" + new Date().getTime()
            }
            $(this).attr("src", src)
            console.log($(this).attr("src"))
        })
    }
    contents = String(document.body.innerHTML.replace("&lt;", "<").replace("&gt;", ">"))
    return {
        name: name,
        fnSource: _.template(contents).source
    }
}

function buildJSTString(files, renameKeys) {
    function compileAndRender(file) {
        var template = compile(file, renameKeys)
        return printf('"%s": %s', template.name, template.fnSource)
    }

    return printf(outputTmpl, files.map(compileAndRender).join(',\n'))
}

module.exports = function jstConcat(fileName, _opts) {
    if (!fileName) throw pluginError('Missing fileName')

    var defaults = { renameKeys: ['.*', '$&'] },
        opts = _.extend({}, defaults, _opts),
        files = []

    function write(file) {
        /* jshint validthis: true */
        if (file.isNull()) return
        if (file.isStream()) return this.emit('error', pluginError('Streaming not supported'))

        files.push(file)
    }

    function end() {
        /* jshint validthis: true */
        var jstString = buildJSTString(files, opts.renameKeys)

        this.queue(new File({
            path: fileName,
            contents: new Buffer(jstString)
        }))

        this.queue(null)
    }

    return through(write, end)
}