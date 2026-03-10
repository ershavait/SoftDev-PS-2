const rooms = [
{ id:"A", name:"LRC 2nd Floor", capacity:70 },
{ id:"B", name:"LRC 3rd Floor", capacity:85 },
{ id:"C", name:"Swadhay", capacity:60 }
];

const slots = [
"9:00 - 11:00",
"11:00 - 13:00",
"14:00 - 16:00",
"16:00 - 18:00",
"19:00 - 21:00"
];

const roomsDiv = document.getElementById("rooms");
const bookingsList = document.getElementById("myBookings");
const datePicker = document.getElementById("datePicker");
const darkBtn = document.getElementById("darkToggle");

datePicker.valueAsDate = new Date();

function getBookings(){
return JSON.parse(localStorage.getItem("bookings")) || [];
}

function saveBookings(bookings){
localStorage.setItem("bookings",JSON.stringify(bookings));
}

function renderRooms(){

roomsDiv.innerHTML="";

const bookings = getBookings();
const date = datePicker.value;

rooms.forEach(room=>{

const roomDiv = document.createElement("div");
roomDiv.className="room";

roomDiv.innerHTML =
`<h3>${room.name} (Capacity ${room.capacity})</h3>`;

const slotsDiv = document.createElement("div");
slotsDiv.className="slots";

slots.forEach(slot=>{

const key = room.id + "_" + slot + "_" + date;

const btn = document.createElement("div");
btn.className="slot";

const booked = bookings.includes(key);

btn.textContent = slot;

if(booked){
btn.classList.add("booked");
}
else{

btn.classList.add("available");

btn.onclick = ()=>{

bookings.push(key);

saveBookings(bookings);

renderRooms();

renderBookings();

};

}

slotsDiv.appendChild(btn);

});

roomDiv.appendChild(slotsDiv);

roomsDiv.appendChild(roomDiv);

});

}

function renderBookings(){

bookingsList.innerHTML="";

const bookings = getBookings();

bookings.forEach((b,index)=>{

const parts = b.split("_");

const room = parts[0];
const time = parts[1];
const date = parts[2];

const li = document.createElement("li");

li.innerHTML = `
<strong>Room ${room}</strong><br>
Time: ${time}<br>
Date: ${new Date(date).toDateString()}<br>
<button class="cancelBtn">Cancel Booking</button>
`;

const cancelBtn = li.querySelector(".cancelBtn");

cancelBtn.onclick = ()=>{

bookings.splice(index,1);

saveBookings(bookings);

renderRooms();

renderBookings();

};

bookingsList.appendChild(li);

});

}

datePicker.addEventListener("change",()=>{

renderRooms();

});

darkBtn.onclick = ()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

darkBtn.innerText = "Light Mode";

}
else{

darkBtn.innerText = "Dark Mode";

}

};

renderRooms();

renderBookings();