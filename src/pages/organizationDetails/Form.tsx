import React, { useEffect, useState } from "react";
import { FormGroup } from "reactstrap";
import "./form.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../configuration/url";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
interface DropdownItem {
  id: string;
  value: string;
  type: string;
}

interface Dropdown {
  id: string;
  dropdown: string;
  list: DropdownItem[];
}

interface DropdownResponse {
  message: {
    code: string;
    description: string;
  };
  data: Dropdown[];
}

interface FormData {
  organizationName: string;
  organizationType: string;
  organizationId: string;
  duration: string;
  startTime: string;
  mobileNumber: string;
  email: string;
  websiteUrl: string;
  hippaPrivacyOfficerName: string;
  proximityVerification: string;
  geofencing: string;
  q15Access: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  cPerson: string;
  cEmail: string;
  cPhone: string;
}
interface OrganizationType {
  id: string;
  value: string;
  type: string;
}
const OrganizationForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const [selectedValues, setSelectedValues] = useState<any>({
    city: [],
    country: [],
    state: [],
  });
  const [organizationType, setOrganizationType] = useState<OrganizationType[]>(
    []
  );
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    organizationName: "",
    organizationType: "",
    organizationId: "",
    duration: "",
    startTime: "",
    mobileNumber: "",
    email: "",
    websiteUrl: "",
    hippaPrivacyOfficerName: "",
    proximityVerification: "",
    geofencing: "",
    q15Access: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    cPerson: "",
    cEmail: "",
    cPhone: "",
  });

  useEffect(() => {
    const fetchOrganizationTypes = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/dropdowns/getByDropdown?dropdown=Organization%20Type`
        );
        setOrganizationType(response.data.data[0]?.list || []);
        console.log("fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching organization types:", error);
        setError("Error fetching organization types. Please try again.");
      }
    };
    fetchOrganizationTypes();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${baseURL}/dropdowns/get-all`);
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === "MHC - 0200") {
          setDropdownData(data.data);
          console.log("Fetched data:", data.data);
        } else {
          console.error(
            "Error fetching dropdown data:",
            data.message.description
          );
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (
        !formData.organizationName ||
        !formData.organizationType ||
        !formData.duration ||
        !formData.startTime ||
        !formData.email ||
        !formData.mobileNumber
      ) {
        toast.error("Please fill the required fields");
        return;
      }
      const response = await axios.post(`${baseURL}/org/register`, {
        organizationdetails: [
          {
            id: formData.organizationId,
            name: formData.organizationName,
            type: formData.organizationType,
          },
        ],
        shift: {
          duration: formData.duration,
          startTime: formData.startTime,
        },
        contact: [
          {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: selectedValues.state[0] || "",
            country: selectedValues.country[0] || "",
            zip: formData.zip,
          },
        ],
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        websiteUrl: formData.websiteUrl,
        proximityVerification: formData.proximityVerification,
        geofencing: formData.geofencing,
        q15Access: formData.q15Access,
        pointofcontact: [
          {
            name: formData.cPerson,
            email: formData.cEmail,
            phoneNumber: formData.cPhone,
          },
        ],
        hippaprivacyofficer: [
          {
            name: formData.hippaPrivacyOfficerName,
          },
        ],
      });

      if (response.data.message.code === "MHC - 0200") {
        console.log("Registration Data", response.data);
        toast.success(response.data.message.description);
        navigate("/organization-details");
      } else {
        console.error("Error registering:", response.data.message);
        toast.warning(`Error: ${response.data.message.description}`);
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.warning("An error occurred during registration.");
    }
  };
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    city: false,
    country: false,
    state: false,
  });

  const handleSelectChange1 = (
    e: React.ChangeEvent<{ value: unknown }>,
    dropdownName: string
  ) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value });
    setOpenState({ ...openState, [dropdownName]: false });
  };

  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find(
      (item) => item.dropdown === dropdownName
    );

    if (!dropdown) {
      return null;
    }

    const menuStyle = {
      maxHeight: "250px",
    };

    return (
      <FormControl sx={{ marginLeft: "3px", width: "100%" }} key={dropdownName}>
        <InputLabel id={`demo-simple-name-label-${dropdownName}`}>
          {dropdownName}
        </InputLabel>
        <Select
          labelId={`demo-simple-name-label-${dropdownName}`}
          id={`demo-simple-name-${dropdownName}`}
          value={selectedValues[dropdownName]}
          onChange={(e: any) => handleSelectChange1(e, dropdownName)}
          onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
          onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
          open={openState[dropdownName]}
          input={<OutlinedInput label={dropdownName} />}
          MenuProps={{
            PaperProps: {
              style: menuStyle,
            },
          }}
        >
          {dropdown.list.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-90">
      <div className="row">
        <div className="container col-md-12">
          <div className="d-flex justify-content-center align-items-center">
            <h3 className="mt-1">Create An Organization</h3>
          </div>
          <hr></hr>
          <FormGroup>
            <form onSubmit={handleSubmit}>
              <div className="row w-100 ">
                <div className="col-md-6 mb-2">
                  <TextField
                    id="outlined-basic-1"
                    label="OrganizationName"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <TextField
                    id="outlined-basic-2"
                    label="Organization Email"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="row w-100 ">
                <div className="col-md-4 mb-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="OrganizationType">
                      Organization Type
                    </InputLabel>
                    <Select
                      labelId="OrganizationType"
                      id="OrganizationType"
                      label="OrganizationType"
                      value={formData.organizationType}
                      required
                      onChange={(e) =>
                        handleInputChange("organizationType", e.target.value)
                      }
                      MenuProps={{ style: { maxHeight: "300px" } }}
                    >
                      {organizationType.length > 0 &&
                        organizationType.map((type) => (
                          <MenuItem key={type.id} value={type.value}>
                            {type.value}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-2"
                    label="Website URL"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, websiteUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="row w-100 ">
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="HIPPA Officer Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hippaPrivacyOfficerName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="Duration"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  >
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker label="Basic time picker" />
                      </DemoContainer>
                    </LocalizationProvider> */}
                  </TextField>
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-2"
                    label="Start Time"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <label
                  htmlFor="organizationType"
                  className="label d-flex justify-content-center align-items-center"
                >
                  Contact Person
                </label>
              </div>
              <div className="row w-100 ">
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="Contact Person"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, cPerson: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="Contact Email"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, cEmail: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-2"
                    label="Contact Mobile"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, cPhone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-3">
                <label
                  htmlFor="Address"
                  className="label d-flex justify-content-center align-items-center"
                >
                  Address
                </label>
              </div>
              <div className="row w-100 ">
                <div className="col-md-4 mb-2">
                  <TextField
                    id="outlined-basic-1"
                    label="addessLine 1"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine1: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="addressLine 2"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine2: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">{renderDropdown("state")}</div>
              </div>

              <div className="row w-100 ">
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-1"
                    label="city"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4">
                  {renderDropdown("country")}
                  {/* <TextField id="outlined-basic-1" label="country" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, country: e.target.value })} /> */}
                </div>
                <div className="col-md-4">
                  <TextField
                    id="outlined-basic-2"
                    label="zip"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="row w-100">
                <div className="mt-3">
                  <label
                    htmlFor="organizationType"
                    className="label d-flex justify-content-center align-items-center"
                  >
                    Access Control
                  </label>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="proximity-label">Proximity</InputLabel>
                    <Select
                      labelId="proximity-label"
                      id="proximity"
                      label="Proximity"
                      value={formData.proximityVerification}
                      onChange={(e) =>
                        handleInputChange(
                          "proximityVerification",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="q15-access-label">Q15</InputLabel>
                    <Select
                      labelId="q15-access-label"
                      id="q15Access"
                      label="Q15"
                      value={formData.q15Access}
                      onChange={(e) =>
                        handleSelectChange("q15Access", e.target.value)
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="geofencing-label">Geo Fencing</InputLabel>
                    <Select
                      labelId="geofencing-label"
                      id="geofencing"
                      label="Geo Fencing"
                      value={formData.geofencing}
                      onChange={(e) =>
                        handleSelectChange("geofencing", e.target.value)
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-end mt-4">
                <Button
                  label="Cancel"
                  onClick={() => {
                    navigate("/organization-details");
                  }}
                  severity="secondary"
                  style={{
                    color: "#000",
                    backgroundColor: "#fff",
                    border: "2px solid #0f3995",
                  }}
                />
                <Button
                  label="Save"
                  style={{ backgroundColor: "#0f3995" }}
                  onClick={handleSubmit}
                />
              </div>
              <br></br>

              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </FormGroup>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default OrganizationForm;
