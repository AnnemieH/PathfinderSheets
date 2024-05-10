// Convert an attribute value into the modifier
export function getModifier ( attribute )
{
    // First check if this is an integer or parsable into an integer 
    // If it is not, return the input unmodified
    const attrVal = parseInt(attribute);
    if ( isNaN(attrVal) )
    {
        return attribute;
    }
    else
    {
        return Math.floor( (attrVal - 10) / 2 );
    }
}