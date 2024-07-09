// PROPS

import Action from "./Action";

// actions - an array of all the actions of this type
export default function ActionColumn ( props )
{
    return (
        <td>
            {props.actions.map( action => (
                <Action key={action.displayName} action={action} />
            ))}
        </td>
    )
}