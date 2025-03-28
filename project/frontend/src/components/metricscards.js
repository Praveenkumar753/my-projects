import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const MetricsCards = ({ metrics }) => {
  return (
    <Row>
      <Col md={4} className="mb-4">
        <Card className="metric-card">
          <Card.Body>
            <div className="metric-value">{metrics.intensity ? metrics.intensity.toFixed(1) : 0}</div>
            <div className="metric-title">AVERAGE INTENSITY</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-4">
        <Card className="metric-card">
          <Card.Body>
            <div className="metric-value">{metrics.likelihood ? metrics.likelihood.toFixed(1) : 0}</div>
            <div className="metric-title">AVERAGE LIKELIHOOD</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-4">
        <Card className="metric-card">
          <Card.Body>
            <div className="metric-value">{metrics.relevance ? metrics.relevance.toFixed(1) : 0}</div>
            <div className="metric-title">AVERAGE RELEVANCE</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MetricsCards;