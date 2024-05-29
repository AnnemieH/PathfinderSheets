import CharacterArchetypesOfBaseClassRow from "./CharacterArchetypesOfBaseClassRow";

// PROPS
// archetypes - all the archetypes we're listing in a table
// cancel - a function to handle if we have to cancel any archetypes
// editMode - a boolean value keeping track of whether we're editing
export default function CharacterArchetypesOfBaseClass( props )
{
    return (
        <table>
            <tbody>
                {props.archetypes.map(archetype => (
                    <CharacterArchetypesOfBaseClassRow key={archetype.classID} archetype={archetype} cancel={props.cancel} editMode={props.editMode}/>
                ))}
            </tbody>
        </table>
    );
}