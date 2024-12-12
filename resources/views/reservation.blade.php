<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Car Reservation Form</title>
</head>
<body>
    <h1>Car Reservation Form</h1>

    <form id="reservationForm">
        @csrf

        <label for="customerName">Customer Name:</label>
        <input type="text" id="customerName" name="customerName" required><br><br>

        <label for="carId">Car:</label>
        <select id="carId" name="carId" required>
            <option value="">Select a Car</option>
            @foreach($cars as $car)
                <option value="{{ $car->id }}">{{ $car->brand }} {{ $car->model }} ({{ $car->year }}) - ${{ $car->price_per_day }} per day</option>
            @endforeach
        </select><br><br>

        <label for="reservationDate">Reservation Date:</label>
        <input type="date" id="reservationDate" name="reservationDate" required><br><br>

        <label for="returnDate">Return Date:</label>
        <input type="date" id="returnDate" name="returnDate" required><br><br>

        <label for="status">Status:</label>
        <select id="status" name="status" required>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
        </select><br><br>

        <button type="submit">Submit Reservation</button>
    </form>

    <script>
        document.getElementById('reservationForm').addEventListener('submit', function (e) {
            e.preventDefault();  // Prevent default form submission

            const formData = new FormData(this);
            const customerName = formData.get('customerName');
            const carId = formData.get('carId');
            const reservationDate = formData.get('reservationDate');
            const returnDate = formData.get('returnDate');
            const status = formData.get('status');

            const data = {
                customerName: customerName,
                carId: carId,
                reservationDate: reservationDate,
                returnDate: returnDate,
                status: status,
            };

            // Log the data to the console to verify that it's correct
            console.log('Sending data:', data);

            // Send the form data to the API endpoint
            fetch('http://localhost:8000/api/reservations', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value, // CSRF Token for Laravel
                    'Content-Type': 'application/json', // Sending data as JSON
                },
                body: JSON.stringify(data),  // Convert data to JSON
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response data:', data);  // Log the response to check its content

                if (data.reservation) {
                    // Reservation successful
                    alert(`Reservation Confirmed! Price: $${data.price}. Reservation ID: ${data.reservation.id}`);
                } else if (data.error) {
                    // Reservation failed
                    alert(`Reservation Failed: ${data.error}`);
                } else {
                    // Handle unexpected response
                    alert("Unexpected response: " + JSON.stringify(data));
                }
            })
            .catch(error => {
                console.error('Error:', error);  // Log any error that occurs
                alert("Error: " + error);  // Show error in alert
            });
        });
    </script>
</body>
</html>
