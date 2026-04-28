class Projectstate {
    private listeners: any[] = [];
    private projects: any[] = [];
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
        this.listeners.push(listenerFn)
    }
    addproject(title: string, description: string, numofPeople: number) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            numofPeople: numofPeople
        }
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())

        }
    }

}
const projectstate = Projectstate.getinstance()


interface validatable {
    value: string | number;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

function validate(validatbleInput: validatable) {
    let isvalid = true;
    if (validatbleInput.required) {
        isvalid = isvalid && validatbleInput.value.toString().trim().length! == 0;
    }
    if (validatbleInput.minlength != null && typeof validatbleInput.value === 'string') {
        isvalid = isvalid && validatbleInput.value.length >= validatbleInput.minlength;
    }
    if (validatbleInput.maxlength != null && typeof validatbleInput.value === 'string') {
        isvalid = isvalid && validatbleInput.value.length <= validatbleInput.maxlength;
    }
    if (validatbleInput.min != null && typeof validatbleInput.value == 'number') {
        isvalid = isvalid && validatbleInput.value >= validatbleInput.min;
    }
    if (validatbleInput.max != null && typeof validatbleInput.value == 'number') {
        isvalid = isvalid && validatbleInput.value <= validatbleInput.max;
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
    assignedproject:any[];
    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        const importednode = document.importNode(this.templateElement.content, true);
        this.assignedproject=[]
        this.element = importednode.firstElementChild as HTMLFormElement;
        this.element.id = `${this.type}-projects`;
        projectstate.addlistener((projects:any[])=>{
           this.assignedproject=projects;
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

        const importednode = document.importNode(this.templateElement.content, true)
        this.element = importednode.firstElementChild as HTMLFormElement;

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

        const titlevalidatable: validatable = {
            value: enterdTitle,
            required: true,
            minlength: 3

        };
        const descriptionvalidatable: validatable = {
            value: enteredDescription,
            required: true,
            minlength: 5,
            maxlength: 120

        };

        const peoplevalidatable: validatable = {
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
        const userInput = this.getUserInput()
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectstate.addproject(title, desc, people)
            // console.log(title,desc,people);
            this.clearInputs();
        }

    }

    private configure() {
        this.element.addEventListener('submit', this.submithandeler)
    }
    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element)
    }
}
const prjInput = new ProjectInfo();
const activePrj = new Projectlist('active')
const finished = new Projectlist('finished')





// const animals = ["ant", "bison", "camel", "duck", "elephant"];

// console.log(animals.slice(2));
// // Expected output: Array ["camel", "duck", "elephant"]

// console.log(animals.slice(2, 4));
// // Expected output: Array ["camel", "duck"]

// console.log(animals.slice(1, 5));
// // Expected output: Array ["bison", "camel", "duck", "elephant"]

// console.log(animals.slice(-2));
// // Expected output: Array ["duck", "elephant"]

// console.log(animals.slice(2, -1));
// // Expected output: Array ["camel", "duck"]

// console.log(animals.slice());
// // Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]
