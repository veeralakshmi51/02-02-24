import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../configuration/url";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TextField } from "@mui/material";

import { Button } from 'primereact/button';
interface FormData {
    uuid : string;
    deviceName : string;
    deviceId : string;
    deviceType : string; 
}

const BeaconCreation: React.FC = () => {
    const { organization } = useSelector((state: any) => state.Login)
    const navigate = useNavigate();
    
    const [formValues, setFormValues] = useState<FormData>({
        uuid : '',
        deviceName : '',
        deviceId : '',
        deviceType : '',
    });

    const handleSaveClick = async () => {
        const requestBody = {
            id: "",
            uuid: formValues.uuid,
            deviceName: formValues.deviceName,
            deviceId: formValues.deviceId,
            deviceType: formValues.deviceType,
            orgId: organization,
        };
        try {
            if (!formValues.uuid || !formValues.deviceId || !formValues.deviceName ) {
                toast.error('Please fill the required fields');
                return;
            }
            const response = await axios.post(`${baseURL}/sensor/register`, requestBody)
            if(response.data.message && response.data.message.code === 'MHC - 0200') {
                toast.success(response.data.message.description);
                navigate('/beacon-table')
            } else {
                toast.warning(response.data.message.description);
            }
        } catch (error) {
            console.error("beaconCreate: ",error)
        }
    }

    return(
        <div className="row w-100">
            <div className="col-md-1"> </div>
                <div className="col-md-10">
                <h4 className="mb-2 text-center">Beacon Registration</h4>
                <hr></hr>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                    <div className="col-md-5 mb-2">
                        <TextField id="outlined-basic-1" label="Unique Id" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, uuid: e.target.value})} />
                    </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-5 mb-2">
                        <TextField id="outlined-basic-1" label="device Id" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceId: e.target.value})} />
                </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-5 mb-2">
                        <TextField id="outlined-basic-1" label="device Name" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceName: e.target.value})} />
                </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-5 mb-2">
                        <TextField id="outlined-basic-1" label="device Type" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceType: e.target.value})} />
                </div>
                </div>
                </div>
                <div className="d-flex gap-3 justify-content-center mt-4">
          <Button label="Cancel" onClick={() => { navigate('/beacon-table') }} severity="secondary" style={{ color: '#000', backgroundColor: '#fff', border: '2px solid #0f3995' }} />
          <Button label="Save" style={{ backgroundColor: '#0f3995' }} onClick={handleSaveClick} />
        </div>
        <ToastContainer/>
           
        </div>
    )
}

export default BeaconCreation;
