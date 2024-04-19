import { createElement, useEffect, useState } from "react"
import NewBuff from "./New/NewBuff";
import NewClass from "./New/NewClass";

export default function AddNew()
{
    const [SelectedTable, setSelectedTable] = useState("");
    const [postJSON, setPostJSON] = useState([]);
    const [postURL, setPostURL] = useState("");

    // Post the new item
    function submitPost ( event )
    {
        event.preventDefault();

        const requestOptions =
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: postJSON
        };

        console.log(requestOptions);

        fetch(postURL, requestOptions)
            .then(response => response.json());
    }

    function changeTable( event )
    {
        if ( event.target.value === "buff" )
        {
             setSelectedTable("NewBuff");
        }
        else if ( event.target.value === "class" )
        {
            setSelectedTable("NewClass");
        }
    }

    function jsonUpdate( inputJSON, URL )
    {
        setPostJSON(inputJSON);
        setPostURL(URL);
    }

    return (
        <form onSubmit={submitPost}>
            <select name="tableSelector" id="tableSelector" onChange={changeTable}>
                <option value="placeholder">Select what to add</option>
                <option value="buff">Buff</option>
                <option value="class">Class</option>
            </select>
            <br />
            {SelectedTable === "NewBuff" && <NewBuff jsonUpdate = {jsonUpdate}/>}
            {SelectedTable ==="NewClass" && <NewClass jsonUpdate = {jsonUpdate}/>}
            <br />
            <input type="submit" value="Submit" />
        </form>
    );
}