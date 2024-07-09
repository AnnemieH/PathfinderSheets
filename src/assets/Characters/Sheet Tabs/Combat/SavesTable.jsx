import { getFortitude, getReflex, getWill } from "../../Functions/Gameplay/saves";

// PROPS 
// character - the current character
export default function SavesTable ( props )
{
    if ( props.character.derived !== undefined )
    {
        return (
            <table>
                <thead>
                    <tr>
                        <td colSpan={6}>
                            <h2>
                                Saves
                            </h2>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Fortitude
                        </td>
                        <td>
                            {getFortitude(props.character)}
                        </td>
                        <td>
                            Reflex
                        </td>
                        <td>
                            {getReflex(props.character)}
                        </td>
                        <td>
                            Will
                        </td>
                        <td>
                            {getWill(props.character)}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
    else
    {
        return(<></>);
    }
}