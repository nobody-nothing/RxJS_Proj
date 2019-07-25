import {fromEvent, Observable, timer} from 'rxjs';
import {switchMap,distinctUntilChanged,debounceTime, filter, tap, pluck, retryWhen, delayWhen} from "rxjs/operators";
import {ajax} from "rxjs/internal/observable/dom/ajax";
import './style.css';

const sequence$: Observable<any> = fromEvent(document, 'input')
    .pipe(
        pluck('target', 'value'),
        filter((value: any) => value.trim() !== ''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap( (value: string) => ajax.getJSON(`http://api.urbandictionary.com/v0/define?term=${value}`)),
        );

sequence$
    .subscribe(
        (data: Array<Object>) => {
            Object.keys(data).map(function(objectKey, index) {
                let value = data[objectKey];
                document.getElementById('json').innerHTML = getData(value);
            });
        },
        (err) => {console.log('error: ',  err); },
        () => {console.log('yay, complete');}
);

function getData(data: Array<Object>){
    if (!data.length) {return `<div class = "noResult"><h3>Sorry, we couldn't find anything</h3></div>`;}
    return data.map((value: any) => `<div class = "outputBlock">
                    <h3 class = 'word'>${value.word}</h3>
                    <h4>Definition:</h4>
                    <p>
                    ${value.definition}                    
                    </p>
                    <h4>Example:</h4>
                    <p style = 'font-style: italic'>
                    ${value.example}
                    </p><hr>
                    <h5 class = 'author'>${value.author}</h5>
            </div>`)
        .join('');}
