import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Avatar from '@mui/material/Avatar';
import TextField from "@mui/material/TextField";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import type { Dayjs } from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchDataClient } from "src/sections/user/utils";
import { Iconify } from 'src/components/iconify';
import dayjs from "dayjs";
import { fetchDataCars } from "src/sections/car/view/utils";

type FormDataClientType = {
  cin: string;
};

type CarChildProps = {
  setOpenChild: (b: boolean) => void;
  setOpen: (b: boolean) => void;
  setClients: (c: any) => void;
  setErrors: (c: any) => void;
  setFormDataClient: (b: FormDataClientType) => void;
  openChild: boolean;
  formDataClientt: FormDataClientType;
};

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

export default function ChildModal({
  setFormDataClient,
  setOpenChild,
  setClients,
  setOpen,
  setErrors,
  formDataClientt,
  openChild,
}: CarChildProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    age: null,
    telephone: null,
    cars: [] as Array<any>,  
    total_price: "" as string,
    days: 0,
    date_debut: dayjs(),
    date_fin: dayjs(),
  });
  const [cars, setCars] = useState<Array<any>>([]);
  const [carPrice, setCarPrice] = useState<number | null>(null);
  const [isFilled, setIsFilled] = useState(true);
  const [hoveredCar, setHoveredCar] = useState<number | null>(null);

  const handleCarDelete = (carId: number) => {
    setFormData((prev) => ({
      ...prev,
      cars: prev.cars.filter((car) => car.id !== carId),
    }));
  };  

  useEffect(() => {
    const loadCars = async () => {
      const storedCars = localStorage.getItem("cars");
      if (storedCars) {
        setCars(JSON.parse(storedCars).filter((car: any) => car.status === "disponible"));
      } else {
        await fetchDataCars(setCars);
        setCars((prev) => prev.filter((car: any) => car.status === "disponible"));
      }
    };
    loadCars();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formDataClient = new FormData();
    formData.cars.forEach((carId: any) => formDataClient.append("cars[]", carId.id.toString()));    
    formDataClient.append("total_price", formData.total_price);
    formDataClient.append("days", formData.days.toString());
    formDataClient.append("date_debut", formData.date_debut?.format("YYYY-MM-DD") ?? "");
    formDataClient.append("date_fin", formData.date_fin?.format("YYYY-MM-DD") ?? "");
    formDataClient.append("full_name", formData.full_name);
    formDataClient.append("cin", formDataClientt.cin);
    formDataClient.append("age", formData.age ?? "");
    formDataClient.append("telephone", formData.telephone ?? "");

    try {
      await axios.post("http://localhost:8000/api/clients", formDataClient);
      setOpenChild(false);
      setOpen(false);
      setFormDataClient({
        cin: "",
      });
      await fetchDataClient(setClients);
      await fetchDataCars(setCars);
    }
      catch (error) {
        setOpenChild(false);
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors({
            cin: error.response.data.errors.cin ? error.response.data.errors.cin[0] : '', 
          });
        } else {
          console.error("Unexpected error:", error);
        }
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "days") {
        const days = parseInt(value, 10) || 0;
        const updatedDateFin = prev.date_debut?.add(days, "day");
        const updatedPrix = carPrice ? (days * carPrice).toString() : "";
        return { ...prev, days, date_fin: updatedDateFin, total_price: updatedPrix };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (field: "date_debut" | "date_fin", value: Dayjs | null) => {
    setFormData((prev) => {
      if (field === "date_debut" && value) {
        const updatedDateFin = value.add(prev.days, "day");
        return { ...prev, date_debut: value, date_fin: updatedDateFin };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleClose = () => {
    setOpenChild(false);
  };

  useEffect(() => {
    const stat = Object.values(formData).some(
      (item) => item === null || item === "" || item === 0
    );
    setIsFilled(stat);
  }, [formData]);

  return (
    <Modal
      open={openChild}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" gutterBottom>
          Creez un Client
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Nom Complet"
            variant="outlined"
            name="full_name"
            fullWidth
            margin="normal"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Âge"
            variant="outlined"
            name="age"
            type="number"
            fullWidth
            margin="normal"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </Box>
        <Autocomplete
          options={cars}
          getOptionLabel={(option) => option.brand || ""}
          onChange={(event, value) => {
            setFormData((prev) => ({
              ...prev,
              cars: value ? [...prev.cars, value] : prev.cars,
              total_price: value ? value?.price_per_day : carPrice,
            }));
            setCarPrice(value ? parseFloat(value?.price_per_day) : null);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Selectionnez une voiture" />
          )}
        />
        <Box display="flex" gap={2} mb={2} mt={2}>
  {formData.cars.map((car: any, index: number) => (
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
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Prix Total"
            name="prix"
            type="text"
            fullWidth
            value={formData.total_price}
            margin="normal"
            required
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Téléphone"
            variant="outlined"
            name="telephone"
            type="tel"
            fullWidth
            margin="normal"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </Box>
        <TextField
          label="Nombre de Jours"
          name="days"
          type="number"
          fullWidth
          margin="normal"
          value={formData.days}
          onChange={handleChange}
          required
        />
        <Box display="flex" gap={2} mb={2}>
          <DatePicker
            label="Date Début"
            value={formData.date_debut}
            onChange={(value) => handleDateChange("date_debut", value)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                required: true,
              },
            }}
          />
          <DatePicker
            label="Date Fin"
            value={formData.date_fin}
            onChange={(value) => handleDateChange("date_fin", value)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                required: true,
              },
            }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Retour
          </Button>
          <Button type="submit" disabled={isFilled} variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}