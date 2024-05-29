// PROPS
// archetype - the archetype we're displaying
// cancel - a function to handle if we have to cancel any archetypes
// editMode - a boolean value keeping track of whether we're editing
export default function CharacterArchetypesOfBaseClassRow ( props )
{
    // If we want to cancel this row, let peeps know what we're cancelling
    function cancel ( event )
    {
        event.preventDefault();
        props.cancel(props.archetype);
    }

    function cancelButton ()
    {
        if ( props.cancel !== undefined && props.editMode === true )
        {
            return (
                <span className="cancel" onClick={cancel}>X</span>
            );
        }
        else
        {
            return (<></>);
        }
    }
    return (
        <tr>
            <td>
                {props.archetype.className + " "}
                {cancelButton()}
            </td>
        </tr>
    );
}