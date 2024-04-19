import { useEffect, useState } from "react"
import { formatTextToAPI } from "../../Formatting/Formatting";

export default function NewBuff( props )
{
    const [buffTypes, setBuffTypes] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [buffType, setBuffType] = useState({});
    const [postJSON, setPostJSON] = useState({});
    const URL = "http://localhost:8080/buff/allBuffs"

    useEffect(() => {
        const url = "http://localhost:8080/buffType/allBuffTypes";

        fetch(url)
        .then( res => res.json())
        .then( data => setBuffTypes(data));
    }, []);


    // If any JSON fields change, update the JSON
    useEffect(() => {
        updateJSON();
    }, [name, description, buffType]);

    // If the JSON changes, propagate that change upwards
    useEffect(() => {
        props.jsonUpdate(postJSON, URL);
    }, [postJSON]);

    function nameChange ( event )
    {
        setName(event.target.value);
    }

    function descriptionChange (event)
    {
        setDescription(event.target.value);
    }

    function buffTypeChange (event)
    {
        const currType = buffTypes.find( (type) => type.buffTypeID == event.target.value );
        setBuffType(currType);
    }

    function updateJSON()
    {
        setPostJSON(
            JSON.stringify({buffName: name, buffDesc: formatTextToAPI(description), buffType: buffType})
        );
    }

    return (
        <>
            <label htmlFor="buffName">Name of buff: </label>
            <input type="text" id="buffName" name="buffName" onChange={nameChange}/>
            <br />
            <label htmlFor="buffDescription">Description: </label>
            <textarea id="buffDescription" name="buffDescription"  rows="15" cols="75" onChange={descriptionChange}/>
            <br />
            <select name="buffTypes" id="buffTypes" onChange={buffTypeChange}>
                <option value="placeholder">Select buff type</option>
                {buffTypes.map(type => (
                    <option key={type.buffTypeID} value={type.buffTypeID}>{type.typeName}</option>
                ))}
            </select>
        </>
    )
}