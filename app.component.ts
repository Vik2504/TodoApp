import { TaskService } from "./app.service";
import { config } from "./app.config";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'

import { Task } from "./app.model";
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnInit {
  title = "Todo App";
  myTask: string = "";
  tasks: Observable<any[]> | undefined;
  editMode: boolean = false;
  taskToEdit: any = {};

  constructor(private db: AngularFirestore, private taskService: TaskService) {}

  ngOnInit() {
    this.tasks = this.db
      .collection(config.collection_endpoint)
      .snapshotChanges().pipe(map((actions: any[]) => {
        return actions.map((a: { payload: { doc: { data: () => Task; id: any; }; }; }) => {
          const data = a.payload.doc.data() as Task;

          const id = a.payload.doc.id;

          return { id, data };
        });
      }));

    console.log(this.tasks);
  }

  edit(task: { description: string; }) {
    console.log(task);

    this.taskToEdit = task;
    this.editMode = true;

    this.myTask = task.description;
  } 

  saveTask() {
    if (this.myTask !== null) {
      
      let task = {
        id: "1",
        description: this.myTask
      };

      if (!this.editMode) {
        console.log(task);
        this.taskService.addTask(task);
      } else {
        let taskId = this.taskToEdit.id;

        this.taskService.updateTask(taskId, task);
      }

      this.editMode = false;
      this.myTask = "";
    }
  } 

  deleteTask(task: { id: any; }) {
    let taskId = task.id;

    this.taskService.deleteTask(taskId);
  } 
}