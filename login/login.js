const login = document.getElementById("loginInp");
const password = document.getElementById("passwordInp");
const loginBtn = document.getElementById("loginBtn");


loginBtn.addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if(user.email === login.value && user.password === password.value){
        alert('You are logged in')
        window.location.href = "../main/main.html"
    }
}
  
)
