import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";

const Table = () => {
  const API = "http://20.193.149.47:2242/salons/service/";
  const PAGES = 100;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [Search, setSearch] = useState("");

  const getdata = (
    url = `${API}?page=${currentPage}&page_size=${PAGES}`
  ) => {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        const results = response.data.results || [];
        
        setServices(results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setServices([]);
        setLoading(false);
      });
  };

  // when componet will open then featch data on the api and featchdata function will be run

  useEffect(() => {
    getdata();
  }, [currentPage]);

  const Searchbar = () => {
    const removeSearchbarSpace = Search.trim();

    // when searchbar is empty it direct rerender in main data

    if (!removeSearchbarSpace) {
      getdata();
      return;
    }

    setLoading(true);

    axios
      .get(`${API}`)

      .then((response) => {
        const results = response.data.results.service_name;
        if (results.length === 0) {
          alert("No services found for the search term. Please try again.");
        }
        setServices(results.service_name);
        setNextPage(null);
        setPrevPage(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error during search:", error);
        alert("An error occurred while searching. Please try again.");
        setServices([]);
        setLoading(false);
      });
  };

  const handleNext = () => {
    if (nextPage) setCurrentPage((page) => page + 1);
  };

  const handlePrevious = () => {
    if (prevPage) setCurrentPage((page) => page - 1);
  };

  return (
    <div className="main_container">
      <h1>Service Table</h1>

      <div className="searchbar">
        <input
          type="text"
          placeholder="Search by name"
          value={Search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={Searchbar}>Search</button>
      </div>

      <table className="data_table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Gender</th>
            <th>Discount</th>
            <th>City</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="no-data">
                Loading...
              </td>
            </tr>
          ) : services.length > 0 ? (
            services.map((service) => (
              <tr key={service.id}>
                <td>{service.service_name}</td>
                <td>{service.description}</td>
                <td>{service.price}</td>
                <td>
                  {service.service_image ? (
                    <img
                      src={service.service_image}
                      alt={service.service_name || "Service Image"}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{service.gender}</td>
                <td>{service.discount}</td>
                <td>{service.city}</td>
                <td>{service.area}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                No services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-buttons">
        <button onClick={handlePrevious} disabled={!prevPage}>
          Previous
        </button>
        <button onClick={handleNext} disabled={!nextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
