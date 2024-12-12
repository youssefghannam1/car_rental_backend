// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

// import { Iconify } from 'src/components/iconify';
// import { CarProps } from "./user-table-row";

// type UserProps = {
//   full_name: string;
//   cin: string;
//   telephone: string;
//   car: CarProps;
//   days: number;
//   date_debut: string;
//   date_fin: string;
// };

// type ExportPdfButtonProps = {
//   client: UserProps | null; // Single client details
// };



// const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ client }) => {
//   const isDisabled = !client;

//   return (
//     <>
//     <Iconify icon="material-symbols:print-outline" />
//     <FontAwesomeIcon
//       style={{
//         cursor: isDisabled ? "not-allowed" : "pointer",
//         color: isDisabled ? "gray" : "red",
//         fontSize: "2rem",
//         marginLeft: "15px",
//       }}
//       onClick={() => !isDisabled && exportToPdf(client)}
//       icon={faFilePdf}
//     />
//     </>
//   );
// };

// export default ExportPdfButton;
