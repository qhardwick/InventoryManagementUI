import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ItemEditForm() {

    let itemId = useParams().id;

    const [item, setItem] = useState({name: '', volume: 0});
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Fetch warehouse data from backend API
    useEffect(() => {
        fetch(`http://localhost:8080/inventory/items/${itemId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch item data');
                }
                return response.json();
            })
            .then(data => {
                setItem(data);
                setFormData(data); // Initialize formData with item data
            })
            .catch(error => {
                console.error('Error fetching item:', error);
            });
    }, [itemId]); // Run effect when itemId changes


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8080/inventory/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update item');
                }
                console.log('Item updated successfully');
                navigate('/items');
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Update Item</h1>
            <form onSubmit={handleSubmit} className='edit-form' style={{ width: '40%', fontSize: '1.2em' }}>
            <div>
                    <label>Number:</label>
                    <input
                        type="text"
                        name="Part Number"
                        value={itemId}
                        readOnly
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || item.name}
                        placeholder={item.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Volume:</label>
                    <input
                        type="number"
                        name="volume"
                        value={formData.volume || item.volume}
                        placeholder={item.volume}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className='btn-edit ' type="submit">Update</button>
                </div>
            </form>
        </div>
    );
}
