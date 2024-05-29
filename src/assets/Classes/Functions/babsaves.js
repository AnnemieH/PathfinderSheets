// Given a class, return its BAB at a given level
export function babAtLevel ( charClass, level )
{
    return (charClass.charClass.bab.split(","))[level - 1];
}

// Given a class, return its fortitude at a given level
export function fortAtLevel ( charClass, level )
{
    return (charClass.charClass.fortitude.split(","))[level - 1];
}

// Given a class, return its reflex at a given level
export function refAtLevel ( charClass, level )
{
    return (charClass.charClass.reflex.split(","))[level - 1];
}

// Given a class, return its will at a given level
export function willAtLevel ( charClass, level )
{
    return (charClass.charClass.will.split(","))[level - 1];
}