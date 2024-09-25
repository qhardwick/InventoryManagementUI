import WarehouseItemTable from '../components/WarehouseItemTable';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

export default function WarehousesItems() {

    let warehouseId = useParams().id;

    //url for directors endpoint server
    const url = `http://3.95.37.62:8080/inventory/warehouses/${warehouseId}/items`;

    //our list of Warehouses
    const [warehouseItems, setWarehouseItems] = useState([])

    // Function to fetch warehouses from the server.
    const fetchWarehouseItems = () => {
        fetch(url)
        .then(data => data.json())
        .then(returnedWarehouseItems => {
            setWarehouseItems(returnedWarehouseItems);
        })
        .catch(error => console.error(error));
    };

    // On component load, fetch the warehouse items from the server
    useEffect(() => {
        fetchWarehouseItems();
    }, []);

    return(
        <>
            <WarehouseItemTable warehouseItems={warehouseItems} warehouseId={warehouseId} setWarehouseItems={setWarehouseItems} />
        </>
    );
}