interface validatable{
 value:string|number;
  required?:boolean;
  minlength?:number;
  maxlength?:number;
  min?:number;
  max?:number;
}

function validate(validatbleInput:validatable){
    let isvalid=true;
    if (validatbleInput.required){
        isvalid=isvalid && validatbleInput.value.toString().trim().length ! ==0;
    }
    if(validatbleInput.minlength !=null && typeof validatbleInput.value ==='string'){
       isvalid=isvalid && validatbleInput.value.length >=validatbleInput.minlength;            
    }
    if(validatbleInput.maxlength !=null && typeof validatbleInput.value ==='string'){
       isvalid=isvalid && validatbleInput.value.length <=validatbleInput.maxlength;            
    }
    if (validatbleInput.min!=null && typeof validatbleInput.value=='number' ){
        isvalid=isvalid && validatbleInput.value >= validatbleInput.min;
    }
    if (validatbleInput.max!=null && typeof validatbleInput.value=='number' ){
        isvalid=isvalid && validatbleInput.value <= validatbleInput.max;
    }
    return isvalid;

}

function autobinder(_:any,_2:string,descriptor:PropertyDescriptor)
{
  const originalMethod=descriptor.value;
  const myDescriptor:PropertyDescriptor={
  configurable:true,

    get(){
        const boundFn=originalMethod.bind(this);
        return boundFn;
    }
  };
  return myDescriptor;
}

class ProjectInfo {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    
    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importednode = document.importNode(this.templateElement.content,true)
        this.element = importednode.firstElementChild as HTMLFormElement;

        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;
        this.configure()
        this.attach()

    }

    private getUserInput():[string,string,number]|void{
        const enterdTitle=this.titleInputElement.value;
        const enteredDescription=this.descriptionInputElement.value;
        const enterdpeople=this.peopleInputElement.value;

        const titlevalidatable:validatable={
          value:enterdTitle,
          required:true,
          minlength:3

        };
        const descriptionvalidatable:validatable={
            value:enteredDescription,
            required:true,
            minlength:5,
            maxlength:120

        };
        
        const peoplevalidatable:validatable={
            value:+enterdpeople,
            required:true,
            min:1,
            max:10

        }



        if(!validate(titlevalidatable)|| !validate(descriptionvalidatable)|| !validate(peoplevalidatable)){
                 alert("Invalid")
                 return;
        }else{
            return [enterdTitle,enteredDescription,+enterdpeople] //+ casting to number 
        }

    }
    private clearInputs(){
        this.titleInputElement.value="";
        this.descriptionInputElement.value="";
        this.peopleInputElement.value="";

    }

    @autobinder
    private submithandeler(event:Event){
        event.preventDefault();
        const userInput=this.getUserInput()
        if(Array.isArray(userInput)){
            const [title,desc,people]=userInput;
            console.log(title,desc,people);
            this.clearInputs();
        }
       
    }

    private configure(){
        this.element.addEventListener('submit',this.submithandeler)
    }
    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element)
    }
}
const prjInput = new ProjectInfo();
