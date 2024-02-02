import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import {
  getAllBedAssign,
  deleteBedAssignDetails,
  getAllBedAssignByOrg
} from "../../slices/bedAssign/thunk";
import { getAllBed,deletePatientAssignDetails } from "../../slices/patientAssign/thunk";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  CardFooter,
  CardHeader,
  Badge,
  Input,
  Button
} from "reactstrap";
import ReactPaginate from "react-paginate";
import "./bedassign.css";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { toast } from "react-toastify";
 
 
interface FormData {
  id: string;
  bedId: string;
  pid: string;
  orgId: string;
}
interface Bed {
  roomNoStart: string;
  roomNoEnd: string;
  bedNo: string;
  oddOrEven: string,
  organization:string,
}
const BedAssign: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [bedId, setBedId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [showModal,setShowModal]=useState(false);
  const [search, setSearch] = useState("");
  const [patientAndBedAssign, setPatientAndBedAssign] = useState<any[]>([]);
  const [value, setValue] = React.useState('1');
 
  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
    getAllBedAssign(dispatch, organization);
    getAllBed(dispatch,organization);
  };
 
  const { bedAssignData = [], loading } = useSelector(
    (state: any) => state.BedAssign
  );
  const { organization } = useSelector((state: any) => state.Login);
  const { patientData } = useSelector((state: any) => state.Patient);
  const navigate = useNavigate();
  const selectedPatientId = patientData?.id;
 
  const [bedAssignedData, setBedAssignedData] = useState<FormData>({
    id: "",
    bedId: bedAssignData.bedId,
    pid: selectedPatientId || "",
    orgId: organization,
  });
 
  let [newAssignedBy, setAssignedBy] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const handlePatientChange = (selectedPatientId: string) => {
    setBedAssignedData((prevData) => ({ ...prevData, pid: selectedPatientId }));
  };
 
  useEffect(() => {
    getAllBedAssign(dispatch, organization);
    fetchPatients();
    fetchPatientsandBedAssign();
    setAssignedBy(window.localStorage.getItem("LoginData"));
  }, [dispatch, organization, bedAssignedData]);
  console.log((newAssignedBy));
 
  const [formData, setFormData] = useState<Bed>({
    roomNoStart: "",
    roomNoEnd: "",
    bedNo: "",
    oddOrEven: "",
    organization:organization,
  });
  const handleSave = async () => {
    const requestBody = {
      bedId: bedId,
      pid: bedAssignedData.pid,
      assignedBy: newAssignedBy,
      admitDate: new Date().toISOString().slice(0, 10).replace(/-/g, "")
    };
 
    console.log("Request Payload:", JSON.stringify(requestBody));
 
    try {
      const response = await axios.post(
        "http://47.32.254.89:7000/api/Q15Bed/assign",
        requestBody
      );
 
      console.log("API bedassign Response:", response.data);
 
      if (
        response.data.message &&
        response.data.message.code === "MHC - 0200"
      ) {
        toast.success(response.data.message.description);
        setEditModal(false);  
        getAllBedAssign(dispatch, organization);
        getAllBed(dispatch,organization)
        fetchPatientsandBedAssign()
      } else {
        console.error("Error:", response.data.message);
        toast.error(`Error: ${response.data.message.description}`);
      }
    } catch (error) {
      console.error("API Request Error:", error);
      toast.error("An error occurred. Please check console for details.");
    } finally {
      setEditModal(false);
    }
  };
 
  const handleClick = (selectedBed: any) => {
    if (selectedBed) {
   
      const bedAssignId = selectedBed.id || " ";
      setBedId(bedAssignId);
      console.log("Bed Id:", bedAssignId);
      console.log("Clicked details", selectedBed);
      setBedAssignedData({
        id: selectedBed.id,
        bedId: selectedBed.bedId,
        pid: selectedBed.pid,
        orgId: selectedBed.orgId,
      });
      console.log("Responses:", selectedBed);
      setEditModal(true);
    } else {
      console.error("Invalid Data:", selectedBed);
    }
  };
 
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `http://47.32.254.89:7000/api/patient/get/activePatient/${organization}`
      );
      console.log("Patient API Response:", response.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        setPatients(response.data.data);
        // toast.success(response.data.message.description)
      } else {
        console.error("Invalid data format for patients:", response.data);
        // toast.error(response.data.message.description)
      }
    } catch (error) {
      console.log(error);
      // toast.error("Error: something went wrong.")
    }
  };
 
  const fetchPatientsandBedAssign = async () => {
    try {
      const response = await axios.get(
        `http://47.32.254.89:7000/api/Q15Bed/getByOrg/${organization}`
      );
      console.log("Patient and Bed Assign:", response.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        setPatientAndBedAssign(response.data.data);
    // toast.success(response.data.message.description);
      } else {
        console.error("Invalid data format for patients:", response.data);
        // toast.error("Error: something went wrong.")
        // toast.error(response.data.message.description)
      }
    } catch (error) {
      console.log(error);
      // toast.error("Error: something went wrong.")
    }
  };
 
 
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are You Sure Do You Want To Delete bed?");
    if (confirmDelete) {
      try {
 
        await dispatch(deleteBedAssignDetails(id, organization));
        console.log("Bed Assigned Discharge Successfully");
      } catch {
       console.log("Failed to Discharge the Details");
      }
    }
  };
  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
 
