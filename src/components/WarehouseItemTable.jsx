import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import AddWarehouseItemForm from './AddWarehouseItemForm';
import DeleteWarehouseItemForm from './DeleteWarehouseItemForm';

export default function WarehouseItemTable({ warehouseItems, warehouseId, setWarehouseItems }) {

    const [warehouse, setWarehouse] = useState({});
    const [remainingCapacity, setRemainingCapacity] = useState(0);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isDeletingItem, setIsDeletingItem] = useState(false);

    const updateTable = () => {
        fetch(`http://3.95.37.62:8080/inventory/warehouses/${warehouseId}/items`)
            .then(response => response.json())
            .then(data => setWarehouseItems(data))
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        updateTable();
    }, [warehouseId]);

    useEffect(() => {
        fetch(`http://3.95.37.62:8080/inventory/warehouses/${warehouseId}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message);
                    });
                }
                return response.json();
            })
            .then(data => {
                setWarehouse(data);
            })
            .catch(error => {
                if (error.message === "No warehouse exists for that ID.") {
                    // Handle the error
                    alert("No warehouse exists for that ID.");
                } else {
                    console.error('Error:', error);
                }
            });
    }, [warehouseId]);

    useEffect(() => {
        fetch(`http://3.95.37.62:8080/inventory/warehouses/${warehouseId}/items/capacity`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch remaining capacity');
                }
                return response.json();
            })
            .then(data => {
                setRemainingCapacity(data);
            })
            .catch(error => {
                console.error('Error fetching remaining capacity:', error);
            });
    }, [warehouseId, warehouseItems]);

    const handleAddItemsClick = () => {
        setIsAddingItem((prev) => !prev);
        setIsDeletingItem(false);
    };

    const handleDeleteItemsClick = () => {
        setIsDeletingItem((prev) => !prev);
        setIsAddingItem(false);
    };

    const addIncrement = (warehouseItem) => {
        fetch(`http://3.95.37.62:8080/inventory/warehouses/${warehouseId}/items?itemId=${warehouseItem.item.id}&quantity=1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message);
                });
            }
            return response.json();
        })
        .then(data => {
            // Assuming the server returns the updated item
            const updatedItems = warehouseItems.map(item => 
                item.item.id === data.item.id ? data : item
            );
            setWarehouseItems(updatedItems);
        })
        .catch(error => {
            if (error.message === "Warehouse capacity limit exceeded.") {
                // Handle the capacity limit exceeded error
                alert("Warehouse capacity limit exceeded.");
            } else {
                console.error('Error:', error);
            }
        });
    };

    const addDecrement = (warehouseItem) => {
        fetch(`http://3.95.37.62:8080/inventory/warehouses/${warehouseId}/items?itemId=${warehouseItem.item.id}&quantity=1`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to increment item quantity');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the server returns the updated item
            const updatedItems = warehouseItems.map(item => 
                item.item.id === data.item.id ? data : item
            );
            setWarehouseItems(updatedItems);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <table id='warehouse-items-table' style={{ width: '40%', fontSize: '1.2em' }}>
            <thead>
                    <tr>
                        <th colSpan={7}>{warehouse.name} ({warehouse.location})</th>
                    </tr>
                    <tr>
                        <th>Part Number</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Volume</th>
                        <th>Total Volume</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {warehouseItems.map((warehouseItem) => {
                        return (
                            <tr key={warehouseItem.id}>
                                <td>{warehouseItem.item.id}</td>
                                <td>{warehouseItem.item.name}</td>
                                <td style={{textAlign: "right"}}>{warehouseItem.quantity}</td>
                                <td style={{textAlign: "right"}}>{warehouseItem.item.volume}</td>
                                <td style={{textAlign: "right"}}>{warehouseItem.quantity * warehouseItem.item.volume}</td>
                                <td>
                                    <button onClick={() => addIncrement(warehouseItem)} className='btn-icon' style={{ color: "green" }}>
                                        <FontAwesomeIcon icon={faPlus} className="btn-icon" />
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => addDecrement(warehouseItem)} className="btn-icon" style={{ color: "red" }}>
                                        <FontAwesomeIcon icon={faMinus} className="btn-icon" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr style={{ height: "1rem" }}></tr>
                    <tr>
                        <td colSpan={4}></td>
                        <td colSpan={2}>Capacity:</td>
                        <td id='capacity' colSpan={1} style={{
                            color: remainingCapacity/warehouse.capacity <= 0.2 ? 'red' :
                                remainingCapacity/warehouse.capacity <= 0.5 ? 'orange' : 'black'
                        }}>
                            {remainingCapacity}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "-1rem" }}>
                <button style={{ backgroundColor: "green", width: "4rem", fontSize: "0.8rem"}} onClick={handleAddItemsClick} className="btn-add">
                    Add Items
                </button>
                <button style={{ backgroundColor: "red", width: "4rem", fontSize: "0.8rem"}} onClick={handleDeleteItemsClick} className="btn-add">
                    Remove Items
                </button>
            </div>
            {isAddingItem && <AddWarehouseItemForm warehouseId={warehouseId} setIsAddingItem={setIsAddingItem} updateTable={updateTable} setWarehouseItems={setWarehouseItems} />}
            {isDeletingItem && <DeleteWarehouseItemForm warehouseItems={warehouseItems} setIsDeletingItem={setIsDeletingItem} updateTable={updateTable} setWarehouseItems={setWarehouseItems} />}
        </div>
    );
}
