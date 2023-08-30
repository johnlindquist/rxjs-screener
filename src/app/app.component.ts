import { Component } from '@angular/core';
import { Subject, concat, merge, of, race } from 'rxjs';
import { catchError, delay, map, switchMap, takeUntil } from 'rxjs/operators';

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

  waitingMessage = 'Waiting for click...';
  loadingMessage = 'Loading...';
  cancelledMessage = 'Cancelled!';
  errorMessage = 'Error loading :/';

  // Exercise: Create the todo$ observable (Everything else would be already setup)
  /**
   * 1. Display a initial text: "Waiting for click..."
   * 2. Clicking the "Load Todo" changes todo to "Loading..."
   * 3. The stream then waits for 1 second before fetching the todo
   * 4. If the user clicks "cancel" before the todo is loaded, prevent the load and display a "Cancelled!" message
   * 5. "Cancel" should only be active when the todo is loading
   * 6. Handle errors gracefully by displaying "Error loading :/" when the fetch fails
   */

  todo$ = concat(
    of(this.waitingMessage),
    this.click$.pipe(
      switchMap(() =>
        concat(
          of(this.loadingMessage),
          merge(
            of(URL).pipe(
              delay(1000),
              switchMap((url) => fetch(url)),
              switchMap((response) => response.json()),
              map((json) => json.title),
              catchError(() => of(this.errorMessage)),
              takeUntil(this.cancel$)
            ),
            this.cancel$.pipe(map(() => this.cancelledMessage))
          )
        )
      )
    )
  );
}
