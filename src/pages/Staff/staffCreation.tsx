import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from 'primereact/button';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './staff.css'
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateToYYYYMMDD } from '../../helpers/common';
import { toast } from 'react-toastify';
import { createStaff } from '../../slices/thunk';
import Loader from '../../components/loader/Loader';

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

const Staff = () => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const [userType,setUserType]=React.useState('');
  const { organization } = useSelector(
    (state: any) => state.Login
  );
  const { loading } = useSelector(
    (state: any) => state.Staff
  );
  const navigate = useNavigate()
  const dispatch = useDispatch<any>()
  const [selectedValues, setSelectedValues] = useState<any>({
    gender: [],
    country: [],
    roles: [],
    speciality: [],
    state:[]
  });
  const handleChange = (event: SelectChangeEvent) => {
    setUserType(event.target.value as string);
  };
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateofBirth:'',
    ssn:'',
    npi:'',
    addressLine1:'',
    addressLine2:'',
    city:'',
    state:'',
    postalCode:'',
    phoneNumber:'',
    email:'',
    startDate:'',
    userType:'',
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch('http://47.32.254.89:7000/api/dropdowns/get-all');
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === 'MHC - 0200') {
          setDropdownData(data.data);
        } else {
          console.error('Error fetching dropdown data:', data.message.description);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSaveClick = async () => {
    const requestBody = {
      id:'',
      name: [
        {
          use: formData.middleName,
          given: formData.firstName,
          family: formData.lastName,
        },
      ],
      gender: selectedValues.gender || '',
      email: formData.email,
      role: selectedValues.roles || '',
      organization,
      userType:userType,
      startDate: formData.startDate,
      speciality:[
        selectedValues.speciality || ''
      ],
      dateofBirth:formData.dateofBirth,
      ssn:formData.ssn,
      npi:formData.npi,
      contact:[
        {
            address:[{
                addressLine1:formData.addressLine1,
                addressLine2:formData.addressLine2,
                city:formData.city,
                country:selectedValues.country || '',
                state:selectedValues.state || '',
                zip:formData.postalCode
        }],
        mobilePhone:formData.phoneNumber
        }
      ]
    };

    dispatch(createStaff(requestBody, navigate))
  };

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    gender: false,
    country: false,
    roles: false,
    speciality: false,
    state:false
  });

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, dropdownName: string) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value as string[] });
    setOpenState({ ...openState, [dropdownName]: false }); // Close the dropdown after selecting
  };


  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find((item) => item.dropdown === dropdownName);

    if (!dropdown) {
      return null;
    }
    const menuStyle = {
      maxHeight: '250px', 
    };
    return (
      <FormControl sx={{ marginLeft: '3px', width: '100%' }} key={dropdownName}>
        <InputLabel id={`demo-simple-name-label-${dropdownName}`}>{dropdownName}</InputLabel>
        <Select
          labelId={`demo-simple-name-label-${dropdownName}`}
          id={`demo-simple-name-${dropdownName}`}
          // multiple
          value={selectedValues[dropdownName]}
          onChange={(e:any) => handleSelectChange(e, dropdownName)}
          onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
          onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
          open={openState[dropdownName]}
        //   onChange={(e) => setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value as string[] })}
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
    <div className='row w-100'>
      { loading && <Loader /> }
    <div className='col-md-2'></div>
    <div className='col-md-8'>
    <h4 className='mb-2 text-center' >Staff Details</h4>
    <hr></hr>
    
      <div className="row w-100 " style={{marginTop:'10px'}}>
        <div className='col-md-4 mb-2'>
          <TextField id="outlined-basic-1" label="First Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}/>
        </div>
        <div className='col-md-4 mb-2'>
          <TextField id="outlined-basic-2" label="Middle Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}/>
        </div>
        <div className='col-md-4 mb-2'>
          <TextField id="outlined-basic-3" label="Last Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}/>
        </div>
      </div>

    <div className="row w-100">
    <div className='col-md-4 mb-2'>
          {renderDropdown('gender')}
        </div> 
    <div className='col-md-4 mb-2'>
      <DatePicker
        label={'Date Of Birth'}
        format='DD-MM-YYYY'
        onChange={(date: any) =>{
          console.log(formatDateToYYYYMMDD(date))
          setFormData({ ...formData, dateofBirth: formatDateToYYYYMMDD(date) })
        }}
      />
    </div> 
    <div className='col-md-4 mb-2'>
      <TextField id="outlined-basic-2" label="Phone Number" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}/>
    </div>    
  </div>

  <div className="row w-100 ">
    
    <div className='col-md-6 mb-2'>
      <TextField id="outlined-basic-1" label="SSN" variant="outlined" fullWidth inputProps={{maxLength:9,pattern:'[0-9]*',inputMode:'numeric'}}onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}/>
    </div>
    <div className='col-md-6 mb-2'>
      <TextField id="outlined-basic-2" label="NPI#" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, npi: e.target.value })}/>
    </div>    
  </div>

<div className='row w-100'>
<div className='col-md-6 mb-2'>
      <TextField id="outlined-basic-1" label="Email" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
    </div>
    <div className='col-md-6 mb-2'>
    {/* <TextField id="outlined-basic-2" label="User Type" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, userType: e.target.value })}/> */}
    
  <FormControl fullWidth>
  <InputLabel >UserType</InputLabel>
  <Select
    value={userType}
    label="User Type"
    onChange={handleChange}
  >
        <MenuItem value={'Admin'}>Admin</MenuItem>
        <MenuItem value={'SystemAdmin'}>System Admin</MenuItem>
    <MenuItem value={'Staff'}>Staff</MenuItem>
  </Select>
  </FormControl>
 
    </div>
</div>
  <div className="row w-100 ">
    
    <div className='col-md-6 mb-2'>
          {renderDropdown('speciality')}
          
        </div>  
        <div className='col-md-6 mb-2'>
          {renderDropdown('roles')}
        </div>   
  </div>

  <div className="row w-100 ">
    <div className='col-md-4 mb-2'>
      <TextField id="outlined-basic-1" label="Address Line 1" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}/>
    </div>
    <div className='col-md-4 mb-2'>
      <TextField id="outlined-basic-2" label="Address Line 2" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}/>
    </div> 
    <div className='col-md-4 mb-2'>
          {renderDropdown('country')}
        </div>   
  </div>

  <div className="row w-100 ">
      <div className='col-md-4 mb-2'>
        <TextField id="outlined-basic-1" label="City" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, city: e.target.value })}/>
      </div>
      <div className='col-md-4 mb-2'>
        {/* <TextField id="outlined-basic-2" label="State/Provide" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, state: e.target.value })}/> */}
        {renderDropdown('state')}
      </div>
      <div className='col-md-4 mb-2'>
        <TextField id="outlined-basic-3" label="Zip/Postal Code" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}/>
      </div>
    </div>


<div className="d-flex gap-3 justify-content-end mt-4">
            <Button label="Cancel"  onClick={() => { navigate(-1) }} severity="secondary" style={{color:'#000',backgroundColor:'#fff', border:'2px solid #0f3995'}}/>
            <Button label="Save" style={{ backgroundColor: '#0f3995' }} onClick={handleSaveClick} />
        </div>
        </div>
</div>
)
}

export default Staff;