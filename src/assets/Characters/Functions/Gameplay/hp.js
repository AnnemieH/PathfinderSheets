export default function getHP ( character )
{
    let hpSum = 0;
    
    for ( const hpBonus in character.derived.maxHP )
    {
        hpSum += character.derived.maxHP[hpBonus];
    }

    return hpSum;
}