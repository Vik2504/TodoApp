import { config } from "./app.config";
import { Task } from "./app.model";
import { Injectable } from "@angular/core";
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

@Injectable()
export class TaskService{
  tasks: AngularFirestoreCollection<Task>;
  private taskDoc: AngularFirestoreDocument<Task> | undefined;

  constructor(private db: AngularFirestore) {
    this.tasks = db.collection<Task>(config.collection_endpoint);
  }

  addTask(task: Task) {
    this.tasks.add(task);
  } 

  updateTask(id: any, update: Partial<Task>) {
    this.taskDoc = this.db.doc<Task>(`${config.collection_endpoint}/${id}`);

    this.taskDoc.update(update);
  }

  deleteTask(id: any) {
    this.taskDoc = this.db.doc<Task>(`${config.collection_endpoint}/${id}`);

    this.taskDoc.delete();
  } 
}