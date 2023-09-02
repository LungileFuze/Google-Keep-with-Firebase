// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVQKXXRW05itXToTtt78yiFXjITVkMty0",
  authDomain: "keep-d4a67.firebaseapp.com",
  projectId: "keep-d4a67",
  storageBucket: "keep-d4a67.appspot.com",
  messagingSenderId: "333465798452",
  appId: "1:333465798452:web:4aa807989f8cbc5dc1c761"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize the FirebaseUI Widget using Firebase.
const auth = firebase.auth()

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
console.log(db)

// Add a new document in collection "cities"
// db.collection("users").doc("actuallySignedinUser").set({
//     notes: [
//         {
//             id: "123455555TjjfdkY",
//             title: "Testing",
//             text: "Note Testing"
//         }
//    ]
// })
// .then(() => {
//     console.log("Document successfully written!");
// })
// .catch((error) => {
//     console.error("Error writing document: ", error);
// });

var docRef = db.collection("users").doc("actuallySignedinUser");

docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data().notes);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});
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
        this.notes = []
        console.log(this.notes)
        this.notes = [new Note("abc1", "test Title", "test Text")]
        this.$selectedNoteId = ""
        this.miniSidebar = true
        this.userId - ""


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


        this.$app = document.querySelector("#app")
        this.$firebaseAuthContainer = document.querySelector("#firebaseui-auth-container")
        this.$authUserText = document.querySelector(".auth-user")
        this.$logoutButton = document.querySelector(".logout")

        // Initialize the FirebaseUI Widget using Firebase.
        this.ui = new firebaseui.auth.AuthUI(auth);

        this.haddleAuth()
        this.addEventListeners()
        this.displayNotes()
    }

    haddleAuth() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log(user.uid)  
              this.userId = user.uid
              this.$authUserText.innerHTML = user.displayName
              this.redirectToApp()
            } else {
              // User is signed out
              this.redirectToAuth()
            }
          });
    }

    handleSignout() {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.redirectToAuth()
          }).catch((error) => {
            // An error happened.
            console.log("ERROR OCCURED", error)
          });
    }
    redirectToApp() {
        this.$firebaseAuthContainer.style.display = "none"
        this.$app.style.display = "block"
    }

    redirectToAuth() {
        this.$firebaseAuthContainer.style.display = "block"
        this.$app.style.display = "none"

        this.ui.start('#firebaseui-auth-container', {
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                  // User successfully signed in.
                  // Return type determines whether we continue the redirect automatically
                  // or whether we leave that to developer to handle.
                  console,log(userId)
                  this.userId = authResult.user.uid
                  this.$authUserText.innerHTML = user.displayName
                  this.redirectToApp()
                  return true;
                }
            },

            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
              firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
            // Other config options...
          });
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
            this.addNote({title, text})
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

        this.$logoutButton.addEventListener("click", (event) => {
            this.handleSignout()
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
            this.addNote({title, text})
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

    addNote({title,text}) {
        if(text != "") {
            const newNote = {id:cuid(), title, text}
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
        // localStorage.setItem('notes',JSON.stringify(this.notes))
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






