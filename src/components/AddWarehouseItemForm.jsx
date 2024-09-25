import React, {useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddWarehouseItemForm({warehouseId, setIsAddingItem, updateTable}) {

    //url for directors endpoint server
    const itemsUrl = 'http://3.95.37.62:8080/inventory/items';

    //our list of Items
    const [items, setItems] = useState([])

    // Function to fetch items from the server.
    const fetchItems = () => {
        fetch(itemsUrl)
        .then(data => data.json())
        .then(returnedItems => {
            setItems(returnedItems);
        })
        .catch(error => console.error(error));
    };

    // On component load, fetch the items from the server
    useEffect(() => {
        fetchItems();
    }, []);

    const [selectedItemId, setSelectedItemId] = useState(items && items.length > 0 ? items[0].id : null);
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
            fetch(`http://3.95.37.62:8080/inventory/warehouses/${warehouseId}/items?itemId=${itemId}&quantity=${itemQuantity}`, {
                method: 'POST',
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
                setIsAddingItem(false);
                updateTable();
            })
            .catch(error => {
                if (error.message === "Warehouse capacity limit exceeded.") {
                    // Handle the capacity limit exceeded error
                    alert("Warehouse capacity limit exceeded.");
                } else {
                    console.error('Error:', error);
                }
            });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit}>
                <table style={{ width: '40%', fontSize: '1.2em' }}>
                    <thead>
                        <tr>
                            <th colSpan={5}>Items</th>
                        </tr>
                        <tr>
                            <th style={{ width:'10%' }}>Part Number</th>
                            <th>Name</th>
                            <th>Volume</th>
                            <th>Quantity</th>
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
                                        <input type="number" value={quantities[item.id] || ''} onChange={(event) => handleQuantityChange(item.id, event.target.value)} />
                                    </td>
                                    <td>
                                    <button className='btn-icon' onClick={handleSubmit(item.id)}>
                                        <FontAwesomeIcon icon={faPlus} className="btn-icon" />
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