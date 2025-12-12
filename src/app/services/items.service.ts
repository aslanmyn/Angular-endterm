import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private http = inject(HttpClient);
  private readonly API = 'https://dummyjson.com/products';

  // HW6–8 сигнатура: только query
  getItems(query: string = '', page: number = 1, pageSize: number = 10): Observable<Item[]> {
    const trimmed = query.trim();

    let url: string;
    if (trimmed) {
      url = `${this.API}/search?q=${encodeURIComponent(trimmed)}&limit=${pageSize}&skip=${(page - 1) * pageSize}`;
    } else {
      url = `${this.API}?limit=${pageSize}&skip=${(page - 1) * pageSize}`;
    }

    return this.http
      .get<{ products: Item[] }>(url)
      .pipe(map((res) => res.products ?? []));
  }

  getItemById(id: string | number): Observable<Item> {
    const url = `${this.API}/${id}`;
    return this.http.get<Item>(url);
  }
}
