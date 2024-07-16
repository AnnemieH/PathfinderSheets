// Return a different way of editing different variable types

import { useEffect, useState } from "react";
import API_URL from "../Generic/URL";
import findID, { findName } from "../Generic/APIFunctions";
import ClassFeatureVariableEditListItem from "./ClassFeatureVariableEditListItem";

// PROPS
// input - The value of the variäble we've chosen

export default function ClassFeatureVariableEdit ( props )
{
    const [value, setValue] = useState ("");

    const [selectedKey, setSelectedKey] = useState ("");
    const [editable, setEditable] = useState ( true );

    const [valueArray, setValueArray] = useState ([]);

    useEffect( () => {
        setValue(props.input);
    }, [props.input])

    // If value changes, make sure that valField stays NEED TO CHANGE THIS
    useEffect ( () => {
        if ( value !== "" && (typeof(value) !== "object" || Array.isArray(value)) )
        {
            //document.getElementById('valField').value = formatTextToDisplay(value);
        }
    }, [value])

    useEffect ( () => {
        if ( selectedKey !== "" )
        {
            if ( value.metadata !== undefined )
            {
                setEditable ( value.metadata.writable);
            }
        }
    }, [selectedKey])

    // Once a key has been given, calculate what the next value should be.
    // This will usuälly be value[key].
    function nextValue (key)
    {
        // The next value should be value[selectedKey] UNLESS that is a triviäl join table containing an id object and a non-id object
        const trivialNextValue = value[key];

        if ( Object.keys(trivialNextValue).length === 2  && typeof(trivialNextValue.id) === "object" )
        {
            return trivialNextValue[
                Object.keys(trivialNextValue).find( key => key !== "id" )
            ]
        }
        else
        {
            return trivialNextValue;
        }
    }

    function isStringArray ( input )
    {
        if ( !Array.isArray( input ) )
        {
            return false;
        }

        if ( input.every( elem => typeof(elem) === "string" ) )
        {
            return true;
        }

        return false;
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
        else if ( typeof(input) === "number" )
        {
            return input.toString();
        }
        // If input is a string array, concatenate it with line breaks, then return it
        if ( isStringArray( input ) )
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

    function changeVariable ( event )
    {
        if ( event.target.value !== "placeholder" )
        {
            setSelectedKey ( event.target.value );
        }
        else
        {
            setSelectedKey ({});
        }
    }

    // Get the array of all values of the current value's type
    function getValueArray ()
    {
        fetch ( API_URL() + value.metadata.origin + "/all" )
        .then ( res => res.json() )
        .then ( data => setValueArray(data) );
    }

    switch ( typeof(value) )
    {
        case "string":
            return (
                <textarea name="valField" id="valField" rows="15" cols="75" defaultValue={ formatTextToDisplay(value) } />
            );
        case "object":
            // If value is a string array, treat it like a string. 
            // Otherwise, if value is writable recursively create another dropdown 
            // Otherwise, generate a dropdown of possible alternative values
            if ( isStringArray(value) )
            {
                return (
                    <textarea name="valField" id="valField" rows="15" cols="75" defaultValue={ formatTextToDisplay(value) } />
                );
            }
            else if ( value.metadata === undefined || value.metadata.writable === true )
            {
                return (
                    <>
                        <select onChange={changeVariable}>
                            <option value="placeholder">Choose variable</option>
                            {Object.keys(value).map( key => (
                                // value[key] === nextValue(key) is an expression checking whether the next value is the one we naïvely expect.
                                // If this is false, then we have a triviäl join table in the way and need to be more descriptive, using the toString value.
                                <ClassFeatureVariableEditListItem key={key} input={key} value={nextValue(key)} toString={!(value[key] === nextValue(key))}/>
                            ))}
                        </select>
                        { selectedKey !== "" && editable && 
                            <ClassFeatureVariableEdit input={nextValue(selectedKey)} />
                        }
                    </>
                );
            }
            else
            {
                getValueArray();
                // While waiting for value array to populate, show loading. 
                if ( valueArray.length === 0 )
                {
                    return (<span>Loading</span>);
                }

                return(
                    <select>
                        {valueArray.map( (newVal) => (
                            <option key={findID(newVal)} value={findID(newVal)}>{findName(newVal)}</option>
                        ))}
                    </select>
                );
            }
        default:
            return (
                <>{typeof(value)}</>
            );
    }
}