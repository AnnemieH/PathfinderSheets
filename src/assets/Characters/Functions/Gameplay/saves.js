export function getFortitude ( character )
{
    let fortSum = 0;

    for ( const fortBonus in character.derived.fortitude )
    {
        fortSum += parseInt(character.derived.fortitude[ fortBonus ]);
    }

    return fortSum
}

export function getReflex ( character )
{
    let refSum = 0;

    for ( const refBonus in character.derived.reflex )
    {
        refSum += parseInt(character.derived.reflex[ refBonus ]);
    }

    return refSum
}

export function getWill ( character )
{
    let willSum = 0;

    for ( const willBonus in character.derived.will )
    {
        willSum += parseInt(character.derived.will[ willBonus ]);
    }

    return willSum
}