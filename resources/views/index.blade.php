<!-- resources/views/index.blade.php -->


<div class="container">
    <h2>Reservations</h2>

    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Car Model</th>
                <th>Reservation Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reservations as $reservation)
                <tr>
                    <td>{{ $reservation->id }}</td>
                    <td>{{ $reservation->client->full_name }}</td>
                    <td>{{ $reservation->car->model }}</td>
                    <td>{{ $reservation->start_date }}</td>
                    <td>{{ $reservation->end_date }}</td>
                    <td>{{ ucfirst($reservation->status) }}</td>
                    <td>
                        <a href="{{ route('reservation.update', $reservation->id) }}" class="btn btn-warning">Edit</a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
 