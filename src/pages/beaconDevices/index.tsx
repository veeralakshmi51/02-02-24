// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import "./beacon.css";
// import Scan from "./Scan";
// import { Pagination, Tooltip } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { baseURL } from "../../configuration/url";
// import { GrBeacon } from "react-icons/gr";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const QRCodeScanner = () => {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);
//   const { organization } = useSelector((state: any) => state.Login);
// console.log("or", organization)
//   const getAPI = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/sensor/getAllByorgId/${organization}`);
//       setData(res.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const deleteAPI = async (deviceName: any) => {
//     const del = window.confirm(`do you want to miss this data?  ${deviceName}`);
//     if (del) {
//       try {
//         const res = await axios.delete(
//           `${baseURL}/sensor/deleteByDeviceName/${deviceName}`
//         );
//         alert("Oops...Data was deleted.");
//         getAPI();
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       alert("Oh god you save this data.");
//     }
//   };

//   useEffect(() => {
//     getAPI();
//   }, []);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber:any) => setCurrentPage(pageNumber);
//   const navigate = useNavigate();

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col-md-10 d-flex  align-items-center">
//         <p className="mb-0 me-2">Register a New Beacon<span> </span></p>
//     <GrBeacon
//       data-bs-target="#exampleModal"
//       style={{ cursor: "pointer", fontSize: '30px' }}
//       onClick={() => navigate('/beacon-creation')}
//     />
//         </div>
//         <div className="col-md-2">
//           <Scan getAPI={getAPI} />
//         </div>

//       </div>
//       <br />
//       <div className="row mb-2">
//         <div className="text-center mb-2"> Beacon Details</div>

//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th scope="col">ID</th>
//               <th scope="col">DEVICE NAME</th>
//               <th scope="col">DEVICE ID</th>
//               <th scope="col">Unique-ID</th>
//               <th scope="col" className="text-center">DELETE</th>
//             </tr>
//           </thead>
//           <tbody className="tbody">
//             {currentData.map((item: any, index: any) => {
//               return (
//                 <tr key={item.id}>
//                   <td>{index + 1}</td>
//                   <td>{item.deviceName}</td>
//                   <td>{item.deviceId}</td>
//                   <td>{item.uuid}</td>
//                   <td className="text-center">
//                   <FontAwesomeIcon
//                     icon={faTrash}
//                     className="text-danger"
//                     onClick={() => deleteAPI(item.deviceName)}
//                     style={{ cursor: "pointer" }}
//                   />
//                 </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//       <div className="row">
//         <Pagination className='d-flex justify-content-center align-items-center '>
//           {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
//             <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
//               {index + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>
//     </div>
//   );
// };

