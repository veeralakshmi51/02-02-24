import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaUserPlus } from "react-icons/fa";
import { Pagination } from "react-bootstrap";
import "./staff.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff, deleteStaffDetails, updateStaffDetails } from "../../slices/thunk";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Table } from "reactstrap";
import Loader from "../../components/loader/Loader";
import Tooltip from "@mui/material/Tooltip";
import { GoPersonAdd } from "react-icons/go";

const Staff: React.FC = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<any>();
  const { staffData, loading } = useSelector((state: any) => state.Staff);
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages=Math.ceil(staffData.length/itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filteredRecords,setFilteredRecords]=useState<any[]>([]);
  const currentStaffData = filteredRecords.slice(indexOfFirstItem,indexOfLastItem);

  useEffect(() => {
    getAllStaff(dispatch, organization);
  }, [dispatch, organization]);

  

  useEffect(()=>{
    setCurrentPage(1)
   },[staffData]);

   useEffect(()=>{
    setCurrentPage(totalPages)
   },[totalPages])
  useEffect(() => {
    const filteredStaffData = staffData.filter(
      (staff: any) =>
        (staff.name?.[0]?.given?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (staff.name?.[0]?.family?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (staff.dateofBirth?.toString()?.includes(search.toLowerCase()) || '') ||
        (staff.ssn?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
        (staff.email?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
        (staff.role?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
        (staff.userType?.toLowerCase()?.includes(search.toLowerCase()) || '')
    );
    setFilteredRecords(filteredStaffData); 
  }, [search, staffData]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(staffData.length / itemsPerPage);

    // Define the number of page numbers to show
    const pageNumbersToShow = Math.min(5, totalPages);

    let startPage: any;
    let endPage: any;

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

  const handleDelete = async (username: string) => {
    const confirmDelete = window.confirm("Are You Sure Do You Want To Delete?");
    if (confirmDelete) {
      try {
        await dispatch(deleteStaffDetails(username, organization));
        toast.success("Staff Details deleted successfully");
      } catch (error) {
        toast.error("Failed to delete organization");
      }
    }
  };
  return (
    <div className="container m5 p3" style={{ width: '90%' }}>
      {loading && <Loader />}
      <div className="row">
        <div className="col-md-8 d-flex align-items-center">
          <h4 className="me-auto">All Staff List</h4>
          {/* <div className="mx-2">
            <p className="mb-0">Create</p>
          </div>
          <div className="mx-2">
            <Tooltip title="Create a Staff" arrow>
              <FaUserPlus
                data-bs-target="#exampleModal"
                style={{ cursor: "pointer", fontSize: '30px' }}
                onClick={() => navigate("/staff-register")}
              />
            </Tooltip>
          </div> */}
        </div>
        <div className="col-md-4 d-flex justify-content-end align-items-center">
        <p onClick={() => navigate("/staff-register")} style={{cursor:'pointer'}} className="mb-0">Create</p>
            <GoPersonAdd
                data-bs-target="#exampleModal"
                style={{ cursor: "pointer", fontSize: '30px' }}
                onClick={() => navigate("/staff-register")}
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
                disabled={currentPage === Math.ceil(staffData.length / itemsPerPage)}
              />
            </Pagination>
          </div>
        </div>
        <Table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Staff Name</th>
              {/* <th scope="col"></th> */}
              <th scope="col">Role</th>
              <th scope="col">Job Title</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStaffData
              // .filter(
              //   (staff: any) =>
              //     (staff.name?.[0]?.given?.toLowerCase() || '').includes(search.toLowerCase()) ||
              //     (staff.dateofBirth?.toString()?.includes(search.toLowerCase()) || '') ||
              //     (staff.ssn?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
              //     (staff.email?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
              //     (staff.role?.toLowerCase()?.includes(search.toLowerCase()) || '') ||
              //     (staff.userType?.toLowerCase()?.includes(search.toLowerCase()) || '')
              // )
              .map((staff: any, index: number) => (
                <tr key={index}>
                  <td>{indexOfFirstItem+index + 1}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/staff-update/${staff.id}`, { state: staff })}
                  >
                    {staff.name[0].given} {staff.name[0].family}
                  </td>
                  {/* <td>{staff.id}</td> */}
                  <td>{staff.userType}</td>
                  <td>{staff.role}</td>
                  {/* <td>{staff.email}</td> */}
                  <td className="text-center">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-danger"
                      onClick={() => handleDelete(staff.username)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>


  );
};

export default Staff;