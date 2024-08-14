import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface DetailsProps {
  details: any[];
}
const DetailsTable: React.FC<DetailsProps> = ({ details }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Subscription</TableCell>
            <TableCell>Satisfaction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.courses}</TableCell>
              <TableCell>{detail.subscription}</TableCell>
              <TableCell>{detail.satisfaction}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetailsTable;
