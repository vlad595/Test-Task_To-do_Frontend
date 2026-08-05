export interface TaskCreationModel{
    title: string;
    description: string | null;
    deadline: string | null;
    priorityLevel: number;
    categoryId: number | null
}

export interface TaskResponseModel{
    id: string;
    title: string;
    description: string | null;
    deadline: string | null;
    isCompleted: boolean;
    priorityLevel: number;
    categoryId: number | null;
}