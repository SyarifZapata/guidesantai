export class Message {
  id: number;
  from: string;
  content: string;

  constructor(id:number, from:string, content:string){
    this.id = id;
    this.from = from;
    this.content = content;
  }

}
