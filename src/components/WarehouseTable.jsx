import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function WarehouseTable({ warehouseData, onDelete }) {
    const [newWarehouse, setNewWarehouse] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        volume: ''
    });

    const handleCreateNewWarehouse = () => {
        setNewWarehouse({});
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        fetch('http://localhost:8080/inventory/warehouses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add warehouse');
            }
            return response.json();
        })
        .then(data => {
            // Update warehouses
            setWarehouses(prevWarehouses => [...prevWarehouses, data]);
            // Reset form
            setFormData(initialFormData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <table style={{ width: '40%', fontSize: '1.2em' }}>
            <thead>
                    <tr>
                        <th colSpan={7}>Warehouses</th>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th colSpan={3}>Actions</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {warehouseData.map((warehouse) => {
                        return (
                            <tr key={warehouse.id}>
                                <td>{warehouse.id}</td>
                                <td>{warehouse.name}</td>
                                <td>{warehouse.location}</td>
                                <td>{warehouse.capacity}</td>
                                <td>
                                    <Link to={`/warehouses/${warehouse.id}/items`}>
                                        <FontAwesomeIcon icon={faSearch} className="text-primary" />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/warehouses/${warehouse.id}`}>
                                        <FontAwesomeIcon icon={faEdit} className="btn-icon" />
                                    </Link>
                                </td>
                                <td>
                                    <button id={`delete-${warehouse.name}`} onClick={() => onDelete(warehouse.id)} className="btn-icon">
                                        <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {newWarehouse && (
                        <tr key="new">
                            <td colSpan={7}>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
                                    <input type="text" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleInputChange} />
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={handleCreateNewWarehouse} className="btn-add">
                <FontAwesomeIcon icon={faPlus} /> Add Warehouse
            </button>
        </div>
    );
}
