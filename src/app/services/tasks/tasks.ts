import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TaskCreationModel, TaskResponseModel } from '../../models/task.model';
import { response } from 'express';
import { error } from 'console';

@Service()
export class Tasks {
    private apiUrl = "https://test-taskto-dobackend-production.up.railway.app/"
    private http = inject(HttpClient);

    private tasksSubject = new BehaviorSubject<TaskResponseModel[]>([]);

    tasks$ = this.tasksSubject.asObservable();

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
