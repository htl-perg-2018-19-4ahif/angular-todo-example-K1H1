import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toUnicode } from 'punycode';
//import { Observable } from 'rxjs';


interface IPerson {
  name: string;
}

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  public todoList: ITodoItem[];
  public personList: IPerson[];
  public undoneTodos:ITodoItem[]=[];
  public myTodos:ITodoItem[]=[];
  public mineUndone:ITodoItem[]=[];

  deleteId:number;
  filter:boolean = true;


  changeCreateId:number;
  changeCreateDesc:string;
  changeCreateAssignee:string;
  changeCreateDone:boolean;

  newDescription: string;


  assignees = this.personList;


  constructor(private httpClient: HttpClient) { }

  //get all persons:

  async getPersons() {
    try{
      const persons = await this.httpClient.get<IPerson[]>('http://localhost:8080/api/people').toPromise();
    this.personList=persons;
    }catch(e){

    }
    
  }

  //get all to dos:
  async getAllToDos() {
    const todos = await this.httpClient.get<ITodoItem[]>('http://localhost:8080/api/todos').toPromise();
    this.todoList=todos;
  }


  //get undone todos
   getUndoneToDos() {
    //go through todolist and find 'done=false'
    this.todoList.forEach(todo=> {
      if(todo.done === true){
        this.undoneTodos.push(todo);
      }
    });
  }

  //get todos assigned to me
  public getMyTodos(){
    this.todoList.forEach(todo=> {
      if(todo.assignedTo == "Katrin"){
        this.myTodos.push(todo);       
      }
    });
    
  }

  // combine filters
  public getMineUndone(){
    this.todoList.forEach(todo =>{
      if(todo.assignedTo == "Katrin" && todo.done ===false){
        this.mineUndone.push(todo);
      }
    });

  }

  //add new todo item and assign it
  async newTodo() {
    await this.httpClient.post('http://localhost:8080/api/todos',
      {
        "description": this.changeCreateDesc,
        "assignedTo": this.changeCreateAssignee

      }).toPromise();
  }

  public editCreateId(event){
    this.changeCreateId = event;
  }

  public editCreateAssignee(event){
    this.changeCreateAssignee = event;
  }

  public editCreateDesc(event){
    this.changeCreateDesc =event;
  }

  public editCreateDone(event){
    this.changeCreateDone=event;
  }

  //edit an existing todo
  async editTodo() {
    await this.httpClient.patch(`http://localhost:8080/api/todos/${this.changeCreateId}`,

      {
        "description": this.changeCreateDesc,
        "assignedTo": this.changeCreateAssignee,
        "done": this.changeCreateDone

      }).toPromise();
  }


  //delete existing todo item
  async deleteTodo() {
    this.todoList = this.todoList.filter(todo => todo.id !== this.deleteId);
    console.log(this.deleteId);
    await this.httpClient.delete<ITodoItem>(`http://localhost:8080/api/todos/${this.deleteId}`).toPromise();
  }

  public changeDelete(event){
    this.deleteId=event;
  }

}
