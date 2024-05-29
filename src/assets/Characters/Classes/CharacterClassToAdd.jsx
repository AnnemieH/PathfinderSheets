import React, { useEffect, useState } from "react";
import CharacterClassToAddRow from "./CharacterClassToAddRow";

// PROPS
// classes - all the classes (base & archetype) we are to add
// addClass(charClasses, level) - function to save an array of a single base class and 0 or more archetypes to the character
export default function CharacterClassToAdd ( props )
{
    const [characterClasses, setCharacterClasses] = useState([]);
    const [baseClasses, setBaseClasses] = useState([]);


    // Make sure we take a copy of props
    useEffect(() => {
        if ( props.classes !== undefined )
        {
            setCharacterClasses([...props.classes]);
        }
        else
        {
            setCharacterClasses([]);
        }
    }, [props.classes])

    // When characterClasses gets set, separate out the base classes
    useEffect(() => {
        separateBaseClasses();
    }, [characterClasses])

    // Put all the base classes in baseClasses.
    // DANGER: If there is an archetype in characterClasses without its base class there, we won't find the base class yet
    // TO DO: Fix that danger
    function separateBaseClasses ()
    {
        const base = [];

        for ( const charClass of characterClasses )
        {
            // No archetype means we have a base class
            if ( charClass.archetype === undefined )
            {
                base.push(charClass);
            }
        }
        
        setBaseClasses([...base]);
    }

    // Given a base class, find all archetypes of it in characterClasses
    function findArchetypesOfBase ( base )
    {
        const archetypes = [];
        for ( const characterClass of characterClasses )
        {
            // FIrst check whether we're working with an archeetype
            if ( characterClass.archetype !== undefined )
            {
                // Next check to see if the archetype's class ID matches the base class'
                // If so then BINGO, add it to archetypes
                if ( characterClass.archetype.classID == base.classID )
                {
                    archetypes.push(characterClass);
                }
            }
        }

        return [...archetypes];
    }

    function addClass ( charClasses, level )
    {
        props.addClass( charClasses, level )
    }

    function removeClass ( charClasses )
    {

    }

    return (
        <React.Fragment>
            {baseClasses.map( base => (
                <CharacterClassToAddRow key={base.classID} base={base} archetypes={findArchetypesOfBase(base)} addClass={addClass} removeClass={removeClass}/>
            ))}
        </React.Fragment>
    )
}