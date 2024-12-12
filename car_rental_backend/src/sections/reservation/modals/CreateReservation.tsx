import type { UserProps } from 'src/sections/user/user-table-row';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import 'src/global.css';
import { fetchDataCars } from 'src/sections/car/view/utils';
import { fetchDataClient } from 'src/sections/user/utils';
import { fetchDataReservations } from '../view/utils';

const style = {
  position: 'absolute',
  top: '50%',
  borderRadius: "10px",
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type CreateReservationModalProps = {
  open: boolean;
  client?: UserProps;
  setReservations: (r: any[]) => void;
  setOpen: (b: boolean) => void;
};

export default function CreateReservation({
  client,
  setReservations,
  setOpen,
  open,
}: CreateReservationModalProps) {
  const [formDataReservation, setFormDataReservation] = useState({
    client: '',
    carId: '',
    reservationDate: '',
    returnDate: '',
    totalPrice: 0,
    status: 'pending',
  });

  const [cars, setCars] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [noCarsMessage, setNoCarsMessage] = useState<string>('');

  console.log('Component rendered with state:', { formDataReservation, cars, errors, noCarsMessage });


useEffect(() => {
  const loadCarsClients = async () => {
    const storedCars = localStorage.getItem('cars');
    const storedClients = localStorage.getItem('clients');
        if (storedCars !== null) {
      setCars(JSON.parse(storedCars));
    } else {
      await fetchDataCars(setCars);
    }
    if (storedClients !== null) {
      setClients(JSON.parse(storedClients));
    } else {
      await fetchDataClient(setClients);
    }
  };

  loadCarsClients();
}, []);


  const handleClose = () => {
    console.log('Modal closed');
    setOpen(false);
  };

  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormDataReservation((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log('Calculating total price...');
    const calculateTotalPrice = () => {
      if (formDataReservation.reservationDate && formDataReservation.returnDate && formDataReservation.carId) {
        const startDate = new Date(formDataReservation.reservationDate);
        const endDate = new Date(formDataReservation.returnDate);
        const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        const selectedCar = cars.find((car) => car.id === parseInt(formDataReservation.carId, 10));
        if (selectedCar) {
          const price = days * selectedCar.price_per_day;
          console.log(`Calculated price: ${price}`);
          setFormDataReservation((prev) => ({ ...prev, totalPrice: price }));
        }
      }
    };

    calculateTotalPrice();
  }, [formDataReservation.reservationDate, formDataReservation.returnDate, formDataReservation.carId, cars]);

  const updateLocalStorage = async () => {
    console.log('Updating localStorage...');
    try {
      await fetchDataReservations(setReservations);
      const updatedReservations = localStorage.getItem('reservations');
      localStorage.setItem('reservations', updatedReservations || '[]');
      console.log('LocalStorage updated with the latest reservations');
    } catch (e) {
      console.error('Failed to update reservations in localStorage:', e);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted with data:', formDataReservation);
  
    const reservationData = {
      client_id: formDataReservation?.client,
      car_id: formDataReservation.carId,
      start_date: formDataReservation.reservationDate,
      end_date: formDataReservation.returnDate,
      status: formDataReservation.status,
      price: formDataReservation.totalPrice,
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(reservationData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
  
      console.log('Reservation successfully created');
      setOpen(false);
      setFormDataReservation({
        client: '',
        carId: '',
        reservationDate: '',
        returnDate: '',
        totalPrice: 0,
        status: 'pending',
      });
  
      setTimeout(() => {
        updateLocalStorage();
      }, 1000);
  
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setErrors({
        customerName: error.message || '',
        carId: error.message || '',
        reservationDate: error.message || '',
        returnDate: error.message || '',
        totalPrice: error.message || '',
        status: error.message || '',
      });
    } 
  };
  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Créer une Réservation
          </Typography>

          {noCarsMessage && (
            <Typography variant="body1" color="error" gutterBottom>
              {noCarsMessage}
            </Typography>
          )}
          {client ? '' : (
              <Box display="flex" gap={2} mb={2}>
                <TextField
              select
              label="Client"
              variant="outlined"
              name="client"
              fullWidth
              value={formDataReservation.client}
              onChange={handleReservationChange}
              required
              SelectProps={{ native: true }}
              disabled={cars.length === 0}
            >
              {clients.map((clt) => (
                <option key={clt.id} value={clt.id}>
                  {clt.full_name}
                </option>
              ))}
            </TextField>
              </Box>
            )}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              select
              label="Modèle de Voiture"
              variant="outlined"
              name="carId"
              fullWidth
              value={formDataReservation.carId}
              onChange={handleReservationChange}
              required
              SelectProps={{ native: true }}
              disabled={cars.length === 0}
            >
              <option value="">Sélectionner une voiture</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} - DH{car?.price_per_day} par jour
                </option>
              ))}
            </TextField>

            <TextField
              select
              label="Statut"
              variant="outlined"
              name="status"
              fullWidth
              value={formDataReservation.status}
              onChange={handleReservationChange}
              required
              SelectProps={{ native: true }}
            >
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
            </TextField>
          </Box>

          {/* Dates */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Date de Réservation"
              variant="outlined"
              name="reservationDate"
              fullWidth
              type="date"
              value={formDataReservation.reservationDate}
              onChange={handleReservationChange}
              required
            />
            <TextField
              label="Date de Retour"
              variant="outlined"
              name="returnDate"
              fullWidth
              type="date"
              value={formDataReservation.returnDate}
              onChange={handleReservationChange}
              required
            />
          </Box>

          {/* Price */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Prix Total"
              variant="outlined"
              name="totalPrice"
              fullWidth
              value={formDataReservation.totalPrice}
              onChange={handleReservationChange}
              disabled
            />
          </Box>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Créer Réservation
          </Button>
        </Box>
      </Modal>
  );
}
