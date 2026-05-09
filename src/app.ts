enum ProjectStatus{
    Active,finished
}

class project{
  constructor( public id:string,    
    public title:string,
    public description:string,
    public people:number,
    public  status:ProjectStatus
  ){}
  
}

class Projectstate {
    private listeners: any[] = [];
    private projects: project[]=[];
    //singleton 
    private static instance: Projectstate;
    private constructor() {
    
    }

    static getinstance() {
        if (this.instance) {
            return this.instance;
            
        }
        this.instance = new Projectstate()
        return this.instance;
    }

    addlistener(listenerFn: Function) {
        this.listeners.push(listenerFn);
        
    }

    addproject(title: string, description:string, numofPeople: number) {
        // const newProject = {
        //     id: Math.random().toString(),
        //     title: title,
        //     description: description,
        //     numofPeople: numofPeople
        // }
    const newProject=new project(
    Math.random.toString(),
     title,
        description,
      numofPeople ,
     ProjectStatus.Active
    );
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());

        }
    }

}
const projectstate = Projectstate.getinstance()


interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatebleInput:Validatable){
    let isvalid=true;
    if(validatebleInput.required){
        isvalid=isvalid && validatebleInput.value.toString().trim().length !==0;
    }
    if(validatebleInput.minLength !=null &&  typeof validatebleInput.value==="string"){
        isvalid=isvalid&& validatebleInput.value.length >= validatebleInput.minLength
    }
    if(validatebleInput.maxLength !=null && typeof validatebleInput.value==="string"){
        isvalid=isvalid&& validatebleInput.value.length <= validatebleInput.maxLength
    }
    if(validatebleInput.min !=null && typeof validatebleInput.value==="number"){
        isvalid=isvalid && validatebleInput.value >= validatebleInput.min;
}
  if(validatebleInput.max !=null && typeof validatebleInput.value==="number"){
        isvalid=isvalid && validatebleInput.value <= validatebleInput.max;
}
  return isvalid;
}

function autobinder(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const myDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return myDescriptor;
}
class Projectlist {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    assignedproject:project[];
    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        const importednode = document.importNode(this.templateElement.content, true);
        this.assignedproject=[];
        this.element = importednode.firstElementChild as HTMLFormElement;
        this.element.id = `${this.type}-projects`;

        projectstate.addlistener((projects:project[])=>{
        const relatedproject=projects.filter((prj)=>{
            if(this.type==="active"){
                return prj.status===ProjectStatus.Active;
            }
            return prj.status===ProjectStatus.finished
        });
        this.assignedproject===relatedproject
        //    this.assignedproject=projects;
           this.renderprojects(); 
           
           

        })
        this.attach();
        this.rendercontent();
        
        
    }
    private renderprojects(){
        const listEl=document.getElementById(`${this.type}-project-list`) ! as HTMLUListElement;
        for (const prjItem of this.assignedproject) {
            const listItem=document.createElement("li");
            listItem.textContent=prjItem.title;
            listEl.appendChild(listItem)
        }
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element)
    }
    private rendercontent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + "projects";
    }


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
        
        const importednode = document.importNode(this.templateElement.content,true);
        this.element =importednode.firstElementChild as HTMLFormElement;
        
        this.element.id = "user-input";
        
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;
        this.configure()
        this.attach()

    }

    private getUserInput(): [string, string, number] | void {
        const enterdTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enterdpeople = this.peopleInputElement.value;

        const titlevalidatable: Validatable = {
            value: enterdTitle,
            required: true,
             minLength: 3

        };
        const descriptionvalidatable: Validatable = {
            value: enteredDescription,
            required: true,
             minLength: 5,
            maxLength: 120

        };

        const peoplevalidatable: Validatable = {
            value: +enterdpeople,
            required: true,
            min: 1,
            max: 10
        }

        if (!validate(titlevalidatable) || !validate(descriptionvalidatable) || !validate(peoplevalidatable)) {
            
            
           alert("Invalid")
            return;
        } else {
            return [enterdTitle, enteredDescription, +enterdpeople] //+ casting to number 
        }

    }
    private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    
    }

    @autobinder
    private submithandeler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectstate.addproject(title, desc, people)
            // console.log(title,desc,people);
            this.clearInputs();
        }

    }
    //submit  listener 
    private configure() {
        this.element.addEventListener('submit',this.submithandeler);
    }
    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin",this.element)
    }

}

const prjInput = new ProjectInfo();
const activePrj = new Projectlist('active')
const finishedprj = new Projectlist('finished')
