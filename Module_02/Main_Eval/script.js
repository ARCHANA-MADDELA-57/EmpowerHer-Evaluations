
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
const handleCardActions = (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const vehicleId = parseInt(button.getAttribute('data-id'));
    let fleet = getFleet();
    const vehicleIndex = fleet.findIndex(v => v.id === vehicleId);

    if (vehicleIndex === -1) return;

    switch (action) {
        case 'update-driver':
            handleUpdateDriver(fleet, vehicleIndex);
            break;
        case 'change-availability':
            handleChangeAvailability(fleet, vehicleIndex);
            break;
        case 'delete-vehicle':
            handleDeleteVehicle(fleet, vehicleIndex);
            break;
    }
};

const handleUpdateDriver = (fleet, index) => {
    // On click, open a prompt asking for a new driver name
    const newDriver = prompt("Enter a new driver name for Reg No: " + fleet[index].regNo);

    if (newDriver === null) return; // User clicked Cancel
    
    const trimmedDriver = newDriver.trim();
    
    // Empty Driver Name in Prompt: If user submits empty or whitespace-only input
    if (!trimmedDriver) {
        // Optionally show an alert
        alert("Driver name cannot be empty. Update cancelled.");
        return;
    }

    // Update Driver Name and re-save
    fleet[index].driverName = trimmedDriver;
    saveFleet(fleet);
    
    // The change should be reflected immediately in the card UI
    handleFilterChange(); 
};

const handleChangeAvailability = (fleet, index) => {
    let currentStatus = fleet[index].isAvailable;

    // If Available, change it to Unavailable. If Unavailable, change it to Available.
    fleet[index].isAvailable = currentStatus === 'Available' ? 'Unavailable' : 'Available';

    saveFleet(fleet);
    
    // The change should be reflected immediately in the card UI
    handleFilterChange(); 
};

const handleDeleteVehicle = (fleet, index) => {
    // Delete Confirmation: Always show a confirmation
    const isConfirmed = confirm(`Are you sure you want to delete vehicle with Reg No: ${fleet[index].regNo}?`);

    // Only delete if the user confirms.
    if (isConfirmed) {
        // Delete the vehicle
        fleet.splice(index, 1); 
        saveFleet(fleet);
        
        // Updated Data should be Re-rendered into UI again
        handleFilterChange();
    }
};

// --- Dashboard Logic: Filters ---

const handleFilterChange = () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    if (!categoryFilter || !availabilityFilter) return;

    const selectedCategory = categoryFilter.value;
    const selectedAvailability = availabilityFilter.value;

    const fullFleet = getFleet();

    const filteredFleet = fullFleet.filter(vehicle => {
        // When a category is selected: Only show vehicles of that selected category.
        const categoryMatch = selectedCategory === 'ALL' || vehicle.category === selectedCategory;

        // When an availability is selected: Only show vehicles that match the selected availability.
        const availabilityMatch = selectedAvailability === 'ALL' || vehicle.isAvailable === selectedAvailability;

        // Filters can be combined (e.g., Car AND Available)
        return categoryMatch && availabilityMatch;
    });

    renderFleetCards(filteredFleet);
};

const handleClearFilter = () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    
    if (!categoryFilter || !availabilityFilter) return;

    // Reset filters to default (e.g., All / empty).
    categoryFilter.value = 'ALL';
    availabilityFilter.value = 'ALL';

    // Re-render and show all original data (all vehicles added so far).
    renderFleetCards(getFleet());
};


// --- Event Listeners and Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Only set up login listener if on the index page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Only set up dashboard listeners if on the admin page
    const addFleetForm = document.getElementById('addFleetForm');
    if (addFleetForm) {
        const cardsContainer = document.getElementById('fleetCardsContainer');
        const categoryFilter = document.getElementById('categoryFilter');
        const availabilityFilter = document.getElementById('availabilityFilter');
        const clearFilterBtn = document.getElementById('clearFilterBtn');

        // Sidebar Add Fleet Listener
        addFleetForm.addEventListener('submit', handleAddFleet);

        // Main Content Card Actions Listener (Delegation)
        cardsContainer.addEventListener('click', handleCardActions);

        // Navbar Filter Change Listeners
        categoryFilter.addEventListener('change', handleFilterChange);
        availabilityFilter.addEventListener('change', handleFilterChange);
        clearFilterBtn.addEventListener('click', handleClearFilter);
        
        // Initialize dashboard: Load and display all existing fleet data
        handleFilterChange(); 
    }
});
