import SpellTable from "./SpellTable";

export default function SpellsPerDayTable ( props )
{
    // Wrap the SpellTable JSON in a standard wrapper before propagating it upwards
    function change ( input )
    {
        props.change({...input})
    }

    return (
        <SpellTable id={props.id} minSpellLevel={props.minSpellLevel} maxSpellLevel={props.maxSpellLevel} maxLevel={props.maxLevel} value={props.spellsPerDay} change={change}/>
    )
}