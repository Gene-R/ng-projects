import { Component, signal, computed, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../componets/news-card/news-card';
import { DragDropModule, CdkDragDrop, moveItemInArray, CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [CommonModule, DragDropModule]
})
export class Landing {

  cards: WritableSignal<Card[]> = signal([]);
  cardCount = computed(() => this.cards().length);
  buttonClicks = signal(0);
  // true = reorder list mode; false = free placement mode
  reorderMode = signal(true);
  // track selected card ids so each card can keep its selected state
  selectedIds: WritableSignal<Set<number>> = signal(new Set<number>());

  addCard(card: Card) {
    // initialize a simple grid position for free-drag mode
    const index = this.cards().length;
    const cols = 5;
    const padding = 16;
    const cardW = 220;
    const cardH = 160;
    const x = padding + (index % cols) * (cardW + padding);
    const y = padding + Math.floor(index / cols) * (cardH + padding);
    this.cards.update(cards => [...cards, { ...card, x, y }]);
  }

  removeCard(cardId: number) {
    this.cards.update(cards => cards.filter(c => c.id !== cardId));
  }

  public onButtonClick() {
    // this.addCard({ id: Date.now(), title: `Card ${this.cardCount() + 1}` });
    // add a sample card so the UI shows something
    const nextId = (this.cards().length ? Math.max(...this.cards().map(c => c.id)) + 1 : 1);
    this.addCard({ id: nextId, title: `Card ${nextId}`, content: `Generated at ${new Date().toLocaleTimeString()}` });
    this.buttonClicks.update(count => count + 1);
  }

  onNewsCardClick(card: Card) {
    // toggle selected state for this card
    this.selectedIds.update(prev => {
      const next = new Set(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.add(card.id);
      return next;
    });
    this.buttonClicks.update(count => count + 1);
  }

  // handle drop event from CDK drag & drop and reorder the cards signal
  onDrop(event: CdkDragDrop<Card[]>) {
    this.cards.update(list => {
      const copy = [...list];
      moveItemInArray(copy, event.previousIndex, event.currentIndex);
      return copy;
    });
  }

  // handle free-drag end: store the final free-drag position
  onFreeDragEnd(event: CdkDragEnd, card: Card) {
    const pos = event.source.getFreeDragPosition();
    this.cards.update(list => list.map(c => c.id === card.id ? { ...c, x: pos.x, y: pos.y } : c));
  }

  toggleMode() {
    this.reorderMode.update(v => !v);
  }
    

}
