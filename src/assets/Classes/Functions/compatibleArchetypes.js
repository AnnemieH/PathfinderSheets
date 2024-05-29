function buffDelta ( primaryClass, secondaryClass )
{
    // Return an empty array if we get garbage in
    if ( primaryClass === undefined || secondaryClass === undefined )
    {
        return [];
    }


    // Iterate through the buffs of primaryClass and, if they are not present in secondaryClass, add them to the delta array
    let delta = [];

    for ( const buff of primaryClass.buffs )
    {

        // Check if the buffID and level of buff are represented in any buffs of secondary class
        if ( secondaryClass.buffs.find( secondBuff => 
        ( 
            buff.id.buffID == secondBuff.id.buffID && 
            buff.id.level == secondBuff.id.level 
        )) === undefined )
        {
            delta.push({...buff});
        }
    }

    return delta;
}

// Check if two archetypes are compatible
export function compatibleArchetypes ( arche1, arche2 )
{
    // Check if given archetypes have necessary members, if they don't, return false
    if ( arche1.archetype === undefined || arche2.archetype === undefined )
    {
        return false;
    }
    // Check that they are both archetypes of the same class
    else if ( arche1.archetype.classID !== arche2.archetype.classID )
    {
        return false;
    }
    else
    {
        // Calculate the deltas between each archetype and base class
        const delta1 = buffDelta( arche1.archetype, arche1 );
        const delta2 = buffDelta( arche2.archetype, arche2 );

        // If B\A is empty and A\B is empty then A = B 
        if 
        (
            delta1.filter(x => delta2.find(y => y.id.buffID = x.id.buffID) !== undefined).length === 0 &&
            delta2.filter(x => delta1.find(y => y.id.buffID = x.id.buffID) !== undefined).length === 0
        )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

// Check if one archetype is compatible with an array of archetypes
export function isArchetypeCompatible( arche, archeArray )
{
    // Return true if archeArray is empty
    if ( archeArray.length === 0 )
    {
        return true;
    }
    const diffUnion = new Set([]);
    const archeDiff = buffDelta ( arche.archetype, arche );
    // Calculate the union of the diffs in archeArray
    for ( const archetype of archeArray )
    {
        // If any member of archeArray is not an archetype, return false
        if ( archetype.archetype === undefined )
        {
            return false;
        }
        // Calculate the delta and add the elements to diffUnion
        const delta = buffDelta( archetype.archetype, archetype )
        delta.forEach( elem => diffUnion.add(elem));
    }

    // Calculate the intersection of diffUnion and archeDiff
    const diffArray = [...diffUnion];



    // If archeArray and diffArray are distinct, then arche is compatible with archeArray, otherwise it is incompatible
    const intersection = diffArray.filter( x => archeDiff.find(y => y.id.buffID === x.id.buffID && y.id.level === x.id.level) !== undefined)

    if
    ( intersection.length === 0 )
    {
        return true;
    }
    else
    {
        return false;
    }
}

export function applyArchetypes ( baseClasses, archetypes )
{
    const finalClasses = [];

    // Iterate through each baseClass and apply archetypes in turn
    for ( const base of baseClasses )
    {
        const modifiedBase = {...base};
        modifiedBase.archetypes = [];
        for ( const archetype of archetypes )
        {
            // If archetype is an archetype of base, add its buffs to modifiedBase and remove everything in buffDelta
            if ( archetype.charClass.archetype.classID == base.id.classID )
            {
                modifiedBase.archetypes.push( archetype.charClass );

                for ( const buff of archetype.charClass.buffs )
                {
                    (modifiedBase.charClass.buffs).push(buff);
                }

                for ( const buffToRemove of buffDelta(base.charClass, archetype.charClass) )
                {
                    modifiedBase.charClass.buffs = 
                    (
                        modifiedBase.charClass.buffs).filter ( buff => !(buff.id.buffID == buffToRemove.id.buffID && buff.id.level == buffToRemove.id.level) 
                    );
                }
            }
        }
        finalClasses.push({...modifiedBase});
    }

    return finalClasses;
}