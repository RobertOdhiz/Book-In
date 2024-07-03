import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBTypography,
    MDBCheckbox
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function ThankYouPage() {
    const session = useSession();
    console.log(session ? `Session in ThankYouPage ${session.user.email}` : 'No session');

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            organization: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            organization: Yup.string().required('Organization is required'),
        }),
        onSubmit: async (values) => {
            if (!session?.user?.user_metadata?.sub || !session?.user?.email) {
                alert('Please Set up your account first');
                window.location.href = '/login';
                return <></>;
            }

            const { user_metadata: { sub: userId }, email } = session.user;
            const { firstName, lastName, organization } = values;
            const userData = {
                email: email || '',
                userName: `${firstName} ${lastName}`,
                userId: userId || '',
                organization: organization,
            }
            console.log(userData);

            await axios.post('http://127.0.0.1:5000/register', userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    console.log(response.data);
                    alert('Registration successful');
                    window.location.href = '/';
                }).catch((error) => {
                    console.error('Registration error:', error.name);
                    alert('Registration failed');
                });
        },
    });

    return (
        <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='6' className='mx-auto position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass '>
                        <MDBCardBody className='p-5 '>
                            <MDBTypography tag="h2" className='fw-bold mb-4 text-center'>Thanks for signing up!</MDBTypography>
                            <MDBTypography tag="h5" className=' mb-3 text-center'>Fill in the form to proceed.</MDBTypography>
                            <form onSubmit={formik.handleSubmit}>
                                <MDBRow>
                                    <MDBCol col='6'>
                                        <MDBInput wrapperClass='mb-4' label='First name' id='firstName' value={formik.values.firstName} name='firstName' onChange={formik.handleChange} type='text' />
                                    </MDBCol>

                                    <MDBCol col='6'>
                                        <MDBInput wrapperClass='mb-4' label='Last name' id='lastName' value={formik.values.lastName} name='lastName' onChange={formik.handleChange} type='text' />
                                    </MDBCol>
                                </MDBRow>
                                <MDBInput wrapperClass='mb-4' label='Organization' id='organization' value={formik.values.organization} name='organization' onChange={formik.handleChange} type='text' />
                                <div className='d-flex justify-content-center mb-4'>
                                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' />
                                </div>

                                <MDBBtn className='w-100 mb-4' type='submit' size='md'>Submit</MDBBtn>

                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default ThankYouPage;

