import React, { setState, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../styles/Account_Registration.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBCardTitle
} from 'mdb-react-ui-kit';


function AccountLogin() {
    const session = useSession();
    const supabase = useSupabaseClient();

    console.log('Session in AccountLogin', session);
    // /*formic forms*/
    // const formik = useFormik({
    //     initialValues: {
    //         email: '',
    //         password: ''
    //     },
    //     onSubmit: values => {
    //         axios.post('http://localhost:5000/login', {
    //             email: values.email,
    //             password: values.password
    //         }).then(response => {
    //             console.log(response.data);
    //         }).catch(error => {
    //             console.log(error);
    //         })
    //     },
    // })

    // // form validation
    // validationSchema: Yup.object({
    //     email: Yup.string()
    //         .email('Invalid email address')
    //         .required('email is required'),
    // })
    // console.log(formik.errors.email);

    return (
        <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Get <br />
                        <span style={{ color: 'hsl(131, 81%, 75%)' }}>Started</span>
                    </h1>

                    <p className='px-3' style={{ color: 'hsl(131, 81%, 85%)' }}>
                        Verify your account with google.
                    </p>

                </MDBCol>

                <MDBCol md='6' className='position-relative'>

                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>
                            <MDBInput className='mb-4' type='email' id='email' name='email' label='Email address' />
                            <MDBInput className='mb-4' type='password' id='password' name='password' label='Password' />

                            <MDBRow className='mb-4'>
                                <MDBCol className='d-flex justify-content-center'>
                                    <MDBCheckbox id='remember' name='remember' label='Remember me' defaultChecked />
                                </MDBCol>
                                <MDBCol>
                                    <a href='#!'>Forgot password?</a>
                                </MDBCol>
                            </MDBRow>

                            <MDBBtn className='w-100 mb-4' type='submit' size='md' href='/register/thank-you' onClick={() => googleSignIn(supabase)} block>
                                Sign in
                            </MDBBtn>

                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>
        </MDBContainer >
    )
}

export default AccountLogin;