import React, {useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

export default function AddWarehouseItemForm({warehouseItems, setIsDeletingItem, updateTable}) {
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (itemId, quantity) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [itemId]: quantity,
        }));
    };

    const handleSubmit = (itemId) => (event) => {
        event.preventDefault();
        const itemQuantity = quantities[itemId];
        if (itemQuantity) {
            console.log(warehouseItems)
            fetch(`http://localhost:8080/inventory/warehouses/${warehouseItems[0].warehouse.id}/items?itemId=${itemId}&quantity=${itemQuantity}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message);
                    });
                }
                return response.json();
            })
            .then(() => {
                setIsDeletingItem(false);
                updateTable();
            })
            .catch(error => {
                if (error.message === "Cannot remove more items than are present.") {
                    // Handle the capacity limit exceeded error
                    alert("Cannot remove more items than are present.");
                } else {
                    console.error('Error:', error);
                }
            });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit}>
                <table className="table table-striped table-bordered table-hover" style={{ width: '40%', fontSize: '1.2em' }}>
                    <thead>
                        <tr>
                            <th colSpan={6}>Items</th>
                        </tr>
                        <tr>
                            <th style={{ width:'10%' }}>Part Number</th>
                            <th>Name</th>
                            <th>Volume</th>
                            <th>Quantity</th>
                            <th>Remove</th>
                            <th colSpan={2} style={{ width: '2%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {warehouseItems.map((warehouseItem) => {
                            return (
                                <tr key={warehouseItem.item.id}>
                                    <td>{warehouseItem.item.id}</td>
                                    <td>{warehouseItem.item.name}</td>
                                    <td>{warehouseItem.item.volume}</td>
                                    <td>{warehouseItem.quantity}</td>
                                    <td>
                                        <input type="number" value={quantities[warehouseItem.item.id] || ''} onChange={(event) => handleQuantityChange(warehouseItem.item.id, event.target.value)} />
                                    </td>
                                    <td>
                                    <button className='btn-icon' onClick={handleSubmit(warehouseItem.item.id)}>
                                        <FontAwesomeIcon icon={faMinus} className="btn-icon" />
                                    </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </form>
        </div>
    );
}