// Given a class, return the maximum level based on whether or not it is a prestige class.
export function maxLevel ( charClass )
{
    if ( charClass.isPrestige === undefined )
    {
        return 0;
    }
    else if ( charClass.isPrestige === true )
    {
        return 10;
    }
    else
    {
        return 20;
    }
}