// export default QRCodeScanner;
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./beacon.css";
import Scan from "./Scan";
import { Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { baseURL } from "../../configuration/url";
import { TbDeviceWatchPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updatedSensorDetails } from "../../slices/beaconDevices/thunk";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const QRCodeScanner: React.FC = () => {
  const [editModal, setEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selecSensorId, setSelectSensorId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<any>();
  const itemsPerPage = 5;
  const { organization } = useSelector((state: any) => state.Login);
  const { beaconData } = useSelector((state: any) => state.Beacon);

  const [sensorData, setSensorData] = useState({
    id: "",
    uuid: "",
    deviceId: "",
    deviceName: "",
    deviceType: "",
    orgId: organization,
  });

  

  const getAPI = async (dispatch: any, organization: string) => {
    try {
      const res = await axios.get(
        `${baseURL}/sensor/getAllByorgId/${organization}`
      );
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAPI = async (deviceName: any) => {
    const del = window.confirm(`Do you want to delete this data?  ${deviceName}`);
    if (del) {
      try {
        const res = await axios.delete(
          `${baseURL}/sensor/deleteByDeviceName/${deviceName}`
        );
        toast.success("Your data has been deleted successfully.");
        getAPI(dispatch, organization);
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("You declined the delete request.");
    }
  };

  useEffect(() => {
    getAPI(dispatch, organization);
  }, [dispatch, organization]);



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentData = data
    .filter(
      (item: any) =>
        item.uuid?.toLowerCase().includes(search.toLowerCase()) ||
        item.deviceId?.toLowerCase().includes(search.toLowerCase()) ||
        item.deviceType?.toLowerCase().includes(search.toLowerCase()) ||
        item.deviceName?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  const navigate = useNavigate();

  const handleSave = async () => {
    const updateFields = {
      id: sensorData.id,
      uuid: sensorData.uuid,
      deviceId: sensorData.deviceId,
      deviceName: sensorData.deviceName,
      deviceType: sensorData.deviceType,
      orgId: organization,
    };

    setSensorData((prevData) => ({
      ...prevData,
      ...updateFields,
    }));

    try {
      await updatedSensorDetails(
        dispatch,
        sensorData.id,
        updateFields,
        organization
      );

      setEditModal(false);
    } catch (error) {
      console.error("Error updating sensor details:", error);
    }
  };

  const handleClick = (selectSensor: any) => {
    if (selectSensor) {
      setSensorData({
        id: selectSensor?.id,
        uuid: selectSensor?.uuid || "",
        deviceId: selectSensor?.deviceId || "",
        deviceName: selectSensor?.deviceName || "",
        deviceType: selectSensor?.deviceType || "",
        orgId: organization,
      });
      setEditModal(true);
    } else {
      console.log("Invalid data", selectSensor);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch(value);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-outline-primary floflat-end d-flex gap-2 align-items-center"
            onClick={() => navigate("/beacon-creation")}
          >
            <TbDeviceWatchPlus
              style={{ cursor: "pointer", fontSize: "30px" }}
            />{" "}
            Register a New Beacon
          </button>
        </div>
        <div className="col-md-2">
          <Scan getAPI={getAPI} />
        </div>
      </div>
      <br />
      <div className="row mb-2">
        <div className="text-center mb-2">
          <h2>Beacon Details</h2>
        </div>
        <hr></hr>
        <div className="row mt-3">
          <div className="col-md-3">
            <div className="mx-0 search-container d-flex align-items-center">
              <input
                type="text"
                placeholder="Search..."
                className="search form-control"
                onChange={handleChange}
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
          <div className="col-md-9 d-flex justify-content-end">
            <Pagination>
              {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map(
                (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </div>
        </div>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">DEVICE NAME</th>
              <th scope="col">DEVICE ID</th>
              <th scope="col">DEVICE TYPE</th>
              <th scope="col">Unique-ID</th>
              <th scope="col" className="text-center">
                DELETE
              </th>
            </tr>
          </thead>
          <tbody className="tbody">
            {currentData.map((item: any, index: any) => (
              <tr key={item.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.deviceName}
                </td>
                <td>{item.deviceId}</td>
                <td>{item.deviceType}</td>
                <td>{item.uuid}</td>
                <td className="text-center">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    onClick={() => deleteAPI(item.deviceName)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={editModal} toggle={() => setEditModal(false)} centered>
        <ModalHeader toggle={() => setEditModal(false)}>
          Update Beacon-Details
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="form-control">
              <label
                htmlFor="deviceName"
                className="floating-label"
                style={{ fontWeight: "bold" }}
              >
                Device Name
              </label>
              <input
                type="text"
                id="deviceName"
                name="deviceName"
                placeholder="Enter Device Name"
                value={sensorData.deviceName}
                onChange={(e) => setSensorData({ ...sensorData, deviceName: e.target.value })}
              />
              <label
                htmlFor="deviceId"
                className="floating-label"
                style={{ fontWeight: "bold" }}
              >
                Device ID
              </label>
              <input
                type="text"
                id="deviceId"
                name="deviceId"
                placeholder="Enter Device ID"
                value={sensorData.deviceId}
                onChange={(e) => setSensorData({ ...sensorData, deviceId: e.target.value })}
              />
              <label
                htmlFor="deviceType"
                className="floating-label"
                style={{ fontWeight: "bold" }}
              >
                Device Type
              </label>
              <input
                type="text"
                id="deviceType"
                name="deviceType"
                placeholder="Enter Device Type"
                value={sensorData.deviceType}
                onChange={(e) => setSensorData({ ...sensorData, deviceType: e.target.value })}
              />
              <label
                htmlFor="uuid"
                className="floating-label"
                style={{ fontWeight: "bold" }}
              >
                UUID
              </label>
              <input
                type="text"
                id="uuid"
                name="uuid"
                placeholder="Enter UUID"
                value={sensorData.uuid}
                onChange={(e) => setSensorData({ ...sensorData, uuid: e.target.value })}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="info" onClick={handleSave}>
            Save Changes
          </Button>{" "}
          <Button color="danger" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default QRCodeScanner;
