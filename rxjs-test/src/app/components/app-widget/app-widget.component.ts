import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Observer, Subject, Subscriber, Subscription } from 'rxjs';
import { WidgetEvent } from 'src/app/WidgentEvent';

@Component({
  selector: 'app-widget',
  templateUrl: './app-widget.component.html',
  styleUrls: ['./app-widget.component.scss']
})
export class AppWidgetComponent implements OnInit {

  @Input() dateSubject: Subject<WidgetEvent> | undefined;
  @Output() updateCallbackEvent: EventEmitter<number> = new EventEmitter<number>();

  date: Date | undefined

  ngOnInit(): void {
    this.dateSubject?.subscribe((widgetEvent) => {
      this.date = widgetEvent.date
      this.updateCallbackEvent.emit(widgetEvent.counter)
      console.log('widget received event [' + widgetEvent.counter + '] => ' + widgetEvent.date)

    })
  }


}
