import JsPDF from "jspdf";
import "jspdf-autotable";
import type { UserProps } from './user-table-row';


// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string;
  },
  b: {
    [key in Key]: number | string;
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
// ----------------------------------------------------------------------
export const fetchDataClient = async (setClients: (clients: any[]) => void) => {
  const response = await fetch('http://localhost:8000/api/clients');
  const data = await response.json();
  localStorage.setItem('clients', JSON.stringify(data));
  setClients(data);
};
// ----------------------------------------------------------------------

export const exportToPdf = (client: UserProps | null) => {
  if (!client) {
    alert("No client selected to generate the contract!");
    return;
  }

  const pdf = new JsPDF();

  // Agency Information
  const agencyName = "Agence de Location Auto";
  const agencyAddress = "123 Rue Principale, Casablanca, Maroc";
  const agencyPhone = "+212 6 12 34 56 78";
  const agencyLogo = "/path/to/your/logo.png"; // Replace with your actual logo path

  const generatePdf = () => {
    // Add agency details
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(agencyName, 70, 20);
    pdf.setFontSize(10);
    pdf.text(agencyAddress, 70, 25);
    pdf.text(`Téléphone: ${agencyPhone}`, 70, 30);

    // Add contract heading
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Contrat de Location de Voiture", pdf.internal.pageSize.width / 2, 50, {
      align: "center",
    });

    // Add client details
    pdf.setFontSize(12);
    pdf.text(`Nom et Prénom: ${client.full_name}`, 10, 70);
    pdf.text(`CIN: ${client.cin}`, 10, 80);
    pdf.text(`Téléphone: ${client.telephone}`, 10, 90);

    pdf.text(`Voiture: ${client.cars.map((car: any) => car.brand).join(', ')}`, 10, 110);
    pdf.text(`Nombre de Jours: ${client.days}`, 10, 130);
    pdf.text(`Total à Payer: ${client.days * client.total_price} MAD`, 10, 140);

    pdf.text(`Date de Début: ${client.date_debut}`, 10, 160);
    pdf.text(`Date de Fin: ${client.date_fin}`, 10, 170);

    pdf.setFont("helvetica", "italic");
    pdf.text(
      "En signant ce contrat, le client confirme avoir pris connaissance des termes et conditions de location.",
      10,
      190
    );

    pdf.text("Signature du Client: ____________________", 10, 210);
    pdf.text("Signature de l'Agence: __________________", 10, 230);

    // Open PDF in a new tab
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  // Add agency logo if available
  if (agencyLogo) {
    const img = new Image();
    img.src = agencyLogo;

    img.onload = () => {
      pdf.addImage(img, "PNG", 10, 10, 50, 20); // Adjust dimensions and position
      generatePdf();
    };

    img.onerror = () => {
      console.error("Failed to load logo image");
      generatePdf(); // Continue without the logo if it fails to load
    };
  } else {
    generatePdf(); // Skip logo if not provided
  }
};

// ----------------------------------------------------------------
type ApplyFilterProps = {
  inputData: UserProps[];
  filterName: string;
  comparator: (a: any, b: any) => number;
};

export function applyFilter({ inputData, comparator, filterName }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.full_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}