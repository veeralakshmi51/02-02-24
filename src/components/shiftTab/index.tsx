import React, { useEffect, useState } from 'react'
import './shifttab.css'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { getPSConfigByDate } from '../../slices/thunk'
interface ShiftTabProps {
    shiftName: string
    date: any
    startTime: string
    endTime: string
    slot1Time: any
    slot2Time: any
    slot3Time: any
    slot4Time: any
    selectedIncharge: string
    selectedSWorker1: string
    selectedSWorker2: string
    selectedSWorker3: string
    selectedSWorker4: string
    selectedSWorker5: string
    selectedSWorker6: string
    selectedSWorker7: string
    selectedSWorker8: string
}

const ShiftTab = (props: ShiftTabProps) => {
    const { shiftName, date, endTime, startTime, slot1Time, slot2Time, slot3Time, slot4Time, selectedIncharge, selectedSWorker1, selectedSWorker2, selectedSWorker3, selectedSWorker4, selectedSWorker5, selectedSWorker6, selectedSWorker7, selectedSWorker8 } = props
    const { rnInchargeList, socialWorkerList } = useSelector((state: any) => state.PSConfig)
    const dispatch = useDispatch();
    
    const [isPartial, setIsPartial] = useState<boolean>(false)
    const [isPartial2, setIsPartial2] = useState<boolean>(false)
    const [isPartial3, setIsPartial3] = useState<boolean>(false)
    const [isPartial4, setIsPartial4] = useState<boolean>(false)
    
    const [incharge, setIncharge] = useState<any>(selectedIncharge)
    const [slot1Staff1, setSlot1Staff1] = useState<any>(selectedSWorker1)
    const [slot1Staff2, setSlot1Staff2] = useState<any>(selectedSWorker5)
    const [slot2Staff1, setSlot2Staff1] = useState<any>(selectedSWorker2)
    const [slot2Staff2, setSlot2Staff2] = useState<any>(selectedSWorker6)
    const [slot3Staff1, setSlot3Staff1] = useState<any>(selectedSWorker3)
    const [slot3Staff2, setSlot3Staff2] = useState<any>(selectedSWorker7)
    const [slot4Staff1, setSlot4Staff1] = useState<any>(selectedSWorker4)
    const [slot4Staff2, setSlot4Staff2] = useState<any>(selectedSWorker8)

    const date1 = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const forDate = `${year}${month}${date1}`

    const bodyA = {
        date:forDate,shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot1Time,staff1:slot1Staff1,staff2:slot1Staff2},{time:slot2Time,staff1:slot2Staff1,staff2:slot2Staff2},{time:slot3Time,staff1:slot3Staff1,staff2:slot3Staff2},{time:slot4Time,staff1:slot4Staff1,staff2:slot4Staff2}]}]}
    const bodyB = {
        date:forDate,shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot2Time,staff1:slot1Staff1,staff2:slot1Staff2},{time:slot2Time,staff1:slot2Staff1,staff2:slot2Staff2},{time:slot3Time,staff1:slot3Staff1,staff2:slot3Staff2},{time:slot4Time,staff1:slot4Staff1,staff2:slot4Staff2}]}]}
    const bodyC = {
        date:forDate,shift :[{shiftName,rnIncharge:incharge,startTime,endTime,schedule:[{time:slot3Time,staff1:slot1Staff1,staff2:slot1Staff2},{time:slot2Time,staff1:slot2Staff1,staff2:slot2Staff2},{time:slot3Time,staff1:slot3Staff1,staff2:slot3Staff2},{time:slot4Time,staff1:slot4Staff1,staff2:slot4Staff2}]}]}
    // const bodyD = {
    //     date,shift :[{shiftName,rnIncharge:selectedIncharge,startTime,endTime}],schedule:[{time:slot1Time,staff1:slot4Staff1,staff2:slot4Staff2}]
    // }
    const baseURL = 'http://47.32.254.89:7000/api'
    const successCode = 'MHC - 0200'
const handleSubmit = async() => {
        try {
            let bodyData;
            if (!incharge || !slot1Staff1 || !slot2Staff1 || !slot3Staff1 || !slot4Staff1) {
                toast.error('Please fill in all required fields');
                return;
            }
            if(shiftName === "Shift-A"){bodyData = { ...bodyA };} else if(shiftName === "Shift-B")bodyData = { ...bodyB };else bodyData = { ...bodyC };
            
            const response = await axios.post(`${baseURL}/PSConfig/register`, bodyData);
    
            // console.log("SecretKey response:", response);
            // console.log("Date: ",forDate)
    
            if (response.data.message.code === successCode) {
                toast.success(response.data.message.description)
                
            } else {
                toast.error("Login failed: " + response.data.message.description);
            }
        } catch (error) {
            // console.log("Date: ",forDate)
            // console.error("Error during Register:", error);
            toast.error("An error occurred during register.");
        }
}
const handleCancel = () => {
    setIncharge(selectedIncharge);
    setSlot1Staff1(selectedSWorker1);
    setSlot1Staff2(selectedSWorker5);
    setSlot2Staff1(selectedSWorker2);
    setSlot2Staff2(selectedSWorker6);
    setSlot3Staff1(selectedSWorker3);
    setSlot3Staff2(selectedSWorker7);
    setSlot4Staff1(selectedSWorker4);
    setSlot4Staff2(selectedSWorker8);
    // getPSConfigByDate(dispatch, forDate)
}
useEffect(() => {
    
    getPSConfigByDate(dispatch, forDate)
}, [dispatch])

