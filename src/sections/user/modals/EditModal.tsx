import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { fetchDataCars } from "src/sections/car/view/utils";
import { Iconify } from 'src/components/iconify';
import { fetchDataClient } from "src/sections/user/utils";
import ChildEditModal from './ChildEditModal';
import type { UserProps, CarProps } from '../user-table-row';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  borderRadius: "10px",
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type EditModalProps = {
  open: boolean;
  setClients: (c: UserProps[]) => void;
  setOpen: (b: boolean) => void;
  editingClient: UserProps;
  setEditingClient: (b: UserProps) => void;
};

export default function EditModal({ setClients, editingClient, setEditingClient, setOpen, open }: EditModalProps) {
  const [formDataClient, setFormDataClient] = useState({
    id: "",
    full_name: "",
    cin: "",
    age: "",
    telephone: "",
    cars: [] as Array<any>,
    date_debut: "",
    date_fin: "",
    total_price: 0,
    days: 0,
    avatarUrl: "",
  });

  const [cars, setCars] = useState<any[]>([]);
  const [carPrice, setCarPrice] = useState<number | null>(null);
  const [isFilled, setIsFilled] = useState(false);
  const [openChild, setOpenChild] = useState(false);
  const [hoveredCar, setHoveredCar] = useState<number | null>(null);

  const handleCarDelete = (carId: number) => {
    setFormDataClient((prev) => ({
      ...prev,
      cars: prev.cars.filter((car) => car.id !== carId),
    }));
  };  

  const handleClose = () => {
    setOpen(false);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formDataClienttt = new FormData();
    formDataClient.cars.forEach((carId: any) => formDataClienttt.append("cars[]", carId.id.toString()));
    formDataClienttt.append("total_price", formDataClient.total_price.toString());
    formDataClienttt.append("days", formDataClient.days.toString());
    formDataClienttt.append("full_name", formDataClient.full_name);
    formDataClienttt.append("cin", formDataClient.cin);
    formDataClienttt.append("age", formDataClient.age?.toString() ?? "");
    formDataClienttt.append("telephone", formDataClient.telephone);

    try {
      await axios.put(
        `http://localhost:8000/api/clients/${formDataClient.id}`,
        formDataClienttt,
        { headers: { "Content-Type": "application/json" } }
      );
      setOpenChild(false);
      setOpen(false);
      setFormDataClient({
        id: "",
        full_name: "",
        cin: "",
        age: "",
        telephone: "",
        cars: [],
        date_debut: "",
        date_fin: "",
        total_price: 0,
        days: 0,
        avatarUrl: "",
      });
      await fetchDataClient(setClients);
      await fetchDataCars(setCars);
    } catch (error) {
      setOpenChild(false);
      alert("Erreur lors de la mise à jour des données !");
    }
  };

  useEffect(() => {
    setFormDataClient({
      id: editingClient.id,
      full_name: editingClient.full_name,
      cin: editingClient.cin,
      age: editingClient.age,
      telephone: editingClient.telephone,
      cars: editingClient.cars,
      total_price: editingClient.total_price,
      date_debut: editingClient.date_debut,
      date_fin: editingClient.date_fin,
      days: editingClient.days,
      avatarUrl: editingClient.avatarUrl,
    });
  }, [editingClient]);

  useEffect(() => {
    const loadCars = async () => {
      const storedCars = localStorage.getItem("cars");
      if (storedCars) {
        setCars(JSON.parse(storedCars));
      } else {
        await fetchDataCars(setCars);
      }
    };
    loadCars();
  }, []);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Modifiez un Client
        </Typography>
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <TextField
            label="Full Name"
            variant="outlined"
            name="full_name"
            fullWidth
            margin="normal"
            value={formDataClient.full_name}
            onChange={handleClientChange}
            required
          />
          <TextField
            label="Age"
            variant="outlined"
            name="age"
            type="number"
            fullWidth
            margin="normal"
            value={formDataClient.age}
            onChange={handleClientChange}
            required
          />
        </Box>
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <TextField
            label="CIN"
            variant="outlined"
            name="cin"
            fullWidth
            margin="normal"
            value={formDataClient.cin}
            onChange={handleClientChange}
            required
          />
          <TextField
            label="Telephone"
            variant="outlined"
            name="telephone"
            fullWidth
            margin="normal"
            value={formDataClient.telephone}
            onChange={handleClientChange}
            required
          />
        </Box>
        <Autocomplete
          options={cars}
          getOptionLabel={(option) => option.brand || ""}
          onChange={(event, value) => {
            setFormDataClient((prev) => ({
              ...prev,
              cars: value ? [...prev.cars, value] : prev.cars,
              total_price: value ? value?.price_per_day : carPrice,
            }));
            setCarPrice(value ? parseFloat(value.price_per_day) : null);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Selectionnez une voiture" />
          )}
        />
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
          gap={2}
          mb={2}
          mt={2}
        >
          <Box display="flex" gap={2} mb={2} mt={2}>
  {formDataClient.cars.map((car: any, index: number) => (
    <Box
      key={index}
      gap={2}
      display="flex"
      alignItems="center"
      sx={{ position: "relative" }}
    >
      <Box
        onMouseEnter={() => setHoveredCar(car.id)}
        onMouseLeave={() => setHoveredCar(null)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {hoveredCar === car.id ? (
          <Iconify
            icon="mdi:delete-outline"
            width={24}
            height={24}
            style={{ color: "#d32f2f" }}
            onClick={() => handleCarDelete(car.id)}
          />
        ) : (
          <Avatar alt={car.brand} src={car.avatarUrl} />
        )}
      </Box>
      {car.brand}
    </Box>
  ))}
</Box>
        </Box>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Jours"
            name="days"
            type="number"
            fullWidth
            margin="normal"
            value={formDataClient.days}
            onChange={handleClientChange}
            required
          />
          <TextField
            label="Prix Total"
            name="prix"
            type="number"
            fullWidth
            margin="normal"
            value={formDataClient.total_price}
            onChange={handleClientChange}
            required
          />
        </Box>
        <ChildEditModal
          setClients={setClients}
          setFormDataClient={setFormDataClient}
          setOpen={setOpen}
          setOpenChild={setOpenChild}
          formDataClientt={formDataClient}
          openChild={openChild}
        />
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Retour
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Modifiez
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
