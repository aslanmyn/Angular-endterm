import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../../../models/item.model';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-card.html',
  styleUrls: ['./item-card.css']
})
export class ItemCard {
  @Input() item!: Item;
  favoritesService = inject(FavoritesService);

  async toggleFavorite(): Promise<void> {
    await this.favoritesService.toggleFavorite(this.item.id);
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.item.id);
  }
}
