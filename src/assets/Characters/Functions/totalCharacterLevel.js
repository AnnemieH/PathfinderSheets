// Total up all the class levels for a character
export function totalCharacterLevel ( currChar )
{
    let total = 0;
    try
    {
        // Loop through each class and add their level to total
        currChar.charClasses.forEach( currClass => {
            total += currClass.level;
        })

        return total;
    }
    // If we fail to calculate a total level, return -1
    catch ( error )
    {
        console.error(error);
        return -1;
    }
}