import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllOrganizationDetails, updateOrganizationDetails, deleteOrganizationDetails } from "../../slices/organizationDetails/thunk";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBuilding, FaPlusSquare, FaSearch } from "react-icons/fa";
import { GoPersonAdd } from "react-icons/go";

interface FormData {
  organizationName: string;
  email: string;
  mobileNumber: string;
  websiteUrl: string;
  organizationType: string;
  hippaPrivacyOfficerName: string;
  id: string;
  proximityVerification: string;
  geofencing: string;
  q15Access: string;

}

const Organization: React.FC = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<any>();
  const { organizationDetails } = useSelector((state: any) => state.Organization);

  const navigate = useNavigate();
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(organizationDetails.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const records = filteredRecords.slice(firstIndex, lastIndex);
  const numbers = [...Array(Math.ceil(filteredRecords.length / itemsPerPage)).keys()].map((num) => num + 1);

  useEffect(() => {
    dispatch(getAllOrganizationDetails());
  }, [dispatch]);

  useEffect(()=>{
    setCurrentPage(1);
   },[organizationDetails]);

  useEffect(() => {
    const filteredData = organizationDetails.filter((organization: any) =>
      organization.organizationdetails?.[0]?.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      organization.organizationdetails?.[0]?.type.toLowerCase().includes(search.toLowerCase()) ||
      organization.hippaprivacyofficer[0]?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecords(filteredData);
  }, [search, organizationDetails]);

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changecurrentpage(page: number) {
    setCurrentPage(page);
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handleDelete = async (organizationId: string) => {
    const confirmDelete = window.confirm("Are You sure Do You want To Delete?");
    if (confirmDelete) {
      try {
        await dispatch(deleteOrganizationDetails(organizationId));
        console.log("Organization Details deleted successfully");
      } catch (error) {
        console.log("Failed to delete organization");
      }
    }
  };
  const columnStyle = {
    maxWidth: '150px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        <div className="col-md-12">
          <div className="row">
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            <h4>Organization List</h4>
            {/* <span className="mx-5">
              <Link to="/organization-form">
                <button className="btn btn-info">+ </button>
              </Link>
            </span> */}
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-4 d-flex justify-content-end align-items-center">
        <p onClick={() => navigate("/organization-form")} style={{cursor:'pointer'}} className="mb-0">Create</p>
            <FaPlusSquare
                data-bs-target="#exampleModal"
                style={{ cursor: "pointer", fontSize: '30px',color:'grey' }}
                onClick={() => navigate("/organization-form")}
              />
        </div>
          </div>
          <hr />
          <div className="row-md-3">
            <div className="mx-2 search-container d-flex justify-content-between align-items-center">
            <div className="search-bar d-flex align-items-center">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FaSearch className="search-icon" />
                </div>
              </div>
              <div className="pagination-container">
                <nav className="d-flex">
                  <ul className="pagination">
                    <li className="page-item">
                      <a href="#" className="page-link" onClick={prevPage}>
                        Prev
                      </a>
                    </li>
                    {numbers.map((num, index) => (
                      <li key={index} className="page-item">
                        <a
                          href="#"
                          className={`page-link ${currentPage === num ? "active" : ""}`}
                          onClick={() => changecurrentpage(num)}
                        >
                          {num}
                        </a>
                      </li>
                    ))}
                    <li className="page-item">
                      <a href="#" className="page-link" onClick={nextPage}>
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <br />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className="text-center">S.No #</th>
                <th scope="col" className="text-center">Organization Name</th>
                <th scope="col" className="text-center">Organization Type</th>
                <th scope="col" className="text-center">Proximity</th>
                <th scope="col" className="text-center">Q15 Access</th>
                <th scope="col" className="text-center">GeoFencing</th>
                <th scope="col" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {records
                // .filter((organization: any) =>
                //   organization.organizationdetails?.[0]?.name
                //     .toLowerCase()
                //     .includes(search.toLowerCase()) ||
                //   organization.organizationdetails?.[0]?.type.toLowerCase().includes(search.toLowerCase()) ||
                //   organization.hippaprivacyofficer[0]?.name.toLowerCase().includes(search.toLowerCase())
                // )
                .map((organization: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/organization-update/${organization.id}`, { state: organization })
                      }
                    >
                      {organization.organizationdetails?.[0]?.name || ""}
                    </td>
                    <td style={columnStyle}>
                      {organization.organizationdetails?.[0]?.type || ""}
                    </td>
                    <td className="text-center">
                      {organization.proximityVerification === "Yes" ? (
                        <FontAwesomeIcon icon={faCheck} color="green" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color="red" />
                      )}
                    </td>
                    <td className="text-center">
                      {organization.q15Access === "Yes" ? (
                        <FontAwesomeIcon icon={faCheck} color="green" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color="red" />
                      )}
                    </td>
                    <td className="text-center">
                      {organization.geofencing === "Yes" ? (
                        <FontAwesomeIcon icon={faCheck} color="green" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color="red" />
                      )}
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger"
                        onClick={() => handleDelete(organization.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Organization;
