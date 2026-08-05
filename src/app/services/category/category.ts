import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CategoryModel } from '../../models/category.model';

@Service()
export class Category {
    private apiUrl = "https://test-taskto-dobackend-production.up.railway.app/";
    private http = inject(HttpClient);

    private categoriesSubject = new BehaviorSubject<CategoryModel[]>([]);

    categories$ = this.categoriesSubject.asObservable();

    get_categories_names(): Observable<CategoryModel[]> {
        return this.http.get<CategoryModel[]>(`${this.apiUrl}api/Category/names`).pipe(
            tap((response: any) => {
                if (response){
                    this.categoriesSubject.next(response);
                }
            })
        )
    }
}
