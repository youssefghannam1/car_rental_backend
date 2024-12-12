import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import { Select, SelectChangeEvent } from '@mui/material'; 
import { fetchDataReservations } from '../view/utils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type EditReservationModalProps = {
  open: boolean;
  setReservations: (r: any[]) => void;
  setOpen: (b: boolean) => void;
  editingReservation: any | null;
  setEditingReservation: (r: any | null) => void;
};

export default function EditReservation({
  setReservations,
  editingReservation,
  setEditingReservation,
  setOpen,
  open,
}: EditReservationModalProps) {
  const [formDataReservation, setFormDataReservation] = useState({
    id: '',
    customerName: '',
    carId: '',
    reservationDate: '',
    returnDate: '',
    status: 'pending',
  });

  const [cars, setCars] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/reservations/cars');
        const contentType = response.headers.get("Content-Type");
    
        // Vérifie si le type de contenu est bien JSON
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setCars(data);
        } else {
          const textResponse = await response.text(); // Lire la réponse en tant que texte
          console.error("Réponse non JSON reçue:", textResponse);
          setStatusMessage('Erreur : Le serveur ne renvoie pas des données JSON.');
        }
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
        setStatusMessage('Erreur de connexion au serveur.');
      }
    };
    
    fetchCars();
  }, []);

  useEffect(() => {
    if (editingReservation) {
      setFormDataReservation({
        id: editingReservation.id || '',
        customerName: editingReservation.customerName || '',
        carId: editingReservation.carId || '',
        reservationDate: editingReservation.reservationDate || '',
        returnDate: editingReservation.returnDate || '',
        status: editingReservation.status || 'pending',
      });
    }
  }, [editingReservation]);

  const handleClose = () => {
    setOpen(false);
    setEditingReservation(null);
    setStatusMessage('');
  };

  const handleReservationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (typeof name === 'string') {
      setFormDataReservation((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotalPrice = () => {
    if (!formDataReservation.reservationDate || !formDataReservation.returnDate) return 0;
    const start = new Date(formDataReservation.reservationDate);
    const end = new Date(formDataReservation.returnDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24); 
    return dayDiff * 100; // Suppose 100 is the price per day, adjust as needed
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');
  
    const totalPrice = calculateTotalPrice();
    const updatedReservation = { ...formDataReservation, price: totalPrice };
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/reservationsUpdate/${formDataReservation.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedReservation),
        }
      );
  
      const textResponse = await response.text(); // For debugging
console.log('Response Text:', textResponse); // Logs the raw response

const contentType = response.headers.get("Content-Type");
if (contentType && contentType.includes("application/json")) {
  const responseData = await response.json();
  if (!response.ok) {
    setStatusMessage(responseData.error || 'An error occurred');
  } else {
    setStatusMessage('Reservation updated successfully!');
    setOpen(false);
    await fetchDataReservations(setReservations);
    setEditingReservation(null);
  }
} else {
  console.error("Non-JSON response received:", textResponse);
  setStatusMessage('Error: The server did not return JSON data.');
}

      
    } catch (error) {
      setLoading(false);
  
      if (error instanceof SyntaxError) {
        setStatusMessage('Error processing data.');
      } else {
        setStatusMessage(`An error occurred: ${error.message}`);
      }
    }
};


  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>
          Modifier une Réservation
        </Typography>

        <TextField
          label="Nom du Client"
          name="customerName"
          value={formDataReservation.customerName}
          onChange={handleReservationChange}
          fullWidth
          required
          error={!!errors.customerName}
          helperText={errors.customerName}
        />

        <TextField
          select
          label="Voiture"
          name="carId"
          value={formDataReservation.carId}
          onChange={handleReservationChange}
          fullWidth
          required
          error={!!errors.carId}
          helperText={errors.carId ? errors.carId[0] : ''}
          SelectProps={{
            native: true,
          }}
        >
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.model}
            </option>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Date de Début"
          name="reservationDate"
          value={formDataReservation.reservationDate}
          onChange={handleReservationChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          type="date"
          label="Date de Fin"
          name="returnDate"
          value={formDataReservation.returnDate}
          onChange={handleReservationChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />

        <Select
          label="Statut"
          name="status"
          value={formDataReservation.status}
          onChange={handleReservationChange}
          fullWidth
          required
        >
          <MenuItem value="pending">En Attente</MenuItem>
          <MenuItem value="confirmed">Confirmée</MenuItem>
        </Select>

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Mettre à Jour'}
        </Button>

        {statusMessage && (
          <Typography variant="body2" color="error" mt={2}>
            {statusMessage}
          </Typography>
        )}
      </Box>
    </Modal>
  );
}
