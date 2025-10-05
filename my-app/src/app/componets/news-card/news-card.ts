import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Card {
  id: number;
  title: string;
  content?: string;
  x?: number;
  y?: number;
}

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.scss']
})
export class NewsCard {
  @Input() card?: Card | null;
  @Output() cardClicked = new EventEmitter<Card>();

  handleClick() {
    if (this.card) {
      this.cardClicked.emit(this.card);
    }
  }
}
