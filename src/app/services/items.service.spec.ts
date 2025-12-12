import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsService } from './items.service';
import { Item } from '../models/item.model';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService]
    });

    service = TestBed.inject(ItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should fetch items without query', () => {
      const mockItems: Item[] = [
        { id: 1, title: 'Test Item', price: 10, description: 'Test', category: 'test', images: [], rating: 4.5, stock: 10, brand: 'Test', thumbnail: '' }
      ];

      service.getItems('', 1, 10).subscribe(items => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne('https://dummyjson.com/products?limit=10&skip=0');
      expect(req.request.method).toBe('GET');
      req.flush({ products: mockItems });
    });

    it('should fetch items with query', () => {
      const mockItems: Item[] = [
        { id: 1, title: 'Search Item', price: 10, description: 'Test', category: 'test', images: [], rating: 4.5, stock: 10, brand: 'Test', thumbnail: '' }
      ];

      service.getItems('search', 1, 10).subscribe(items => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne('https://dummyjson.com/products/search?q=search&limit=10&skip=0');
      expect(req.request.method).toBe('GET');
      req.flush({ products: mockItems });
    });

    it('should handle pagination correctly', () => {
      service.getItems('', 2, 5).subscribe();

      const req = httpMock.expectOne('https://dummyjson.com/products?limit=5&skip=5');
      expect(req.request.method).toBe('GET');
      req.flush({ products: [] });
    });

    it('should return empty array if products is null', () => {
      service.getItems('', 1, 10).subscribe(items => {
        expect(items).toEqual([]);
      });

      const req = httpMock.expectOne('https://dummyjson.com/products?limit=10&skip=0');
      req.flush({ products: null });
    });
  });

  describe('getItemById', () => {
    it('should fetch item by id', () => {
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

      service.getItemById(1).subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne('https://dummyjson.com/products/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });

    it('should handle string id', () => {
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

      service.getItemById('1').subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne('https://dummyjson.com/products/1');
      req.flush(mockItem);
    });
  });
});

