import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Iconify } from 'src/components/iconify';
import CreateReservation from "src/sections/reservation/modals/CreateReservation";
import type { CarProps } from "../view/car-table-row";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const sampleCars = [
  { carName: 'Toyota Corolla', startDate: '2024-01-01', endDate: '2024-01-07', disponible: 'Yes' },
  { carName: 'Honda Civic', startDate: '2024-01-10', endDate: '2024-01-15', disponible: 'No' }
];

const sampleReservations = [
  { startDate: '2024-01-01', endDate: '2024-01-07' },
  { startDate: '2024-01-10', endDate: '2024-01-15' }
];

type CarDetailsProps = {
  car: CarProps;
  open: boolean;
  setOpen: (c: boolean) => void;
};

const CarDetails: React.FC<CarDetailsProps> = ({ car, open, setOpen }) => {
  const [openReservation ,setOpenReservation] = useState<boolean>(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpenReservation(true);
  }

  const [openCollapse, setOpenCollapse] = useState(false);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        <Typography variant="h5" gutterBottom align="center">
          Car Details
        </Typography>
        
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Matricule</TableCell>
                <TableCell>Model</TableCell>
                <TableCell align="right">Brand</TableCell>
                <TableCell align="right">Prix par Jour</TableCell>
                <TableCell align="right">Année</TableCell>
                <TableCell align="right">Catégorie</TableCell>
                <TableCell align="right">Type de Carburant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpenCollapse(!openCollapse)}
                  >
                    {openCollapse ? <Iconify icon="mdi:keyboard-arrow-up" /> : <Iconify icon="mdi:keyboard-arrow-down" />}
                  </IconButton>
                </TableCell>
                <TableCell>{car.matricule}</TableCell>
                <TableCell align="right">{car.model}</TableCell>
                <TableCell align="right">{car.brand}</TableCell>
                <TableCell align="right">{car.price_per_day}</TableCell>
                <TableCell align="right">{car.year}</TableCell>
                <TableCell align="right">{car.category}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Collapse in={openCollapse}>
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Other Details
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="car details table">
                <TableHead>
                  <TableRow>
                    <TableCell>Kilométrage</TableCell>
                    <TableCell align="right">Transmission</TableCell>
                    <TableCell align="right">Niveau de Carburant</TableCell>
                    <TableCell align="right">Couleur</TableCell>
                    <TableCell align="right">Emplacement</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell>{car.mileage}</TableCell>
                      <TableCell align="right">{car.transmission}</TableCell>
                      <TableCell align="right">{car.fuel_level}</TableCell>
                      <TableCell align="right">{car.color}</TableCell>
                      <TableCell align="right">{car.location}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Reservation History Table */}
          {/* <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Reservation History
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="reservation history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Voiture</TableCell>
                    <TableCell align="right">End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {client?.reservations?.map((reservation: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell>{reservation.start_date}</TableCell>
                      <TableCell>{reservation.car.brand}</TableCell>
                      <TableCell align="right">{reservation.end_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box> */}
        </Collapse>

        {/* Footer Buttons */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Retour
          </Button>
          <Button type="submit" onClick={handleOpen} variant="contained">
            Creer un reservation
          </Button>
          {/* <CreateReservation client={car} setOpen={setOpenReservation} open={openReservation} setReservations={setReservations}/> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default CarDetails;
