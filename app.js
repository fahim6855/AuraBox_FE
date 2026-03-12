//     "email": "john@example.com",  "password": "123456" github check


let baseUrl = 'https://aurabox.up.railway.app/';

document.addEventListener('alpine:init', () => {
    Alpine.data('notesApp', () => ({
        title: "",
        content: "",
        notes: [],
        loading: false,
        activeForm: "",
        activeFormToggler(formClass){this.activeForm = formClass},
        closeForm(){this.activeForm = ""},
        loginInfo: {email: "", password: ""},
        userInfo: {},

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
                body: JSON.stringify({ title: this.title, content: this.content, user_id: 2 }),
                headers: { 'Content-type': 'application/json' }
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

        async editNote(id){console.log("Editing initiated for note with id: " + id)},

        async deleteNote(id){
            const res = await fetch(`${baseUrl}/${id}`);
            const status = await res.json();
            console.log(status);
            await this.fetchNotes()
        },

        async login(){
            const response = await fetch('${baseUrl}/login', {
                method: 'POST',
                body: JSON.stringify({ email: this.loginInfo.email, password: this.loginInfo.password }),
                headers: { 'Content-type': 'application/json' }
            });
            const data =  await response.json();
            console.log(data);
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
        console.log(user); // "John"
        this.userInfo = user;
        },
        logout(){ localStorage.removeItem('token')},
    }));
});


