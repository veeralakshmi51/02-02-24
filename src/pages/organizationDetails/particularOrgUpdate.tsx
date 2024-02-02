import { useEffect } from "react"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getOrgByID, updateOrganizationDetails } from "../../slices/thunk"
import { Button } from "primereact/button"
import Loader from "../../components/loader/Loader"

interface FormData {
    id: string
    name: string
    email: string
    mobileNumber: string
    websiteUrl: string
    type: string
    hippaPrivacyOfficerName: string
    proximityVerification: string
    geofencing: string
    q15Access: string
    duration: string
    startTime: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    zip: string
    cPerson: string
    cEmail: string
    cPhone: string
}

const ParticularOrgUpdate = () => {
    const dispatch = useDispatch<any>()
    const navigate = useNavigate()
    const params = useParams()
    const { orgData } = useSelector(
        (state: any) => state.Org
    )
    const { loading } = useSelector(
        (state: any) => state.Organization
    )
    const { organization } = useSelector(
        (state: any) => state.Login
    )
    const [orgdatabyId, setOrgdatabyId] = useState<any>(orgData)
    const [formData, setFormData] = useState<FormData>({
        id: "",
        name: "",
        email: "",
        mobileNumber: "",
        websiteUrl: "",
        type: "",
        hippaPrivacyOfficerName: "",
        proximityVerification: "",
        geofencing: "",
        q15Access: "",
        duration: "",
        startTime: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        cPerson: "",
        cEmail: "",
        cPhone: "",
    })

    useEffect(() => {
        if (!params?.id) return
        getOrgByID(dispatch, organization)
    }, [params?.id])

    useEffect(() => {
        setOrgdatabyId(orgData)
    }, [orgData])

    useEffect(() => {
        setFormData({
            id: orgdatabyId?.id,
            name: orgdatabyId?.organizationdetails && orgdatabyId?.organizationdetails[0]?.name || "",
            email: orgdatabyId?.email || "",
            mobileNumber: orgdatabyId?.mobileNumber || "",
            websiteUrl: orgdatabyId?.websiteUrl || "",
            type: orgdatabyId?.organizationdetails && orgdatabyId?.organizationdetails[0].type || "",
            hippaPrivacyOfficerName: orgdatabyId?.hippaprivacyofficer && orgdatabyId?.hippaprivacyofficer[0]?.name || "",
            startTime: orgdatabyId?.shift?.startTime || "",
            duration: orgdatabyId?.shift?.duration || "",
            proximityVerification: orgdatabyId?.proximityVerification || "",
            q15Access: orgdatabyId?.q15Access || "",
            geofencing: orgdatabyId?.geofencing || "",
            addressLine1: orgdatabyId?.contact && orgdatabyId.contact[0]?.addressLine1 || "",
            addressLine2: orgdatabyId?.contact && orgdatabyId.contact[0]?.addressLine2 || "",
            city: orgdatabyId?.contact && orgdatabyId.contact[0]?.city || "",
            state: orgdatabyId?.contact && orgdatabyId.contact[0]?.state || "",
            country: orgdatabyId?.contact && orgdatabyId.contact[0]?.country || "",
            zip: orgdatabyId?.contact && orgdatabyId.contact[0]?.zip || "",
            cPerson: orgdatabyId?.pointofcontact && orgdatabyId.pointofcontact[0]?.name || "",
            cEmail: orgdatabyId?.pointofcontact && orgdatabyId.pointofcontact[0]?.email || "",
            cPhone: orgdatabyId?.pointofcontact && orgdatabyId.pointofcontact[0]?.phoneNumber || "",
        })
    }, [orgdatabyId])

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSaveChanges = () => {
        if (!params?.id) return

        const updatedFields = {
            id: params?.id,
            organizationdetails: [
                {
                    name: formData.name,
                    type: formData.type,
                },
            ],
            email: formData.email,
            websiteUrl: formData.websiteUrl,
            shift: {
                duration: formData.duration,
                startTime: formData.startTime,
            },
            contact: [
                {
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zip: formData.zip
                }
            ],
            pointofcontact: [
                {
                    name: formData.cPerson,
                    email: formData.cEmail,
                    phoneNumber: formData.cPhone,
                }
            ],
            proximityVerification: formData.proximityVerification,
            geofencing: formData.geofencing,
            q15Access: formData.q15Access,
            hippaprivacyofficer: [
                {
                    name: formData.hippaPrivacyOfficerName,
                },
            ],
            mobileNumber: formData.mobileNumber,
        }

        dispatch(updateOrganizationDetails(params?.id, updatedFields))
    }

    return (
        <div className="row w-100" >
            {/* {loading && <Loader />} */}
            <div className="col-md-2"></div>
            <div className="col-md-8">
                <h3 className="mb-2 text-center">{formData.name} Details</h3>
                <hr></hr>
                <div className="row w-100 " style={{ marginTop: "20px" }}>
                    <div className="col-md-6 mb-4">
                        <TextField
                            id="outlined-basic-1" label="Organization Name" variant="outlined" fullWidth onChange={handleChange} value={formData.name} name="name" />
                    </div>
                    <div className="col-md-6 mb-4">
                        <TextField id="outlined-basic-2" label="Organization Email" variant="outlined" fullWidth onChange={handleChange} value={formData.email} name="email" />
                    </div>

                </div>
                <div className="row w-100 ">
                    <div className="col-md-4 mb-4">
                        <TextField id="outlined-basic-1" label="Organization Type" variant="outlined" fullWidth onChange={handleChange} value={formData.type} name="type" />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="outlined-basic-1" label="Mobile Number" variant="outlined" fullWidth onChange={handleChange} value={formData.mobileNumber} name="mobileNumber" />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="outlined-basic-1" label="Website URL" variant="outlined" fullWidth onChange={handleChange} value={formData.websiteUrl} name="websiteUrl" />
                    </div>
                </div>

                <div className="row w-100 ">
                    <div className="col-md-4 mb-4">
                        <TextField id="outlined-basic-1" label="Contact person" variant="outlined" fullWidth onChange={handleChange} value={formData.cPerson} name="cPerson" />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="outlined-basic-1" label="Contact Mobile " variant="outlined" fullWidth onChange={handleChange} value={formData.cPhone} name="cPhone" />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField id="outlined-basic-1" label="Contact email" variant="outlined" fullWidth onChange={handleChange} value={formData.cEmail} name="cEmail" />
                    </div>
                </div>

                <div className="row w-100">
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="outlined-addressLine1"
                            label="Address Line 1"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.addressLine1}
                            name="addressLine1"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="outlined-addressLine2"
                            label="Address Line 2"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.addressLine2}
                            name="addressLine2"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="outlined-state"
                            label="State"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.state}
                            name="state"
                        />
                    </div>
                </div>
                <div className="row w-100">
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="outlined-city"
                            label="City"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.city}
                            name="city"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="outlined-country"
                            label="Country"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.country}
                            name="country"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <TextField
                            id="outlined-zip"
                            label="ZIP"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.zip}
                            name="zip"
                        />
                    </div>
                </div>

                <div className="row w-100 ">
                    <div className="mt-0">
                        <label htmlFor="organizationType" className="label">
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
                                onChange={handleChange}
                                value={formData.proximityVerification}
                                name="proximityVerification"
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
                                onChange={handleChange}
                                value={formData.q15Access}
                                name="q15Access"
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
                                onChange={handleChange}
                                value={formData.geofencing}
                                name="geofencing"
                            >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="row w-100">
                </div>
                <div className="d-flex gap-3 justify-content-end mt-4">
                    <Button
                        label="Cancel"
                        disabled
                        onClick={() => {
                            navigate(-1)
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
                        onClick={handleSaveChanges}
                    />
                </div>
            </div>
        </div>
    )
}
export default ParticularOrgUpdate