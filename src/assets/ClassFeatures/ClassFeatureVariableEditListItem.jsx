// PROPS
// input - the key we're displaying
// value - the value of the item (usually the object's id)
// toString - whether or not we want to use the toString value

import findID from "../Generic/APIFunctions";

export default function ClassFeatureVariableEditListItem ( props )
{
    function format ( input )
    {
        console.log(input)
        if ( input.metadata !== undefined && props.toString )
        {
            return input.metadata.toString;
        }
        else
        {
            return props.input;
        }
    }

    return ( 
        <option value={ props.input }>
            {format( props.value )}
        </option>
    )
}