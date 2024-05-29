import { applyArchetypes } from "../../Classes/Functions/compatibleArchetypes";

// Given an array of classes, take every base class and construct the class object representing all archetypes the character has picked
function combineArchetypes ( classes )
{
    const baseClasses = [];
    const archetypes = [];

    // Divide up classes according to base or archetype
    for ( const charClass of classes )
    {
        if ( charClass.charClass.archetype === undefined )
        {
            baseClasses.push ( charClass );
        }
        else
        {
            archetypes.push ( charClass );
        }
    }

    return applyArchetypes( baseClasses, archetypes );
}

function derivedCharacteristics ( character )
{
    const derivedObject = {};
    const charClasses = combineArchetypes( character.charClasses )
    derivedObject.charClasses = charClasses;

    return derivedObject;
}

export function formatCharacter( character )
{
    const characterJSON = {};
    characterJSON.raw = character;
    characterJSON.derived = derivedCharacteristics( character );

    return characterJSON;
}