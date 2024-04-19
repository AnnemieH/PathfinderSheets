export function formatTextToAPI ( input )
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