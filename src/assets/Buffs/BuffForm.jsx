import { useEffect, useState } from "react"

export default function BuffForm()
{
    const [totalBuffs, setTotalBuffs] = useState([]);
    const [selectedBuff, setSelectedBuff] = useState([]);
    const [selectedParam, setSelectedParam] = useState([]);

    // Read all the buffs from the API
    useEffect(() =>
    {
    refreshBuffs();
    }, []
    );

    function refreshBuffs ()
    {
        // Make sure buffs are set to empty
        setTotalBuffs([]);

        const url = "http://localhost:8080/buff/allBuffs";
        fetch( url )
        .then( res => res.json())
        .then (data => setTotalBuffs( data ));
    }

    // Change valField whenever selectedBuff or selectedParam change
    useEffect(() => {
        document.getElementById('valField').value = formatTextToDisplay(selectedBuff[selectedParam]);
    }, [selectedBuff, selectedParam])

    // If the buff selection is changed, change the selected buff
    function changeBuff ( event )
    {
        // Make sure that we're dealing with an actual buff
        if ( event.target.value != "placeholder" )
        {
            buff = totalBuffs.find((elem) => elem.buffID == event.target.value);
            setSelectedBuff(buff);
        }
    }

    // If the parameter selection is changed, change the selected parameter
    function changeParam ( event )
    {
        // Make sure that we're dealing with an actual buff
        if ( event.target.value != "placeholder" )
        {
            setSelectedParam ( event.target.value );
        }
    }

    function formatTextToDisplay ( input )
    {
        // If input is null, return an empty string
        if ( typeof(input) === "undefined" )
        {
            return "";
        }
        // If input is a string, return it
        if ( typeof(input) === "string" )
        {
            return input;
        }

        // If input is an array, concatenate it with line breaks, then return it
        if ( Array.isArray( input ) )
        {
            let output = "";

            // For every fragment in input, remove leading/trailing whitespace, append it to output and add two newlines
            input.map(str => {
                output += str.trim() + "\n\n";
            })

            // Remove the trailing whitespace from output and return it
            return output.trim();
        }
    }

    function formatTextToAPI ( input )
    {
        // If input is an array, return it
        if ( Array.isArray( input ))
        {
            return input;
        }

        // If input is a string, split it at newline characters and return that array
        if ( typeof( input ) === "string" )
        {
            return input.split("\n");
        }
    }

    function handleSubmit ( event )
    {
        event.preventDefault();
        const requestOptions = 
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json-patch+json'},
            body: "[" + JSON.stringify({op: "replace", path: "/" + event.target.buff.value, value: formatTextToAPI(event.target.valField.value)}) + "]",
        };

        console.log(requestOptions)

        fetch("http://localhost:8080/buff/" + selectedBuff.buffID, requestOptions).then( response => response.json());

        refreshBuffs();
    }


    return(
        <form onSubmit={handleSubmit}>
            <select name="allBuffs" id="allBuffs" onChange={changeBuff}>
                <option value="placeholder">Choose buff</option>
                {totalBuffs.map(buff => (
                    <option key={buff.buffID} value={buff.buffID}>{buff.buffName}</option>
            ))}
            </select>
            <select name="buff" id="buff" onChange={changeParam}>
                <option value="placeholder">Choose parameter</option>
                {Object.keys(selectedBuff).map( key => (
                    <option key={key} value={key}> {key}</option>
                ))}
            </select>
            <textarea name="valField" id="valField" rows="15" cols="75" defaultValue={ formatTextToDisplay(selectedBuff[selectedParam])} />
            <input type="submit" value="Submit"/>
        </form>
    )
}