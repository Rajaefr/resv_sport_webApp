"use client";

import React, { useEffect, useState } from "react";
import { Table, Row, Col, InputGroup, Form, Badge } from "react-bootstrap";
import { Search } from "lucide-react";

interface Discipline {
  code: string;
  nom: string;
  participantsCount: number;
  paidCount: number;
  isActive: boolean;
}

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setDisciplines([
      { code: "C001-1", nom: "Natation débutant", participantsCount: 10, paidCount: 8, isActive: true },
      { code: "C058-2", nom: "Natation intermédiaire", participantsCount: 12, paidCount: 6, isActive: false },
      { code: "C001-2", nom: "Natation avancée", participantsCount: 5, paidCount: 5, isActive: true },
    ]);
  }, []);

  const filteredDisciplines = disciplines.filter(
    (d) =>
      d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentBadge = (paid: number, total: number) => {
    const percent = Math.round((paid / total) * 100);
    const color = percent === 100 ? "success" : percent >= 50 ? "warning" : "danger";
    return (
      <Badge bg={color}>
        {percent}% ({paid}/{total})
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge bg={isActive ? "success" : "secondary"}>
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  );

  return (
    <div className="container mt-4">
      <Row className="mb-4">
        <Col md={6}>
          <h5>Codes de Discipline</h5>
        </Col>
        <Col md={6} className="text-end">
          <InputGroup>
            <InputGroup.Text><Search size={16} /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par code ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Participants</th>
            <th>% Paiement</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {filteredDisciplines.map((d) => (
            <tr key={d.code}>
              <td>{d.code}</td>
              <td>{d.nom}</td>
              <td><Badge bg="info">{d.participantsCount}</Badge></td>
              <td>{getPaymentBadge(d.paidCount, d.participantsCount)}</td>
              <td>{getStatusBadge(d.isActive)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
