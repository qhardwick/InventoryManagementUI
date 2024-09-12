import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function WarehouseEditForm() {

    let warehouseId = useParams().id;

    const [warehouse, setWarehouse] = useState({name: '', location: '', capacity: 0});
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Fetch warehouse data from backend API
    useEffect(() => {
        fetch(`http://localhost:8080/inventory/warehouses/${warehouseId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch warehouse data');
                }
                return response.json();
            })
            .then(data => {
                setWarehouse(data);
                setFormData(data); // Initialize formData with warehouse data
            })
            .catch(error => {
                console.error('Error fetching warehouse:', error);
            });
    }, [warehouseId]); // Run effect when warehouseId changes


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8080/inventory/warehouses/${warehouseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update warehouse');
                }
                console.log('Warehouse updated successfully');
                navigate('/warehouses');
            })
            .catch(error => {
                console.error('Error updating warehouse:', error);
            });
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Update Warehouse</h1>
            <form onSubmit={handleSubmit} className='edit-form' style={{ width: '40%', fontSize: '1.2em' }}>
            <div>
                    <label>Number:</label>
                    <input
                        type="text"
                        name="Warehouse Id"
                        value={warehouseId}
                        readOnly
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || warehouse.name}
                        placeholder={warehouse.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location || warehouse.location}
                        placeholder={warehouse.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Capacity:</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity || warehouse.capacity}
                        placeholder={warehouse.capacity}
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
