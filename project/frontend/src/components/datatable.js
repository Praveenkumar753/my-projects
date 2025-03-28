import React, { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';

const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Sector</th>
              <th>Region</th>
              <th>Country</th>
              <th>Intensity</th>
              <th>Likelihood</th>
              <th>Relevance</th>
              <th>Year</th>
              <th>PESTLE</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.topic}</td>
                <td>{item.sector}</td>
                <td>{item.region}</td>
                <td>{item.country}</td>
                <td>{item.intensity}</td>
                <td>{item.likelihood}</td>
                <td>{item.relevance}</td>
                <td>{item.end_year || item.start_year || 'N/A'}</td>
                <td>{item.pestle}</td>
                <td>{item.source}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {paginationItems.length <= 10 ? (
            paginationItems
          ) : (
            <>
              {currentPage > 3 && <Pagination.Ellipsis />}
              {paginationItems.slice(
                Math.max(0, currentPage - 3),
                Math.min(paginationItems.length, currentPage + 2)
              )}
              {currentPage < paginationItems.length - 2 && <Pagination.Ellipsis />}
            </>
          )}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
};

export default DataTable;