const handlePatientClick=(e:React.FormEvent)=>{
  e.preventDefault();
  setShowModal(!showModal)
}
 
// const handlePatientClick = () => {
//   navigate('/bed-creation')
// }
 
const { patientAssignData = [] } = useSelector(
  (state: any) => state.PatientAssign
);
 
console.log('patientAndBedAssign',patientAndBedAssign)
console.log("Redux Patient Data:", patientData);
console.log("patient assigned data:",patientAssignData)
 
const [currentPage, setCurrentPage] = useState(0);
const [perPage] = useState(10);
const [totalItems, setTotalItems] = useState(0);
const totalPages = Math.ceil(totalItems / perPage);
useEffect(() => {
  getAllBed(dispatch, organization);
}, [dispatch, organization]);
 
 
const handlePatientDelete = async (id: string) => {
  const confirmDelete = window.confirm("Are You Sure Do You Want To Discharge?");
  if (confirmDelete) {
    try {
      await dispatch(deletePatientAssignDetails(id, organization));
      console.log("Bed Assigned Deleted Successfully");
    } catch {
      console.log("Failed to Delete the Details");
    }
  }
};
const getPatientName = (patientId: string) => {
  console.log("patientData:", patientData);
 
  const selectedPatient = patientData.find((patient: any) => patient.id === patientId);
 
  console.log("selectedPatient:", selectedPatient);
 
  if (selectedPatient) {
    if (selectedPatient.name && selectedPatient.name.length > 0) {
      const { family, given } = selectedPatient.name[0];
      const fullName = `${given} ${family}`;
     
      console.log("patientName:", fullName);
      return fullName;
    } else if (selectedPatient.basicDetails && selectedPatient.basicDetails.length > 0) {
      const { family, given } = selectedPatient.basicDetails[0].name[0];
      const fullName = `${given} ${family}`;
      console.log("patientName (using basicDetails):", fullName);
      return fullName;
    }
  }
console.warn(`Patient data issue for ID: ${patientId}`, selectedPatient);
  return "Unknown";
};
 
