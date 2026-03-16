document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const bookingDateInput = document.getElementById('bookingDate');
    const roomsContainer = document.getElementById('roomsContainer');
    const myBookingsList = document.getElementById('myBookingsList');

    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;

    const rooms = [
        { id: 'room1', name: 'LRC 3rd Floor', capacity: 70, location: 'Library' },
        { id: 'room2', name: 'Swadhay', capacity: 60, location: 'Backside Library' },
        { id: 'room3', name: 'LRC 2nd floor', capacity: 65, location: 'Library' }
    ];

    const timeSlots = [
        '9:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 1:00',
        '2:00 - 3:00'
    ];

    let bookings = JSON.parse(localStorage.getItem('studyRoomBookings')) || [];

    let isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        darkModeToggle.textContent = 'Switch to Light Mode';
    } else {
        darkModeToggle.textContent = 'Switch to Dark Mode';
    }
    
    darkModeToggle.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
            darkModeToggle.textContent = 'Switch to Light Mode';
        } else {
            document.body.removeAttribute('data-theme');
            darkModeToggle.textContent = 'Switch to Dark Mode';
        }
        localStorage.setItem('darkMode', isDark);
    });

    function renderRooms() {
        const selectedDate = bookingDateInput.value;
        if (!selectedDate) return;

        roomsContainer.innerHTML = '';

        rooms.forEach((room) => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            
            const title = document.createElement('h3');
            title.textContent = room.name;
            
            const meta = document.createElement('div');
            meta.className = 'room-meta';
            meta.textContent = `Capacity: ${room.capacity} | Location: ${room.location}`;
            
            const slotsContainer = document.createElement('div');
            slotsContainer.className = 'slots';

            timeSlots.forEach((slot) => {
                const slotBtn = document.createElement('div');
                slotBtn.className = 'slot';
                slotBtn.textContent = slot;

                const isBooked = bookings.some((b) => b.date === selectedDate && b.roomId === room.id && b.time === slot);
                
                if (isBooked) {
                    slotBtn.classList.add('booked');
                    slotBtn.title = "Already Booked";
                } else {
                    slotBtn.addEventListener('click', () => bookSlot(room, selectedDate, slot));
                }

                slotsContainer.appendChild(slotBtn);
            });

            roomCard.appendChild(title);
            roomCard.appendChild(meta);
            roomCard.appendChild(slotsContainer);
            roomsContainer.appendChild(roomCard);
        });
    }

    function bookSlot(room, date, time) {
        const confirmMsg = `Are you sure you want to book ${room.name} for the time slot ${time} on ${date}?`;
        const confirmBooking = window.confirm(confirmMsg);
        
        if (confirmBooking) {
            const alreadyBooked = bookings.some((b) => b.date === date && b.roomId === room.id && b.time === time);
            if (alreadyBooked) {
                window.alert('Sorry, this slot is already booked!');
                return;
            }

            const newBooking = {
                id: Date.now().toString(),
                roomId: room.id,
                roomName: room.name,
                date: date,
                time: time
            };

            bookings.push(newBooking);
            saveBookings();
            
            renderRooms();
            renderMyBookings();
            
            window.alert('Room booked successfully!');
        }
    }

    function cancelBooking(bookingId) {
        const confirmCancel = window.confirm("Do you want to cancel this booking?");
        if (confirmCancel) {
            bookings = bookings.filter((b) => b.id !== bookingId);
            saveBookings();
            
            renderRooms();
            renderMyBookings();
        }
    }

    function renderMyBookings() {
        myBookingsList.innerHTML = '';

        if (bookings.length === 0) {
            myBookingsList.textContent = 'No bookings yet.';
            return;
        }

        const sortedBookings = [...bookings].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedBookings.forEach((booking) => {
            const item = document.createElement('div');
            item.className = 'booking-item';
            
            const details = document.createElement('div');
            details.className = 'booking-details';
            
            const roomName = document.createElement('strong');
            roomName.textContent = booking.roomName;
            
            const timeDate = document.createElement('span');
            timeDate.className = 'booking-time';
            timeDate.textContent = `${booking.date} • ${booking.time}`;
            
            details.appendChild(roomName);
            details.appendChild(timeDate);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = 'Cancel Booking';
            cancelBtn.addEventListener('click', () => cancelBooking(booking.id));

            item.appendChild(details);
            item.appendChild(cancelBtn);
            myBookingsList.appendChild(item);
        });
    }

    function saveBookings() {
        localStorage.setItem('studyRoomBookings', JSON.stringify(bookings));
    }

    bookingDateInput.addEventListener('change', renderRooms);

    renderRooms();
    renderMyBookings();
});
