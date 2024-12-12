import React, { useEffect, useState } from 'react'; 
import { Box, Select, MenuItem, SelectChangeEvent, Button, Modal, Typography, TextField, FormControl, InputLabel, ListItemText } from '@mui/material';
import axios from 'axios';
import { fetchDataCars } from '../view/utils';

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

type CreateModalProps = {
  open: boolean;
  setCars: (c: any[]) => void;
  setOpen: (b: boolean) => void;
};

export default function CreateCar({ setCars, setOpen, open }: CreateModalProps) {
  const [formDataCar, setFormDataCar] = useState({
    model: '',
    brand: '',
    year: '',
    price_per_day: 0,
    matricule: '',
    category: '',
    color: '',
    mileage: 0,
    status: '',
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

  useEffect(() => {
    const stat = Object.values(formDataCar).some((item) => item === '');
    setIsFilled(stat);
  }, [formDataCar]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/cars', formDataCar);
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
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  // Define color options
  const colorOptions = [
    { value: 'red', label: 'Rouge', imgSrc: 'https://www.flatuicolors.com/palette/flat/rose' },
    { value: 'blue', label: 'Bleu', imgSrc: 'https://www.flatuicolors.com/palette/flat/blue' },
    { value: 'black', label: 'Noir', imgSrc: 'https://www.flatuicolors.com/palette/flat/black' },
  ];
  const StatusOptions = [
    { value: 'disponible', label: 'disponible'},
    { value: 'pas disponible', label: 'pas disponible'},
    { value: 'maintenance', label: 'maintenance'},
  ];  

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Ajoutez une Voiture
        </Typography>

        {/* Basic Information */}
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Model" name="model" value={formDataCar.model} onChange={handleCarChange} fullWidth required />
          <TextField label="Brand" name="brand" value={formDataCar.brand} onChange={handleCarChange} fullWidth required />
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField label="Matricule" name="matricule" value={formDataCar.matricule} onChange={handleCarChange} fullWidth required />
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
            <Select
              labelId="color-label"
              name="color"
              value={formDataCar.color}
              onChange={handleSelectChange}
              displayEmpty
            >
              {colorOptions.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Box display="flex" alignItems="center">
                    <img src={color.imgSrc} alt={`${color.label} color`} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <ListItemText primary={color.label} />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Other fields */}
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Kilométrage" name="mileage" value={formDataCar.mileage} onChange={handleCarChange} fullWidth required />
          <TextField label="Prix par Jour" name="price_per_day" value={formDataCar.price_per_day} onChange={handleCarChange} fullWidth required />
        </Box>

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
          <TextField label="Emplacement" name="location" value={formDataCar.location} onChange={handleCarChange} fullWidth required />
        </Box>

        <Box display="flex" gap={2} mb={2}>
          <TextField label="Année" name="year" value={formDataCar.year} onChange={handleCarChange} fullWidth required />
          <FormControl fullWidth required>
            <InputLabel id="category-label">Catégorie</InputLabel>
            <Select labelId="category-label" name="category" value={formDataCar.category} onChange={handleSelectChange}>
              <MenuItem value="Economy">Economy</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Luxury">Luxury</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Coupe">Coupe</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>Retour</Button>
          <Button type="submit" variant="contained" disabled={isFilled} color="primary">Ajouter</Button>
        </Box>
      </Box>
    </Modal>
  );
}
