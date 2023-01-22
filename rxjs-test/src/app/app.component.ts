import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { throws } from 'assert';
import { concatMap, Observable, Observer, timer, interval, map, Subscriber, Subscription, Subject } from 'rxjs';
import { Car } from './Car';
import { WidgetEvent } from './WidgentEvent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit, OnDestroy {

  cars$: Observable<Car[]> | undefined = undefined

  counter: number = 0
  callbackCounter: number = 0
  counter10: number = 0
  date: Date | undefined

  counter$: Subject<number> = new Subject()
  counter10$: Subject<number> = new Subject()
  date$: Subject<WidgetEvent> = new Subject()

  intervalSubscription$: Subscription | undefined

  ngOnInit(): void {
    this.refresh()

    this.counter$.subscribe(event => {
      this.counter++;
      console.log('Prev: ' + event + ', new: ' + this.counter) 
    })

    this.counter10$.subscribe(event => {
      this.counter10++;
    })

    this.date$.subscribe((widgetEvent: WidgetEvent) => {
      this.date = widgetEvent.date;
    })

  }

  refresh(): void {
    console.log('... on refresh')
    this.cars$ = undefined

    setTimeout(() => {
      this.cars$ = new Observable((observer: Observer<Car[]>) => {
        const c: Car[] = []
        for (let i = 0; i < 5; i++) {
          c.push(new Car('Make' + i, 'Model' + i))
        }
        observer.next(c)
        observer.complete()
      })
    }, 1000)

  }

  subscribe(): void {
    this.intervalSubscription$ = interval(1000).subscribe(() => {
      console.log('interval is called: ' + this.counter)
      this.counter$.next(this.counter)
      if (this.counter % 10 === 0) {
        this.counter10$.next(this.counter10)
      }
      this.date$.next(new WidgetEvent(this.counter, new Date()))
    })

  }

  unsubscribe(): void {
    this.intervalSubscription$?.unsubscribe()
    this.intervalSubscription$ = undefined
  }

  ngOnDestroy(): void {
    this.intervalSubscription$?.unsubscribe()
  }

  onUpdateCallbackEvent(counter: any): void {
    console.log('received on callback event: ' + counter)
    this.callbackCounter = counter;
  }


}
