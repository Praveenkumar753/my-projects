import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const FiltersPanel = ({ filterOptions, filters, onFilterChange, onReset }) => {
  return (
    <Card className="filters-panel">
      <Card.Header>Filters</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>End Year</Form.Label>
            <Form.Select
              value={filters.end_year}
              onChange={(e) => onFilterChange('end_year', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.end_years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Select
              value={filters.topic}
              onChange={(e) => onFilterChange('topic', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sector</Form.Label>
            <Form.Select
              value={filters.sector}
              onChange={(e) => onFilterChange('sector', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Region</Form.Label>
            <Form.Select
              value={filters.region}
              onChange={(e) => onFilterChange('region', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>PESTLE</Form.Label>
            <Form.Select
              value={filters.pestle}
              onChange={(e) => onFilterChange('pestle', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.pestles.map((pestle) => (
                <option key={pestle} value={pestle}>
                  {pestle}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Select
              value={filters.source}
              onChange={(e) => onFilterChange('source', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Select
              value={filters.country}
              onChange={(e) => onFilterChange('country', e.target.value)}
            >
              <option value="">All</option>
              {filterOptions.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="outline-secondary" className="w-100 mb-2" onClick={onReset}>
            Reset Filters
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FiltersPanel;