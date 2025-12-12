import { itemsReducer, initialState } from './items.reducer';
import * as ItemsActions from './items.actions';
import { Item } from '../../../models/item.model';

describe('ItemsReducer', () => {
  const mockItem: Item = {
    id: 1,
    title: 'Test Item',
    price: 10,
    description: 'Test',
    category: 'test',
    images: [],
    rating: 4.5,
    stock: 10,
    brand: 'Test',
    thumbnail: ''
  };

  it('should return initial state', () => {
    const action = { type: 'Unknown' };
    const state = itemsReducer(initialState, action as any);
    expect(state).toBe(initialState);
  });

  describe('loadItems', () => {
    it('should set loading to true and clear error', () => {
      const action = ItemsActions.loadItems({ query: '', page: 1, pageSize: 10 });
      const state = itemsReducer(initialState, action);
      expect(state.itemsLoading).toBe(true);
      expect(state.itemsError).toBeNull();
    });
  });

  describe('loadItemsSuccess', () => {
    it('should set items and loading to false', () => {
      const items = [mockItem];
      const action = ItemsActions.loadItemsSuccess({ items });
      const state = itemsReducer({ ...initialState, itemsLoading: true }, action);
      expect(state.items).toEqual(items);
      expect(state.itemsLoading).toBe(false);
      expect(state.itemsError).toBeNull();
    });
  });

  describe('loadItemsFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Test error';
      const action = ItemsActions.loadItemsFailure({ error });
      const state = itemsReducer({ ...initialState, itemsLoading: true }, action);
      expect(state.itemsError).toBe(error);
      expect(state.itemsLoading).toBe(false);
    });
  });

  describe('loadItem', () => {
    it('should set itemLoading to true and clear selectedItem', () => {
      const action = ItemsActions.loadItem({ id: 1 });
      const state = itemsReducer(initialState, action);
      expect(state.itemLoading).toBe(true);
      expect(state.itemError).toBeNull();
      expect(state.selectedItem).toBeNull();
    });
  });

  describe('loadItemSuccess', () => {
    it('should set selectedItem and itemLoading to false', () => {
      const action = ItemsActions.loadItemSuccess({ item: mockItem });
      const state = itemsReducer({ ...initialState, itemLoading: true }, action);
      expect(state.selectedItem).toEqual(mockItem);
      expect(state.itemLoading).toBe(false);
      expect(state.itemError).toBeNull();
    });
  });

  describe('loadItemFailure', () => {
    it('should set itemError and itemLoading to false', () => {
      const error = 'Test error';
      const action = ItemsActions.loadItemFailure({ error });
      const state = itemsReducer({ ...initialState, itemLoading: true }, action);
      expect(state.itemError).toBe(error);
      expect(state.itemLoading).toBe(false);
    });
  });
});

