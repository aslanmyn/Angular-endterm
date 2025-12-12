import { createAction, props } from '@ngrx/store';

export const loadItems = createAction(
  '[Items] Load Items',
  props<{ query: string; page: number; pageSize: number }>()
);

export const loadItemsSuccess = createAction(
  '[Items] Load Items Success',
  props<{ items: any[] }>()
);

export const loadItemsFailure = createAction(
  '[Items] Load Items Failure',
  props<{ error: string }>()
);

export const loadItem = createAction(
  '[Items] Load Item',
  props<{ id: string | number }>()
);

export const loadItemSuccess = createAction(
  '[Items] Load Item Success',
  props<{ item: any }>()
);

export const loadItemFailure = createAction(
  '[Items] Load Item Failure',
  props<{ error: string }>()
);
