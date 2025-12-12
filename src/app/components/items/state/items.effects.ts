import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadItem,
  loadItemFailure,
  loadItems,
  loadItemsFailure,
  loadItemsSuccess,
  loadItemSuccess
} from './items.actions';
import { ItemsService } from '../../../services/items.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Item } from '../../../models/item.model';

@Injectable()
export class ItemsEffects {
  private actions$ = inject(Actions);
  private api = inject(ItemsService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      switchMap(({ query, page, pageSize }) =>
        this.api.getItems(query, page, pageSize).pipe(
          map((items: Item[]) => loadItemsSuccess({ items })),
          catchError(err => of(loadItemsFailure({ error: String(err) })))
        )
      )
    )
  );

  loadItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItem),
      switchMap(({ id }) =>
        this.api.getItemById(id).pipe(
          map((item: Item) => loadItemSuccess({ item })),
          catchError(err => of(loadItemFailure({ error: String(err) })))
        )
      )
    )
  );
}
