import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import type { UserProps } from '../user-table-row';
import { fetchDataClient } from '../utils';

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

type ProlongationModalProps = {
  open: boolean;
  setClients: (c: UserProps[]) => void;
  setOpen: (b: boolean) => void;
  editingProlongation:  any;
  setEditingProlongation: (b: any) => void;
};

export default function ProlongationModal({ setClients, editingProlongation, setEditingProlongation, setOpen, open }: ProlongationModalProps) {
  const [formDataClient, setFormDataClient] = useState({
    days: "",
  });
  useEffect(() => {
    setFormDataClient({
      days: editingProlongation.days,
    });
  },[editingProlongation])
//   const [isFilled, setIsFilled] = useState(false);
  const [openChild, setOpenChild] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  }


  const handleProlongationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingProlongation((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataProlongation = new FormData();
    formDataProlongation.append("days", formDataClient.days.toString());

    try {
      await axios.put(
        `http://localhost:8000/api/clients/prolongation/${editingProlongation.id}`,
        formDataProlongation,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setOpenChild(false);
      setOpen(false);
      setFormDataClient({
        days: ""
      });
      await fetchDataClient(setClients);
    } catch (error) {
      setOpenChild(false);
      alert("Erreur lors de la mise à jour des données !");
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
          Ajouter un Prolongation
        </Typography>
        <TextField
          label="Jours"
          variant="outlined"
          name="days"
          type="number"
          fullWidth
          margin="normal"
          value={editingProlongation.days}
          onChange={handleProlongationChange}
          required
        />
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Retour
          </Button>
          <Button 
          type="submit" 
          onClick={handleSubmit} 
          variant="contained" 
        //   disabled={isFilled}
          color="primary">Contrat
          </Button>
        </Box>
        </Box>
    </Modal>
  );
}

