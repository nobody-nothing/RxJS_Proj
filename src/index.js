"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ajax_1 = require("rxjs/internal/observable/dom/ajax");
require("./style.css");
var sequence$ = rxjs_1.fromEvent(document, 'input')
    .pipe(operators_1.pluck('target', 'value'), operators_1.filter(function (value) { return value.trim() !== ''; }), operators_1.debounceTime(500), operators_1.distinctUntilChanged(), operators_1.switchMap(function (value) { return ajax_1.ajax.getJSON("http://api.urbandictionary.com/v0/define?term=" + value); }));
sequence$
    .subscribe(function (data) {
    Object.keys(data).map(function (objectKey, index) {
        var value = data[objectKey];
        document.getElementById('json').innerHTML = getData(value);
    });
}, function (err) { console.log('error: ', err); }, function () { console.log('yay, complete'); });
function getData(data) {
    if (!data.length) {
        return "<div class = \"noResult\"><h3>Sorry, we couldn't find anything</h3></div>";
    }
    return data.map(function (value) { return "<div class = \"outputBlock\">\n                    <h3 class = 'word'>" + value.word + "</h3>\n                    <h4>Definition:</h4>\n                    <p>\n                    " + value.definition + "                    \n                    </p>\n                    <h4>Example:</h4>\n                    <p style = 'font-style: italic'>\n                    " + value.example + "\n                    </p><hr>\n                    <h5 class = 'author'>" + value.author + "</h5>\n            </div>"; })
        .join('');
}
