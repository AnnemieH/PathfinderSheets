import { useEffect, useState } from "react";
import SpellTable from "./SpellTable";

export default function SpellKnownTable ( props )
{
    const [category, setCategory] = useState("");
    const [categoryJSON, setCategoryJSON] = useState({});
    const [spellsKnownJSON, setSpellsKnownJSON] = useState({});


    // If the category changes, keep track of it
    useEffect (() => {
        // Put this in an if statement to stop infinite loops
        if ( category != props.spellsKnown["category"])
        {
            setCategory(props.spellsKnown["category"]);
            
        }

        
    }, [props.spellsKnown])

    useEffect (() => {
        // If spells known are unlimited, set the spells known JSON to just be the category
        if ( category === "unlimited" )
        {
            setCategoryJSON({"category":"unlimited"});
        }
        else if ( category === "perLevel" )
        {
            setCategoryJSON({"category":"perLevel"});
        }
        else if ( category === "complex" )
        {
            setCategoryJSON({"category":"complex"});
        }
    }, [category])


    // If categoryJSON changes, clear the spellsKnownJSON and prime it with the category
    useEffect (() => {
        setSpellsKnownJSON({...categoryJSON})
    }, [categoryJSON])

    // When spellsKnownJSON changes, propagate it
    useEffect (() => {
        if ( JSON.stringify(spellsKnownJSON) != JSON.stringify(props.spellsKnown) )
        {
            props.change(spellsKnownJSON);
        }
    }, [spellsKnownJSON])

    function perLevelChanged ( event )
    {
        setSpellsKnownJSON({...categoryJSON, "total": event.target.value});
    }

    function complexChanged ( input )
    {
        setSpellsKnownJSON({...categoryJSON, "table": {...input}})
    }

    return (
        <>
        { 
            category === "unlimited" &&
            <span id={props.id}></span>
        }
        { 
            category === "perLevel" &&
            <table id={props.id}>
                <tbody>
                    <tr>
                        <td>
                            <input type="text" name={props.id} id={props.id} onChange={perLevelChanged}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        }
        { 
            category === "complex" &&
            <SpellTable id={props.id} minSpellLevel={props.minSpellLevel} maxSpellLevel={props.maxSpellLevel} maxLevel={props.maxLevel} change={complexChanged}/>
        }
        </>
    )
}