class Note {
    constructor(id, title, text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

class App {
    constructor() {
        // localStorage.setItem('test',JSON.stringify(['123']))
        // console.log(JSON.parse(localStorage.getItem('test')))
        this.notes = JSON.parse(localStorage.getItem('notes')) || []
        console.log(this.notes)
        this.notes = [new Note("abc1", "test Title", "test Text")]
        this.$selectedNoteId = ""
        this.miniSidebar = true

        this.$activeForm = document.querySelector(".active-form")
        this.$inactiveForm = document.querySelector(".inactive-form")
        this.$noteTitle = document.querySelector("#note-title")
        this.$noteText = document.querySelector("#note-text")
        this.$notes = document.querySelector(".notes")
        this.$form = document.querySelector(".form")
        this.$modal = document.querySelector(".modal")
        this.$modalForm = document.querySelector("#modal-form")
        this.$modalTitle = document.querySelector("#modal-title")
        this.$modalText = document.querySelector("#modal-text")
        this.$closeModalForm = document.querySelector("#modal-button")
        this.$sidebar = document.querySelector(".sidebar")
        this.$sidebarActiveItem = document.querySelector(".active-item")

        this.addEventListeners()
    }

    addEventListeners() {
        document.body.addEventListener("click", (event) => {
            this.handleFormClickEvent(event)
            this.closeModal(event)
            this.openModal(event)
            this.handleArchiving(event)
        })

        this.$form.addEventListener("submit", (event) =>{
            event.preventDefault()
            const title = this.$noteTitle.value
            const text = this.$noteText.value
            this.addNotes({title, text})
            this.closeInactiveForm()
        })

        this.$closeModalForm.addEventListener("click", (event) =>{
            event.preventDefault()
        })

        this.$sidebar.addEventListener("mouseover", (event) => {
            this.handleToggleSidebar();
        })

        this.$sidebar.addEventListener("mouseout", (event) => {
            this.handleToggleSidebar()
        })

    }

    handleFormClickEvent(event) {
        const isInactiveFormClickedOn = this.$inactiveForm.contains(event.target)
        const isActiveFormClickedOn = this.$activeForm.contains(event.target)
        const title = this.$noteTitle.value
        const text = this.$noteText.value

        if(isInactiveFormClickedOn) {
           this.openActiveForm()
        }
        else if(!isInactiveFormClickedOn && !isActiveFormClickedOn) {
            this.addNotes({title, text})
            this.closeInactiveForm()
        }
    }

    openActiveForm() {
        this.$activeForm.style.display = "block"
        this.$inactiveForm.style.display = "None"
        this.$noteText.focus()
    }

    openModal(event) {
        const $selectedNote = event.target.closest(".note")
        if ($selectedNote && !event.target.closest(".archive")) {
            this.$selectedNoteId = $selectedNote.id
            this.$modalTitle.value = $selectedNote.children[1].innerHTML
            this.$modalText.value = $selectedNote.children[2].innerHTML
            this.$modal.classList.add("open-modal")
        } else {
            return
        }
       
    }

    closeModal(event) {
        const isModalFormClickedOn = this.$modalForm.contains(event.target)
        const isCloseModalBtnClickedOn = this.$closeModalForm.contains(event.target)
        if ((!isModalFormClickedOn || isCloseModalBtnClickedOn) && this.$modal.classList.contains("open-modal")) {
            this.editNote(this.$selectedNoteId, {title: this.$modalTitle.value, text: this.$modalText.value})
            this.$modal.classList.remove("open-modal")
        }
    }

    handleArchiving(event) {
        const $selectedNote = event.target.closest(".note")
        if ($selectedNote && event.target.closest(".archive")) {
            this.$selectedNoteId = $selectedNote.id
            this.deleteNote(this.$selectedNoteId)
        } else {
            return;
        }
    }

    closeInactiveForm() {
        this.$activeForm.style.display = "None"
        this.$inactiveForm.style.display = "Block"
        this.$noteTitle.value = ""
        this.$noteText.value = ""
    }

    addNotes({title,text}) {
        if(text != "") {
            const newNote = new Note(cuid(), title, text)
            this.notes = [...this.notes, newNote]
            this.render()
        }
    }

    editNote(id, {title, text}){
       this.notes =  this.notes.map((note) => {
            if(note.id == id) {
                note.title = title;
                note.text = text;
            }
            return note;
            
        });
        this.render()
    }

    deleteNote(id) {
       this.notes =  this.notes.filter((note) => note.id != id)
       this.render()
    }

    handleMouseOverNote(element) {
        const $note = document.querySelector("#" + element.id)
        const $checkNote = $note.querySelector(".check-circle")
        const $noteFooter = $note.querySelector(".note-footer")

        $checkNote.style.visibility = "visible"
        $noteFooter.style.visibility = "visible"
    }

    handleMouseOutNote(element) {
        const $note = document.querySelector("#" + element.id)
        const $checkNote = $note.querySelector(".check-circle")
        const $noteFooter = $note.querySelector(".note-footer")

        $checkNote.style.visibility = "hidden"
        $noteFooter.style.visibility = "hidden"
    }

    handleToggleSidebar() {
        if (this.miniSidebar) {
            this.$sidebar.style.width = "250px"
            this.$sidebar.classList.add("sidebar-hover")
            this.$sidebarActiveItem.classList.add("sidebar-active-item")
            this.miniSidebar = false
        }
        else {
            this.$sidebar.style.width = "80px"
            this.$sidebar.classList.remove("sidebar-hover")
            this.$sidebarActiveItem.classList.remove("sidebar-active-item")
            this.miniSidebar = "true"
        }
    }

    saveNotes() {
        localStorage.setItem('test',JSON.stringify(this.notes))
    }

    render() {
        this.saveNotes()
        this.displayNotes()
    }

    displayNotes() {
        this.$notes.innerHTML = this.notes.map((note) => 
            `
            <div class="note" id="${note.id}" onmouseover="app.handleMouseOverNote(this)" onmouseout="app.handleMouseOutNote(this)">
                <span class="material-icons check-circle">check_circle</span>
                <div class="title">${note.title}</div>
                <div class="text">${note.text}</div>

                <div class="note-footer">
                    <div class="tooltip">
                        <i class="material-icons-outlined hover small-icon">
                            add_alert
                        </i>
                        <span class="tooltip-text">Remind me</span>
                    </div>
                    <div class="tooltip">
                        <i class="material-icons-outlined hover small-icon">
                            person_add_alt
                        </i>
                        <span class="tooltip-text">Collaborator</span>
                    </div>
                    <div class="tooltip">
                        <i class="material-icons-outlined hover small-icon">
                            palette
                        </i>
                        <span class="tooltip-text">Background options</span>
                    </div>
                    <div class="tooltip">
                        <i class="material-icons-outlined hover small-icon">
                            image
                        </i>
                        <span class="tooltip-text">Background image</span>
                    </div>
                    <div class="tooltip archive">
                        <i class="material-icons-outlined hover small-icon">
                            archive
                        </i>
                        <span class="tooltip-text">Archives</span>
                    </div>                   
                    <div class="tooltip">
                    <i class="material-icons-outlined hover small-icon">
                        more_vert
                    </i>
                    <span class="tooltip-text">More</span>
                    </div>
                </div>
            </div>
        `).join("")
    }
}
const app = new App()






