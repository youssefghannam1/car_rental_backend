import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import ChildModal from './ChildModal';
import ClientDetails from './ClientDetails';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  borderRadius: "10px",
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type CreateModalProps = {
  open: boolean;
  setClients: (c: any[]) => void;
  setOpen: (b: boolean) => void;
};

export default function CreateModal({ setClients, setOpen, open }: CreateModalProps) {
  const [formDataClient, setFormDataClient] = useState({
    cin: '',
  });
  const [errors, setErrors] = useState({
    cin: "",
  });
  const [response, setResponse] = useState<any>({
    
  });
  const [isFilled, setIsFilled] = useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openChild, setOpenChild] = React.useState(false);
  const handleOpen = () => {
      setOpenChild(true);
    };
  const handleClose = () => {
    setOpen(false);
  }
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataClient((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const stat = Object.values(formDataClient).some((item) => item === "");
    setIsFilled(stat); 
  }, [formDataClient]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`http://localhost:8000/api/clients/search/${formDataClient.cin}`);
      if (data.data) {
        setOpenChild(true);
        setResponse(data.data);
      }
      else {
        setOpenCreate(true)
      }
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
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Ajoutez un Client
        </Typography>
        <TextField
          label="CIN"
          variant="outlined"
          name="cin"
          type="text"
          fullWidth
          error={!!errors.cin}
          margin="normal"
          value={formDataClient.cin}
          helperText={errors.cin ? errors.cin : ''}
          onChange={handleClientChange}
          required
        />
        <ClientDetails client={response} open={openChild} setOpen={setOpenChild} />
        <ChildModal setErrors={setErrors} setClients={setClients} setFormDataClient={setFormDataClient} setOpen={setOpen} setOpenChild={setOpenCreate} formDataClientt={formDataClient} openChild={openCreate} />
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" onClick={handleClose}>
            Retour
          </Button>
          <Button 
          type="submit" 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isFilled}
          color="primary">Suivant
          </Button>
        </Box>
        </Box>
    </Modal>
  );
}

