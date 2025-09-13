import React from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon
} from 'mdb-react-ui-kit';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { googleSignIn } from '../services/googleServices';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Registration() {
    const supabase = useSupabaseClient();
    const session = useSession();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        }),
        onSubmit: async (values) => {
            try {
                await googleSignIn(supabase);

                if (session) {
                    const googleId = session.user.user_metadata.sub;
                    const response = await axios.post('https://localhost:5000/register', {
                        email: values.email,
                        userName: `${values.firstName} ${values.lastName}`,
                        userId: googleId
                    });
                    console.log(response.data);
                } else {
                    alert('Please login first');
                }
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    });

    return (
        <MDBContainer fluid className='p-4 background-radial-gradient min-vh-100 d-flex align-items-center position-relative'>
            <MDBRow className='justify-content-center'>
                <MDBCol md='6' className='text-center text-md-start'>
                    <h1 className='my-5 display-3 fw-bold ls-tight' style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Register An Account<br />
                        <span style={{ color: 'hsl(131, 81%, 75%)' }}>To Get Started</span>
                    </h1>
                    <p style={{ color: 'hsl(131, 81%, 85%)' }}>
                        Register now as an Event Owner on our platform and gain access to all of our features.
                    </p>
                </MDBCol>
                <MDBCol md='6' className='position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute bottom-0 start-50 translate-middle-x rounded-circle shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>
                            <form onSubmit={formik.handleSubmit}>
                                <MDBRow className='mb-4'>
                                    <MDBCol size='6'>
                                        <MDBInput wrapperClass='mb-3' label='First name' id='firstName' value={formik.values.firstName} name='firstName' onChange={formik.handleChange} type='text' />
                                    </MDBCol>
                                    <MDBCol size='6'>
                                        <MDBInput wrapperClass='mb-3' label='Last name' id='lastName' value={formik.values.lastName} name='lastName' onChange={formik.handleChange} type='text' />
                                    </MDBCol>
                                </MDBRow>
                                <MDBInput className='mb-3' type='email' id='email' name='email' label='Email address' value={formik.values.email} onChange={formik.handleChange} />
                                <MDBInput className='mb-3' type='password' id='password' name='password' label='Password' value={formik.values.password} onChange={formik.handleChange} />
                                <div className='d-flex justify-content-center mb-3'>
                                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' />
                                </div>
                                <MDBBtn className='w-100 mb-3' href='/register/thank-you' type='submit' size='md'>
                                    Continue
                                </MDBBtn>
                                <div className='text-center'>
                                    <p>or</p>
                                    <MDBBtn tag='a' color='green' className='my-2 w-100 border' style={{ backgroundColor: 'transparent', color: 'green', border: 'green' }} onClick={() => googleSignIn(supabase)}>
                                        <MDBIcon fab icon='google' size='sm' className='me-2' />
                                        Sign Up with Google
                                    </MDBBtn>
                                </div>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Registration;