useEffect(() => {
    // Update state with the selected values once they are available
    setIncharge(selectedIncharge);
    setSlot1Staff1(selectedSWorker1);
    setSlot1Staff2(selectedSWorker5);
    setSlot2Staff1(selectedSWorker2);
    setSlot2Staff2(selectedSWorker6);
    setSlot3Staff1(selectedSWorker3);
    setSlot3Staff2(selectedSWorker7);
    setSlot4Staff1(selectedSWorker4);
    setSlot4Staff2(selectedSWorker8);
}, [selectedIncharge, selectedSWorker1, selectedSWorker2, selectedSWorker3, selectedSWorker4, selectedSWorker5, selectedSWorker6, selectedSWorker7, selectedSWorker8]);

    // useEffect(() => {
    // setSlot1Staff1(selectedSWorker1)
    // setSlot1Staff2(selectedSWorker2)
    // }, [selectedSWorker1,selectedSWorker2])
    return (
        <React.Fragment>
            <div className="p-3">
                <div className="d-flex justify-content-center align-items-center rounded p-1" style={{ backgroundColor: '#0f3995' }}>
                    <span className='text-white'>{shiftName} Configuration</span>
                </div>
                <div className='row mt-1 p-1'>
                    <div className="form-floating mb-3 col-md-3 p-1" >
                        <input type="text" value={startTime} className="form-control" id="floatingStartTime" disabled placeholder='start time' />
                        <label htmlFor="floatingStartTime">Start Time</label>
                    </div>
                    <div className="form-floating mb-3 col-md-3 p-1">
                        <input type="text" value={endTime} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                        <label htmlFor="floatingEndTime">End Time</label>
                    </div>
                    <div className="mb-3 col-md-6 form-floating p-1">
                        <select className="form-select" id="floatingSelect" onChange={ (e:any) => setIncharge(e.target.value) } value={incharge ? incharge : ""}>
                        <option value="">Select RN Incharge</option>
                            {
                                rnInchargeList?.map((item: any) => {
                                    return (
                                        <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                    )
                                })
                            }
                        </select>
                        <label htmlFor='floatingSelect'>Shift Incharge</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 p-1" style={{ backgroundColor: '#e6f0ff' }}>
                        <div className="row p-1">
                            <div className="form-floating mb-3 col-md-4 p-1">
                                <input type="text" value={slot1Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 1</label>
                            </div>
                            <div className="mb-3 col-md-7 form-floating p-1">
                                <select className="form-select" id="floatingSelect" onChange={ (e:any) => setSlot1Staff1(e.target.value) } value={ slot1Staff1 ? slot1Staff1 :  "" }>
                                <option value="">Select Social Worker</option>
                                    {
                                        socialWorkerList?.map((item: any) => {
                                            return (
                                                <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                            )
                                        })
                                    }
                                </select>
                                <label htmlFor='floatingSelect'>Social Workers</label>
                            </div>
                        </div>
                        <div className="row p-1">
                            <div className="form-check col-md-4 d-flex gap-2 justify-content-center align-items-center">
                                <input className="form-check-input" type="checkbox" id="flexCheckDefault1" onChange={() => { setIsPartial(!isPartial) }} />
                                <label className="form-check-label" htmlFor="flexCheckDefault1">
                                    Partial Room
                                </label>
                            </div>
                            {isPartial &&
                                <div className="mb-3 col-md-7 form-floating p-1">
                                    <select className="form-select" id="floatingSelect2" onChange={ (e:any) => setSlot1Staff2(e.target.value) } value={slot1Staff2 ? slot1Staff2 : ""}>
                                    <option value="">Select Social Worker</option>
                                        {
                                            socialWorkerList?.map((item: any) => {
                                                return (
                                                    <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <label htmlFor='floatingSelect2'>Social Workers</label>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-md-6 p-1" style={{ backgroundColor: '#e6f0ff' }}>
                        <div className="row p-1">
                            <div className="form-floating mb-3 col-md-4 p-1">
                                <input type="text" value={slot2Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 2</label>
                            </div>
                            <div className="mb-3 col-md-7 form-floating p-1">
                                <select className="form-select" id="floatingSelect3" onChange={ (e:any) => setSlot2Staff1(e.target.value) } value={slot2Staff1 ? slot2Staff1 : ""}>
                                <option value="">Select Social Worker</option>
                                    {
                                        socialWorkerList?.map((item: any) => {
                                            return (
                                                <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                            )
                                        })
                                    }
                                </select>
                                <label htmlFor='floatingSelect3'>Social Workers</label>
                            </div>
                        </div>
                        <div className="row p-1">
                            <div className="form-check col-md-4 d-flex gap-2 justify-content-center align-items-center">
                                <input className="form-check-input" type="checkbox" id="flexCheckDefault2" onChange={() => { setIsPartial2(!isPartial2) }} />
                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                    Partial Room
                                </label>
                            </div>
                            {isPartial2 &&
                                <div className="mb-3 col-md-7 form-floating p-1">
                                    <select className="form-select" id="floatingSelect4" onChange={ (e:any) => setSlot2Staff2(e.target.value) } value={slot2Staff2 ? slot2Staff2 : ""}>
                                    <option value="">Select Social Worker</option>
                                        {
                                            socialWorkerList?.map((item: any) => {
                                                return (
                                                    <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <label htmlFor='floatingSelect4'>Social Workers</label>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6 p-1" style={{ backgroundColor: '#e6f0ff' }}>
                        <div className="row p-1">
                            <div className="form-floating mb-3 col-md-4 p-1">
                                <input type="text" value={slot3Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 3</label>
                            </div>
                            <div className="mb-3 col-md-7 form-floating p-1">
                                <select className="form-select" id="floatingSelect5" onChange={ (e:any) => setSlot3Staff1(e.target.value) } value={slot3Staff1 ? slot3Staff1 : ""}>
                                <option value="">Select Social Worker</option>
                                    {
                                        socialWorkerList?.map((item: any) => {
                                            return (
                                                <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                                
                                            )
                                        })
                                    }
                                </select>
                                <label htmlFor='floatingSelect5'>Social Workers</label>
                            </div>
                        </div>
                        <div className="row p-1">
                            <div className="form-check col-md-4 d-flex gap-2 justify-content-center align-items-center">
                                <input className="form-check-input" type="checkbox" id="flexCheckDefault3" onChange={() => { setIsPartial3(!isPartial3) }} />
                                <label className="form-check-label" htmlFor="flexCheckDefault3">
                                    Partial Room
                                </label>
                            </div>
                            {isPartial3 &&
                                <div className="mb-3 col-md-7 form-floating p-1">
                                    <select className="form-select" id="floatingSelect6" onChange={ (e:any) => setSlot3Staff2(e.target.value) } value={slot3Staff2 ? slot3Staff2 : ""}>
                                    <option value="">Select Social Worker</option>
                                        {
                                            socialWorkerList?.map((item: any) => {
                                                return (
                                                    <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <label htmlFor='floatingSelect6'>Social Workers</label>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-md-6 p-1" style={{ backgroundColor: '#e6f0ff' }}>
                        <div className="row p-1">
                            <div className="form-floating mb-3 col-md-4 p-1">
                                <input type="text" value={slot4Time} className="form-control" id="floatingEndTime" disabled placeholder='end time' />
                                <label htmlFor="floatingEndTime">Slot 4</label>
                            </div>
                            <div className="mb-3 col-md-7 form-floating p-1">
                                <select className="form-select" id="floatingSelect7" onChange={ (e:any) => setSlot4Staff1(e.target.value) } value={slot4Staff1 ? slot4Staff1 : ""}>
                                <option value="">Select Social Worker</option>
                                    {
                                        socialWorkerList?.map((item: any) => {
                                            return (
                                                <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                            )
                                        })
                                    }
                                </select>
                                <label htmlFor='floatingSelect7'>Social Workers</label>
                            </div>
                        </div>
                        <div className="row p-1">
                            <div className="form-check col-md-4 d-flex gap-2 justify-content-center align-items-center">
                                <input className="form-check-input" type="checkbox" id="flexCheckDefault4" onChange={() => { setIsPartial4(!isPartial4) }} />
                                <label className="form-check-label" htmlFor="flexCheckDefault4">
                                    Partial Room
                                </label>
                            </div>
                            {isPartial4 &&
                                <div className="mb-3 col-md-7 form-floating p-1">
                                    <select className="form-select" id="floatingSelect8" onChange={ (e:any) => setSlot4Staff2(e.target.value) } value={slot4Staff2 ? slot4Staff2 : ""}>
                                    <option value="">Select Social Worker</option>
                                        {
                                            socialWorkerList?.map((item: any) => {
                                                return (
                                                    <option value={item?.id}>{item?.name[0]?.given + ' ' + item?.name[0]?.family}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <label htmlFor='floatingSelect8'>Social Workers</label>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-3 justify-content-end mt-4">
                <button onClick={ handleCancel } className="btn-save float-end mt-3">
                    Clear
                </button>
                <button onClick={ handleSubmit } className="btn-save float-end mt-3">
                    Save
                </button>
            </div>
            </div>

        </React.Fragment>
    )
}

export default ShiftTab