const closeBedModal = () => {
    setShowModal(false)
    setFormData({
      roomNoStart: "",
    roomNoEnd: "",
    bedNo: "",
    oddOrEven: "",
    organization:organization,
    })
}
  const handleSaveBed = async () => {
    if (!formData.bedNo) {
    toast.error("Please fill All The Fields");
    return;
  }
 
  console.log("Organization:", organization);
    const requestBody = {    
      roomNoStart: formData.roomNoStart,
      roomNoEnd: formData.roomNoEnd,
      bedNo:formData.bedNo,
      oddOrEven:formData.oddOrEven,
      organization:formData.organization
    };    
    try {
      const response = await axios.post(
        "http://47.32.254.89:7000/api/Q15Bed/create",
        requestBody
      );
      console.log("Registered Data:", response.data);
      console.log("Request details:", requestBody);
      console.log('ID:',response.data.data.id)
      if (
        response.data.message &&
        response.data.message.code === "MHC - 0200"
      )
      {
        toast.success(response.data.message.description);
        setEditModal(false);
        setShowModal(false)
        getAllBedAssign(dispatch, organization);
        getAllBed(dispatch, organization);
 
      } else {
        console.log("error:", response.data.message);
        toast.error(`Error:${response.data.message.description}`);
      }
    } catch (error) {
      toast.error("Room No and Bed No Already Exists");
    }
  };
 
  return (
    <div className="container m15 p3" style={{ width: "90%" }}>
      <div className="row mb-2">
        <div className="col-md-8">
          <div className="heading1">
            <h4>All Bed Details</h4>
            <br />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mx-2">
         
            <FaPlus
              data-bs-target="#exampleModal"
              style={{ cursor: "pointer" }}
              onClick={handlePatientClick}
            />
     
          </div>
        </div>
      </div>
      <hr></hr>  
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Available" value="1" />
            <Tab label="Occupied" value="2" />
            <Tab label="Both" value="3" />
          </TabList>
        </Box>        
        <TabPanel sx={{padding:'0px'}} value="1">        
        <div>
          <Row style={{ display: "flex", flexWrap: "wrap" }}>
            {Array.isArray(bedAssignData) && bedAssignData.length > 0 ? (
              bedAssignData.map((bedassign: any, index: number) => (
                <Col key={index}>
                  <div className="bed-assignment-box">
                    <Card
                      className="mb-3"
                      color="primary"
                      outline
                      style={{
                        width: "180px",
                        height: "180px",
                        padding: "5px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className="mb-2"
                        onClick={() => handleClick(bedassign)}
                        style={{ cursor: "pointer" }}
                      >
                        <CardTitle tag="h6">
                          RoomNo: {bedassign.roomNo}
                        </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">
                          BedNo: {bedassign.bedNo}
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{display:'flex'}}>
                        <Badge
                          color={bedassign.pid ? "danger" : "success"}
                          tag="h4"
                        >
                          {bedassign.pid ? "Occupied" : "Available"}
                        </Badge>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-danger outline"
                          onClick={() => handleDelete(bedassign.id)}
                          style={{ cursor: "pointer", marginLeft: "20px" }}
                        />
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <p>No bed assignments available.</p>
            )}
          </Row>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>    
        </TabPanel>
        <TabPanel sx={{padding:'0px',position:'relative',top:'8px'}} value="2">        
        <Row className="mt-10 mb-4 m-0">
          {Array.isArray(patientAssignData) && patientAssignData.length > 0 ? (
            patientAssignData.map((patientassign: any, index: number) => (
              <Col key={patientassign.id}>
                <div className="bed-assignment-box">
                  <Card className="mb-3" color="danger" outline
                  style={{
                    width: "180px",
                    height: "180px",
                    padding: "5px",
                    margin: "5px",
                    justifyContent: "flex-start",
                  }}>
                  <CardHeader tag="h6">Patient Name: {getPatientName(patientassign.pid)}</CardHeader>
                  <CardBody>
                      {/* <CardTitle tag="h6">Patient ID: {patientassign.pid}</CardTitle> */}
                      <CardSubtitle tag="h6" className="text-muted">
                        <div>
                        Room No: {patientassign.roomNo}
                        </div>
                        Bed No: {patientassign.bedNo}
                      </CardSubtitle>
                    </CardBody>
                   
                      <CardFooter  style={{display:'flex'}}>
                        <Badge
                          color={patientassign.pid ? "danger" : "success"}
                          tag="h4"
                        >
                          {patientassign.pid ? "Occupied" : "Available"}
                        </Badge>
                        <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    onClick={() => handlePatientDelete(patientassign.id)}
                    style={{ cursor: "pointer",marginLeft:'20px' }}
                  />
                </CardFooter>
                      </Card>
                </div>
              </Col>
            ))
          ) : (
            <p>No bed assignments available.</p>
          )}
        </Row>            
        </TabPanel>
        <TabPanel value="3">      
        <div>
          <Row style={{ display: "flex", flexWrap: "wrap" }}>
            {Array.isArray(patientAndBedAssign) && patientAndBedAssign.length > 0 ? (
              patientAndBedAssign.map((bedassign: any, index: number) => (
                bedassign.pid !== null ? <>
                <Col key={bedassign.id}>
                <div className="bed-assignment-box">
                  <Card className="mb-3" color="danger" outline
                  style={{
                    width: "180px",
                    height: "180px",
                    padding: "5px",
                    margin: "5px",
                    justifyContent: "flex-start",
                  }}>
                  <CardHeader tag="h6">Patient Name: {getPatientName(bedassign.pid)}</CardHeader>
                  <CardBody>
                      {/* <CardTitle tag="h6">Patient ID: {patientassign.pid}</CardTitle> */}
                      <CardSubtitle tag="h6" className="text-muted">
                        <div>
                        Room No: {bedassign.roomNo}
                        </div>
                        Bed No: {bedassign.bedNo}
                      </CardSubtitle>
                    </CardBody>
                   
                      <CardFooter  style={{display:'flex'}}>
                        <Badge
                          color={bedassign.pid ? "danger" : "success"}
                          tag="h4"
                        >
                          {bedassign.pid ? "Occupied" : "Available"}
                        </Badge>
                        <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    onClick={() => handlePatientDelete(bedassign.id)}
                    style={{ cursor: "pointer",marginLeft:'20px' }}
                  />
                </CardFooter>
                      </Card>
                </div>
              </Col>            
                </>:<> <Col key={index}>
                  <div className="bed-assignment-box">
                    <Card
                      className="mb-3"
                      color="primary"
                      outline
                      style={{
                        width: "180px",
                        height: "180px",
                        padding: "5px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className=""
                        onClick={() => handleClick(bedassign)}
                        style={{ cursor: "pointer" }}
                      >
                        <CardTitle tag="h6">
                          RoomNo: {bedassign.roomNo}
                        </CardTitle>
                        <CardSubtitle tag="h6" className="text-muted">
                          BedNo: {bedassign.bedNo}
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{display:'flex'}}>
                        <Badge
                          color={bedassign.pid ? "danger" : "success"}
                          tag="h4"
                        >
                          {bedassign.pid ? "Occupied" : "Available"}
                        </Badge>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-danger outline"
                          onClick={() => handleDelete(bedassign.id)}
                          style={{ cursor: "pointer", marginLeft: "20px" }}
                        />
                      </CardFooter>
                    </Card>
                  </div>
                </Col></>
              ))
            ) : (
              <p>No bed assignments available.</p>
            )}
          </Row>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>      
        </TabPanel>
      </TabContext>
    </Box>
     
      <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
        <ModalHeader toggle={() => setEditModal(false)}>Assign Bed For Patient</ModalHeader>
        <ModalBody>
          <div>          
            <div className="form-control">
              <label
                htmlFor="patientName"
                className="floating-label"
                style={{ fontWeight: "bold" }}
              >
                Patient Name
              </label>
              <Input
                type="select"
                id="patientName"
                name="pid"
                value={bedAssignedData.pid}
                onChange={(e) => handlePatientChange(e.target.value)}
              >
                <option value="">Select Patient</option>
                {patients
                  .filter((patient: any) =>
                    patient.basicDetails[0].name[0].given
                      .toLowerCase()
                      .includes(search.toLowerCase())
                    || patientData.basicDetails[0].name[0].family.toLowerCase().includes(search.toLowerCase()))
                  .map((patient:any) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.basicDetails[0].name[0].given}{" "}
                      {patient.basicDetails[0].name[0].family}
                    </option>
                  ))}
              </Input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditModal(false)}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered>
        <ModalHeader toggle={closeBedModal}>
          <h3>Bed Assign Details</h3>
        </ModalHeader>
        <ModalBody>
          <div>
            {/* <div className="form-control">
              <label
                htmlFor="roomNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'30%' }}
              >
                Start Room No:
              </label>
              <input style={{width:'20%'}}
                type="text"
                id="roomNo"
                name="roomNo"
                placeholder="Enter No"
                value={formData.roomNoStart}
                onChange={(e) => setFormData({ ...formData, roomNoStart: e.target.value })}
              ></input>
              <label style={{width:'2%'}}/>
              <label
                htmlFor="bedNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'28%' }}
              >
                End Room No:
              </label>
              <input style={{width:'20%'}}
                type="text"
                id="bedNo"
                name="bedNo"
                placeholder="Enter No"
                value={formData.roomNoEnd}
                onChange={(e) => setFormData({ ...formData, roomNoEnd: e.target.value })}
              ></input>
              <div style={{marginBottom:'15px'}}></div>
              <label
                htmlFor="roomNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'30%' }}
              >
                Bed No:
              </label>
              <input style={{width:'20%'}}
                type="text"
                id="roomNo"
                name="roomNo"
                placeholder="Enter No"
                value={formData.bedNo}
                onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })}
              ></input>
              <label style={{width:'2%'}}/>
              <label
                htmlFor="bedNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'28%' }}
              >
                Type:
              </label>
              <select id="bedNo"  style={{width:'20%', height:'45px', border:'1px solid black', borderRadius:'5px' }} name="bedNo" value={formData.oddOrEven} onChange={(e) => setFormData({ ...formData, oddOrEven: e.target.value })} >
                                            <option value="" >Select</option>
                                            <option value="odd" >Odd</option>
                                            <option value="even" >Even</option>
                                        </select>            
              <ModalFooter style={{position:'relative', top:'12px'}}>
            <Button color="info" onClick={handleSaveBed}>
              Save Changes
            </Button>{" "}
            <Button color="danger" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
            </div> */}
            <div className="row w-100">
          <div className='col-md-6 mb-2 '>
            <TextField id="outlined-basic-1" label="RoomNoStart" variant="outlined" fullWidth  onChange={(e) => setFormData({ ...formData, roomNoStart: e.target.value })} className="text-center"/>
          </div>
          <div className='col-md-6 mb-2 '>
            <TextField id="outlined-basic-1" label="RoomNoEnd" variant="outlined" fullWidth  onChange={(e) => setFormData({ ...formData, roomNoEnd: e.target.value })} className="text-center"/>
          </div>
          </div>
          <div className="row w-100 h-100 " style={{marginTop:'20px'}}>
          <div className='col-md-6 mb-2' >
          <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">BedNo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.bedNo}
                  label="bedNo"
                  onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })}
                >
                  <MenuItem value="01">01</MenuItem>
                  <MenuItem value="02">02</MenuItem>
                  <MenuItem value="03">03</MenuItem>
                  <MenuItem value="04">04</MenuItem>
                </Select>
              </FormControl>
              </div>
          <div className='col-md-6 mb-2' >
          <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">OddOrEven</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.oddOrEven}
                  label="oddOrEven"
                  onChange={(e) => setFormData({ ...formData, oddOrEven: e.target.value })}
                >
                  <MenuItem value="odd">odd</MenuItem>
                  <MenuItem value="even">even</MenuItem>
                  <MenuItem value="both">both</MenuItem>
                </Select>
              </FormControl>
            {/* <TextField id="outlined-basic-2" label="organization" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, organization: e.target.value })} /> */}
          </div>
        </div>
          </div>
              <ModalFooter style={{position:'relative', top:'12px'}}>
            <Button color="primary" onClick={handleSaveBed}>
              Save Changes
            </Button>{" "}
            <Button color="danger" onClick={closeBedModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};
 
export default BedAssign;