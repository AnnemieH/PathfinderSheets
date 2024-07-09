import allBarbarianAbilitiesOfDerivedClass from "./All/Barbarian/abilitiesBarbarian";


export default function getClassAbilities ( character )
{
    let classAbilities = [];
    for ( const charClass  of character.derived.charClasses )
    {
        switch ( charClass.charClass.className )
        {
            case "Barbarian":
                classAbilities = [...classAbilities, ...allBarbarianAbilitiesOfDerivedClass( character, charClass )];
                break;
        }
    }

    return classAbilities;
}