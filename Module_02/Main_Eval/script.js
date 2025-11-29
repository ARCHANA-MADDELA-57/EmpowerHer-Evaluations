
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
document.addEventListener('DOMContentLoaded',()=>{
    const loginform=document.getElementById('loginform')
    if(loginform){
        loginform.addEventListener('submit',handleLogin)
    }
})


const createCardHTML = (vehicle)=>{
    const isAvailable = vehicle.isAvailable==='Available'
    const statusClass=isAvailable?'available':'unavailable'
    const statusText=vehicle.isAvailable

    return `<div class="vehicle-card" data-id="${vehicle.id}">
    <img src="${PLACEHOLDER_IMG_SRC}" alt="${vehicle.category} vehicle">
    <div class="card-info">
    <h4>Reg No:${vehicle.regNo}</h4>
    <p><strong>Category:</strong>${vehicle.category}</p>
    <p><strong>Driver:</strong>${vehicle.driverName}</p>
    <p><strong>Status:</strong>
    <span class="availability-status ${statusClass}">${statusText}</span></p></div>
    <div class="card-actions"><button class="update-btn" data-action="update-driver" data-id="${vehicle.id}">Update Driver</button>
    <button class="toggle-button" data-action="change-availability" data-id="${vehicle.id}"> Change Availability</button>
    <button class="delete-btn" data-action="delete-vehicle" data-id="${vehicle.id}>Delete Vehicle</button></div></div>`
}

const renderFleetCards=(fleetToRender)=>{
    const container=document.getElementById("fleetCardsContainer")
    if(!container)return
    if(fleetToRender.length===0){
        container.innerHTML='<p>No vehicles in the fleet matching current criteria.Add one using the form on the left.</p>'
        return
    }
    const cardsHTML=fleetToRender.mao(createCardHTML).join('')
    container.innerHTML=cardsHTML
}

const handleAddFleet=(event)=>{
    if(!document.getElementById('addFleetForm'))
        return
    event.preventDefault()

    const regNo=document.getElementById('regNo').value.trim()
    const category=document.getElementById('category').value.trim()
    const driverName=document.getElementById('driverName').value.trim()
    const isAvailable=document.getElementById('isAvailable').value.trim()

    if(!regNo || !category || !driverName || !isAvailable){
        alert("Please fill out all required fields")
        return
    }

    const newVehicle={
        id:Date.now(),
        regNo:regNo,
        category:category,
        driverName:driverName,
        isAvailable:isAvailable
    }

    const fleet=getFleet()
    fleet.push(newVehicle)
    saveFleet(fleet)

    document.getElementById('addFleetForm').reset()
    alert(`Vehicle ${regNo} added successfully!`)

    handleFilterChange()
}
