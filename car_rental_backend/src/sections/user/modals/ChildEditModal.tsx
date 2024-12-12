import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import { fetchDataClient } from "src/sections/user/utils";
import { fetchDataCars } from "src/sections/car/view/utils";

type CarChildProps = {
  setOpenChild: (b: boolean) => void;
  setOpen: (b: boolean) => void;
  setClients: (c: any) => void;
  setFormDataClient: (b: any) => void;
  openChild: boolean;
  formDataClientt: any;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ChildEditModal({
  setFormDataClient,
  setOpenChild,
  setClients,
  setOpen,
  formDataClientt,
  openChild,
}: CarChildProps) {
  const [formData, setFormData] = useState({
    car: null as number | null,
    prix: "" as string,
    days: 0,
    date_debut: dayjs(),
    date_fin: dayjs(),
  });

  const [cars, setCars] = useState<any[]>([]);
  const [carPrice, setCarPrice] = useState<number | null>(null);
  const [isFilled, setIsFilled] = useState(true);

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

  // Update formData when formDataClientt changes
  useEffect(() => {
    if (formDataClientt) {
      setFormData({
        car: formDataClientt.car?.id || null,
        prix: formDataClientt.prix || "",
        days: formDataClientt.days || 0,
        date_debut: dayjs(formDataClientt.date_debut),
        date_fin: dayjs(formDataClientt.date_fin),
      });
    }
  }, [formDataClientt]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formDataClient = new FormData();
    formDataClient.append("car", formData.car?.toString() ?? "");
    formDataClient.append("prix", formData.prix);
    formDataClient.append("days", formData.days.toString());
    formDataClient.append("full_name", formDataClientt.full_name);
    formDataClient.append("cin", formDataClientt.cin);
    formDataClient.append("age", formDataClientt.age?.toString() ?? "");
    formDataClient.append("telephone", formDataClientt.telephone);

    try {
      await axios.put(
        `http://localhost:8000/api/clients/${formDataClientt.id}`,
        formDataClient,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setOpenChild(false);
      setOpen(false);
      setFormDataClient({});
      await fetchDataClient(setClients);
    } catch (error) {
      setOpenChild(false);
      alert("Erreur lors de la mise à jour des données !");
    }
  };

  // Update validation state
  useEffect(() => {
    const isFormInvalid = Object.values(formData).some(
      (item) => item === null || item === "" || item === 0
    );
    setIsFilled(!isFormInvalid);
  }, [formData]);

  return (
    <Modal
      open={openChild}
      onClose={() => setOpenChild(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" gutterBottom>
          Selectionnez une voiture
        </Typography>

        {/* Car Selector */}
        <Autocomplete
          options={cars}
          getOptionLabel={(option) => option.brand || ""}
          value={
            Array.isArray(cars) &&
            cars.find((car) => car.id === formData.car) || null
          }
          onChange={(event, value) => {
            setFormData((prev) => ({
              ...prev,
              car: value ? value.id : null,
              prix: value ? value?.price_per_day : carPrice,
            }));
            setCarPrice(value ? parseFloat(value?.price_per_day) : null);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Selectionnez une voiture" required />
          )}
        />
        <TextField
                  label="Prix Par Jour"
                  name="prix"
                  type="text"
                  fullWidth
                  value={carPrice ?? formDataClientt.car?.price_per_day}
                  margin="normal"
                  required
                />
        {/* Days Field */}
        <TextField
          label="Jours"
          name="days"
          type="number"
          fullWidth
          margin="normal"
          value={formData.days}
          onChange={(e) => setFormData({ ...formData, days: +e.target.value })}
          required
        />

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={() => setOpenChild(false)}>
            Retour
          </Button>
          <Button type="submit" disabled={isFilled} variant="contained">
            Sauvegarder
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
