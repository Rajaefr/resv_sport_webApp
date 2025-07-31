"use client";

import React, { useEffect, useState } from "react";
import { Table, Row, Col, InputGroup, Form, Badge } from "react-bootstrap";
import { Search } from "lucide-react";

interface Groupe {
  code: string;
  horaires: string;
  participantsCount: number;
  isBlocked: boolean;
}

export default function GroupesPage() {
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setGroupes([
      {
        code: "A1-1",
        horaires: "Lundi 14:00-16:00, Mercredi 08:00-10:00",
        participantsCount: 8,
        isBlocked: false,
      },
      {
        code: "A1-2",
        horaires: "Mardi 10:00-12:00, Jeudi 14:00-16:00",
        participantsCount: 10,
        isBlocked: true,
      },
      {
        code: "B1-1",
        horaires: "Vendredi 08:00-10:00",
        participantsCount: 3,
        isBlocked: false,
      },
    ]);
  }, []);

  const filteredGroupes = groupes.filter((g) =>
    g.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupStatusBadge = (isBlocked: boolean) => (
    <Badge bg={isBlocked ? "danger" : "success"}>
      {isBlocked ? "Bloqué" : "Ouvert"}
    </Badge>
  );

  return (
    <div className="container mt-4">
      <Row className="mb-4">
        <Col md={6}>
          <h5>Groupes Piscine</h5>
        </Col>
        <Col md={6} className="text-end">
          <InputGroup>
            <InputGroup.Text><Search size={16} /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Code Groupe</th>
            <th>Horaires</th>
            <th>Participants</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroupes.map((g) => (
            <tr key={g.code}>
              <td>{g.code}</td>
              <td>{g.horaires}</td>
              <td><Badge bg="info">{g.participantsCount}</Badge></td>
              <td>{getGroupStatusBadge(g.isBlocked)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
