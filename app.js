//     "email": "john@example.com",  "password": "123456" github check


let baseUrl = 'https://xjdqws-3001.csb.app';

document.addEventListener('alpine:init', () => {
    Alpine.data('notesApp', () => ({
        title: "",
        content: "",
        notes: [],
        loading: false,
        activeForm: "",
        activeFormToggler(formClass){this.activeForm = formClass},
        closeForm(){this.activeForm = ""},
        signupInfo: {name: "", email: "", password: "", confirmPass: ""},
        loginInfo: {email: "", password: ""},
        userInfo: {},
        editNote: {id: 0, title : "", content : ""},

        // This runs automatically when x-data="notesApp" is initialized
        init(){
            this.fetchNotes();
            this.getUserInfo();
            

        },

        async fetchNotes() {
            this.loading = true;
            try {
                // Using JSONPlaceholder as a dummy API
                const response = await fetch(`${baseUrl}`);
                data = await response.json();
                this.notes = data.reverse() ;
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                this.loading = false;
            }
        },

        async submitNote() {
            console.log("Submit func called")
    
            const response = await fetch(`${baseUrl}/add`, {
                method: 'POST',
                body: JSON.stringify({ title: this.title, content: this.content }),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
    
            const status = await response.json();
            console.log(status);
            this.closeForm()
            await this.fetchNotes()
            
            // Update list and clear inputs
            //this.notes.unshift(newNote);
            this.title = "";
            this.content = "";
        },

        setEditNoteValue(id, title, content){
            this.activeForm = "editNote";
            this.editNote.id = id;
            this.editNote.title = title;
            this.editNote.content = content;
        },

        async editNoteFunc(id){
            console.log(this.editNote.id);
            const response = await fetch(`${baseUrl}/edit/${this.editNote.id}`, {
                method: 'POST',
                body: JSON.stringify({ title: this.editNote.title, content: this.editNote.content }),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              const data = await response.json();
              console.log(data);
              this.closeForm()
              await this.fetchNotes()
        },

        async deleteNote(id){
            const res = await fetch(`${baseUrl}/delete/${id}`,{
                method: 'DELETE',
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            if (!res.ok){
                console.error("Failed to delete note", res.status);
                return
            }

            const data = await res.json();
            console.log(data);
            await this.fetchNotes()
        },

        async login(){
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                body: JSON.stringify({ email: this.loginInfo.email, password: this.loginInfo.password }),
                headers: { 'Content-type': 'application/json' }
            });
            const data =  await response.json();
            if (data.token) {
                // 1. Save the token
                localStorage.setItem('token', data.token)
                
                // 2. Redirect to dashboard/home
                alert("Welcome! You are Authenticated")
              } else {
                // Show error message
                console.log('Login failed', data.error)
              }
            
              this.getUserInfo()
        },

        async getUserInfo(){
            const token = localStorage.getItem('token')
        
        const response = await fetch(`${baseUrl}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const user = await response.json()
        this.userInfo = user;
        },

        async signup(){
            if (this.signupInfo.password !== this.signupInfo.confirmPass){
                alert("Passport Mismatch In confirm field");
                return
            }
            const res = await fetch(`${baseUrl}/signup`,{
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ name: this.signupInfo.name, email: this.signupInfo.email, password: this.signupInfo.password }),
            });
            const data = await res.json();
            console.log(data)
        },

        logout(){ localStorage.removeItem('token')},

    }));
});


