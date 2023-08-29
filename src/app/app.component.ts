import { Component } from '@angular/core';
import { Subject, concat, merge, of } from 'rxjs';
import { delay, map, switchMap, takeUntil } from 'rxjs/operators';

const URL = `https://jsonplaceholder.typicode.com/todos/1`;
@Component({
  selector: 'app-root',
  template: `<div>
    <button (click)="click$.next()">Load Todo</button>
    <button (click)="cancel$.next()">Cancel Load</button>

    <div>
      {{ todoTitle | async }}
    </div>
  </div>`,
})
export class AppComponent {
  click$ = new Subject<void>();
  cancel$ = new Subject<void>();

  todoTitle = concat(
    of('Waiting for click...'),

    this.click$.pipe(
      switchMap(() =>
        merge(
          concat(
            of('Loading...'),
            of(URL).pipe(
              delay(1000),
              switchMap((url) => fetch(url)),
              switchMap((response) => response.json()),
              map((json) => json.title)
            )
          ).pipe(takeUntil(this.cancel$)),
          this.cancel$.pipe(map(() => 'Cancelled!'))
        )
      )
    )
  );
}
