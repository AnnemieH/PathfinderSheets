import { useEffect, useState } from "react";
import SpellTable from "./SpellTable";

export default function SpellKnownTable ( props )
{
    const [category, setCategory] = useState("");
    const [categoryJSON, setCategoryJSON] = useState({});
    const [spellsKnownJSON, setSpellsKnownJSON] = useState({});
    const [initialValue, setInitialValue] = useState({});
    const [hasUserOperated, setHasUserOperated] = useState(false);

    useEffect (() => {
        setInitialValue(props.spellsKnown);
    }, [props.spellsKnown])

    // If the category changes, keep track of it
    useEffect (() => {
        // Make sure that props.spellsKnown is properly formed
        if ( initialValue.category !== undefined )
        {
            // Put this in an if statement to stop infinite loops
            if ( category != initialValue["category"])
            {
                setCategory(initialValue["category"]);
                
            }

            if ( initialValue != spellsKnownJSON )
            {
                setSpellsKnownJSON(props.spellsKnown);
            }
        }
        
    }, [initialValue])

    // Update the categoryJSON whenever category is updated
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

    // Create an empty table: element for the JSON
    function emptyTableJSON ()
    {
        let tempJSON = {};

        for ( let level = 1; level <= props.maxLevel; ++level)
        {
            let innerJSON = {};
            for ( let spellLevel = props.minSpellLevel; spellLevel <= props.maxSpellLevel; ++ spellLevel )
            {
                innerJSON[spellLevel.toString()] = null;
            }
            
            tempJSON[level.toString()] = innerJSON;
        }

        return tempJSON;
    }

    // If categoryJSON changes, clear the spellsKnownJSON and prime it with the category
    useEffect (() => {
        //setSpellsKnownJSON({...categoryJSON, "table": emptyTableJSON()})

        let tempJSON = {};
        tempJSON.category = category;

        if ( category === "placeholder" )
        {
            tempJSON.category = null;
        }
        else if ( category === "unlimited" )
        {
            
        }
        else if ( category === "perLevel" )
        {
            tempJSON.value = null;
        }
        else if ( category === "complex" )
        {
            tempJSON.table = emptyTableJSON();
        }
        else
        {
            tempJSON.category = null;
        }
        
        setSpellsKnownJSON(tempJSON)

        // Once we have a category, ask for an initial value
        if ( category === "perLevel" || category === "complex" )
        {
            props.setVal();
        }
    }, [categoryJSON])

    // When spellsKnownJSON changes, propagate it
    useEffect (() => {
        // Ignore if this is the first time the component is loaded or if it's the same as props.spellsKnown
        if ( hasUserOperated === true && spellsKnownJSON !== props.spellsKnown)
        {
            if ( JSON.stringify(spellsKnownJSON) != JSON.stringify(props.spellsKnown) )
            {
                props.change(spellsKnownJSON);
            }
        }
    }, [spellsKnownJSON])

    function perLevelChanged ( event )
    {
        setSpellsKnownJSON({...categoryJSON, "value": event.target.value});

        setHasUserOperated(true);
    }

    function complexChanged ( input )
    {
        setSpellsKnownJSON({...categoryJSON, ...input});

        setHasUserOperated(true);
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
            <SpellTable id={props.id} minSpellLevel={props.minSpellLevel} maxSpellLevel={props.maxSpellLevel} maxLevel={props.maxLevel} value={props.spellsKnown} change={complexChanged}/>
        }
        </>
    )
}