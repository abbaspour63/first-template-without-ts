"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Projectstatus;
(function (Projectstatus) {
    Projectstatus[Projectstatus["Active"] = 0] = "Active";
    Projectstatus[Projectstatus["finished"] = 1] = "finished";
})(Projectstatus || (Projectstatus = {}));
class project {
    id;
    title;
    description;
    people;
    status;
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class Projectstate {
    listeners = [];
    projects = [];
    //singleton 
    static instance;
    constructor() {
    }
    static getinstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Projectstate();
        return this.instance;
    }
    addlistener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addproject(title, description, numofPeople) {
        // const newProject = {
        //     id: Math.random().toString(),
        //     title: title,
        //     description: description,
        //     numofPeople: numofPeople
        // }
        const newProject = new project(Math.random.toString(), title, description, numofPeople, Projectstatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectstate = Projectstate.getinstance();
function validate(validatbleInput) {
    let isvalid = true;
    if (validatbleInput.required) {
        isvalid = isvalid && validatbleInput.value.toString().trim().length == 0;
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
//autobinder 
function autobinder(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const myDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return myDescriptor;
}
class Projectlist {
    type;
    templateElement;
    hostElement;
    element;
    assignedproject;
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        const importednode = document.importNode(this.templateElement.content, true);
        this.assignedproject = [];
        this.element = importednode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectstate.addlistener((projects) => {
            const relatedproject = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === Projectstatus.Active;
                }
                return prj.status === Projectstatus.finished;
            });
            this.assignedproject === relatedproject;
            //    this.assignedproject=projects;
            this.renderprojects();
        });
        this.attach();
        this.rendercontent();
    }
    renderprojects() {
        const listEl = document.getElementById(`${this.type}-project-list`);
        for (const prjItem of this.assignedproject) {
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
    rendercontent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = this.type.toUpperCase() + "projects";
    }
}
class ProjectInfo {
    templateElement;
    hostElement;
    element;
    titleInputElement;
    descriptionInputElement;
    peopleInputElement;
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importednode = document.importNode(this.templateElement.content, true);
        this.element = importednode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    getUserInput() {
        const enterdTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enterdpeople = this.peopleInputElement.value;
        const titlevalidatable = {
            value: enterdTitle,
            required: true,
            minlength: 3
        };
        const descriptionvalidatable = {
            value: enteredDescription,
            required: true,
            minlength: 5,
            maxlength: 120
        };
        const peoplevalidatable = {
            value: +enterdpeople,
            required: true,
            min: 1,
            max: 10
        };
        if (!validate(titlevalidatable) || !validate(descriptionvalidatable) || !validate(peoplevalidatable)) {
            //alert("Invalid")
            return;
        }
        else {
            return [enterdTitle, enteredDescription, +enterdpeople]; //+ casting to number 
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    @autobinder
    submithandeler(event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectstate.addproject(title, desc, people);
            // console.log(title,desc,people);
            this.clearInputs();
        }
    }
    //submit  listener 
    configure() {
        this.element.addEventListener('submit', this.submithandeler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const prjInput = new ProjectInfo();
const activePrj = new Projectlist('active');
const finishedprj = new Projectlist('finished');
//# sourceMappingURL=app.js.map