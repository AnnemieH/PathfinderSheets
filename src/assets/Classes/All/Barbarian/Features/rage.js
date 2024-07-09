import { getModifier } from "../../../../Attributes/getModifier";
import { getConstitution } from "../../../../Characters/Functions/Gameplay/attributes";

export default function barbarianRage( character, charClass )
{
    const abilities = [];

    abilities.push( startRage( character, charClass ) );

    return abilities;
}

function startRage ( character, charClass )
{
    const startRageJSON = {};

    startRageJSON.displayName = "Begin Rage";
    startRageJSON.category = "Ex";
    startRageJSON.type = "state";
    startRageJSON.action = "free";

    startRageJSON.duration = {};
    startRageJSON.duration.length = 2 + (2 * parseInt(charClass.level)) + parseInt( getModifier(getConstitution( character ) ) );
    startRageJSON.duration.unit = "rounds";
    startRageJSON.duration.divisible = true;

    startRageJSON.effects = {};

    const strengthJSON = {};
    strengthJSON.morale = 4;
    startRageJSON.effects.strength = strengthJSON;

    const constitutionJSON = {};
    constitutionJSON.morale = 4;
    startRageJSON.effects.constitution = constitutionJSON;

    const willJSON = {};
    willJSON.morale = 2;
    startRageJSON.effects.will = willJSON;

    const acJSON = {};
    acJSON.untyped = -2;
    startRageJSON.effects.ac = acJSON;

    return startRageJSON;
}