import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesService } from '../../services/favorites.service';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/item.model';
import { ItemCard } from '../items/item-card/item-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ItemCard, TranslateModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class Favorites {
  favoritesService = inject(FavoritesService);
  private itemsService = inject(ItemsService);

  items = signal<Item[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadFavorites();
  }

  async loadFavorites(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const favoriteIds = this.favoritesService.favorites();
      
      if (favoriteIds.length === 0) {
        this.items.set([]);
        this.loading.set(false);
        return;
      }

      const items: Item[] = [];
      for (const id of favoriteIds) {
        try {
          const item = await this.itemsService.getItemById(id).toPromise();
          if (item) items.push(item);
        } catch (err) {
          console.warn(`Failed to load item ${id}:`, err);
        }
      }
      
      this.items.set(items);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load favorites');
    } finally {
      this.loading.set(false);
    }
  }

  async toggleFavorite(itemId: number): Promise<void> {
    await this.favoritesService.toggleFavorite(itemId);
    await this.loadFavorites();
  }

  isFavorite(itemId: number): boolean {
    return this.favoritesService.isFavorite(itemId);
  }
}

