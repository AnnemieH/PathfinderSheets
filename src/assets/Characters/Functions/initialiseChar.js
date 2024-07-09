import { getModifier } from "../../Attributes/getModifier";
import { fortAtLevel, refAtLevel, willAtLevel } from "../../Classes/Functions/babsaves";
import getClassAbilities from "../../Classes/classAbilities";
import findRawCharAttributeByID from "./Gameplay/attributes";
import { totalCharacterLevel } from "./totalCharacterLevel";

// Set up a character for the first time
export function initialiseChar ( character )
{
    character.derived.maxHP = totalMaxHP( character );

    // Attributes
    character.derived.attributes = {}
    character.derived.attributes.strength = totalStrength( character );
    character.derived.attributes.dexterity = totalDexterity( character );
    character.derived.attributes.constitution = totalConstitution( character );
    character.derived.attributes.intelligence = totalIntelligence( character );
    character.derived.attributes.wisdom = totalWisdom( character );
    character.derived.attributes.charisma = totalCharisma( character );

    // Saves
    character.derived.fortitude = totalFortitude( character );
    character.derived.reflex = totalReflex( character );
    character.derived.will = totalWill( character );

    // Load class features
    character.derived.abilities = getClassAbilities( character );

    console.log(character)
    return character;
}

// Iterate through all a character's classes and return the HP JSON
function totalMaxHP ( character )
{
    let sumHP = 0;

    for ( const charClass of character.derived.charClasses )
    {
        sumHP += charClass.hp;
    }

    const hpJSON = {};
    hpJSON.base = sumHP;
    hpJSON.constitution = (getModifier(findRawCharAttributeByID(character, 3)) * totalCharacterLevel( character ));

    return hpJSON;
}

function totalStrength ( character )
{
    const strengthJSON = {};

    strengthJSON.base = findRawCharAttributeByID( character, 1 );

    return strengthJSON;
}

function totalDexterity ( character )
{
    const dexterityJSON = {};

    dexterityJSON.base = findRawCharAttributeByID( character, 2);

    return dexterityJSON;
}

function totalConstitution ( character )
{
    const constitutionJSON = {};

    constitutionJSON.base = findRawCharAttributeByID( character, 3 );

    return constitutionJSON;
}

function totalIntelligence ( character )
{
    const intelligenceJSON = {};

    intelligenceJSON.base = findRawCharAttributeByID( character, 4 );

    return intelligenceJSON;    
}

function totalWisdom ( character )
{
    const wisdomJSON = {};

    wisdomJSON.base = findRawCharAttributeByID( character, 5 );

    return wisdomJSON;
}

function totalCharisma ( character )
{
    const charismaJSON = {};

    charismaJSON.base = findRawCharAttributeByID( character, 6 );

    return charismaJSON;
}

// Iterate through all a character's classes and return the fortitude JSON
function totalFortitude ( character )
{
    let sumFort = 0;

    for ( const charClass of character.derived.charClasses )
    {
        sumFort += parseInt(fortAtLevel(charClass, charClass.level));
    }

    const fortJSON = {};
    fortJSON.base = sumFort;
    fortJSON.constitution = getModifier(findRawCharAttributeByID(character, 3));

    return fortJSON;
}

// Iterate through all a character's classes and return the reflex JSON
function totalReflex ( character )
{
    let sumRef = 0;

    for ( const charClass of character.derived.charClasses )
    {
        sumRef += parseInt(refAtLevel(charClass, charClass.level));
    }

    const refJSON = {};
    refJSON.base = sumRef;
    refJSON.reflex = getModifier(findRawCharAttributeByID(character, 2));

    return refJSON;
}

// Iterate through all a character's classes and return the fortitude JSON
function totalWill ( character )
{
    let sumWill = 0;

    for ( const charClass of character.derived.charClasses )
    {
        sumWill += parseInt(willAtLevel(charClass, charClass.level));
    }

    const willJSON = {};
    willJSON.base = sumWill;
    willJSON.will = getModifier(findRawCharAttributeByID(character, 5));

    return willJSON;
}