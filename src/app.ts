interface Validetable {
  value:string|number;
  required?:boolean;
  minlength?:number;
  maxlength?:number;
  min?:number;
  max?:number;
}
//function for validation
function validate(validataebleInput:Validetable){
  let isvalid=true;
  if(validataebleInput.required){
    isvalid=isvalid && validataebleInput.value.toString().trim().length !==0;

  }
  if(validataebleInput.minlength !=null && typeof validataebleInput.value==="string"){
    isvalid=isvalid && validataebleInput.value.length >=validataebleInput.minlength;
  }
  if(validataebleInput.maxlength !=null && typeof validataebleInput.value=="string"){
    isvalid=isvalid && validataebleInput.value.length <= validataebleInput.maxlength;
  }
  if (validataebleInput.min !=null && typeof  validataebleInput.value==="number"){
    isvalid=isvalid && validataebleInput.value >=validataebleInput.min;
  }
  if (validataebleInput.max !=null && typeof validataebleInput.value==="number"){
    isvalid=isvalid && validataebleInput.value <= validataebleInput.max;
  }
  return isvalid;

}
//autobinder
function autobinder(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalmethod = descriptor.value;
  const myDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalmethod.bind(this);
      return boundFn;
    },
  };
  return myDescriptor;
}

class ProjectInput {
  // create to elemnt
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  //creare  getform Input
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  //Access to element
  constructor() {
    this.templateElement = document.getElementById(
      "project-input",
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    //import template to const
    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    //add template to  div
    this.element = importedNode.firstElementChild as HTMLFormElement;
    //css to form
    this.element.id = "user-input";
    //get form element
    this.titleInputElement = this.element.querySelector(
      "#title",
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people",
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }
  //get input form in tuple and validation
  private getInput():[string,string,number] | void {
    const eneterdtitle = this.titleInputElement.value;
    const eneterdescription = this.descriptionInputElement.value;
    const enterpeople = this.peopleInputElement.value;
    // if(eneterdtitle.trim().length===0 ||eneterdescription.trim().length===0||enterpeople.trim().length===0){
    //   alert("Invalid");
    //   return ;
    // }else {
    //   return  [eneterdtitle,eneterdescription,+enterpeople]
    // }
     const  titlevalidateble:Validetable={
       value:eneterdtitle,
       required:true,
       minlength:3
     };
     const  descriptionvalidateble:Validetable={
       value:eneterdescription,
       required:true,
       minlength:5,
       maxlength:100
     };
     const  peoplevalidateble:Validetable={
       value:+enterpeople,
       required:true,
       min:0,
       max:10
     }
     if(!validate(titlevalidateble)|| !validate(descriptionvalidateble)||!validate(peoplevalidateble)){
         alert("INVALID DATA")
       return ;
     }else
     {
       return [eneterdtitle,eneterdescription,+enterpeople]
     }

  }
  private clear(){
    this.titleInputElement.value="";
    this.descriptionInputElement.value="";
    this.peopleInputElement.value="";
    
  }
  //submit Handeler
  @autobinder
  private submitHandeler(event: Event) {
    event.preventDefault();
    const userinput=this.getInput();
    //check for tuple
    if(Array.isArray(userinput)){
      const [title,desc,people]=userinput
      console.log(title,desc,people)
    }
    this.clear()
  }

  //listener to function
  private configure()  {
    this.element.addEventListener("submit", this.submitHandeler.bind(this));
  }
  // attach form to div
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const p = new ProjectInput();

