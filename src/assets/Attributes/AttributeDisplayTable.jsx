import { useEffect, useState } from "react"
import { getModifier } from "./getModifier";

export default function AttributeDisplayTable (props)
{
    const [attribute, setAttribute] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(10);

    useEffect( () => {
        setAttribute(props.attribute)
    }, [props])

    function formatAttributeModifier ( value )
    {
        if ( value === null )
        {
            return "";
        }
        else if ( value >= 10 )
        {
            return "+" + getModifier(value);
        }
        else
        {
            return "" + getModifier(value);
        }
    }

    function inputValidation( event )
    {
        // Create a regex for validation
        const validationRegex = /^[0-9]+$/

        // Check if input is a number, if it's not, revert it to the original value
        if ( !validationRegex.test(event.target.value) && event.target.value !== "" )
        {
            event.target.value = attribute.value;
        }
        else 
        {
            // Now that we've verified we're dealing with a number, parse it as one and check that we're positive
            const input = parseInt(event.target.value);

            // If it's negative, revert the textbox back to the original value
            if ( input < 0 )
            {
                event.target.value = ranks;
            }
            // Everything's good, so keep track of this value in tempRanks
            else
            {
                setTempValue(input);
            }
        }
    }

    function changeAttribute()
    {
        setIsEditing( !isEditing );
    }

    function submit()
    {
        setIsEditing( false );

        let attributeJSON = {...attribute};
        attributeJSON.value = tempValue;

        let attributesArrayJSON = {};
        attributesArrayJSON.attributes = [];
        attributesArrayJSON.attributes.push(attributeJSON);

        props.update(attributesArrayJSON);

        // Update the value held in attribute
        setAttribute(tempValue)

    }

    if ( isEditing === false )
    {
        return (
            <table className="attributeDisplayTable">
                <tbody>
                    <tr onClick={changeAttribute}>
                        <td className="attributeModifierDisplay" onClick={changeAttribute}>{formatAttributeModifier(attribute)}</td>
                        <td className="attributeDisplay" onClick={changeAttribute}>({attribute})</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{props.attributeName}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
    else
    {
        return (
            <table className="attributeDisplayTable">
                <tbody>
                    <tr>
                        <td>
                            <input type="text" defaultValue={attribute} size={2} onChange={inputValidation}/>
                            <button type="button" onClick={submit}>Submit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>{props.attributeName}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}