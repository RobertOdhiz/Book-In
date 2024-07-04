import { useState } from "react"

function Footer() {

    const [subscribtionForm, setSubscriptionForm] = useState({
        email: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSubscriptionForm((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const subscribe = (email) => {
        console.log('Email:', email)
    };

  return (
    <footer>
        <ul>
            <h5>Services</h5>
            <li>Schedule events</li>
            <li>Events</li>
        </ul>
        <ul>
            <h5>Products</h5>
            <li>Events</li>
            <li>Appointments</li>
            <li>Create New</li>
        </ul>
        <div>
            <h5>Subscribe to our Newsletter</h5>
            <input
                name='email'
                value={subscribtionForm.email}
                onChange={(e) => handleInputChange(e)}
            />
            <button htmlFor='email' onSubmit={() => subscribe(subscribtionForm.email)} >Subscribe</button>
        </div>
    </footer>
  )
}

export default Footer
