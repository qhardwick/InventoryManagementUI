import ItemTable from '../components/ItemTable';
import { useState, useEffect } from "react";

export default function Items() {

    //url for directors endpoint server
    const url = 'http://localhost:8080/inventory/items';

    //our list of Items
    const [items, setItems] = useState([])

    // Function to fetch items from the server.
    const fetchItems = () => {
        fetch(url)
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

    // Function to handle item deletion
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/inventory/items/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            console.log('Item deleted successfully');
            fetchItems(); // Re-fetch the data
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return(
        <>
            <ItemTable items={items} setItems={setItems} onDelete={handleDelete} />
        </>
    );
}