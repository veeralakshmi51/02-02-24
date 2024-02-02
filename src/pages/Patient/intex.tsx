import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllPatient,
  updatePatientDetails,
  patientDischarge,
} from "../../slices/thunk";
import { FaPlus, FaSearch,  } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import { GoPersonAdd }from "react-icons/go";
import { Pagination } from "react-bootstrap";
import 
{
  Table,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";
import "./patient.css";
import Button from "@mui/material/Button";
interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  mrNumber: string;
  email: string;
  beaconDevice: string;
  gender: string;
  country: string;
  id: string;

}

const Patient: React.FC = () => {
  const [search,setSearch]=useState("");
  const dispatch = useDispatch<any>();
  const [selectPatientId, setSelectPatientId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const { patientData, loading } = useSelector((state: any) => state.Patient);
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    id:'',
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    ssn: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    mrNumber: "",
    email: "",
    beaconDevice: "",
    gender: "",
    country: "",
  });

  useEffect(() => {
    getAllPatient(dispatch, organization);
  }, [dispatch, organization]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatientData =
    patientData && patientData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(patientData.length / itemsPerPage);

    const pageNumbersToShow = Math.min(5, totalPages);

    let startPage: number;
    let endPage: number;

    if (totalPages <= pageNumbersToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middlePage = Math.ceil(pageNumbersToShow / 2);

      if (currentPage <= middlePage) {
        startPage = 1;
        endPage = pageNumbersToShow;
      } else if (currentPage + middlePage >= totalPages) {
        startPage = totalPages - pageNumbersToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - middlePage + 1;
        endPage = currentPage + middlePage - 1;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
      <Pagination.Item
        key={startPage + index}
        active={startPage + index === currentPage}
        onClick={() => paginate(startPage + index)}
      >
        {startPage + index}
      </Pagination.Item>
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDischarge = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are You Sure Do You Want to Discharge?"
    );
    if (confirmDelete) {
      try {
        await patientDischarge(dispatch, id, organization);
        console.log("Patient Discharged Successfully"); 
        // window.location.reload();
        navigate("/patient-table");
      } catch {
        console.log("Failed to Delete Patient Details");
      }
    }
  };

  return (
    <div className="container m5 p3" style={{ width: '90%' }}>
      {/* {loading && <Loader />} */}
      <div className="row">
  <div className="col-md-8 d-flex align-items-center">
  <h4 className="me-auto">All patient List</h4>
  {/* <div className="mx-2">
    <p className="mb-0">Create</p>
  </div>
  <div className="mx-2">
  <Tooltip title="Create a Patient" arrow>
    <GoPersonAdd
      data-bs-target="#exampleModal"
      style={{ cursor: "pointer", fontSize: '30px' }}
      onClick={() => navigate("/patient-register")}
    />
  </Tooltip>
</div> */}
</div>
<div className="col-md-4 d-flex justify-content-end align-items-center">
        <p onClick={() => navigate("/patient-register")} style={{cursor:'pointer'}} className="mb-0">Create</p>
            <GoPersonAdd
                data-bs-target="#exampleModal"
                style={{ cursor: "pointer", fontSize: '30px' }}
                onClick={() => navigate("/patient-register")}
              />
        </div>

      <br></br>
      <hr></hr>
      <div className="row">
      <div className="col-md-3">
  <div className="mx-0 search-container d-flex align-items-center">
    <input
      type="text"
      placeholder="Search..."
      className="search form-control"
      onChange={(e) => setSearch(e.target.value)}
    />
    <FaSearch className="search-icon" />
  </div>
</div>

  <div className="col-md-9 d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {renderPageNumbers()}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(patientData.length / itemsPerPage)}
            />
          </Pagination>
        </div>
      </div>
      <Table responsive bordered>
        <thead>
          <tr>
            <th scope="col" className="text-center">S.No</th>
            <th scope="col" className="text-center">Patient Name</th>
            {/* <th scope="col" className="text-center">Patient ID</th> */}
            <th scope="col" className="text-center">SSN</th>
            <th scope="col" className="text-center">Beacon Device</th>
            <th scope="col" className="text-center">Room No - Bed No</th>
            <th scope="col" className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPatientData
            .filter((patient: any) =>
              patient.basicDetails[0].name[0].given
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              patient.basicDetails[0].birthDate
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              patient.basicDetails[0].ssn
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              patient.beaconDevice.toLowerCase().includes(search.toLowerCase()) ||
              patient.email.toLowerCase().includes(search.toLowerCase())
            )
            .map((patient: any, index: number) => (
              <tr key={index}>
                <td className="text-center">{indexOfFirstItem+index + 1}</td>
                <td
                  className="text"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/patient-update/${patient.id}`, { state: patient })
                  }
                >
                  {patient.basicDetails[0].name[0].given}{" "}
                  {patient.basicDetails[0].name[0].family}
                </td>
                {/* <td className="text">{patient.id}</td> */}
                <td className="text-center">{patient.basicDetails[0].ssn}</td>
                <td className="text-center">{patient.beaconDevice}</td>
                <td className="text-center">{patient.assignedBed}</td>
                <td className="text-center">
                  <Button
                    onClick={() => handleDischarge(patient.id)}
                    variant="contained" color="success">
                    In Active
                    </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
     </div>
  );
};

export default Patient;
