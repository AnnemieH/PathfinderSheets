import getAC from "../../Functions/Gameplay/ac.js"
import hpSum from "../../Functions/Gameplay/hp.js"
import ActionTable from "./ActionTable/ActionTable.jsx"
import SavesTable from "./SavesTable.jsx"

// PROPS 
// character - the current character
// update - a function to propagate a database update
export default function CombatTab ( props )
{
    if ( props.character.derived !== undefined )
    {
        return (
            <table>
                <thead>

                </thead>
                <tbody>
                    <tr>
                        <td>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Max HP: </td>
                                        <td>{hpSum(props.character)}</td>
                                        <td></td>
                                        <td>AC: </td>
                                        <td>{getAC(props.character)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <SavesTable character={props.character}/>
                        </td>
                        <td>
                            <ActionTable character={props.character} />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}