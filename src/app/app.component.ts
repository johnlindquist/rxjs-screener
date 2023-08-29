import { Component } from '@angular/core';
import { Subject, concat, merge, of } from 'rxjs';
import { delay, map, switchMap, takeUntil } from 'rxjs/operators';

const URL = `https://jsonplaceholder.typicode.com/todos/1`;
@Component({
  selector: 'app-root',
  template: `<div>
    <!-- Don't change anything in the template -->
    <button (click)="click$.next()">Load Todo</button>
    <button (click)="cancel$.next()">Cancel Load</button>

    <div>
      {{ todo$ | async }}
    </div>
  </div>`,
})
export class AppComponent {
  click$ = new Subject<void>();
  cancel$ = new Subject<void>();

  // Exercise: Create the todo$ observable (Everything else would be already setup)
  /**
   * 1. Display a initial text: "Waiting for click..."
   * 2. Clicking the "Load Todo" changes todo to "Loading..."
   * 3. The stream then waits for 1 second before fetching the todo
   * 4. If the user clicks "cancel" before the todo is loaded, prevent the load and display a "Cancelled!" message
   */

  todo$ = concat(
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
