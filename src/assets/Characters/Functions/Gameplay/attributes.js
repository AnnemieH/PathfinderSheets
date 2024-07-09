export default function findRawCharAttributeByID ( character, id )
{
    return (character.raw.attributes.find( attribute => attribute.id.attributeID == id )).value;
}

export function findCharAttributeByID ( character, id )
{
    switch(id)
    {
        case 1:
            return getStrength( character );
            break;
        case 2:
            return getDexterity( character );
            break;
        case 3:
            return getConstitution( character );
            break;
        case 4:
            return getIntelligence( character );
            break;
        case 5:
            return getWisdom( character );
            break;
        case 6:
            return getCharisma( character );
            break;
        default:
            return 0;
            break;
    }
}

export function getStrength ( character )
{
    let strengthSum = 0;
    
    for ( const strengthBonus in character.derived.attributes.strength )
    {
        strengthSum += character.derived.attributes.strength[strengthBonus];
    }

    return strengthSum;
}

export function getDexterity ( character )
{
    let dexteritySum = 0;
    
    for ( const dexterityBonus in character.derived.attributes.dexterity )
    {
        dexteritySum += character.derived.attributes.dexterity[dexterityBonus];
    }

    return dexteritySum;
}

export function getConstitution ( character )
{
    let constitutionSum = 0;
    
    for ( const constitutionBonus in character.derived.attributes.constitution )
    {
        constitutionSum += character.derived.attributes.constitution[constitutionBonus];
    }

    return constitutionSum;
}

export function getIntelligence ( character )
{
    let intelligenceSum = 0;
    
    for ( const intelligenceBonus in character.derived.attributes.intelligence )
    {
        intelligenceSum += character.derived.attributes.intelligence[intelligenceBonus];
    }

    return intelligenceSum;
}

export function getWisdom ( character )
{
    let wisdomSum = 0;
    
    for ( const wisdomBonus in character.derived.attributes.wisdom )
    {
        wisdomSum += character.derived.attributes.wisdom[wisdomBonus];
    }

    return wisdomSum;
}

export function getCharisma ( character )
{
    let charismaSum = 0;
    
    for ( const charismaBonus in character.derived.attributes.charisma )
    {
        charismaSum += character.derived.attributes.charisma[charismaBonus];
    }

    return charismaSum;
}