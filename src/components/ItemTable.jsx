import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ItemTable({ items, setItems, onDelete }) {
    const [newItem, setNewItem] = useState(false);

    const initialFormData = {
        name: '',
        volume: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleCreateNewItem = () => {
        setNewItem(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://3.95.37.62:8080/inventory/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add item');
                }
                return response.json();
            })
            .then(data => {
                // Update items
                setItems(prevItems => [...prevItems, data]);
                // Reset form
                setFormData(initialFormData);
                // Hide the form
                setNewItem(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <table className="table table-striped table-bordered table-hover" style={{ width: '40%', fontSize: '1.2em' }}>
                <thead>
                <tr>
                    <th colSpan={5}>Items</th>
                </tr>
                <tr>
                    <th style={{ width:'10%' }}>Part Number</th>
                    <th>Name</th>
                    <th>Volume</th>
                    <th colSpan={2} style={{ width: '2%' }}>Actions</th>
                </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                {items.map((item) => {
                    return (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.volume}</td>
                            <td>
                                <Link to={`/items/${item.id}`}>
                                    <FontAwesomeIcon icon={faEdit} className="btn-icon" />
                                </Link>
                            </td>
                            <td>
                                <button onClick={() => onDelete(item.id)} className="btn-icon">
                                    <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                                </button>
                            </td>
                        </tr>
                    );
                })}
                {newItem && (
                    <tr key="new">
                        <td colSpan={5}>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="volume"
                                    placeholder="Volume"
                                    value={formData.volume}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <button onClick={handleCreateNewItem} className="btn-add">
                <FontAwesomeIcon icon={faPlus} /> Add Item
            </button>
        </div>
    );
}
