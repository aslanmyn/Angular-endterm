import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ItemCard } from '../item-card/item-card';
import { loadItems } from '../state/items.actions';
import {
  selectItems,
  selectItemsError,
  selectItemsLoading
} from '../state/items.selectors';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ItemCard, TranslateModule],
  templateUrl: './items-list.html',
  styleUrl: './items-list.css'
})
export class ItemsList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  items = this.store.selectSignal(selectItems);
  loading = this.store.selectSignal(selectItemsLoading);
  error = this.store.selectSignal(selectItemsError);

  searchQuery = signal('');
  page = signal(1);
  pageSize = signal(10);

  constructor() {
    const q$ = this.route.queryParamMap.pipe(
      map(params => params.get('q') || ''),
      distinctUntilChanged()
    );

    const page$ = this.route.queryParamMap.pipe(
      map(params => Number(params.get('page') || 1)),
      distinctUntilChanged()
    );

    const pageSize$ = this.route.queryParamMap.pipe(
      map(params => Number(params.get('pageSize') || 10)),
      distinctUntilChanged()
    );

    combineLatest([q$, page$, pageSize$])
      .pipe(debounceTime(300))
      .subscribe(([q, page, pageSize]) => {
        this.searchQuery.set(q);
        this.page.set(page);
        this.pageSize.set(pageSize);

        this.store.dispatch(
          loadItems({
            query: q,
            page,
            pageSize
          })
        );
      });
  }

  onSearchChange(value: string) {
    this.router.navigate([], {
      queryParams: {
        q: value,
        page: 1,
        pageSize: this.pageSize()
      },
      queryParamsHandling: 'merge'
    });
  }

  onPageSizeChange(size: string) {
    const pageSize = Number(size);
    this.router.navigate([], {
      queryParams: {
        pageSize,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  nextPage() {
    this.router.navigate([], {
      queryParams: {
        page: this.page() + 1
      },
      queryParamsHandling: 'merge'
    });
  }

  prevPage() {
    if (this.page() <= 1) {
      return;
    }
    this.router.navigate([], {
      queryParams: {
        page: this.page() - 1
      },
      queryParamsHandling: 'merge'
    });
  }
}
