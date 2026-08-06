import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, tap, map } from 'rxjs';
import { TaskCreationModel, TaskResponseModel } from '../../models/task.model';
import { DateFormatPipePipe } from '../../pipes/s/date-format-pipe-pipe';

export type SortDirection = 'NONE' | 'ASC' | 'DESC';

@Service()
export class Tasks {
    private apiUrl = "https://test-taskto-dobackend-production.up.railway.app/"
    private http = inject(HttpClient);
    private dateFormtPipe = new DateFormatPipePipe();

    private tasksSubject = new BehaviorSubject<TaskResponseModel[]>([]);
    private filterSubject = new BehaviorSubject<string>('NOTDONE');
    private categoryFilterSubject = new BehaviorSubject<number>(-1);
    private searchSubject = new BehaviorSubject<string>('');

    tasks$ = this.tasksSubject.asObservable();

    filteredAndSortedTasks$: Observable<TaskResponseModel[]> = combineLatest([
        this.tasksSubject,
        this.filterSubject,
        this.categoryFilterSubject,
        this.searchSubject
    ]).pipe(
        map(([tasks, filter, categoryFilter, search]) => {
            let result = [...tasks];

            if (search.trim() !== '') {
                const lower = search.toLowerCase();
                result = result.filter(t => 
                    t.title.toLowerCase().includes(lower) || 
                    (t.description && t.description.toLowerCase().includes(lower))
                );
            }

            if (filter === 'NOTDONE'){
                result = result.filter(t => !t.isCompleted);
            }
            else if (filter === 'IMPORTANT'){
                result = result.filter(t => t.priorityLevel === 2 && !t.isCompleted);
            }
            else if (filter === 'ALL'){
                result = result;
            }
            else if (filter === 'PLANNED'){
                const plannedStatuses = ['Tomorrow', 'The day after tomorrow', 'Next week', 'Next month'];
                
                result = result.filter(t => {
                    const dateStatus = this.dateFormtPipe.transform(t.deadline);
                    return plannedStatuses.includes(dateStatus) && !t.isCompleted;
                });
            }
            if (categoryFilter !== -1){
                result = result.filter(t => t.categoryId === categoryFilter);
            }

            return result;
        })
    );

    setSearch(query: string){
        this.searchSubject.next(query);
    }

    setFilter(filter: string) {
        this.filterSubject.next(filter);
    }

    setCategoryId(id: number){
        this.categoryFilterSubject.next(id);
    }

    newTask(data: TaskCreationModel): Observable<TaskResponseModel>{
        return this.http.post<TaskResponseModel>(`${this.apiUrl}api/Tasks/`, data).pipe(
            tap((response: TaskResponseModel) => {
                this.tasksSubject.next([
                    ...this.tasksSubject.getValue(), response
                ]);
            })
        )
    }
    
    getTasks(): Observable<TaskResponseModel[]>{
        return this.http.get<TaskResponseModel[]>(`${this.apiUrl}api/Tasks/`).pipe(
            tap((response: any) => {
                if (response){
                    this.tasksSubject.next(response)
                }
            })
        )
    }

    deleteTask(taskId: string){
        return this.http.delete(`${this.apiUrl}api/Tasks/${taskId}`).subscribe({
            next: (data) => {
                const currentTasks = this.tasksSubject.getValue();
                const updatedTasks = currentTasks.filter(task => task.id !== taskId);
                this.tasksSubject.next(updatedTasks);
            },
            error: (error) => {
                console.log("Deleting task exception: ", error);
            }
        })
    }

    toggleTask(taskId: string){
        return this.http.patch<TaskResponseModel>(`${this.apiUrl}api/Tasks/${taskId}/toggle`, null).subscribe({
            next: (data: TaskResponseModel) => {
                const currentTasks = this.tasksSubject.getValue();
                const updatedTasks = currentTasks.map(task => {
                    if (task.id === taskId){
                        return { ...task, isCompleted: data.isCompleted}
                    }
                    return task;
                });
                this.tasksSubject.next(updatedTasks);
            },
            error: (error) => {
                console.log("Toggle task exception: ", error);
            }
        });
    }

    editTask(dataToChange: TaskCreationModel, taskId: string){
        return this.http.put<TaskResponseModel>(`${this.apiUrl}api/Tasks/${taskId}`, dataToChange).subscribe({
            next: (newData: TaskResponseModel) => {
                const currentTasks = this.tasksSubject.getValue();
                const updatedTasks = currentTasks.map(task => {
                    if (task.id === taskId){
                        return newData;
                    }
                    return task;
                });
                this.tasksSubject.next(updatedTasks);
            }
        });
    }
}
