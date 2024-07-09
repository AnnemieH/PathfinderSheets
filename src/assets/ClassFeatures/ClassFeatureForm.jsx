import { useEffect, useState } from "react"

export default function ClassFeatureForm()
{
    const [totalClassFeatures, setTotalClassFeatures] = useState([]);
    const [selectedClassFeature, setSelectedClassFeature] = useState([]);
    const [selectedParam, setSelectedParam] = useState([]);

    // Read all the buffs from the API
    useEffect(() =>
    {
    refreshClassFeatures();
    }, []
    );

    function refreshClassFeatures ()
    {
        // Make sure buffs are set to empty
        setTotalClassFeatures([]);

        const url = "http://localhost:8080/classFeatures/all";
        fetch( url )
        .then( res => res.json())
        .then (data => setTotalClassFeatures( data ));
    }

    // Change valField whenever selectedClassFeature or selectedParam change
    useEffect(() => {
        document.getElementById('valField').value = formatTextToDisplay(selectedClassFeature[selectedParam]);
    }, [selectedClassFeature, selectedParam])

    // If the class feature selection is changed, change the selected buff
    function changeClassFeature ( event )
    {
        // Make sure that we're dealing with an actual buff
        if ( event.target.value != "placeholder" )
        {
            const classFeature = totalClassFeatures.find((elem) => elem.classFeatureID == event.target.value);
            setSelectedClassFeature(classFeature);
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
            body: "[" + JSON.stringify({op: "replace", path: "/" + event.target.classFeature.value, value: formatTextToAPI(event.target.valField.value)}) + "]",
        };

        console.log(requestOptions)

        fetch("http://localhost:8080/classFeatures/" + selectedClassFeature.classFeatureID, requestOptions).then( response => response.json());

        refreshClassFeatures();
    }


    return(
        <form onSubmit={handleSubmit}>
            <select name="allClassFeatures" id="allClassFeatures" onChange={changeClassFeature}>
                <option value="placeholder">Choose class feature</option>
                {totalClassFeatures.map(classFeature => (
                    <option key={classFeature.classFeatureID} value={classFeature.classFeatureID}>{classFeature.name}</option>
            ))}
            </select>
            <select name="classFeature" id="classFeature" onChange={changeParam}>
                <option value="placeholder">Choose parameter</option>
                {Object.keys(selectedClassFeature).map( key => (
                    <option key={key} value={key}> {key}</option>
                ))}
            </select>
            <textarea name="valField" id="valField" rows="15" cols="75" defaultValue={ formatTextToDisplay(selectedClassFeature[selectedParam])} />
            <input type="submit" value="Submit"/>
        </form>
    )
}