import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import axios from "axios";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { fetchDataInvoices } from '../view/utils';

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

type CreateInvoiceModalProps = {
  open: boolean;
  setInvoices: (invoices: any[]) => void;
  setOpen: (open: boolean) => void;
};

export default function CreateInvoiceModal({ setInvoices, setOpen, open }: CreateInvoiceModalProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    car_id: '',
    days: '',
  });
  const [clients, setClients] = useState<any[]>([]); // Fetch the clients
  const [cars, setCars] = useState<any[]>([]); // Fetch the cars
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Fetch available clients and cars for the dropdowns (assuming APIs are available)
    const fetchClientsAndCars = async () => {
      try {
        console.log('Fetching clients and cars...');
        const clientsResponse = await fetch('http://localhost:8000/api/clients');
        const carsResponse = await fetch('http://localhost:8000/api/cars');
        
        if (!clientsResponse.ok || !carsResponse.ok) {
          throw new Error('Failed to fetch clients or cars');
        }

        const clientsData = await clientsResponse.json();
        const carsData = await carsResponse.json();

        console.log('Fetched clients:', clientsData);
        console.log('Fetched cars:', carsData);

        setClients(clientsData);
        setCars(carsData);
      } catch (error) {
        console.error('Error fetching clients and cars:', error);
      }
    };
    fetchClientsAndCars();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log('Form data updated:', formData);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const formDataInvoice = new FormData();
    formDataInvoice.append("client_id", formData.client_id);
    formDataInvoice.append("car_id", formData.car_id);
    formDataInvoice.append("days", formData.days.toString());
  
    try {
      await axios.post("http://localhost:8000/api/invoices", formDataInvoice, {
        headers: { "Content-Type": "application/json" },
      });
  
      setOpen(false); // Close the modal
      setFormData({ client_id: "", car_id: "", days: "" }); // Reset form data
      await fetchDataInvoices(setInvoices); // Refresh the invoices list
    } catch (error: any) {
      setOpen(false); // Close the modal
  
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors({
          client_id: error.response.data.errors.client_id
            ? error.response.data.errors.client_id[0]
            : "",
          car_id: error.response.data.errors.car_id
            ? error.response.data.errors.car_id[0]
            : "",
          days: error.response.data.errors.days
            ? error.response.data.errors.days[0]
            : "",
        });
      } else {
        console.error("Unexpected error:", error);
      }
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
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Create an Invoice
        </Typography>

        {/* Client selection */}
        <TextField
          label="Client"
          variant="outlined"
          name="client_id"
          fullWidth
          value={formData.client_id}
          onChange={handleChange}
          required
          select
          SelectProps={{
            native: true,
          }}
          error={Boolean(errors.client_id)}
          helperText={errors.client_id}
        >
          <option value="">Select Client</option>
          {clients.map((client: any) => (
            <option key={client.id} value={client.id}>
              {client.full_name}
            </option>
          ))}
        </TextField>

        {/* Car selection */}
        <TextField
          label="Car"
          variant="outlined"
          name="car_id"
          fullWidth
          value={formData.car_id}
          onChange={handleChange}
          required
          select
          SelectProps={{
            native: true,
          }}
          error={Boolean(errors.car_id)}
          helperText={errors.car_id}
        >
          <option value="">Select Car</option>
          {cars.map((car: any) => (
            <option key={car.id} value={car.id}>
              {car.model} ({car.brand})
            </option>
          ))}
        </TextField>

        {/* Days input */}
        <TextField
          label="Days"
          variant="outlined"
          name="days"
          type="number"
          fullWidth
          value={formData.days}
          onChange={handleChange}
          required
          error={Boolean(errors.days)}
          helperText={errors.days}
        />

        {/* Submit button */}
        <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
          <Button onClick={handleClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create Invoice
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
