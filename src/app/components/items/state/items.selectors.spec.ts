import { ItemsState } from './items.reducer';
import * as fromSelectors from './items.selectors';
import { Item } from '../../../models/item.model';

describe('ItemsSelectors', () => {
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

  const initialState: ItemsState = {
    items: [mockItem],
    itemsLoading: false,
    itemsError: null,
    selectedItem: mockItem,
    itemLoading: false,
    itemError: null
  };

  it('should select items', () => {
    const result = fromSelectors.selectItems.projector(initialState);
    expect(result).toEqual([mockItem]);
  });

  it('should select itemsLoading', () => {
    const result = fromSelectors.selectItemsLoading.projector(initialState);
    expect(result).toBe(false);
  });

  it('should select itemsError', () => {
    const result = fromSelectors.selectItemsError.projector(initialState);
    expect(result).toBeNull();
  });

  it('should select selectedItem', () => {
    const result = fromSelectors.selectSelectedItem.projector(initialState);
    expect(result).toEqual(mockItem);
  });

  it('should select itemLoading', () => {
    const result = fromSelectors.selectItemLoading.projector(initialState);
    expect(result).toBe(false);
  });

  it('should select itemError', () => {
    const result = fromSelectors.selectItemError.projector(initialState);
    expect(result).toBeNull();
  });
});

