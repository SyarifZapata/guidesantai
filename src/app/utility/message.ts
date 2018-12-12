export class Message {
  from: string;
  content: string;
  createdAt: any;

  constructor(from:string, content:string, createdAt:any){
    this.from = from;
    this.content = content;
    this.createdAt = createdAt;
  }

}
