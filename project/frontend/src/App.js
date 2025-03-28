import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form, Navbar, Nav } from 'react-bootstrap';
import './App.css';

// Import components
import IntensityChart from './components/intensitychart';
import LikelihoodChart from './components/likelihoodchart';
import RelevanceChart from './components/relevancechart';
import RegionChart from './components/regionchart';
import TopicChart from './components/topicchart'; 
// import CountryMap from './components/CountryMap';
import MetricsCards from './components/metricscards';
import DataTable from './components/datatable';
import FiltersPanel from './components/filterpannel';

const API_BASE_URL = 'http://localhost:5000/api'; 

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    country: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    end_years: [],
    topics: [],
    sectors: [],
    regions: [],
    pestles: [],
    sources: [],
    countries: []
  });
  const [metrics, setMetrics] = useState({
    intensity: 0,
    likelihood: 0,
    relevance: 0,
    regions: [],
    topics: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch data and filter options on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await axios.get(`${API_BASE_URL}/data`);
        const filtersResponse = await axios.get(`${API_BASE_URL}/filters`);
        const metricsResponse = await axios.get(`${API_BASE_URL}/metrics`);
        
        setData(dataResponse.data);
        setFilteredData(dataResponse.data);
        setFilterOptions(filtersResponse.data);
        setMetrics(metricsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        // Build query params from filters
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            params.append(key, filters[key]);
          }
        });
        
        const response = await axios.get(`${API_BASE_URL}/data?${params.toString()}`);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };

    if (!loading) {
      applyFilters();
    }
  }, [filters, loading]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      end_year: '',
      topic: '',
      sector: '',
      region: '',
      pestle: '',
      source: '',
      country: ''
    });
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Blackcoffer Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#insights">Insights</Nav.Link>
              <Nav.Link href="#reports">Reports</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <Row>
          <Col md={3}>
            <FiltersPanel 
              filterOptions={filterOptions} 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={resetFilters} 
            />
          </Col>
          <Col md={9}>
            <MetricsCards metrics={metrics} />

            <Row className="mt-4">
              <Col md={6} className="mb-4">
                <Card className="h-100">
                  <Card.Header>Intensity by Region</Card.Header>
                  <Card.Body>
                    <IntensityChart data={filteredData} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="h-100">
                  <Card.Header>Likelihood by Topic</Card.Header>
                  <Card.Body>
                    <LikelihoodChart data={filteredData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6} className="mb-4">
                <Card className="h-100">
                  <Card.Header>Relevance by Year</Card.Header>
                  <Card.Body>
                    <RelevanceChart data={filteredData} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="h-100">
                  <Card.Header>Topics Distribution</Card.Header>
                  <Card.Body>
                    <TopicChart data={filteredData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12} className="mb-4">
                <Card>
                  <Card.Header>Regional Distribution</Card.Header>
                  <Card.Body>
                    <RegionChart data={filteredData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12} className="mb-4">
                <Card>
                  <Card.Header>Data Overview</Card.Header>
                  <Card.Body>
                    <DataTable data={filteredData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;