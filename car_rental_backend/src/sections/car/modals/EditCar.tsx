import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, ListItemText } from '@mui/material';
import { fetchDataCars } from '../view/utils';

// Modal styling
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

type EditModalProps = {
  open: boolean;
  setCars: (c: any[]) => void;
  setOpen: (b: boolean) => void;
  editingCar: any;
  setEditingCar: (b: any) => void;
};

export default function EditCar({
  setCars,
  editingCar,
  setEditingCar,
  setOpen,
  open,
}: EditModalProps) {
  const [formDataCar, setFormDataCar] = useState({
    model: '',
    brand: '',
    year: '',
    price_per_day: 0,
    matricule: '',
    category: '',
    status: '',
    color: '',
    mileage: 0,
    fuel_type: '',
    fuel_level: '',
    transmission: '',
    location: '',
  });

  const [errors, setErrors] = useState({
    matricule: '',
    model: '',
    brand: '',
    year: '',
    price_per_day: 0,
    category: '',
    status: '',
    color: '',
    mileage: '',
    fuel_type: '',
    fuel_level: '',
    transmission: '',
    location: '',
  });

  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    // Populate the form with the data of the car being edited
    setFormDataCar({
      model: editingCar.model,
      brand: editingCar.brand,
      year: editingCar.year,
      price_per_day: editingCar?.price_per_day,
      matricule: editingCar.matricule,
      category: editingCar.category,
      status: editingCar.status,
      color: editingCar.color,
      mileage: editingCar.mileage,
      fuel_type: editingCar.fuel_type,
      fuel_level: editingCar.fuel_level,
      transmission: editingCar.transmission,
      location: editingCar.location,
    });
  }, [editingCar]);

  useEffect(() => {
    const stat = Object.values(formDataCar).some((item) => item === '');
    setIsFilled(stat);
  }, [formDataCar]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormDataCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formDataClient = new FormData();
      Object.entries(formDataCar).forEach(([key, value]) => {
        formDataClient.append(key, value.toString());
      });

      await axios.put(`http://localhost:8000/api/cars/${editingCar.id}`, formDataClient, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setOpen(false);
      setFormDataCar({
        model: '',
        brand: '',
        year: '',
        price_per_day: 0,
        matricule: '',
        category: '',
        status: '',
        color: '',
        mileage: 0,
        fuel_type: '',
        fuel_level: '',
        transmission: '',
        location: '',
      });
      await fetchDataCars(setCars);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors({
          matricule: error.response.data.errors.matricule || '',
          model: error.response.data.errors.model || '',
          brand: error.response.data.errors.brand || '',
          year: error.response.data.errors.year || '',
          price_per_day: error.response.data.errors?.price_per_day || '',
          category: error.response.data.errors.category || '',
          status: error.response.data.errors.status || '',
          color: error.response.data.errors.color || '',
          mileage: error.response.data.errors.mileage || '',
          fuel_type: error.response.data.errors.fuel_type || '',
          fuel_level: error.response.data.errors.fuel_level || '',
          transmission: error.response.data.errors.transmission || '',
          location: error.response.data.errors.location || '',
        });
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const colorOptions = [
    { value: 'red', label: 'Rouge' },
    { value: 'blue', label: 'Bleu' },
    { value: 'black', label: 'Noir' },
    { value: 'white', label: 'Blanc' },
    { value: 'green', label: 'Vert' },
  ];
  
  const StatusOptions = [
    { value: 'disponible', label: 'disponible'},
    { value: 'pas disponible', label: 'pas disponible'},
    { value: 'maintenance', label: 'maintenance'},
  ]; 

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Modifiez une Voiture
        </Typography>

        {/* Basic Info */}
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Model" variant="outlined" name="model" fullWidth value={formDataCar.model} onChange={handleCarChange} required />
          <TextField label="Brand" variant="outlined" name="brand" fullWidth value={formDataCar.brand} onChange={handleCarChange} required />
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField label="Matricule" variant="outlined" name="matricule" fullWidth error={!!errors.matricule} value={formDataCar.matricule} onChange={handleCarChange} required helperText={errors.matricule || ''} />
          <TextField label="Year" variant="outlined" name="year" fullWidth value={formDataCar.year} onChange={handleCarChange} required />
        </Box>

        <Box display="flex" gap={2} mb={2}>
        <FormControl fullWidth required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formDataCar.status}
              onChange={handleSelectChange}
              displayEmpty
            >
                {StatusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Box display="flex" alignItems="center">
                    <ListItemText primary={status.label} />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id="color-label">Couleur</InputLabel>
            <Select labelId="color-label" name="color" value={formDataCar.color} onChange={handleSelectChange}>
              {colorOptions.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <ListItemText primary={color.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </Box>

          <TextField label="Kilométrage" variant="outlined" name="mileage" fullWidth value={formDataCar.mileage} onChange={handleCarChange} required />

        <Box display="flex" gap={2} mb={2}>
          <TextField label="Prix par Jour" variant="outlined" name="price_per_day" fullWidth value={formDataCar.price_per_day} onChange={handleCarChange} required />
          <TextField label="Emplacement" variant="outlined" name="location" fullWidth value={formDataCar.location} onChange={handleCarChange} required />
        </Box>

        {/* Select Fields */}
        <Box display="flex" gap={2} mb={2}>
          <FormControl fullWidth required>
            <InputLabel id="fuel-type-label">Type de Carburant</InputLabel>
            <Select labelId="fuel-type-label" name="fuel_type" value={formDataCar.fuel_type} onChange={handleSelectChange}>
              <MenuItem value="essence">Essence</MenuItem>
              <MenuItem value="diesel">Diesel</MenuItem>
              <MenuItem value="électrique">Électrique</MenuItem>
              <MenuItem value="hybride">Hybride</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel id="fuel-level-label">Niveau de Carburant</InputLabel>
            <Select labelId="fuel-level-label" name="fuel_level" value={formDataCar.fuel_level} onChange={handleSelectChange}>
              <MenuItem value="plein">Plein</MenuItem>
              <MenuItem value="moitié">Moitié</MenuItem>
              <MenuItem value="vide">Vide</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <FormControl fullWidth required>
            <InputLabel id="transmission-label">Transmission</InputLabel>
            <Select labelId="transmission-label" name="transmission" value={formDataCar.transmission} onChange={handleSelectChange}>
              <MenuItem value="automatique">Automatique</MenuItem>
              <MenuItem value="manuelle">Manuelle</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Catégorie" variant="outlined" name="category" fullWidth value={formDataCar.category} onChange={handleCarChange} required />
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>Retour</Button>
          <Button type="submit" variant="contained" disabled={isFilled} color="primary">Modifier</Button>
        </Box>
      </Box>
    </Modal>
  );
}
