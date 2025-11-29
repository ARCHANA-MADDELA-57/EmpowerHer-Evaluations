
const VALID_EMAIL = 'admin@gmail.com'
const VALID_PASSWORD = 'admin1234'
const STORAGE_KEY = 'fleetmanagementData'
const PLACEHOLDER_IMG_SRC = 'https://via.placeholder.com/400x150.png?text=Vehicle+Image'

const getFleet =()=>{
    const data=localStorage.getItem(STORAGE_KEY)
    try{
        return data?JSON.parse(data):[]
    }catch(e){
        console.error("Error parsing fleet data from localStorage",e)
        return[]
    }
}

const saveFleet = (fleet)=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(fleet))
}

const handleLogin = (event)=>{
    if(!document.getElementById('loginform'))
        return

    event.preventDefault()
    const emailInput=document.getElementById('email').value 
    const passwordInput=document.getElementById('password').value 

    if(emailInput===VALID_EMAIL && passwordInput===VALID_PASSWORD){
        alert("Login Success")
        window.location.href="admin.html"
    }else{
        alert("Wrong email or password")
    }
}
