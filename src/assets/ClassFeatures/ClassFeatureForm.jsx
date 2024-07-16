import { useEffect, useState } from "react"
import ClassFeatureDropdown from "./ClassFeatureDropdown";
import ClassFeatureVariableDropdown from "./ClassFeatureVariableDropdown";
import ClassFeatureVariableEdit from "./ClassFeatureVariableEdit";

export default function ClassFeatureForm()
{
    const [totalClassFeatures, setTotalClassFeatures] = useState([]);
    const [selectedClassFeature, setSelectedClassFeature] = useState([]);
    const [selectedVar, setSelectedVar] = useState([]);

    // Read all the class features from the API
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
        if ( Object.keys(selectedVar) > 0 )
        {
            document.getElementById('valField').value = formatTextToDisplay(selectedClassFeature[selectedVar]);
        }
    }, [selectedClassFeature, selectedVar])

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

    // If the variäble selection is changed, change the selected parameter
    function changeVar ( event )
    {
        // Make sure that we're dealing with an actual buff
        if ( event.target.value != "placeholder" )
        {
            setSelectedVar ( event.target.value );
        }
    }

    function formatTextToDisplay ( input )
    {
        console.log(input)
        console.log(typeof(input))
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
        else if ( typeof(input) === "number" )
        {
            return input.toString();
        }
        else if ( typeof( input ) === "object" )
        {
            return JSON.stringify(input);
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
        console.log(event.target)

        // Iterate through all the fields of the form, ignoring the submit button.
        for ( let i = 0;
            i < event.target.length - 1;
            ++i)
        {
            console.log(event.target[i].value)    
        }
        event.preventDefault();
        const requestOptions = 
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json-patch+json'},
            body: "[" + JSON.stringify({op: "replace", path: "/" + event.target[0].value, value: formatTextToAPI(event.target.valField.value)}) + "]",
        };

        console.log(requestOptions)

        //fetch("http://localhost:8080/classFeatures/" + selectedClassFeature.classFeatureID, requestOptions).then( response => response.json());

        refreshClassFeatures();
    }


    return(
        <form onSubmit={handleSubmit}>
            <ClassFeatureDropdown totalClassFeatures={totalClassFeatures} changeClassFeature={changeClassFeature}/>
            { Object.keys(selectedClassFeature).length > 0 && 
                <ClassFeatureVariableEdit input={selectedClassFeature} />
            }
            <input type="submit" value="Submit"/>
        </form>
    )
}