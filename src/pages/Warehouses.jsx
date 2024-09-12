import WarehouseTable from '../components/WarehouseTable';
import { useState, useEffect } from "react";

export default function Warehouses() {

    //url for directors endpoint server
    const url = 'http://localhost:8080/inventory/warehouses';

    //our list of Warehouses
    const [warehouses, setWarehouses] = useState([])

    // Function to fetch warehouses from the server.
    const fetchWarehouses = () => {
        fetch(url)
        .then(data => data.json())
        .then(returnedWarehouses => {
            setWarehouses(returnedWarehouses);
        })
        .catch(error => console.error(error));
    };

    // On component load, fetch the warehouses from the server
    useEffect(() => {
        fetchWarehouses();
    }, []); 

    // Function to handle warehouse deletion
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/inventory/warehouses/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete warehouse');
            }
            console.log('Warehouse deleted successfully');
            fetchWarehouses(); // Re-fetch the data
        } catch (error) {
            console.error('Error deleting warehouse:', error);
        }
    };

    return(
        <>
            <WarehouseTable warehouseData={warehouses} onDelete={handleDelete} />
        </>
    );
}