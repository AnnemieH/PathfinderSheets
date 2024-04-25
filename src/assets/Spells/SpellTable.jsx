
// Given a maximum & minimum spell level and a maximum character level

import { useEffect, useState } from "react"

// Create an empty spell table
export default function SpellTable(props)
{
    const [levels, setLevels] = useState([]);
    const [spellLevels, setSpellLevels] = useState([]);
    const [spellJSON, setSpellJSON] = useState({});
    const [value, setValue] = useState({});

    const globalMaxSpellLevel = 9

    useEffect(() => {
        setValue(props.value);
    }, [props.value])

    // Whenever props.value changes, propagate it through the table
    useEffect(() => {
        if ( props.value.table !== undefined )
        {
            for ( let level = 1; level <= props.maxLevel; ++level )
            {
                for ( let spellLevel = props.minSpellLevel; spellLevel <= props.maxSpellLevel; ++spellLevel )
                {
                    if( document.getElementById(props.id + spellLevel + "," + level) !== null )
                    {
                        document.getElementById(props.id + spellLevel + "," + level).value = value.table[level.toString()][spellLevel.toString()];
                    }
                }
            }

            // Set spellsJSON equal to valuee
            setSpellJSON(value)
        }
    }, [value])

    // Generate an array of possible levels from props argument and store them in levels.
    useEffect(() => {
        // Make sure we're not double-counting
        if ( levels.length != props.maxLevel )
        {
            let temp = [];

           for (let i = 1; i <= props.maxLevel; ++i)
            {
                temp.push(parseInt(i));
            }

            setLevels(temp);
        }
    }, [props.maxLevel])


    // Generate an array of possible spell levels from props arguments and store them in spellLevels.
    useEffect(() => {
        // Make sure we're not double-counting
        if ( spellLevels.length != props.maxSpellLevel - props.minSpellLevel + 1 )
        {
            let temp = [];
            for (let i = props.minSpellLevel; i <= props.maxSpellLevel; ++i)
            {
                temp.push(parseInt(i));
            }
            setSpellLevels(temp);
        }
    }, [props.minSpellLevel, props.maxSpellLevel])

    // Generate the initial output JSON of maximal size to be trimmed later
    useEffect(() => {

        // Create the null-filled inner JSON
        let innerJSON = '{';

        for ( let spellLevel = props.minSpellLevel; spellLevel <= globalMaxSpellLevel; ++ spellLevel)
        {
            innerJSON += '"' + spellLevel + '": null' + ',';
        }

        // Remove trailing comma
        innerJSON = innerJSON.substring(0, innerJSON.length - 1);

        // Add closing brace for inner JSON
        innerJSON += '}';

        // Convert into JSON
        innerJSON = JSON.parse(innerJSON);


        // Create the null-filled outerJSON
        let outerJSON = '{';

        for ( let level = 1; level <= 20; ++level )
        {
            outerJSON += '"' + level + '": null' + ',';
        }

        // Remove trailing commas
        outerJSON = outerJSON.substring(0, outerJSON.length - 1);

        // Add closing brace for outer JSON
        outerJSON += '}';

        // Convert into JSON
        outerJSON = JSON.parse(outerJSON);


        // Instantiate the values of outerJSON as innerJSON
        for ( let level = 1; level <= 20; ++level )
        {
            outerJSON[level] = {...innerJSON};
        }

        setSpellJSON(outerJSON);
    }, [])

    // Whenever spellJSON changes, propagate it upwards
    useEffect(() => {
        // Make sure this doesn't trigger on initial value-setting
        if ( value !== spellJSON )
        {
            let isNull = true;

            for ( let key in spellJSON )
            {
                for ( let otherKey in spellJSON[key] )
                {
                    if ( spellJSON[key][otherKey] != null )
                    {
                        isNull = false;
                    }
                }
            }
            // Check that spellJSON exists first
            if ( isNull === false )
            {
                // If it exists, propagate the trimmed version
                props.change(trimJSON(spellJSON));
            }
        }
    }, [spellJSON])

    function changeField ( event )
    {

        // Read level and spellLevel from the event
        // Strip out props.id from the id and split it at the comma to get coordinates
        const coords = (event.target.id).substring(props.id.length, event.target.id.length).split(',');
        const spellLevel = coords[0];
        const level = coords[1];

        // Update JSON with the value at given coordinates
        const tempJSON = {...spellJSON};
        const tempInnerJSON = {...spellJSON.table[level]};

        console.log(event.target.value)
        // If the value is the empty string, set the JSON at that point to be null
        if ( event.target.value == "" || event.target.value == "-" )
        {
            tempInnerJSON[spellLevel] = null;    
        }
        // Otherwise set it to be equal to the value
        else
        {
            tempInnerJSON[spellLevel] = event.target.value;
        }
        tempJSON.table[level] = {...tempInnerJSON};
        
        setSpellJSON ({...tempJSON});
    }

    // Trim the JSON to props arguments
    function trimJSON ( inputJSON )
    {
        const tempJSON = {...inputJSON };

        // Delete all levels higher than props.maxLevel
        for ( let level = props.maxLevel + 1; level <= 20; ++level )
        {
            delete tempJSON[level];
        }

        return tempJSON;
    }

    return (
        <table id={props.id}>
            <tbody>
                <tr>
                    <td></td>
                    {spellLevels.map(i => (
                        <td key={"spellLevel" + i}>{i}</td>
                    ))}
                </tr>

                {levels.map(level => (
                        <tr key={level + "TR"}>
                            <td key={"charLevel" + level}>{level}</td>
                        {spellLevels.map(spellLevel => (
                            <td key={spellLevel + "," + level + "TD"}>
                                <input type="text" id={props.id + spellLevel + "," + level} name={spellLevel + "," + level} key={spellLevel + "," + level} size="1" onChange={changeField}/>
                            </td>
                        ))}
                        </tr>
                ))
                }
            </tbody>
        </table>
    )
}