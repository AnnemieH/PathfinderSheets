import barbarianRage from "./Features/rage";

export default function allBarbarianAbilitiesOfDerivedClass ( character, charClass )
{
    let allAbilities = [];

    allAbilities = [...allAbilities, ...barbarianRage( character, charClass )];

    return allAbilities;
}